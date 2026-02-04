from fastapi import FastAPI
from pydantic import BaseModel
import sqlite3
import bcrypt

class User(BaseModel):
    usuario: str
    contraseña: str

app = FastAPI()


def crear_conexion():
    conn = sqlite3.connect('app.db')
    cursor = conn.cursor()
    return conn, cursor

def crear_tabla():
    conn, cursor = crear_conexion()
    cursor.execute("""
CREATE TABLE IF NOT EXISTS users(
id INTEGER PRIMARY KEY AUTOINCREMENT,
username TEXT UNIQUE,
password_hash BLOB
)
""")
    conn.commit()
    conn.close()

def hash_contraseña(password):
    hash = bcrypt.hashpw(password.encode(), bcrypt.gensalt())
    return hash

def comprobar_contraseña(usuario, password):
    conn, cursor = crear_conexion()
    cursor.execute("""
    SELECT password_hash FROM users WHERE username = ?""",
    (usuario,)
    )
    hash_a_comparar = cursor.fetchone()
    conn.close()
    if hash_a_comparar:
        if bcrypt.checkpw(password.encode(), hash_a_comparar[0]):
            return {'respuesta':'OK'}
    return {'respuesta': 'Falta datos'}
    

def insertar_usuarios(password, usuario):
    hash_generado = hash_contraseña(password)
    conn, cursor = crear_conexion()
    try: 
        cursor.execute(
        """INSERT INTO users(username, password_hash)
        VALUES(?, ?)""",
        (usuario, hash_generado)
        )
        conn.commit()
        conn.close()
        return {'respuesta':'OK'}
    except:
        return {'respuesta':'Usuario existente'}
    
crear_tabla()

@app.post('/register')
def login(body: User):
    usuario = body.usuario
    contraseña = body.contraseña

    respuesta = insertar_usuarios(contraseña, usuario)
    return respuesta

@app.post('/login')
def comprobar(body: User):
    contraseña = body.contraseña
    usuario = body.usuario

    respuesta = comprobar_contraseña(usuario, contraseña)
    return respuesta


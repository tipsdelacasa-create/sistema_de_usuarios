from fastapi import FastAPI
from pydantic import BaseModel
import sqlite3
import bcrypt

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

    if hash_a_comparar:
        if bcrypt.checkpw(password.encode(), hash_a_comparar[0]):
            return {'respuesta':'OK'}
    conn.close()
    return {'respuesta': 'Falta datos'}
    

def insertar_usuarios(password, usuario):
    hash_generado = hash_contraseña(password)
    conn, cursor = crear_conexion()
    try: 
        cursor.execute("""
        INSERT INTO users(username, password_hash)
        VALUES(?, ?)"""
        (usuario, hash_generado))
        conn.commit()
        conn.close()
        return {'respuesta':'Hecho correctamente'}
    except:
        return {'respuesta':'Usuario existente'}
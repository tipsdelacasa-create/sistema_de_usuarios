let contenedor = document.getElementById('content')

const pestana_principal = `
<h1>Bienvenido al sistema de usuarios</h1>
<p>Para empezar puede presionar alguno de los botones que hay en el header`

const registrarse= `
<h1>Registrarse</h1>
<input type='text' placeholder='Introduzca su usuario'
id='usuario'>
<input type='password' placeholder='Introduzca su contraseña'
id='contraseña'>
<input type='button' value='Entrar' id='login'>
<p id='informacion'></p>`

const login = `
<h1>Inicio de sesión</h1>
<input type='text' placeholder='Introduzca su usuario'
id='usuario2'>
<input type='password' placeholder='Introduzca su contraseña'
id='contraseña2'>
<input type='button' value='Entrar' id='login2'>
<p id='informacion2'></p>
`

const entrada = `
<p>Has entrado de forma correcta</p>
<p id='tipo_registro'></p>`

function pintar(pantalla) {
    contenedor.innerHTML = ''
    contenedor.innerHTML = pantalla
}

function router() {
    const path = window.location.pathname;

    if (path === '/login') {
        pintar(login);
        const text_login = document.getElementById('usuario2')
        const informacion2 = document.getElementById('informacion2')
        const password_login = document.getElementById('contraseña2')
        const boton_login = document.getElementById('login2')
        boton_login.addEventListener('click', function() {
    informacion2.textContent = ''
    if (!text_login.value || !password_login.value) {
        return informacion2.textContent = 'Faltan datos'
    }
    fetch (`http://127.0.0.1:8000${window.location.pathname}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body : JSON.stringify({
            usuario: text_login.value,
            contraseña: password_login.value
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data['respuesta'] === 'OK') {
            informacion2.textContent = 'Inicio de sesión hecho'
        } else {
            informacion2.textContent = 'Contraseña o usuario incorrectos' }
        })
    .catch(error => {
        console.log('Error');
    })
})
        return;
    }
    
    if (path === '/register') {
        pintar(registrarse)
        const text_registro = document.getElementById('usuario')
        const password_registro = document.getElementById('contraseña')
        const boton_registro = document.getElementById('login')
        const informacion = document.getElementById('informacion')
        boton_registro.addEventListener('click', function()
 {
    informacion.textContent = ''
    if (!text_registro.value || !password_registro.value) {
        return informacion.textContent = 'Faltan datos'
    }
    fetch (`http://127.0.0.1:8000${window.location.pathname}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body : JSON.stringify({
            usuario: text_registro.value,
            contraseña: password_registro.value
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data['respuesta'] === 'OK') {
            informacion.textContent = 'Registro hecho correctamente'
        } else {
            informacion.textContent = 'Usuario existente o datos faltantes' }
        })
    .catch(error => {
        console.log('Error');
    })
})



        return
    }

    pintar(pestana_principal)
}

function irA(URL) {
    history.pushState({}, '', URL)
    router() //Para poner la pantalla correcta
}


document.getElementById('head').addEventListener('click',(e) => {
    const URL = e.target.dataset.id
    if (URL) {
        irA(URL)
    }
})

window.onpopstate = router

router()
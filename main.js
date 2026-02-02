let contenedor = document.getElementById('content')

const pestana_principal = `
<h1>Bienvenido al sistema de usuarios</h1>
<p>Para empezar puede presionar alguno de los botones que hay en el header`

const registrarse= `
<h1>Registrarse</h1>
<input type='text1' placeholder='Introduzca su usuario'
id='usuario'>
<input type='password1' placeholder='Introduzca su contraseña'
id='contraseña'>
<input type='button' value='Entrar' id='login1'>
<p id='informacion'></p>`

const login = `
<h1>Inicio de sesión</h1>
<input type='text' placeholder='Introduzca su usuario'
id='usuario2'>
<input type='password' placeholder='Introduzca su contraseña'
id='contraseña2'>
<input type='button' value='Entrar' id='login2'>
<p id='informacion'></p>
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
        return;
    }
    
    if (path === '/register') {
        pintar(registrarse)
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
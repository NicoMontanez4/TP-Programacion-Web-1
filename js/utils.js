/* Util.js: Funciones chicas que van a usar toda la pagina */

/* Leer un dato de la URL */
// Devuelve el valor de un parámetro de la URL, o null si no está.
// Ej: en "mapa.html?curso=aleman", leerParametro("curso") -> "aleman"
function leerParametro(nombre) {
    const parametros = new URLSearchParams(window.location.search);
    /* window.location.search es la parte de la URL desde el ?. 
    Es como un Map de Java: le pedís una clave y te da el valor */
    return parametros.get(nombre);
}

/* Validar un email */
// true si tiene forma de email (algo@algo.algo)
function esEmailValido(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* Mostrar un mensaje en la pagina */
// Muestra un mensaje de error u ok dentro de un elemento de la página.
// tipo: "error" o "ok"
function mostrarMensaje(idElemento, texto, tipo) {
    const elemento = document.getElementById(idElemento);
    if (!elemento) return;
    elemento.textContent = texto;
    elemento.className = "mensaje-form " + (tipo === "ok" ? "mensaje-ok" : "mensaje-error");
    elemento.hidden = false;
}

function ocultarMensaje(idElemento) {
    const elemento = document.getElementById(idElemento);
    if (!elemento) return;
    elemento.hidden = true;
    elemento.textContent = "";
}
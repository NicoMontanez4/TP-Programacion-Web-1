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

/* Mostrar un cartel (modal) */
// opciones = {
//   titulo: "texto",
//   texto: "texto",
//   imagen: "ruta de una imagen" (opcional),
//   botones: [ { texto, tipo: "principal" | "secundario", alHacerClic: función } ],
//   cerrable: false  -> no se cierra con Escape (para avisos obligatorios)
// }
function mostrarModal(opciones) {
    cerrarModal(); // si había otro abierto, lo sacamos

    const modal = document.createElement("dialog"); /* "dialog" es una etiqueta HTML
    que funciona como un cartel, se muestra adelante de todo con fondo oscurecido,
    no deja tocar la pagina de atras hasta que se cierre, etc. */
    modal.id = "modal-polilingo";
    modal.className = "modal";
    modal.setAttribute("aria-labelledby", "modal-titulo");

    if (opciones.imagen) {
        const imagen = document.createElement("img");
        imagen.src = opciones.imagen;
        imagen.alt = "";
        imagen.className = "modal-imagen";
        modal.appendChild(imagen);
    }

    const titulo = document.createElement("h2"); /* Crea una etiqueta que todavia no está
    en la pagina. Es como hacer un "new" de un objeto. */
    titulo.id = "modal-titulo";
    titulo.textContent = opciones.titulo;
    modal.appendChild(titulo); /* Mete un elemento adentro de otro. */

    if (opciones.texto) {
        const texto = document.createElement("p");
        texto.textContent = opciones.texto;
        modal.appendChild(texto);
    }

    // Si no mandan botones, ponemos uno de "Aceptar"
    const listaBotones = opciones.botones || [{ texto: "Aceptar", tipo: "principal" }];
    const contenedorBotones = document.createElement("article");
    contenedorBotones.className = "modal-botones";
    let seEligioUnBoton = false;

    listaBotones.forEach(function (boton) {
        const elemento = document.createElement("button");
        elemento.type = "button";
        elemento.textContent = boton.texto;
        elemento.className = "modal-boton " + (boton.tipo === "secundario" ? "modal-boton-secundario" : "modal-boton-principal");
        elemento.addEventListener("click", function () {
            seEligioUnBoton = true;
            cerrarModal();
            if (boton.alHacerClic) boton.alHacerClic();
        });
        contenedorBotones.appendChild(elemento);
    });
    modal.appendChild(contenedorBotones);

    // Escape: si el cartel no es cerrable, lo bloqueamos
    modal.addEventListener("cancel", function (evento) {
        if (opciones.cerrable === false) evento.preventDefault();
    });

    // Si igual se cerró sin tocar un botón (algunos navegadores dejan con doble Escape),
    // en un cartel obligatorio ejecutamos la acción del primer botón
    modal.addEventListener("close", function () {
        modal.remove();
        if (!seEligioUnBoton && opciones.cerrable === false && listaBotones[0].alHacerClic) {
            listaBotones[0].alHacerClic();
        }
    });

    document.body.appendChild(modal);
    modal.showModal(); // lo muestra y pone el foco en el primer botón
}

function cerrarModal() {
    const modal = document.getElementById("modal-polilingo");
    if (modal) modal.close();
}
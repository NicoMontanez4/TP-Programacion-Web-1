/* Util.js: Funciones chicas que van a usar toda la pagina */

/* Leer un dato de la URL */
// Devuelve el valor de un parámetro de la URL, o null si no está.
// Ej: en "mapa.html?curso=aleman", leerParametro("curso") -> "aleman"
function leerParametro(nombre) {
    const parametros = new URLSearchParams(window.location.search);
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
    elemento.className =
        "mensaje-form " + (tipo === "ok" ? "mensaje-ok" : "mensaje-error");
    elemento.hidden = false;
}

function ocultarMensaje(idElemento) {
    const elemento = document.getElementById(idElemento);
    if (!elemento) return;
    elemento.hidden = true;
    elemento.textContent = "";
}

/* Pintar un requisito (texto de ayuda) */
// Pinta un requisito: gris por defecto, verde si cumple, rojo si no.
// Solo cambia el color del texto (no tamaño, ni negrita, ni fondo).
function pintarRequisito(elemento, valor, cumple) {
    if (!elemento) return;
    elemento.classList.remove("requisito-ok", "requisito-error");
    if (valor === "") return; // queda en gris
    elemento.classList.add(cumple ? "requisito-ok" : "requisito-error");
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

    const modal = document.createElement("dialog");
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

    const titulo = document.createElement("h2");
    titulo.id = "modal-titulo";
    titulo.textContent = opciones.titulo;
    modal.appendChild(titulo);

    if (opciones.texto) {
        const texto = document.createElement("p");
        texto.textContent = opciones.texto;
        modal.appendChild(texto);
    }

    const listaBotones = opciones.botones || [
        { texto: "Aceptar", tipo: "principal" },
    ];
    const contenedorBotones = document.createElement("article");
    contenedorBotones.className = "modal-botones";
    let seEligioUnBoton = false;

    listaBotones.forEach(function (boton) {
        const elemento = document.createElement("button");
        elemento.type = "button";
        elemento.textContent = boton.texto;
        elemento.className =
            "modal-boton " +
            (boton.tipo === "secundario"
                ? "modal-boton-secundario"
                : "modal-boton-principal");
        elemento.addEventListener("click", function () {
            seEligioUnBoton = true;
            cerrarModal();
            if (boton.alHacerClic) boton.alHacerClic();
        });
        contenedorBotones.appendChild(elemento);
    });
    modal.appendChild(contenedorBotones);

    modal.addEventListener("cancel", function (evento) {
        if (opciones.cerrable === false) evento.preventDefault();
    });

    modal.addEventListener("close", function () {
        modal.remove();
        if (
            !seElegioUnBoton &&
            opciones.cerrable === false &&
            listaBotones[0].alHacerClic
        ) {
            listaBotones[0].alHacerClic();
        }
    });

    document.body.appendChild(modal);
    modal.showModal();
}

function cerrarModal() {
    const modal = document.getElementById("modal-polilingo");
    if (modal) modal.close();
}

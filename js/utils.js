/* Util.js: Funciones chicas que van a usar toda la pagina */

/* Leer un dato de la URL */
function leerParametro(nombre) {
    const parametros = new URLSearchParams(window.location.search);
    return parametros.get(nombre);
}

/* Validar un email */
function esEmailValido(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* Mostrar un mensaje en la pagina */
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
function pintarRequisito(elemento, valor, cumple) {
    if (!elemento) return;
    elemento.classList.remove("requisito-ok", "requisito-error");
    if (valor === "") return; // queda en gris
    elemento.classList.add(cumple ? "requisito-ok" : "requisito-error");
}

/* Mostrar un cartel (modal) */
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
            !seEligioUnBoton &&
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

/* ===================== Popup de logros ===================== */

const INFORMACION_POPUP_LOGROS = {
    "en-llamas": {
        nombre: "En llamas",
        imagen: "Logro-1.png"
    },
    "hechicero": {
        nombre: "Hechicero",
        imagen: "Logro-2.png"
    },
    "insuperable": {
        nombre: "Insuperable",
        imagen: "Logro-3.png"
    },
    "corazon-roto": {
        nombre: "Corazón roto",
        imagen: "Logro-4.png"
    },
    "coleccionista": {
        nombre: "Coleccionista de Gemas",
        imagen: "Logro-5.png"
    },
    "es-un-trato": {
        nombre: "Es un trato",
        imagen: "Logro-6.png"
    },
    "fotogenico": {
        nombre: "Fotogénico",
        imagen: "Logro-7.png"
    }
};

let colaLogros = [];
let popupLogroAbierto = false;

document.addEventListener("logrosDesbloqueados", function (evento) {
    colaLogros.push(...evento.detail.logros);
    mostrarSiguienteLogro();
});


function mostrarSiguienteLogro() {
    if (popupLogroAbierto || colaLogros.length === 0) return;

    popupLogroAbierto = true;

    const logro = colaLogros.shift();
    const info = INFORMACION_POPUP_LOGROS[logro.id];

    const popup = document.createElement("section");
    popup.className = "popup-logro";
    popup.setAttribute("role", "status");

    const imagen = document.createElement("img");

    imagen.src = info && info.imagen
        ? "../../imagenes/logros/" + info.imagen
        : "../../imagenes/logros/Logro-1.png";

    imagen.alt = "Insignia " + (info ? info.nombre : "logro");

    const contenido = document.createElement("div");
    contenido.className = "popup-logro-contenido";

    const encabezado = document.createElement("span");
    encabezado.className = "popup-logro-encabezado";
    encabezado.textContent = "LOGRO DESBLOQUEADO";

    const nombre = document.createElement("h3");
    nombre.textContent = info ? info.nombre : logro.id;

    const descripcion = document.createElement("p");
    descripcion.textContent =
        "¡Felicitaciones! Seguí aprendiendo y sumando logros.";

    contenido.append(encabezado, nombre, descripcion);
    popup.append(imagen, contenido);

    document.body.appendChild(popup);

    // Cerrar automáticamente después de 5 segundos
    setTimeout(function () {
        popup.classList.add("ocultar");

        setTimeout(function () {
            popup.remove();
            popupLogroAbierto = false;
            mostrarSiguienteLogro();
        }, 400);

    }, 5000);
}

/* leccion.js: lección interactiva 
   La URL dice qué lección mostrar: leccion.html?curso=ingles&unidad=3&leccion=1
   Necesita datos.js, estado.js, utils.js y navbar.js cargados antes. */

// 1) Qué lección pidió la URL
const idCurso = leerParametro("curso");
const numeroUnidad = Number(leerParametro("unidad"));
/* Las unidades y las lecciones estan representadas en numeros */
const numeroLeccion = Number(leerParametro("leccion"));

// 2) Variables de la lección mientras se juega
let leccion = null;      // la lección que sacamos de datos.js
let indiceEjercicio = 0; // en qué ejercicio (nivel) vamos: 0, 1, 2, 3

document.addEventListener("DOMContentLoaded", function () {
    const curso = obtenerCurso(idCurso);
    const unidad = obtenerUnidad(idCurso, numeroUnidad);
    leccion = obtenerLeccion(idCurso, numeroUnidad, numeroLeccion);

    // Si la URL está mal o la lección no tiene ejercicios, avisamos y volvemos
    if (!curso || !unidad || !leccion || leccion.ejercicios.length === 0) {
        mostrarModal({
            titulo: "No encontramos esta lección",
            texto: "Puede que el link esté mal o que la lección todavía no tenga ejercicios.",
            cerrable: false,
            botones: [
                {
                    texto: "Volver a mis cursos",
                    alHacerClic: function () {
                        window.location.href = "mis-cursos.html";
                    },
                },
            ],
        });
        return;
    }

    mostrarCabecera(curso, unidad);
    actualizarIntentos();
    actualizarProgreso(0);
    mostrarEjercicio();

    // Sin vidas no se puede empezar la lección
    if (!tieneVidas(usuarioActual())) {
        bloquearFichas(true);
        mostrarSinVidas("Para hacer una lección necesitás al menos 1 vida.");
    }

    // Botones de la lección
    document.getElementById("boton-comprobar").addEventListener("click", comprobar);
    document.getElementById("boton-continuar").addEventListener("click", continuar);
    document.getElementById("boton-reintentar").addEventListener("click", reintentar);
    document.getElementById("boton-salir").addEventListener("click", confirmarSalida);
});

// Completa la barra de arriba: curso, unidad, lección, bandera y la ✕
function mostrarCabecera(curso, unidad) {
    document.title = leccion.titulo + " - " + curso.nombre + " - PoliLingo";

    document.getElementById("leccion-curso").textContent = curso.nombre;
    document.getElementById("leccion-unidad").textContent = "Unidad " + unidad.numero + " - " + unidad.titulo;
    document.getElementById("leccion-titulo").textContent = "Lección " + leccion.numero + " - " + leccion.titulo;

    const bandera = document.getElementById("bandera-leccion");
    bandera.src = "../../imagenes/banderas/" + curso.bandera;
    bandera.alt = "Bandera del curso de " + curso.nombre;

    // La ✕ vuelve a la unidad de esta lección
    document.getElementById("boton-salir").href = "unidad.html?curso=" + idCurso + "&unidad=" + numeroUnidad;
}

// Muestra el ejercicio actual: la frase y el banco de palabras mezclado
function mostrarEjercicio() {
    const ejercicio = leccion.ejercicios[indiceEjercicio];

    document.getElementById("frase").textContent = "“" + ejercicio.frase + "”";

    const respuesta = document.getElementById("respuesta");
    const banco = document.getElementById("banco");
    respuesta.innerHTML = ""; // vaciamos lo del ejercicio anterior
    banco.innerHTML = "";

    // El banco tiene las palabras correctas + las de más, mezcladas
    const palabras = mezclar(ejercicio.respuesta.concat(ejercicio.distractores));
    /* concat une dos listas en una nueva */

    palabras.forEach(function (palabra) {
        const item = document.createElement("li");
        const ficha = document.createElement("button");
        ficha.type = "button";
        ficha.className = "ficha";
        ficha.textContent = palabra;
        item.appendChild(ficha);
        banco.appendChild(item);
        // Al tocarla, la palabra se mueve entre el banco y la respuesta
        ficha.addEventListener("click", function () {
            moverFicha(item);
        });
    });
}

/* Mezclar las palabras */
// Devuelve una COPIA de la lista con los elementos en orden aleatorio
function mezclar(lista) {
    const copia = lista.slice(); /* Devuelve una copia de la lista */
    /* Metodo para mezclar: */
    for (let i = copia.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temporal = copia[i];
        copia[i] = copia[j];
        copia[j] = temporal;
    }
    return copia;
}

// Si la ficha está en el banco, la pasa a la respuesta; si está en la respuesta, la devuelve
function moverFicha(item) {
    const respuesta = document.getElementById("respuesta");
    const banco = document.getElementById("banco");

    if (item.parentElement === banco) { /* item.parentElement es el elemento que contiene a la ficha */
        respuesta.appendChild(item);
    } else {
        banco.appendChild(item);
    }
}

// Devuelve las palabras que armó el usuario, en orden: ["El", "tren", "es", "rojo"]
function respuestaArmada() {
    const fichas = document.querySelectorAll("#respuesta .ficha"); /* busca todas 
    las fichas que están adentro de la respuesta, en orden */
    const palabras = [];
    fichas.forEach(function (ficha) {
        palabras.push(ficha.textContent);
    });
    return palabras;
}

/* ===================== Comprobar ===================== */

let xpLeccion = 0; // XP que lleva ganada en esta lección

// Se fija si la respuesta armada es la correcta y muestra el panel que corresponde
function comprobar() {
    const ejercicio = leccion.ejercicios[indiceEjercicio];
    const armada = respuestaArmada();

    // Si no tocó ninguna palabra, le explicamos qué hacer
    if (armada.length === 0) {
        mostrarModal({
            titulo: "Todavía no armaste tu respuesta",
            texto: "Tocá las palabras del banco en el orden correcto y después apretá Comprobar.",
        });
        return;
    }

    // Comparamos como texto: "El tren es rojo" === "El tren es rojo"
    const esCorrecta = armada.join(" ") === ejercicio.respuesta.join(" ");
    /* el "join(" ") convierte la lista en un texto asi se pueden comparar entre ellos*/

    bloquearFichas(true); // mientras se ve el resultado, no se pueden mover
    document.getElementById("boton-comprobar").hidden = true;

    if (esCorrecta) {
        xpLeccion += XP_POR_NIVEL;
        document.getElementById("mensaje-correcto").textContent = "¡Muy bien! Sumaste " + XP_POR_NIVEL + " XP.";
        mostrarPanel("correcto");
        actualizarProgreso(indiceEjercicio + 1);
    } else {
        mostrarPanel("incorrecto");
        gastarIntento();
    }
}

// "Continuar" del panel verde: pasa al siguiente ejercicio o termina la lección
function continuar() {
    ocultarPaneles();
    indiceEjercicio++; /* Pasa al siguiente ejercicio */
    if (indiceEjercicio < leccion.ejercicios.length) {
        mostrarEjercicio();
    } else {
        terminarLeccion();
    }
}

// "Reintentar" del panel rojo: deja las palabras como estaban para que las corrija
function reintentar() {
    ocultarPaneles();
}

function mostrarPanel(id) {
    const panel = document.getElementById(id);
    panel.classList.add("visible"); /* Es una clase CSS */
    panel.querySelector("button").focus(); // el teclado queda en el botón del panel
}

function ocultarPaneles() {
    document.getElementById("correcto").classList.remove("visible");
    document.getElementById("incorrecto").classList.remove("visible");
    document.getElementById("boton-comprobar").hidden = false;
    bloquearFichas(false);
}

// Habilita o deshabilita todas las fichas (banco y respuesta)
function bloquearFichas(bloquear) {
    document.querySelectorAll(".ficha").forEach(function (ficha) {
        ficha.disabled = bloquear;
    });
}

// Fin de la lección: guarda el progreso y muestra el resumen
function terminarLeccion() {
    const resultado = completarLeccion(idCurso, numeroUnidad, numeroLeccion, xpLeccion); // estado.js
    actualizarNavbar(); // se ven al instante el XP y la racha nuevos

    // Armamos el texto del resumen
    let texto = "Ganaste " + xpLeccion + " XP.";
    if (!resultado.primeraVez) {
        texto += " Ya la habías completado: ¡buen repaso!";
    }
    if (resultado.cursoCompletado) {
        texto += " ¡Además completaste el curso! Recompensa: " + resultado.recompensa.gemas + " gemas y " + resultado.recompensa.xp + " XP extra.";
    }
    if (resultado.logrosNuevos.length > 0) {
        const nombres = resultado.logrosNuevos.map(function (logro) {
            return logro.nombre;
        });
        texto += " Nuevo logro: " + nombres.join(", ") + ".";
    }

    // Botones: siguiente lección (si hay), volver a la unidad o ir al inicio
    const botones = [];
    const siguiente = siguienteLeccion(usuarioActual(), idCurso);
    if (siguiente) {
        botones.push({
            texto: "Siguiente lección",
            alHacerClic: function () {
                window.location.href = "leccion.html?curso=" + idCurso + "&unidad=" + siguiente.unidad + "&leccion=" + siguiente.leccion;
            },
        });
    }
    botones.push({ texto: "Volver a la unidad", tipo: siguiente ? "secundario" : "principal", alHacerClic: volverALaUnidad });
    botones.push({
        texto: "Ir al inicio",
        tipo: "secundario",
        alHacerClic: function () {
            window.location.href = "../inicio/inicio.html";
        },
    });

    mostrarModal({
        titulo: resultado.cursoCompletado ? "¡Curso completado!" : "¡Lección superada!",
        texto: texto,
        imagen: "../../imagenes/poli/Poli-check.png",
        cerrable: false,
        botones: botones,
    });
}

/* ===================== intentos, progreso y vidas ===================== */

let intentosRestantes = INTENTOS_POR_LECCION; // arranca en 3

// Dibuja los círculos de intentos y el texto "2 de 3"
function actualizarIntentos() {
    const marcas = document.getElementById("intentos-marcas");
    marcas.innerHTML = "";
    for (let i = 1; i <= INTENTOS_POR_LECCION; i++) {
        const marca = document.createElement("span");
        // los primeros "intentosRestantes" quedan llenos, el resto vacíos
        marca.className = i <= intentosRestantes ? "intento" : "intento intento-usado";
        marcas.appendChild(marca);
    }
    const texto = intentosRestantes + " de " + INTENTOS_POR_LECCION;
    document.getElementById("intentos-numero").textContent = texto;
    document.getElementById("intentos").setAttribute("aria-label", "Te quedan " + texto + " intentos");
}

// Actualiza la barra según cuántos ejercicios ya resolvió
function actualizarProgreso(resueltos) {
    const porcentaje = Math.round((resueltos / leccion.ejercicios.length) * 100);
    document.getElementById("progreso-leccion").value = porcentaje;
    document.getElementById("progreso-texto").textContent = "Progreso de la lección: " + porcentaje + "%";
}

// Se llama cada vez que la respuesta es incorrecta
function gastarIntento() {
    intentosRestantes--;
    actualizarIntentos();
    if (intentosRestantes === 0) {
        sinIntentos();
    }
}

// Se gastaron los 3 intentos: pierde 1 vida y la lección vuelve a empezar
function sinIntentos() {
    const resultado = perderVida(); // estado.js: resta la vida y la guarda
    actualizarNavbar(); // el corazón del navbar baja en el momento
    document.getElementById("incorrecto").classList.remove("visible");

    if (resultado.sinVidas) {
        mostrarSinVidas("Gastaste los 3 intentos y te quedaste sin vidas.");
        return;
    }

    mostrarModal({
        titulo: "¡Perdiste una vida!",
        texto: "Gastaste los 3 intentos. Te " + (resultado.vidas === 1 ? "queda 1 vida" : "quedan " + resultado.vidas + " vidas") + ". La lección vuelve a empezar.",
        imagen: "../../imagenes/poli/PoliSorprendido.png",
        cerrable: false, // tiene que elegir una opción
        botones: [
            { texto: "Empezar de nuevo", alHacerClic: empezarDeNuevo },
            { texto: "Volver a la unidad", tipo: "secundario", alHacerClic: volverALaUnidad },
        ],
    });
}

// Cartel de "no tenés vidas": solo se puede ir a la tienda o volver
function mostrarSinVidas(texto) {
    mostrarModal({
        titulo: "No tenés vidas",
        texto: texto + " Recargalas en la tienda para seguir aprendiendo.",
        imagen: "../../imagenes/poli/PoliSorprendido.png",
        cerrable: false,
        botones: [
            {
                texto: "Ir a la tienda",
                alHacerClic: function () {
                    window.location.href = "../tienda/tienda.html";
                },
            },
            { texto: "Volver a la unidad", tipo: "secundario", alHacerClic: volverALaUnidad },
        ],
    });
}

// Reinicia la lección desde el primer ejercicio
function empezarDeNuevo() {
    indiceEjercicio = 0;
    xpLeccion = 0;
    intentosRestantes = INTENTOS_POR_LECCION;
    ocultarPaneles();
    actualizarIntentos();
    actualizarProgreso(0);
    mostrarEjercicio();
}

function volverALaUnidad() {
    window.location.href = "unidad.html?curso=" + idCurso + "&unidad=" + numeroUnidad;
}

/* ===================== salir con la ✕ ===================== */

// Si ya empezó a jugar, preguntamos antes de salir (el avance no se guarda)
function confirmarSalida(evento) {
    const empezo = indiceEjercicio > 0 || respuestaArmada().length > 0;
    if (!empezo) return; // no hizo nada: sale directo

    evento.preventDefault(); // frena el link para preguntar primero
    mostrarModal({
        titulo: "¿Seguro que querés salir?",
        texto: "Si salís ahora, el avance de esta lección no se guarda.",
        botones: [
            { texto: "Seguir en la lección" },
            { texto: "Salir", tipo: "secundario", alHacerClic: volverALaUnidad },
        ],
    });
}
/* perfil.js: página de perfil (paginas/perfil/perfil.html)
   Necesita datos.js, estado.js, utils.js y navbar.js cargados antes. */


/* perfil.js: página de perfil
   Necesita datos.js, estado.js, utils.js y navbar.js cargados antes. */


/* ======================== DATOS DEL PERFIL ======================== */

document.addEventListener("DOMContentLoaded", () => {
    cargarDatosPerfil();

    const botonCerrar = document.getElementById("boton-cerrar-sesion");
    const botonEliminar = document.getElementById("boton-eliminar-cuenta");

    if (botonCerrar) {
        botonCerrar.addEventListener("click", confirmarCerrarSesion);
    }

    if (botonEliminar) {
        botonEliminar.addEventListener("click", confirmarEliminarCuenta);
    }
});


function cargarDatosPerfil() {

    // Obtiene los datos del usuario que inició sesión
    const usuario = usuarioActual();

    // Si no hay una sesión iniciada, no carga el perfil
    if (!usuario) {
        window.location.href = "../../index.html";
        return;
    }

    cargarDatosPersonales(usuario);
    cargarEstadisticas(usuario);
    cargarDatosCuenta(usuario);
    cargarLogros(usuario);
    configurarAjustes(usuario);
}


/* ======================== DATOS PERSONALES ======================== */

function cargarDatosPersonales(usuario) {

    const avatar = document.getElementById("perfil-avatar");
    const nombre = document.getElementById("perfil-nombre");
    const nombreUsuario = document.getElementById("perfil-usuario");
    const fecha = document.getElementById("perfil-fecha");

    if (avatar) {
        avatar.src = `../../imagenes/avatares/${usuario.avatar}`;
    }

    if (nombre) {
        nombre.textContent = `${usuario.nombre} ${usuario.apellido}`;
    }

    if (nombreUsuario) {
        nombreUsuario.textContent = `@${usuario.usuario}`;
    }

    if (fecha) {
        fecha.textContent = `Desde ${formatearFecha(usuario.fechaAlta)}`;
    }
}


/* ======================== ESTADISTICAS ======================== */

function cargarEstadisticas(usuario) {

    const racha = document.getElementById("stat-racha");
    const xp = document.getElementById("stat-xp");
    const gemas = document.getElementById("stat-gemas");
    const vidas = document.getElementById("stat-vidas");
    const liga = document.getElementById("stat-liga");

    if (racha) {
        racha.textContent = `${rachaActual(usuario)} días de racha`;
    }

    if (xp) {
        xp.textContent = `${usuario.xpTotal} XP Totales`;
    }

    if (gemas) {
        gemas.textContent = `${usuario.gemas} PoliGemas`;
    }

    if (vidas) {
        vidas.textContent = `${usuario.vidas} Vidas restantes`;
    }

    if (liga) {
        const nombreLiga = usuario.liga
            ? usuario.liga.charAt(0).toUpperCase() + usuario.liga.slice(1)
            : "Sin liga";

        liga.textContent = `Liga ${nombreLiga}`;
    }
}


/* ======================== DATOS DE LA CUENTA ======================== */

function cargarDatosCuenta(usuario) {

    const nombre = document.getElementById("dato-nombre");
    const apellido = document.getElementById("dato-apellido");
    const email = document.getElementById("dato-email");
    const nombreUsuario = document.getElementById("dato-usuario");
    const registro = document.getElementById("dato-registro");
    const cursos = document.getElementById("dato-cursos");
    const conexion = document.getElementById("dato-conexion");

    if (nombre) {
        nombre.textContent = usuario.nombre;
    }

    if (apellido) {
        apellido.textContent = usuario.apellido;
    }

    if (email) {
        email.textContent = usuario.email;
    }

    if (nombreUsuario) {
        nombreUsuario.textContent = usuario.usuario;
    }

    if (registro) {
        registro.textContent = formatearFecha(usuario.fechaAlta);
    }

    if (cursos) {
        const cursosActivos = usuario.inscripciones
            .map(idCurso => CURSOS[idCurso]?.nombre || idCurso);

        cursos.textContent = cursosActivos.length > 0
            ? cursosActivos.join(", ")
            : "Ningún curso activo";
    }

    if (conexion) {
        conexion.textContent = usuario.ultimaConexion
            ? usuario.ultimaConexion
            : "No disponible";
    }
}


/* ======================== FORMATO DE FECHAS ======================== */

function formatearFecha(fecha) {

    if (!fecha) {
        return "No disponible";
    }

    // Separamos año, mes y día para evitar problemas de zona horaria
    const [anio, mes, dia] = fecha.split("-").map(Number);

    const fechaFormateada = new Date(anio, mes - 1, dia);

    return fechaFormateada.toLocaleDateString("es-AR", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });
}

/* ======================== LOGROS ======================== */

// Nombres y descripciones de los logros del perfil.
// Las condiciones y metas se obtienen de datos.js.
const INFORMACION_LOGROS = {
    "en-llamas": {
        nombre: "En llamas",
        descripcion: "Alcanzaste una racha de 5 días",
        imagen: "Logro-1.png"
    },
    "hechicero": {
        nombre: "Hechicero",
        descripcion: "Ganaste 120 XP",
        imagen: "Logro-2.png"
    },
    "insuperable": {
        nombre: "Insuperable",
        descripcion: "Completaste 10 lecciones",
        imagen: "Logro-3.png"
    },
    "corazon-roto": {
        nombre: "Corazón roto",
        descripcion: "Perdiste una vida",
        imagen: "Logro-4.png"
    },
    "coleccionista": {
        nombre: "Coleccionista de Gemas",
        descripcion: "Conseguiste 200 PoliGemas",
        imagen: "Logro-5.png"
    },
    "es-un-trato": {
        nombre: "Es un trato",
        descripcion: "Hiciste una compra en la tienda",
        imagen: "Logro-6.png"
    },
    "fotogenico": {
        nombre: "Fotogénico",
        descripcion: "Cambiaste tu foto de perfil",
        imagen: "Logro-7.png"
    },
    "maestro-ingles": {
        nombre: "Maestro de Inglés",
        descripcion: "Completá 20 lecciones de inglés"
    },
    "maestro-chino": {
        nombre: "Maestro de Chino",
        descripcion: "Completá 20 lecciones de chino"
    },
    "maestro-aleman": {
        nombre: "Maestro de Alemán",
        descripcion: "Completá 20 lecciones de alemán"
    },
    "millonario": {
        nombre: "Millonario",
        descripcion: "Conseguí 600 PoliGemas"
    },
    "comprador": {
        nombre: "Comprador",
        descripcion: "Hacé 2 compras en la tienda"
    },
    "cliente-vip": {
        nombre: "Cliente VIP",
        descripcion: "Hacé 5 compras en la tienda"
    },
    "sin-corazones": {
        nombre: "Sin corazones",
        descripcion: "Perdé todas tus vidas"
    },
    "racha-10": {
        nombre: "Racha de 10 días",
        descripcion: "Alcanzá una racha de 10 días"
    },
    "racha-15": {
        nombre: "Racha de 15 días",
        descripcion: "Alcanzá una racha de 15 días"
    },
    "racha-20": {
        nombre: "Racha de 20 días",
        descripcion: "Alcanzá una racha de 20 días"
    },
    "racha-25": {
        nombre: "Racha de 25 días",
        descripcion: "Alcanzá una racha de 25 días"
    },
    "racha-30": {
        nombre: "Racha de 30 días",
        descripcion: "Alcanzá una racha de 30 días"
    }
};


function cargarLogros(usuario) {

    // Actualiza los logros alcanzados y guarda los nuevos
    const logrosNuevos = calcularLogros(usuario);

    if (logrosNuevos.length > 0) {
        guardarUsuario(usuario);
    }

    const listaAlcanzados = document.getElementById(
        "lista-logros-alcanzados"
    );

    const listaBloqueados = document.getElementById(
        "lista-logros-bloqueados"
    );

    if (!listaAlcanzados || !listaBloqueados) return;

    // Limpiamos las listas antes de volver a cargarlas
    listaAlcanzados.innerHTML = "";
    listaBloqueados.innerHTML = "";

    LOGROS.forEach(function (logro) {

        const progreso = progresoLogro(usuario, logro);

        if (progreso.desbloqueado) {
            listaAlcanzados.appendChild(
                crearElementoLogro(logro, progreso, true)
            );
        } else {
            listaBloqueados.appendChild(
                crearElementoLogro(logro, progreso, false)
            );
        }
    });

    // Si todavía no consiguió ningún logro
    if (listaAlcanzados.children.length === 0) {
        listaAlcanzados.innerHTML =
            "<li class='item-logro'>Todavía no desbloqueaste logros.</li>";
    }
}


/* ======================== CREAR ELEMENTO ======================== */

function crearElementoLogro(logro, progreso, desbloqueado) {

    const informacion = INFORMACION_LOGROS[logro.id] || {
        nombre: logro.id,
        descripcion: "Seguí aprendiendo para conseguir este logro."
    };

    const elemento = document.createElement("li");

    elemento.className = desbloqueado
        ? "item-logro"
        : "item-logro desactivado";

    // Imagen del logro o candado si está bloqueado
    if (desbloqueado && informacion.imagen) {

        const imagen = document.createElement("img");

        imagen.src = `../../imagenes/logros/${informacion.imagen}`;
        imagen.alt = informacion.nombre;

        elemento.appendChild(imagen);

    } else {

        const candado = document.createElement("span");

        candado.textContent = "🔒";
        candado.setAttribute("aria-label", "Logro bloqueado");

        elemento.appendChild(candado);
    }

    const grupo = document.createElement("hgroup");

    const titulo = document.createElement("h3");
    titulo.textContent = desbloqueado ? informacion.nombre : "?";

    const estado = document.createElement("p");
    const textoEstado = document.createElement("small");

    textoEstado.textContent = desbloqueado
        ? "Completado"
        : "Bloqueado";

    estado.appendChild(textoEstado);

    const descripcion = document.createElement("p");
    descripcion.textContent = informacion.descripcion;

    grupo.appendChild(titulo);
    grupo.appendChild(estado);
    grupo.appendChild(descripcion);

    // En los logros bloqueados mostramos cuánto falta
    if (!desbloqueado) {

        const avance = document.createElement("p");

        avance.textContent =
            `${progreso.actual} / ${progreso.meta}`;

        grupo.appendChild(avance);
    }

    elemento.appendChild(grupo);

    return elemento;
}

function configurarAjustes(usuario) {
    const formulario = document.querySelector("#form-ajustes");
    const selectorIdioma = document.querySelector("#idioma-interfaz");
    const mensaje = document.querySelector("#mensaje-ajustes");

    // Mostrar el idioma que tiene guardado el usuario
    selectorIdioma.value = usuario.idioma || "es";

    formulario.addEventListener("submit", function (e) {
        e.preventDefault();

        const idioma = selectorIdioma.value;

        const actual = document.querySelector("#pass-actual").value;
        const nueva = document.querySelector("#pass-nueva").value;
        const repetir = document.querySelector("#pass-repetir").value;

        // Guardar idioma
        const resultadoIdioma = cambiarIdioma(idioma);

        if (!resultadoIdioma.ok) {
            mensaje.textContent = resultadoIdioma.mensaje;
            return;
        }

        // Si no completó ningún campo de contraseña,
        // solamente se cambia el idioma.
        if (!actual && !nueva && !repetir) {
            mensaje.textContent = "¡Idioma actualizado correctamente!";
            return;
        }

        // Verificar que haya completado los tres campos
        if (!actual || !nueva || !repetir) {
            mensaje.textContent = "Completá los tres campos de contraseña.";
            return;
        }

        // Verificar contraseña actual
        if (actual !== usuario.contrasenia) {
            mensaje.textContent = "La contraseña actual es incorrecta.";
            return;
        }

        // Verificar longitud
        if (nueva.length < 8) {
            mensaje.textContent = "La nueva contraseña debe tener al menos 8 caracteres.";
            return;
        }

        // Verificar confirmación
        if (nueva !== repetir) {
            mensaje.textContent = "Las contraseñas nuevas no coinciden.";
            return;
        }

        // Cambiar contraseña utilizando estado.js
        const resultadoPassword = cambiarPassword(usuario.usuario, nueva);

        if (!resultadoPassword.ok) {
            mensaje.textContent = resultadoPassword.mensaje;
            return;
        }

        mensaje.textContent = "¡Idioma y contraseña actualizados correctamente!";

        // Limpiar campos
        document.querySelector("#pass-actual").value = "";
        document.querySelector("#pass-nueva").value = "";
        document.querySelector("#pass-repetir").value = "";

        // Actualizar copia local del usuario
        usuario.contrasenia = nueva;
        usuario.idioma = idioma;
    });
}


/* ========================CERRAR SESION====================== */
// Pregunta antes de cerrar sesión, así no se sale por error
function confirmarCerrarSesion(evento) {
  evento.preventDefault(); // frena el link: primero preguntamos
  /* frena el link para que no navegue enseguida */

  mostrarModal({ /* mostrarModal abre el cartel de utils.js */
    titulo: "¿Cerrar sesión?",
    texto: "Tu progreso queda guardado. Podés volver a entrar cuando quieras.",
    botones: [
      { texto: "Cerrar sesión", tipo: "principal", alHacerClic: salir },
      { texto: "Cancelar", tipo: "secundario" }, /* “Cancelar” no tiene alHacerClic, 
      así que solo cierra el cartel */
    ],
  });
}

function salir() { /* salir() borra la sesión y te lleva al login. 
    Como ya no hay sesión, login.js no te devuelve al inicio */
  cerrarSesion(); // estado.js: borra la sesión de localStorage
  window.location.href = "../../index.html";
}

/* Si tenías tildado “Recordar mi usuario”, el campo de usuario va a seguir completo en el login. 
Eso está bien: recuerda solo el nombre, no la sesión. */

/* ======================== ELIMINAR CUENTA ====================== */

// Pregunta antes de eliminar la cuenta
function confirmarEliminarCuenta(evento) {
    evento.preventDefault();

    mostrarModal({
        titulo: "¿Eliminar tu cuenta?",
        texto: "Esta acción es permanente. Se eliminarán tu cuenta, tu progreso y tus comentarios. ¿Estás seguro?",
        botones: [
            {
                texto: "Eliminar cuenta",
                tipo: "principal",
                alHacerClic: eliminarCuenta
            },
            {
                texto: "Cancelar",
                tipo: "secundario"
            }
        ]
    });
}


// Elimina la cuenta del usuario actual
function eliminarCuenta() {

    const usuario = usuarioActual();

    if (!usuario) {
        window.location.href = "../../index.html";
        return;
    }

    const resultado = eliminarUsuario(usuario.usuario);

    if (!resultado.ok) {
        const mensaje = document.getElementById("mensaje-ajustes");

        if (mensaje) {
            mensaje.textContent = resultado.mensaje;
        }

        return;
    }

    // La cuenta y la sesión ya fueron eliminadas.
    window.location.href = "../../index.html";
}
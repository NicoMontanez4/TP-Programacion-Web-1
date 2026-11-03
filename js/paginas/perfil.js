/* perfil.js: página de perfil (paginas/perfil/perfil.html)
   Necesita datos.js, estado.js, utils.js y navbar.js cargados antes. */


/* perfil.js: página de perfil
   Necesita datos.js, estado.js, utils.js y navbar.js cargados antes. */


/* ======================== DATOS DEL PERFIL ======================== */

document.addEventListener("DOMContentLoaded", () => {
    cargarDatosPerfil();

    const botonCerrar = document.getElementById("boton-cerrar-sesion");

    if (botonCerrar) {
        botonCerrar.addEventListener("click", confirmarCerrarSesion);
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

/* ========================CERRAR SESION====================== */
document.addEventListener("DOMContentLoaded", () => {
  const botonCerrar = document.getElementById("boton-cerrar-sesion");
  botonCerrar.addEventListener("click", confirmarCerrarSesion);
});

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
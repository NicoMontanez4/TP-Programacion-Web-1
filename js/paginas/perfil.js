/* perfil.js: página de perfil (paginas/perfil/perfil.html)
   Necesita datos.js, estado.js, utils.js y navbar.js cargados antes. */

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
//esperamos a que cargue toda la pagina para arrancar a manejar los elementos del form
document.addEventListener("DOMContentLoaded", () => {
  const formulario = document.querySelector("form");
  const emailInput = document.getElementById("email");
  const mensajeError = document.getElementById("mensaje-recuperar");

  //escuchamos cuando el usuario le da a aceptar para validar el mail
  formulario.addEventListener("submit", (e) => {
    e.preventDefault(); //frenamos el envio por defecto para validar primero

    const email = emailInput.value.trim().toLowerCase();

    //si el campo esta vacio, marcamos error y avisamos
    if (!email) {
      emailInput.setAttribute("aria-invalid", "true");
      mostrarMensaje(
        mensajeError,
        "Por favor, ingresá tu correo electrónico.",
        "error",
      );
      return;
    }

    //traemos los usuarios y los mostramos en consola para debuguear
    const usuariosRegistrados = obtenerUsuarios();
    console.log("usuarios en storage:", usuariosRegistrados);

    //buscamos si alguno coincide con el mail ingresado
    const usuarioEncontrado = usuariosRegistrados.find(
      (u) => u.email && u.email.trim().toLowerCase() === email,
    );

    //si el mail no esta registrado, tiramos el error
    if (!usuarioEncontrado) {
      emailInput.setAttribute("aria-invalid", "true");
      mostrarMensaje(
        mensajeError,
        "El correo electrónico ingresado no existe en nuestros registros.",
        "error",
      );
      return;
    }

    //si todo va bien, armamos un codigo random de 4 digitos
    const codigoGenerado = Math.floor(1000 + Math.random() * 9000).toString();

    //guardamos el codigo y el mail en la sesion para usarlos en la siguiente pantalla
    sessionStorage.setItem("codigoRecuperacion", codigoGenerado);
    sessionStorage.setItem("emailRecuperacion", email);

    emailInput.removeAttribute("aria-invalid");

    //mostramos el cartel verde de éxito y le chivamos el código al usuario en pantalla
    mostrarMensaje(
      mensajeError,
      `¡Código enviado con éxito! (Simulación - Tu código es: ${codigoGenerado})`,
      "ok",
    );

    //esperamos un toque y lo mandamos a la pantalla para poner el codigo
    setTimeout(() => {
      window.location.href = "cod_recuperacion(recuperar).html";
    }, 2500);
  });

  //limpiamos los errores apenas el usuario empieza a escribir de nuevo en el input
  emailInput.addEventListener("input", () => {
    emailInput.removeAttribute("aria-invalid");
    mensajeError.hidden = true;
  });
});

//funcion auxiliar para cambiar el texto y la clase del cartel ok o error
function mostrarMensaje(elemento, texto, tipo) {
  elemento.textContent = texto;
  elemento.className =
    "mensaje-form " + (tipo === "ok" ? "mensaje-ok" : "mensaje-error");
  elemento.hidden = false;
}

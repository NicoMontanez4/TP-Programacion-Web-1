//esperamos a que cargue toda la pagina para arrancar a manejar los elementos del form
document.addEventListener("DOMContentLoaded", () => {
  const formulario = document.querySelector("form");
  const emailInput = document.getElementById("email");

  //escuchamos cuando el usuario le da a aceptar para validar el mail
  formulario.addEventListener("submit", (e) => {
    e.preventDefault(); //frenamos el envio por defecto para validar primero

    const email = emailInput.value.trim().toLowerCase();

    //si el campo esta vacio, marcamos error y avisamos
    if (!email) {
      emailInput.setAttribute("aria-invalid", "true");
      mostrarMensaje("mensaje-recuperar", "Por favor, ingresá tu correo electrónico.", "error");
      return;
    }

    const usuarioEncontrado = buscarUsuario(email);

    //si el mail no esta registrado, tiramos el error
    if (!usuarioEncontrado) {
      emailInput.setAttribute("aria-invalid", "true");
      mostrarMensaje("mensaje-recuperar", "El correo electrónico ingresado no existe en nuestros registros.", "error");
      return;
    }

    //si todo va bien, armamos un codigo random de 4 digitos
    const codigoGenerado = Math.floor(1000 + Math.random() * 9000).toString();

    //guardamos el codigo y el mail en la sesion para usarlos en la siguiente pantalla
    sessionStorage.setItem("codigoRecuperacion", codigoGenerado);
    sessionStorage.setItem("emailRecuperacion", email);

    emailInput.removeAttribute("aria-invalid");

    //mostramos el cartel verde de éxito y le chivamos el código al usuario en pantalla
    mostrarMensaje("mensaje-recuperar",`¡Código enviado con éxito! (Simulación - Tu código es: ${codigoGenerado})`, "ok");

    //esperamos un toque y lo mandamos a la pantalla para poner el codigo
    setTimeout(() => {
      window.location.href = "cod_recuperacion.html";
    }, 2500);
  });

  //limpiamos los errores apenas el usuario empieza a escribir de nuevo en el input
  emailInput.addEventListener("input", () => {
    emailInput.removeAttribute("aria-invalid");
    ocultarMensaje("mensaje-recuperar");
  });
});

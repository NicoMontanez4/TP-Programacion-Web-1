//cargamos el dom para inicializar
document.addEventListener("DOMContentLoaded", () => {
  const inputsCodigo = document.querySelectorAll("#form-codigo input");
  const formulario = document.getElementById("form-codigo");
  const mensajeError = document.getElementById("mensaje-codigo");

  inputsCodigo.forEach((input, index) => {
    //controlamos el input para digitos
    input.addEventListener("input", (e) => {
      const valor = e.target.value;

      if (!/^[0-9]$/.test(valor)) {
        e.target.value = "";
        return;
      }

      if (valor && index < inputsCodigo.length - 1) {
        inputsCodigo[index + 1].focus();
      }
    });

    //controlamos retroceso con backspace
    input.addEventListener("keydown", (e) => {
      if (e.key === "Backspace" && !input.value && index > 0) {
        inputsCodigo[index - 1].focus();
      }
    });
  });

  //validamos al submit del formulario
  formulario.addEventListener("submit", (e) => {
    e.preventDefault();

    const codigoIngresado = Array.from(inputsCodigo)
      .map((input) => input.value)
      .join("");
    const codigoGuardado = sessionStorage.getItem("codigoRecuperacion");

    if (codigoIngresado.length < 4) {
      mostrarMensaje(
        mensajeError,
        "por favor, completa los 4 digitos del codigo.",
        "error",
      );
      inputsCodigo.forEach((input) =>
        input.setAttribute("aria-invalid", "true"),
      );
      return;
    }

    if (codigoIngresado !== codigoGuardado) {
      mostrarMensaje(
        mensajeError,
        "el codigo ingresado es incorrecto.",
        "error",
      );
      inputsCodigo.forEach((input) =>
        input.setAttribute("aria-invalid", "true"),
      );
      return;
    }

    mostrarMensaje(
      mensajeError,
      "¡codigo verificado con exito! redirigiendo...",
      "ok",
    );
    setTimeout(() => {
      window.location.href = "nueva_contrasenia(recuperar).html";
    }, 1500);
  });

  inputsCodigo.forEach((input) => {
    input.addEventListener("input", () => {
      inputsCodigo.forEach((i) => i.removeAttribute("aria-invalid"));
      mensajeError.hidden = true;
    });
  });
});

//funcion para renderizar mensajes
function mostrarMensaje(elemento, texto, tipo) {
  elemento.textContent = texto;
  elemento.className =
    "mensaje-form " + (tipo === "ok" ? "mensaje-ok" : "mensaje-error");
  elemento.hidden = false;
}

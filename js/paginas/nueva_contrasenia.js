document.addEventListener("DOMContentLoaded", () => {
  const formulario = document.querySelector("form");
  const nuevaInput = document.getElementById("nueva-contrasenia");
  const confirmarInput = document.getElementById("confirmar-nueva-contrasenia");
  const mensajeError = document.getElementById("mensaje-nueva-contra");

  const validarEnTiempoReal = () => {
    const nueva = nuevaInput.value.trim();
    const confirmar = confirmarInput.value.trim();

    if (!nueva && !confirmar) {
      nuevaInput.removeAttribute("aria-invalid");
      confirmarInput.removeAttribute("aria-invalid");
      mensajeError.hidden = true;
      return true;
    }

    if (nueva.length > 0 && nueva.length < 8) {
      nuevaInput.setAttribute("aria-invalid", "true");
      mostrarMensaje(
        mensajeError,
        "la contraseña debe tener al menos 8 caracteres",
        "error",
      );
      return false;
    }

    if (nueva.length >= 8 && !/\d/.test(nueva)) {
      nuevaInput.setAttribute("aria-invalid", "true");
      mostrarMensaje(
        mensajeError,
        "la contraseña debe tener al menos un número",
        "error",
      );
      return false;
    }

    if (confirmar.length > 0 && nueva !== confirmar) {
      confirmarInput.setAttribute("aria-invalid", "true");
      mostrarMensaje(mensajeError, "las contraseñas no coinciden", "error");
      return false;
    }

    nuevaInput.removeAttribute("aria-invalid");
    confirmarInput.removeAttribute("aria-invalid");
    mensajeError.hidden = true;
    return true;
  };

  nuevaInput.addEventListener("input", validarEnTiempoReal);
  confirmarInput.addEventListener("input", validarEnTiempoReal);

  formulario.addEventListener("submit", (e) => {
    e.preventDefault();

    const nueva = nuevaInput.value.trim();
    const confirmar = confirmarInput.value.trim();

    if (!nueva || !confirmar) {
      mostrarMensaje(
        mensajeError,
        "por favor, completa todos los campos",
        "error",
      );
      return;
    }

    if (!validarEnTiempoReal()) {
      return;
    }

    const email = sessionStorage.getItem("emailRecuperacion");
    if (!email) {
      mostrarMensaje(
        mensajeError,
        "error: no se encontró el email en la sesión",
        "error",
      );
      return;
    }

    const resultado = cambiarPassword(email, nueva);

    if (!resultado.ok) {
      mostrarMensaje(mensajeError, resultado.mensaje, "error");
      return;
    }

    //limpiamos la sesion y los datos temporales para forzar el login
    sessionStorage.removeItem("codigoRecuperacion");
    sessionStorage.removeItem("emailRecuperacion");
    localStorage.removeItem("usuarioActivo"); //por si guarda la sesion activa con este nombre

    mostrarMensaje(
      mensajeError,
      "¡contraseña actualizada con éxito! redirigiendo...",
      "ok",
    );
    setTimeout(() => {
      window.location.href = "../../index.html";
    }, 2000);
  });
});

function mostrarMensaje(elemento, texto, tipo) {
  elemento.textContent = texto;
  elemento.className =
    "mensaje-form " + (tipo === "ok" ? "mensaje-ok" : "mensaje-error");
  elemento.hidden = false;
}

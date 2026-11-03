document.addEventListener("DOMContentLoaded", () => {
    if (sessionStorage.getItem("codigoVerificado") !== "si") {
    window.location.href = "olvidaste_contra.html";
    return;
  }

  const formulario = document.querySelector("form");
  const nuevaInput = document.getElementById("nueva-contrasenia");
  const confirmarInput = document.getElementById("confirmar-nueva-contrasenia");

  const validarEnTiempoReal = () => {
    const nueva = nuevaInput.value.trim();
    const confirmar = confirmarInput.value.trim();

    if (!nueva && !confirmar) {
      nuevaInput.removeAttribute("aria-invalid");
      confirmarInput.removeAttribute("aria-invalid");
      ocultarMensaje("mensaje-nueva-contra");
      return true;
    }

    if (nueva.length > 0 && nueva.length < 8) {
      nuevaInput.setAttribute("aria-invalid", "true");
      mostrarMensaje("mensaje-nueva-contra", "La contraseña debe tener al menos 8 caracteres", "error");
      return false;
    }

    if (nueva.length >= 8 && !/\d/.test(nueva)) {
      nuevaInput.setAttribute("aria-invalid", "true");
      mostrarMensaje("mensaje-nueva-contra", "La contraseña debe tener al menos un número","error");
      return false;
    }

    if (confirmar.length > 0 && nueva !== confirmar) {
      confirmarInput.setAttribute("aria-invalid", "true");
      mostrarMensaje("mensaje-nueva-contra", "Las contraseñas no coinciden", "error");
      return false;
    }

    nuevaInput.removeAttribute("aria-invalid");
    confirmarInput.removeAttribute("aria-invalid");
    ocultarMensaje("mensaje-nueva-contra");
    return true;
  };

  nuevaInput.addEventListener("input", validarEnTiempoReal);
  confirmarInput.addEventListener("input", validarEnTiempoReal);

  formulario.addEventListener("submit", (e) => {
    e.preventDefault();

    const nueva = nuevaInput.value.trim();
    const confirmar = confirmarInput.value.trim();

    if (!nueva || !confirmar) {
      mostrarMensaje("mensaje-nueva-contra", "Por favor, completá todos los campos", "error");
      return;
    }

    if (!validarEnTiempoReal()) {
      return;
    }

    const email = sessionStorage.getItem("emailRecuperacion");
    if (!email) {
      mostrarMensaje("mensaje-nueva-contra", "Error: no se encontró el email en la sesión", "error");
      return;
    }

    const resultado = cambiarPassword(email, nueva);

    if (!resultado.ok) {
      mostrarMensaje("mensaje-nueva-contra", resultado.mensaje, "error");
      return;
    }

    //limpiamos la sesion y los datos temporales para forzar el login
    sessionStorage.removeItem("codigoRecuperacion");
    sessionStorage.removeItem("emailRecuperacion");
    sessionStorage.removeItem("codigoVerificado");
    cerrarSesion();

    mostrarMensaje("mensaje-nueva-contra", "¡Contraseña actualizada con éxito! Redirigiendo...", "ok");
    setTimeout(() => {
      window.location.href = "../../index.html";
    }, 2000);
  });
});

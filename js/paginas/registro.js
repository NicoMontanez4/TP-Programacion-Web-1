document.addEventListener("DOMContentLoaded", () => {
  const formulario = document.getElementById("form-registro");
  const inputEmail = document.getElementById("email");
  const inputPass = document.getElementById("contrasenia");
  const inputRepetirPass = document.getElementById("repetir-contrasenia");

  formulario.addEventListener("submit", (e) => {
    e.preventDefault();

    const emailValor = inputEmail.value.trim();
    const passValor = inputPass.value;
    const repetirPassValor = inputRepetirPass.value;

    if (passValor !== repetirPassValor) {
      alert("Las contraseñas no coinciden. Por favor, revísalas.");
      return;
    }

    if (passValor.length < 8) {
      alert("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    const resultado = registrarNuevoUsuario(emailValor, passValor);

    if (resultado.exito) {
      alert(resultado.mensaje);
      window.location.href = "../inicio/inicio.html";
    } else {
      alert(resultado.mensaje);
    }
  });
});

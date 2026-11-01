document.addEventListener("DOMContentLoaded", () => {
  const formularioLogin = document.getElementById("form-login");
  const inputEmail = document.getElementById("email");
  const inputPass = document.getElementById("contrasenia");

  formularioLogin.addEventListener("submit", (e) => {
    e.preventDefault();

    const emailValor = inputEmail.value.trim();
    const passValor = inputPass.value;

    //si los campos estan vacios que los completen
    if (!emailValor || !passValor) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    //si se inicio correctamente mandamos al dashboard y sino tiramos ensaje de error
    const resultado = iniciarSesionUsuario(emailValor, passValor);

    if (resultado.exito) {
      alert(resultado.mensaje);
      window.location.href = "paginas/inicio/inicio.html";
    } else {
      alert(resultado.mensaje);
    }
  });
});

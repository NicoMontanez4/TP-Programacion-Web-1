/* =====================================================
   login.js — Inicio de sesión (index.html)
   Necesita datos.js y estado.js cargados antes.
   ===================================================== */
 
const CLAVE_RECORDADO = "polilingo_usuario_recordado";
 
document.addEventListener("DOMContentLoaded", () => {
  // Si ya hay alguien logueado, no tiene sentido mostrar el login
  if (haySesion()) {
    window.location.href = "paginas/inicio/inicio.html";
    return;
  }
 
  const formulario = document.getElementById("form-login");
  const inputUsuario = document.getElementById("usuario-email");
  const inputPass = document.getElementById("contrasenia");
  const checkRecordar = document.getElementById("recordarme");
  const mensaje = document.getElementById("mensaje-login");
 
  // "Recordar mi usuario": si lo tildó la vez pasada, completamos el campo
  try {
    const recordado = localStorage.getItem(CLAVE_RECORDADO);
    if (recordado) {
      inputUsuario.value = recordado;
      checkRecordar.checked = true;
    }
  } catch (error) {
    // si el navegador no deja leer, simplemente no se completa
  }
 
  // Al escribir de nuevo, se limpia el error
  [inputUsuario, inputPass].forEach((input) => {
    input.addEventListener("input", () => {
      input.removeAttribute("aria-invalid");
      ocultarMensaje(mensaje);
    });
  });
 
  formulario.addEventListener("submit", (e) => {
    e.preventDefault();
 
    const usuarioValor = inputUsuario.value.trim();
    const passValor = inputPass.value;
 
    // 1) Campos vacíos: decimos cuál falta
    if (!usuarioValor) {
      marcarError(inputUsuario, mensaje, "Escribí tu usuario o tu email.");
      return;
    }
    if (!passValor) {
      marcarError(inputPass, mensaje, "Escribí tu contraseña.");
      return;
    }
 
    // 2) Intentamos iniciar sesión (estado.js)
    const resultado = iniciarSesion(usuarioValor, passValor);
 
    if (!resultado.ok) {
      inputPass.value = "";
      marcarError(inputPass, mensaje, resultado.mensaje + " Revisá los datos o registrate.");
      return;
    }
 
    // 3) Recordar (o dejar de recordar) el usuario
    try {
      if (checkRecordar.checked) {
        localStorage.setItem(CLAVE_RECORDADO, usuarioValor);
      } else {
        localStorage.removeItem(CLAVE_RECORDADO);
      }
    } catch (error) {
      // no pasa nada si no se puede guardar
    }
 
    // 4) Todo bien: avisamos y vamos al inicio
    mostrarMensajeForm(mensaje, resultado.mensaje + " Entrando…", "ok");
    setTimeout(() => {
      window.location.href = "paginas/inicio/inicio.html";
    }, 800);
  });
});
 
/* ---------- Ayudas para los mensajes ----------
   (cuando exista utils.js, estas tres pueden pasar allá
   y usarlas también el registro)
*/
function mostrarMensajeForm(elemento, texto, tipo) {
  elemento.textContent = texto;
  elemento.className = "mensaje-form " + (tipo === "ok" ? "mensaje-ok" : "mensaje-error");
  elemento.hidden = false;
}
 
function ocultarMensaje(elemento) {
  elemento.hidden = true;
  elemento.textContent = "";
}
 
function marcarError(input, elemento, texto) {
  input.setAttribute("aria-invalid", "true");
  input.focus();
  mostrarMensajeForm(elemento, texto, "error");
}

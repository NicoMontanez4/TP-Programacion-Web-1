/* =====================================================
   registro.js — Crear cuenta (paginas/cuenta/registro.html)
   Necesita datos.js y estado.js cargados antes.
   ===================================================== */
 
// 3 a 15 caracteres: letras, números y guion bajo
const FORMATO_USUARIO = /^[A-Za-z0-9_]{3,15}$/;
// algo@algo.algo (validación simple)
const FORMATO_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LARGO_MINIMO_PASS = 8;
 
document.addEventListener("DOMContentLoaded", () => {
  const formulario = document.getElementById("form-registro");
  const mensaje = document.getElementById("mensaje-registro");
 
  const campos = {
    nombre: document.getElementById("nombre"),
    apellido: document.getElementById("apellido"),
    usuario: document.getElementById("usuario"),
    email: document.getElementById("email"),
    contrasenia: document.getElementById("contrasenia"),
    repetir: document.getElementById("repetir-contrasenia"),
    terminos: document.getElementById("terminos"),
  };
 
  // Al corregir un campo, se le saca la marca de error
  Object.values(campos).forEach((input) => {
    input.addEventListener("input", () => input.removeAttribute("aria-invalid"));
    input.addEventListener("change", () => input.removeAttribute("aria-invalid"));
  });
 
  formulario.addEventListener("submit", (e) => {
    e.preventDefault();
 
    const datos = {
      nombre: campos.nombre.value.trim(),
      apellido: campos.apellido.value.trim(),
      usuario: campos.usuario.value.trim(),
      email: campos.email.value.trim(),
      contrasenia: campos.contrasenia.value,
    };
 
    // 1) Validaciones de formato, en el orden de los campos.
    //    Se muestra el primer problema y se lleva el foco a ese campo.
    const error = validarRegistro(datos, campos.repetir.value, campos.terminos.checked);
    if (error) {
      marcarError(campos[error.campo], mensaje, error.mensaje);
      return;
    }
 
    // 2) Crear la cuenta (estado.js controla que usuario y email no estén ocupados)
    const resultado = crearUsuario(datos);
    if (!resultado.ok) {
      marcarError(campos[resultado.campo], mensaje, resultado.mensaje);
      return;
    }
 
    // 3) Entra directo con la cuenta nueva y va al inicio
    iniciarSesion(datos.usuario, datos.contrasenia);
    formulario.querySelector("button[type='submit']").disabled = true;
    mostrarMensajeForm(mensaje, resultado.mensaje + " Entrando…", "ok");
    setTimeout(() => {
      window.location.href = "../inicio/inicio.html";
    }, 1200);
  });
});
 
// Devuelve { campo, mensaje } con el primer error, o null si está todo bien
function validarRegistro(datos, repetir, aceptoTerminos) {
  if (!datos.nombre) {
    return { campo: "nombre", mensaje: "Escribí tu nombre." };
  }
  if (!datos.usuario) {
    return { campo: "usuario", mensaje: "Elegí un nombre de usuario." };
  }
  if (!FORMATO_USUARIO.test(datos.usuario)) {
    return { campo: "usuario", mensaje: "El usuario tiene que tener de 3 a 15 caracteres: solo letras, números y _." };
  }
  if (!datos.email) {
    return { campo: "email", mensaje: "Escribí tu email." };
  }
  if (!FORMATO_EMAIL.test(datos.email)) {
    return { campo: "email", mensaje: "El email no es válido. Ejemplo: nombre@email.com" };
  }
  if (datos.contrasenia.length < LARGO_MINIMO_PASS) {
    return { campo: "contrasenia", mensaje: "La contraseña tiene que tener al menos " + LARGO_MINIMO_PASS + " caracteres." };
  }
  if (datos.contrasenia !== repetir) {
    return { campo: "repetir", mensaje: "Las contraseñas no coinciden." };
  }
  if (!aceptoTerminos) {
    return { campo: "terminos", mensaje: "Tenés que aceptar los Términos y la Política de Privacidad." };
  }
  return null;
}
 
/* ---------- Ayudas para los mensajes ----------
   (iguales a las de login.js; cuando exista utils.js pasan allá)
*/
function mostrarMensajeForm(elemento, texto, tipo) {
  elemento.textContent = texto;
  elemento.className = "mensaje-form " + (tipo === "ok" ? "mensaje-ok" : "mensaje-error");
  elemento.hidden = false;
}
 
function marcarError(input, elemento, texto) {
  input.setAttribute("aria-invalid", "true");
  input.focus();
  mostrarMensajeForm(elemento, texto, "error");
}

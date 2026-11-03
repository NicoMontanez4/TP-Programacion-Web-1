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

  const reqUsuario = document.getElementById("req-usuario");
  const reqLongitud = document.getElementById("req-longitud");
  const reqNumero = document.getElementById("req-numero");

  // Validación en tiempo real para el nombre de usuario
  if (campos.usuario && reqUsuario) {
    campos.usuario.addEventListener("input", () => {
      const val = campos.usuario.value.trim();
      if (FORMATO_USUARIO.test(val)) {
        reqUsuario.className = "mensaje-form mensaje-ok";
      } else {
        reqUsuario.className = "mensaje-form mensaje-error";
      }
      campos.usuario.removeAttribute("aria-invalid");
    });
  }

  // Validaciones en tiempo real para la contraseña
  if (campos.contrasenia) {
    campos.contrasenia.addEventListener("input", () => {
      const val = campos.contrasenia.value;

      // 1. Longitud mínima
      if (reqLongitud) {
        if (val.length >= LARGO_MINIMO_PASS) {
          reqLongitud.className = "mensaje-form mensaje-ok";
        } else {
          reqLongitud.className = "mensaje-form mensaje-error";
        }
      }

      // 2. Al menos un número
      if (reqNumero) {
        if (/\d/.test(val)) {
          reqNumero.className = "mensaje-form mensaje-ok";
        } else {
          reqNumero.className = "mensaje-form mensaje-error";
        }
      }

      campos.contrasenia.removeAttribute("aria-invalid");
    });
  }

  // Al corregir otros campos, se les saca la marca de error
  Object.values(campos).forEach((input) => {
    if (input && input !== campos.usuario && input !== campos.contrasenia) {
      input.addEventListener("input", () =>
        input.removeAttribute("aria-invalid"),
      );
      input.addEventListener("change", () =>
        input.removeAttribute("aria-invalid"),
      );
    }
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

    // 1) Validaciones de formato completas
    const error = validarRegistro(
      datos,
      campos.repetir.value,
      campos.terminos.checked,
    );
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
    return {
      campo: "usuario",
      mensaje:
        "El usuario tiene que tener de 3 a 15 caracteres: solo letras, números y _.",
    };
  }
  if (!datos.email) {
    return { campo: "email", mensaje: "Escribí tu email." };
  }
  if (!FORMATO_EMAIL.test(datos.email)) {
    return {
      campo: "email",
      mensaje: "El email no es válido. Ejemplo: nombre@email.com",
    };
  }
  if (datos.contrasenia.length < LARGO_MINIMO_PASS) {
    return {
      campo: "contrasenia",
      mensaje:
        "La contraseña tiene que tener al menos " +
        LARGO_MINIMO_PASS +
        " caracteres.",
    };
  }
  if (!/\d/.test(datos.contrasenia)) {
    return {
      campo: "contrasenia",
      mensaje: "La contraseña tiene que tener al menos un número.",
    };
  }
  if (datos.contrasenia !== repetir) {
    return { campo: "repetir", mensaje: "Las contraseñas no coinciden." };
  }
  if (!aceptoTerminos) {
    return {
      campo: "terminos",
      mensaje: "Tenés que aceptar los Términos y la Política de Privacidad.",
    };
  }
  return null;
}

//Ayudas para los mensajes
function mostrarMensajeForm(elemento, texto, tipo) {
  elemento.textContent = texto;
  elemento.className =
    "mensaje-form " + (tipo === "ok" ? "mensaje-ok" : "mensaje-error");
  elemento.hidden = false;
}

function marcarError(input, elemento, texto) {
  input.setAttribute("aria-invalid", "true");
  input.focus();
  mostrarMensajeForm(elemento, texto, "error");
}

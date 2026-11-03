/* =====================================================
   registro.js — Crear cuenta (paginas/cuenta/registro.html)
   Necesita datos.js, estado.js y utils.js cargados antes.
   ===================================================== */

const FORMATO_USUARIO = /^[A-Za-z0-9_]{3,15}$/;
const FORMATO_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LARGO_MINIMO_PASS = 8;

document.addEventListener("DOMContentLoaded", () => {
    const formulario = document.getElementById("form-registro");

    const pasoPerfil = document.getElementById("paso-perfil");
    const pasoPrivacidad = document.getElementById("paso-privacidad");
    const btnContinuar = document.getElementById("btn-continuar");
    const btnVolver = document.getElementById("btn-volver");

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

    const leerDatos = () => ({
        nombre: campos.nombre.value.trim(),
        apellido: campos.apellido.value.trim(),
        usuario: campos.usuario.value.trim(),
        email: campos.email.value.trim(),
        contrasenia: campos.contrasenia.value,
    });

    // --- Validación en tiempo real: usuario ---
    if (campos.usuario && reqUsuario) {
        campos.usuario.addEventListener("input", () => {
            const val = campos.usuario.value.trim();
            pintarRequisito(reqUsuario, val, FORMATO_USUARIO.test(val));
            campos.usuario.removeAttribute("aria-invalid");
        });
    }

    // --- Validación en tiempo real: contraseña ---
    if (campos.contrasenia) {
        campos.contrasenia.addEventListener("input", () => {
            const val = campos.contrasenia.value;
            pintarRequisito(reqLongitud, val, val.length >= LARGO_MINIMO_PASS);
            pintarRequisito(reqNumero, val, /\d/.test(val));
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

    // --- Paso 1 → Paso 2 ---
    btnContinuar.addEventListener("click", () => {
        const error = validarPerfil(leerDatos());
        if (error) {
            marcarError(campos[error.campo], error.mensaje);
            return;
        }
        ocultarMensaje("mensaje-registro");
        pasoPerfil.hidden = true;
        pasoPrivacidad.hidden = false;
    });

    // --- Paso 2 → Paso 1 ---
    btnVolver.addEventListener("click", () => {
        pasoPrivacidad.hidden = true;
        pasoPerfil.hidden = false;
        ocultarMensaje("mensaje-registro");
    });

    // --- Submit final ---
    formulario.addEventListener("submit", (e) => {
        e.preventDefault();

        const datos = leerDatos();

        // Revalidamos perfil por si volvió y editó algo
        const errorPerfil = validarPerfil(datos);
        if (errorPerfil) {
            pasoPerfil.hidden = false;
            pasoPrivacidad.hidden = true;
            marcarError(campos[errorPerfil.campo], errorPerfil.mensaje);
            return;
        }

        const errorPriv = validarPrivacidad(
            datos,
            campos.repetir.value,
            campos.terminos.checked,
        );
        if (errorPriv) {
            marcarError(campos[errorPriv.campo], errorPriv.mensaje);
            return;
        }

        // Crear la cuenta (estado.js controla usuario/email no repetidos)
        const resultado = crearUsuario(datos);
        if (!resultado.ok) {
            marcarError(campos[resultado.campo], resultado.mensaje);
            return;
        }

        iniciarSesion(datos.usuario, datos.contrasenia);
        formulario.querySelector("button[type='submit']").disabled = true;
        mostrarMensaje(
            "mensaje-registro",
            resultado.mensaje + " Entrando…",
            "ok",
        );
        setTimeout(() => {
            window.location.href = "../inicio/inicio.html";
        }, 1200);
    });
});

// --- Validaciones ---
function validarPerfil(datos) {
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
    return null;
}

function validarPrivacidad(datos, repetir, aceptoTerminos) {
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
            mensaje: "Tenés que aceptar los Términos y Condiciones.",
        };
    }
    return null;
}

// --- Helpers locales ---
function marcarError(input, texto) {
    input.setAttribute("aria-invalid", "true");
    input.focus();
    mostrarMensaje("mensaje-registro", texto, "error");
}

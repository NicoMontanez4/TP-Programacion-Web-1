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
            marcarError(campos[error.campo], mensaje, error.mensaje);
            return;
        }
        mensaje.hidden = true;
        pasoPerfil.hidden = true;
        pasoPrivacidad.hidden = false;
    });

    // --- Paso 2 → Paso 1 ---
    btnVolver.addEventListener("click", () => {
        pasoPrivacidad.hidden = true;
        pasoPerfil.hidden = false;
        mensaje.hidden = true;
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
            marcarError(
                campos[errorPerfil.campo],
                mensaje,
                errorPerfil.mensaje,
            );
            return;
        }

        const errorPriv = validarPrivacidad(
            datos,
            campos.repetir.value,
            campos.terminos.checked,
        );
        if (errorPriv) {
            marcarError(campos[errorPriv.campo], mensaje, errorPriv.mensaje);
            return;
        }

        // Crear la cuenta (estado.js controla usuario/email no repetidos)
        const resultado = crearUsuario(datos);
        if (!resultado.ok) {
            marcarError(campos[resultado.campo], mensaje, resultado.mensaje);
            return;
        }

        iniciarSesion(datos.usuario, datos.contrasenia);
        formulario.querySelector("button[type='submit']").disabled = true;
        mostrarMensajeForm(mensaje, resultado.mensaje + " Entrando…", "ok");
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

// --- Helpers de mensajes ---
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

// Pinta un requisito: gris por defecto, verde si cumple, rojo si no.
// Solo cambia el color del texto (no tamaño, ni negrita, ni fondo).
function pintarRequisito(elemento, valor, cumple) {
    if (!elemento) return;
    elemento.classList.remove("requisito-ok", "requisito-error");
    if (valor === "") return; // queda en gris
    elemento.classList.add(cumple ? "requisito-ok" : "requisito-error");
}

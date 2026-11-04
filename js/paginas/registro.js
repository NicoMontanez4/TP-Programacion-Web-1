/* =====================================================
   registro.js — Crear cuenta (paginas/cuenta/registro.html)
   Necesita datos.js, estado.js y utils.js cargados antes.
   ===================================================== */

// Validaciones separadas para el usuario
const LARGO_MIN_USUARIO = 3;
const LARGO_MAX_USUARIO = 15;
const FORMATO_CARACTERES_USUARIO = /^[A-Za-z0-9_]+$/; // Solo letras, números y _

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

    // Capturamos ambos textos de requisitos del usuario
    const reqUsuario = document.getElementById("req-usuario");
    const reqUsuario2 = document.getElementById("req-usuario-2");

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
    if (campos.usuario) {
        campos.usuario.addEventListener("input", () => {
            const val = campos.usuario.value.trim();

            if (val === "") {
                pintarRequisito(reqUsuario, val, false);
                pintarRequisito(reqUsuario2, val, false);
            } else {
                // Chequeamos las condiciones por separado
                const cumpleLongitud =
                    val.length >= LARGO_MIN_USUARIO &&
                    val.length <= LARGO_MAX_USUARIO;
                const cumpleCaracteres = FORMATO_CARACTERES_USUARIO.test(val);

                pintarRequisito(reqUsuario, val, cumpleLongitud);
                pintarRequisito(reqUsuario2, val, cumpleCaracteres);
            }

            campos.usuario.removeAttribute("aria-invalid");
            ocultarMensaje("mensaje-perfil"); // Ocultamos error al escribir
        });
    }

    // --- Validación en tiempo real: contraseña ---
    if (campos.contrasenia) {
        campos.contrasenia.addEventListener("input", () => {
            const val = campos.contrasenia.value;
            pintarRequisito(reqLongitud, val, val.length >= LARGO_MINIMO_PASS);
            pintarRequisito(reqNumero, val, /\d/.test(val));
            campos.contrasenia.removeAttribute("aria-invalid");
            ocultarMensaje("mensaje-registro"); // Ocultamos error al escribir
        });
    }

    // Al corregir otros campos, se les saca la marca de error
    Object.values(campos).forEach((input) => {
        if (input && input !== campos.usuario && input !== campos.contrasenia) {
            input.addEventListener("input", () => {
                input.removeAttribute("aria-invalid");
                if (input === campos.nombre || input === campos.apellido) {
                    ocultarMensaje("mensaje-perfil");
                } else {
                    ocultarMensaje("mensaje-registro");
                }
            });
        }
    });

    // --- Paso 1 → Paso 2 ---
    btnContinuar.addEventListener("click", () => {
        const error = validarPerfil(leerDatos());
        if (error) {
            campos[error.campo].setAttribute("aria-invalid", "true");
            campos[error.campo].focus();
            mostrarMensaje("mensaje-perfil", error.mensaje, "error"); // Cartel en el Paso 1
            return;
        }
        ocultarMensaje("mensaje-perfil");
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
            campos[errorPerfil.campo].setAttribute("aria-invalid", "true");
            campos[errorPerfil.campo].focus();
            mostrarMensaje("mensaje-perfil", errorPerfil.mensaje, "error");
            return;
        }

        const errorPriv = validarPrivacidad(
            datos,
            campos.repetir.value,
            campos.terminos.checked,
        );
        if (errorPriv) {
            campos[errorPriv.campo].setAttribute("aria-invalid", "true");
            campos[errorPriv.campo].focus();
            mostrarMensaje("mensaje-registro", errorPriv.mensaje, "error"); // Cartel en el Paso 2
            return;
        }

        // Crear la cuenta (estado.js controla usuario/email no repetidos)
        const resultado = crearUsuario(datos);
        if (!resultado.ok) {
            // Si el error es porque el usuario ya existe, lo mandamos al paso 1
            if (resultado.campo === "usuario") {
                pasoPerfil.hidden = false;
                pasoPrivacidad.hidden = true;
                campos.usuario.setAttribute("aria-invalid", "true");
                campos.usuario.focus();
                mostrarMensaje("mensaje-perfil", resultado.mensaje, "error");
            } else {
                // Si es el email repetido, se queda en el paso 2
                campos[resultado.campo].setAttribute("aria-invalid", "true");
                campos[resultado.campo].focus();
                mostrarMensaje("mensaje-registro", resultado.mensaje, "error");
            }
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

    // Validación 1: Longitud
    if (
        datos.usuario.length < LARGO_MIN_USUARIO ||
        datos.usuario.length > LARGO_MAX_USUARIO
    ) {
        return {
            campo: "usuario",
            mensaje: "El usuario debe tener entre 3 y 15 caracteres.",
        };
    }

    // Validación 2: Caracteres permitidos
    if (!FORMATO_CARACTERES_USUARIO.test(datos.usuario)) {
        return {
            campo: "usuario",
            mensaje: "El usuario solo puede tener letras, números y '_'.",
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

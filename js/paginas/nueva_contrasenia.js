document.addEventListener("DOMContentLoaded", () => {
    if (sessionStorage.getItem("codigoVerificado") !== "si") {
        window.location.href = "olvidaste_contra.html";
        return;
    }

    const formulario = document.querySelector("form");
    const nuevaInput = document.getElementById("nueva-contrasenia");
    const confirmarInput = document.getElementById(
        "confirmar-nueva-contrasenia",
    );

    // Elementos de los requisitos
    const reqLongitud = document.getElementById("req-longitud");
    const reqNumero = document.getElementById("req-numero");

    // --- 1. Validación en tiempo real (SOLO visual y limpiar errores) ---
    const actualizarVisuales = () => {
        const nueva = nuevaInput.value.trim();

        // Pintamos los requisitos (usando utils.js)
        pintarRequisito(reqLongitud, nueva, nueva.length >= 8);
        pintarRequisito(reqNumero, nueva, /\d/.test(nueva));

        // Ocultamos cualquier cartel de error viejo
        ocultarMensaje("mensaje-nueva-contra");
        nuevaInput.removeAttribute("aria-invalid");
        confirmarInput.removeAttribute("aria-invalid");
    };

    nuevaInput.addEventListener("input", actualizarVisuales);
    confirmarInput.addEventListener("input", actualizarVisuales);

    // --- 2. Validación al hacer Submit (SOLO acá salta el cartel) ---
    formulario.addEventListener("submit", (e) => {
        e.preventDefault();

        const nueva = nuevaInput.value.trim();
        const confirmar = confirmarInput.value.trim();

        // Evaluamos errores en orden
        if (!nueva || !confirmar) {
            mostrarMensaje(
                "mensaje-nueva-contra",
                "Por favor, completá todos los campos.",
                "error",
            );
            if (!nueva) nuevaInput.setAttribute("aria-invalid", "true");
            if (!confirmar) confirmarInput.setAttribute("aria-invalid", "true");
            return;
        }

        if (nueva.length < 8) {
            nuevaInput.setAttribute("aria-invalid", "true");
            mostrarMensaje(
                "mensaje-nueva-contra",
                "La contraseña debe tener al menos 8 caracteres.",
                "error",
            );
            return;
        }

        if (!/\d/.test(nueva)) {
            nuevaInput.setAttribute("aria-invalid", "true");
            mostrarMensaje(
                "mensaje-nueva-contra",
                "La contraseña debe tener al menos un número.",
                "error",
            );
            return;
        }

        if (nueva !== confirmar) {
            confirmarInput.setAttribute("aria-invalid", "true");
            mostrarMensaje(
                "mensaje-nueva-contra",
                "Las contraseñas no coinciden.",
                "error",
            );
            return;
        }

        // --- 3. Si todo está OK, procedemos a guardar ---
        const email = sessionStorage.getItem("emailRecuperacion");
        if (!email) {
            mostrarMensaje(
                "mensaje-nueva-contra",
                "Error: no se encontró el email en la sesión.",
                "error",
            );
            return;
        }

        const resultado = cambiarPassword(email, nueva);

        if (!resultado.ok) {
            mostrarMensaje("mensaje-nueva-contra", resultado.mensaje, "error");
            return;
        }

        // Limpiamos la sesión y redirigimos
        sessionStorage.removeItem("codigoRecuperacion");
        sessionStorage.removeItem("emailRecuperacion");
        sessionStorage.removeItem("codigoVerificado");
        cerrarSesion();

        mostrarMensaje(
            "mensaje-nueva-contra",
            "¡Contraseña actualizada con éxito! Redirigiendo...",
            "ok",
        );
        setTimeout(() => {
            window.location.href = "../../index.html";
        }, 2000);
    });
});

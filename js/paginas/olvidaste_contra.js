//esperamos a que cargue toda la pagina para arrancar a manejar los elementos del form
document.addEventListener("DOMContentLoaded", () => {
    const formulario = document.querySelector("form");
    const emailInput = document.getElementById("email");
    const btnAceptar = formulario.querySelector("button[type='submit']");

    // Bandera para saber si ya generamos el código
    let codigoEnviado = false;

    //escuchamos cuando el usuario le da a aceptar
    formulario.addEventListener("submit", (e) => {
        e.preventDefault(); //frenamos el envio por defecto

        // --- SI EL CÓDIGO YA FUE ENVIADO, EL BOTÓN AHORA REDIRIGE ---
        if (codigoEnviado) {
            window.location.href = "cod_recuperacion.html";
            return;
        }

        const email = emailInput.value.trim().toLowerCase();

        //si el campo esta vacio, marcamos error y avisamos
        if (!email) {
            emailInput.setAttribute("aria-invalid", "true");
            mostrarMensaje(
                "mensaje-recuperar",
                "Por favor, ingresá tu correo electrónico.",
                "error",
            );
            return;
        }

        const usuarioEncontrado = buscarUsuario(email);

        //si el mail no esta registrado, tiramos el error
        if (!usuarioEncontrado) {
            emailInput.setAttribute("aria-invalid", "true");
            mostrarMensaje(
                "mensaje-recuperar",
                "El correo electrónico ingresado no existe en nuestros registros.",
                "error",
            );
            return;
        }

        //si todo va bien, armamos un codigo random de 4 digitos
        const codigoGenerado = Math.floor(
            1000 + Math.random() * 9000,
        ).toString();

        //guardamos el codigo y el mail en la sesion
        sessionStorage.setItem("codigoRecuperacion", codigoGenerado);
        sessionStorage.setItem("emailRecuperacion", email);

        emailInput.removeAttribute("aria-invalid");

        //mostramos el cartel verde de éxito y el código
        mostrarMensaje(
            "mensaje-recuperar",
            `¡Código enviado con éxito! (Simulación - Tu código es: ${codigoGenerado})`,
            "ok",
        );

        // --- CAMBIAMOS EL ESTADO Y EL BOTÓN ---
        codigoEnviado = true;
        btnAceptar.textContent = "Ingresar código →";
        btnAceptar.classList.remove("boton-verde");
        btnAceptar.classList.add("boton-amarillo");

        // Ya NO usamos setTimeout para redirigir automáticamente
    });

    //limpiamos los errores y reiniciamos el botón si el usuario vuelve a escribir
    emailInput.addEventListener("input", () => {
        emailInput.removeAttribute("aria-invalid");
        ocultarMensaje("mensaje-recuperar");

        // Si el usuario cambia el mail, deshacemos el envío del código
        if (codigoEnviado) {
            codigoEnviado = false;
            btnAceptar.textContent = "Aceptar";
            btnAceptar.classList.remove("boton-amarillo");
            btnAceptar.classList.add("boton-verde");
        }
    });
});

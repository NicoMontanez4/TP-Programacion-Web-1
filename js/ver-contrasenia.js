/* ver-contrasenia.js: agrega un botón con un ojito a cada campo de contraseña
   para mostrarla u ocultarla. Funciona solo: alcanza con cargar este archivo
   en la página (no hace falta tocar el HTML de los campos). */

const OJO_ABIERTO = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5C5.6 5 2.4 11 2.1 11.6a.9.9 0 0 0 0 .8C2.4 13 5.6 19 12 19s9.6-6 9.9-6.6a.9.9 0 0 0 0-.8C21.6 11 18.4 5 12 5m0 11a4 4 0 1 1 0-8 4 4 0 0 1 0 8m0-6a2 2 0 1 0 0 4 2 2 0 0 0 0-4"></path></svg>';
const OJO_TACHADO = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M3.7 2.3 2.3 3.7l3.1 3.1C3.4 8.4 2.3 10.9 2.1 11.6a.9.9 0 0 0 0 .8C2.4 13 5.6 19 12 19c1.9 0 3.5-.5 4.9-1.3l3.4 3.4 1.4-1.4zM12 16a4 4 0 0 1-3.5-5.9l1.5 1.5a2 2 0 0 0 2.4 2.4l1.5 1.5c-.6.3-1.2.5-1.9.5m9.9-4.4C21.6 11 18.4 5 12 5c-1.3 0-2.5.2-3.6.6l2.2 2.2c.5-.1.9-.2 1.4-.2a4 4 0 0 1 4 4c0 .5-.1.9-.2 1.4l2.9 2.9c1.8-1.6 3-3.6 3.2-4.1a.9.9 0 0 0 0-.8"></path></svg>';

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll('input[type="password"]').forEach((input) => {
    // Envolvemos el input para poder poner el botón adentro, a la derecha
    const envoltorio = document.createElement("span");
    envoltorio.className = "envoltorio-contrasenia";
    input.parentNode.insertBefore(envoltorio, input);
    envoltorio.appendChild(input);

    const boton = document.createElement("button");
    boton.type = "button"; // para que no envíe el formulario
    boton.className = "boton-ver-contrasenia";
    boton.setAttribute("aria-label", "Mostrar contraseña");
    boton.innerHTML = OJO_ABIERTO;
    envoltorio.appendChild(boton);

    boton.addEventListener("click", () => {
      const oculta = input.type === "password";
      input.type = oculta ? "text" : "password";
      boton.innerHTML = oculta ? OJO_TACHADO : OJO_ABIERTO;
      boton.setAttribute("aria-label", oculta ? "Ocultar contraseña" : "Mostrar contraseña");
    });
  });
});
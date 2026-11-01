document.addEventListener("DOMContentLoaded", () => {
  //si no hay sesion activa, volvemos al login
  if (!usuarioActual()) {
    window.location.href = "../../index.html";
    return;
  }

  const contenedor = document.querySelector(".tarjetas-catalogo");
  const mensaje = document.getElementById("mensaje-catalogo");

  //dibuja una tarjeta por cada curso; el boton depende de si el usuario ya esta inscripto
  const dibujarTarjetas = () => {
    const inscripciones = usuarioActual().inscripciones;

    contenedor.innerHTML = Object.values(CURSOS_DISPONIBLES)
      .map((curso) => {
        const estaInscripto = inscripciones.includes(curso.id);

        const boton = estaInscripto
          ? `<a class="boton-curso" href="mapa.html?curso=${curso.id}">Ir al curso</a>`
          : `<button type="button" class="boton-curso" data-curso="${curso.id}">+ Inscribirme</button>`;

        return `
          <article class="tarjeta-catalogo">
            <img src="../../imagenes/banderas/${curso.bandera}" alt="Bandera de ${curso.nombre}" />
            <h2>${curso.nombre}</h2>
            <p>${curso.descripcion}</p>
            ${boton}
          </article>`;
      })
      .join("");
  };

  dibujarTarjetas();

  //un solo listener para todos los botones "Inscribirme"
  contenedor.addEventListener("click", (e) => {
    const boton = e.target.closest("button[data-curso]");
    if (!boton) return;

    const idCurso = boton.dataset.curso;
    const resultado = inscribirse(idCurso);

    //el texto del mensaje ya dice si salio bien o mal (no depende solo del color)
    mensaje.textContent = resultado.mensaje;

    //volvemos a dibujar para que la tarjeta pase a "Ir al curso"
    dibujarTarjetas();

    //como el boton viejo desaparece, mandamos el foco al nuevo (para quien usa teclado)
    const nuevoBoton = contenedor.querySelector(`a[href$="curso=${idCurso}"]`);
    if (nuevoBoton) nuevoBoton.focus();
  });
});
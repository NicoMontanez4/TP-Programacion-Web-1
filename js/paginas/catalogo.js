
document.addEventListener("DOMContentLoaded", () => {
  //si no hay sesion activa, volvemos al login
  if (!usuarioActual()) {
    window.location.href = "../../index.html";
    return;
  }

  const contenedor = document.querySelector(".tarjetas-catalogo");
  const mensaje = document.getElementById("mensaje-catalogo");

  //dibuja una tarjeta por cada curso
  const dibujarTarjetas = () => {
    const usuario = usuarioActual();

    contenedor.innerHTML = ORDEN_CURSOS.map((id) => CURSOS[id])
      .map((curso) => {
        const inscripto = estaInscripto(usuario, curso.id);

        const boton = inscripto
          ? `<a class="boton-curso" href="mapa.html?curso=${curso.id}">Ir al curso</a>
             <button type="button" class="boton-eliminar-catalogo" data-curso="${curso.id}">Eliminar curso</button>`
          : `<button type="button" class="boton-curso" data-curso="${curso.id}">
          
                  <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" 
                    width="24" 
                    height="24" 
                    fill="currentColor" 
                    viewBox="0 0 24 24">
                    <path d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4z"></path>
                    <path d="M12 2C6.49 2 2 6.49 2 12s4.49 10 10 10 10-4.49 10-10S17.51 2 12 2m0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8"></path>
                  </svg> 
                        
                  <span>Inscribirme</span>

              </button>`;

        return `
          <article class="tarjeta-catalogo">
            <img src="../../imagenes/banderas/${curso.bandera}" alt="Bandera de ${curso.nombre}" />
            <h2>${curso.nombre}</h2>
            <p>${curso.descripcion}</p>
            <div class="acciones-catalogo">
              ${boton}
            </div>
          </article>`;
      })
      .join("");
  };

  //cartel de confirmacion antes de eliminar
  const pedirConfirmacionEliminar = (idCurso) => {
    const curso = CURSOS[idCurso];
    const progreso = obtenerProgresoCurso(usuarioActual(), idCurso).porcentaje;

    mostrarModal({
      titulo: `¿Eliminar el curso de ${curso.nombre}?`,
      texto:
        `Vas a perder tu progreso en este curso (${progreso}%). ` +
        `Tu XP y tus gemas se mantienen y podés volver a inscribirte desde el catálogo.`,
      botones: [
        { texto: "Cancelar", tipo: "secundario" },
        {
          texto: "Sí, eliminar",
          tipo: "principal",
          alHacerClic: () => {
            const resultado = eliminarCurso(idCurso);
            mensaje.textContent = resultado.mensaje;
            dibujarTarjetas();
          },
        },
      ],
    });
  };

  dibujarTarjetas();

  //listener para inscribirse y eliminar cursos
  contenedor.addEventListener("click", (e) => {

    //eliminar curso
    const botonEliminar = e.target.closest(".boton-eliminar-catalogo");
    if (botonEliminar) {
      pedirConfirmacionEliminar(botonEliminar.dataset.curso);
      return;
    }

    //inscribirse en un curso
    const botonInscripcion = e.target.closest("button.boton-curso[data-curso]");
    if (!botonInscripcion) return;

    const idCurso = botonInscripcion.dataset.curso;
    const resultado = inscribirse(idCurso);

    mensaje.textContent = resultado.mensaje;

    //actualizamos las tarjetas
    dibujarTarjetas();

    const nuevoBoton = contenedor.querySelector(`a[href$="curso=${idCurso}"]`);
    if (nuevoBoton) nuevoBoton.focus();
  });
});

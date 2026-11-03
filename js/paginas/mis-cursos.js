document.addEventListener("DOMContentLoaded", () => {
  //si no hay sesion activa, volvemos al login
  const usuario = usuarioActual();
  if (!usuario) {
    window.location.href = "../../index.html";
    return;
  }

  const contenedor = document.querySelector(".tarjetas-cursos");
  const avisoSinCursos = document.getElementById("sin-cursos");

  const FLECHA = `
    <svg class="flecha" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.35 8H6.65c-.64 0-.99.76-.56 1.24l5.35 6.11c.3.34.83.34 1.13 0l5.35-6.11C18.34 8.76 18 8 17.36 8Z"></path>
    </svg>`;

  //arma la tarjeta de un curso en el que el usuario esta inscripto
  const crearTarjeta = (curso, abierta) => {
    const progreso = obtenerProgresoCurso(usuario, curso.id).porcentaje;
    const claseCurso = abierta ? `${curso.id}-abierto` : curso.id;

    return `
      <article class="${claseCurso}" data-curso="${curso.id}">
        <a class="curso-header" href="#" role="button" aria-expanded="${abierta}" aria-controls="contenido-${curso.id}">
          <header>
            <img src="../../imagenes/banderas/${curso.bandera}" alt="Bandera de ${curso.nombre}" />
            <p>${curso.nombre} desde ${curso.desde}</p>
            ${FLECHA}
          </header>
        </a>
        <div class="contenido-curso" id="contenido-${curso.id}" ${abierta ? "" : "hidden"}>
          <p class="progreso-texto">Progreso: ${progreso}%</p>
          <progress value="${progreso}" max="100">${progreso}%</progress>
          <p class="nivel-curso">Nivel: ${curso.nivel}</p>
          <div class="acciones-curso">
            <a class="boton-continuar" href="mapa.html?curso=${curso.id}">Continuar</a>
            <button type="button" class="boton-eliminar-curso" data-curso="${curso.id}">Eliminar curso</button>
          </div>
        </div>
      </article>`;
  };

  const mensaje = document.getElementById("mensaje-cursos");
  const botonAgregar = document.querySelector(".boton-agregar-curso");

  //dibuja una tarjeta por cada curso en el que esta inscripto (todas arrancan cerradas)
  const dibujarCursos = () => {
    const inscripciones = ORDEN_CURSOS.filter((id) => CURSOS[id] && estaInscripto(usuarioActual(), id));

    contenedor.innerHTML = inscripciones
      .map((id) => crearTarjeta(CURSOS[id], false))
      .join("");

    //estado vacio: sin cursos mostramos el aviso; con cursos mostramos "Agregar curso"
    const hayCursos = inscripciones.length > 0;
    avisoSinCursos.hidden = hayCursos;
    if (botonAgregar) botonAgregar.hidden = !hayCursos;
  };

  //cartel de confirmacion antes de eliminar un curso
  const pedirConfirmacion = (idCurso) => {
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

              dibujarCursos();

              const quedanCursos = ORDEN_CURSOS.some(
                  (id) => CURSOS[id] && estaInscripto(usuarioActual(), id)
              );

              if (quedanCursos) {
                  mensaje.textContent = resultado.mensaje;
              } else {
                  mensaje.textContent = "";
              }
          },
        },
      ],
    });
  };

  dibujarCursos();

  //un solo listener para todas las tarjetas: eliminar, o desplegar / plegar
  contenedor.addEventListener("click", (e) => {
    const botonEliminar = e.target.closest(".boton-eliminar-curso");
    if (botonEliminar) {
      pedirConfirmacion(botonEliminar.dataset.curso);
      return;
    }

    const cabecera = e.target.closest(".curso-header");
    if (!cabecera) return;
    e.preventDefault();

    const tarjeta = cabecera.closest("article");
    const idCurso = tarjeta.dataset.curso;
    const contenido = tarjeta.querySelector(".contenido-curso");
    const abrir = contenido.hidden;

    contenido.hidden = !abrir;
    tarjeta.className = abrir ? `${idCurso}-abierto` : idCurso;
    cabecera.setAttribute("aria-expanded", abrir);
  });

  //resumen de actividad con los datos reales del usuario
  const xpHoy = usuario.xpHoy;
  const meta = META_DIARIA_XP;

  document.getElementById("resumen-racha").textContent = rachaActual(usuario);
  document.getElementById("meta-diaria").textContent = meta;

  const barra = document.getElementById("progreso-meta-diaria");
  barra.max = meta;
  barra.value = Math.min(xpHoy, meta);
  barra.textContent = `${xpHoy}/${meta} XP`;
  document.querySelector('label[for="progreso-meta-diaria"]').textContent = `${xpHoy}/${meta} XP`;

  //saludo personalizado
  document.getElementById("saludo").textContent = `¡Hola, ${usuario.usuario}! Te saluda Poli`;
  document.getElementById("texto-racha").textContent =
    usuario.racha > 0 ? `Ya llevás ${usuario.racha} días aprendiendo` : "¡Empezá hoy tu racha!";
});
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
          <a class="boton-continuar" href="mapa.html?curso=${curso.id}">Continuar</a>
        </div>
      </article>`;
  };

  //dibuja una tarjeta por cada curso en el que esta inscripto (todas arrancan cerradas)
  const inscripciones = usuario.inscripciones.filter((id) => CURSOS_DISPONIBLES[id]);

  contenedor.innerHTML = inscripciones
    .map((id) => crearTarjeta(CURSOS_DISPONIBLES[id], false))
    .join("");

  //estado vacio: sin cursos mostramos el aviso; con cursos mostramos "Agregar curso"
  const hayCursos = inscripciones.length > 0;

  avisoSinCursos.hidden = hayCursos;

  const botonAgregar = document.querySelector(".boton-agregar-curso");
  if (botonAgregar) botonAgregar.hidden = !hayCursos;

  //desplegar / plegar una tarjeta (un solo listener para todas)
  contenedor.addEventListener("click", (e) => {
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
  const xpHoy = obtenerXpHoy(usuario);
  const meta = usuario.metaDiaria;

  document.getElementById("resumen-racha").textContent = usuario.racha ?? 0;
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
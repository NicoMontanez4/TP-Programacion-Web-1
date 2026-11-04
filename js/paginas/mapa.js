/* mapa.js: mapa de unidades de un curso (paginas/cursos/mapa.html?curso=ingles)
   Necesita datos.js, estado.js, utils.js y navbar.js cargados antes. */

// Íconos del círculo de cada unidad (Boxicons)
const ICONOS_UNIDAD = {
  completada: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#ffffff" viewBox="0 0 24 24"><path d="M12 2C6.49 2 2 6.49 2 12s4.49 10 10 10 10-4.49 10-10S17.51 2 12 2m-1.29 13.71c-.2.2-.45.29-.71.29s-.51-.1-.71-.29l-3-3L7.7 11.3l2.29 2.29 5.29-5.29 1.41 1.41-6 6Z"></path></svg>',
  "en-curso": '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#ffffff" viewBox="0 0 24 24"><path d="M12 2C6.49 2 2 6.49 2 12s4.49 10 10 10 10-4.49 10-10S17.51 2 12 2m4.7 13.87-5.2-3c-.31-.18-.5-.51-.5-.87V6h2v5.42l4.7 2.71-1 1.73Z"></path></svg>',
  bloqueada: '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="#ffffff" viewBox="0 2 24 24"><path d="M6 22h12c1.1 0 2-.9 2-2v-9c0-1.1-.9-2-2-2h-1V7c0-2.76-2.24-5-5-5S7 4.24 7 7v2H6c-1.1 0-2 .9-2 2v9c0 1.1.9 2 2 2m7-4.28V20h-2v-2.28A2 2 0 0 1 10 16c0-1.1.9-2 2-2s2 .9 2 2a2 2 0 0 1-1 1.72M9 7c0-1.65 1.35-3 3-3s3 1.35 3 3v2H9z"></path></svg>',
};

document.addEventListener("DOMContentLoaded", () => {
  const usuario = usuarioActual();
  if (!usuario) return; // navbar.js ya lo manda al login

  const idCurso = leerParametro("curso");
  const curso = obtenerCurso(idCurso);

  // URL mal armada (curso que no existe)
  if (!curso) {
    mostrarModal({
      titulo: "No encontramos este curso",
      texto: "Puede que el link esté mal escrito. Volvé a tus cursos para elegir uno.",
      botones: [{ texto: "Ir a mis cursos", tipo: "principal", alHacerClic: () => 
        (window.location.href = "mis-cursos.html") }],
      cerrable: false,
    });
    return;
  }

  // Curso en el que no se inscribió
  if (!estaInscripto(usuario, idCurso)) {
    mostrarModal({
      titulo: "Todavía no estás inscripto en " + curso.nombre,
      texto: "Inscribite desde el catálogo para empezar sus lecciones.",
      botones: [{ texto: "Ir al catálogo", tipo: "principal", alHacerClic: () => 
        (window.location.href = "catalogo.html") }],
      cerrable: false,
    });
    return;
  }

  mostrarEncabezado(usuario, curso);
  mostrarUnidades(usuario, curso);
  mostrarValoraciones(usuario, curso);
  prepararFormularioComentario(curso);
});

// Bandera, nombre, mensaje con la próxima lección, progreso e imagen de Poli
function mostrarEncabezado(usuario, curso) {
  document.title = "PoliLingo - " + curso.nombre;

  const bandera = document.getElementById("bandera-curso");
  bandera.src = "../../imagenes/banderas/" + curso.bandera;
  bandera.alt = "Bandera de " + curso.nombre;
  document.getElementById("nombre-curso").textContent = curso.nombre;

  // Mensaje: según cuánto avanzó
  const progreso = obtenerProgresoCurso(usuario, curso.id);
  const proxima = siguienteLeccion(usuario, curso.id);
  const mensaje = document.getElementById("mensaje-curso");

  if (progreso.total === 0) {
    mensaje.textContent = "Este curso llega próximamente.";
  } else if (!proxima) {
    mensaje.textContent = "¡Terminaste el curso! Podés repasar cualquier lección.";
  } else {
    const saludo = progreso.completadas === 0 ? "¡Empecemos!" : "¡Vas muy bien!";
    mensaje.innerHTML = saludo + "<br />Próxima lección: <strong>" + proxima.titulo + "</strong>.";
  }

  // Barra de progreso del curso
  document.getElementById("texto-progreso").textContent = 
  "Progreso: " + progreso.porcentaje + "% · Nivel " + curso.nivel;
  const barra = document.getElementById("progreso-curso");
  barra.value = progreso.porcentaje;
  barra.textContent = progreso.porcentaje + "%";

  // Poli del curso (si un curso nuevo no tiene imagen, usamos una genérica)
  const imagen = document.getElementById("imagen-curso");
  imagen.alt = "Poli en el curso de " + curso.nombre;
  imagen.addEventListener("error", () => {
    imagen.src = "../../imagenes/poli/Poli-leyendo.png";
  }, { once: true });
  imagen.src = "../../imagenes/cursos/" + curso.imagenMapa;
}

// Una fila por unidad, con su estado
function mostrarUnidades(usuario, curso) {
  const mapa = document.getElementById("mapa-unidades");
  mapa.innerHTML = curso.unidades.map((unidad) => armarUnidad(usuario, curso.id, unidad)).join("");
}

function armarUnidad(usuario, idCurso, unidad) {
  const estado = estadoUnidad(usuario, idCurso, unidad.numero);
  const progreso = obtenerProgresoUnidad(usuario, idCurso, unidad.numero);
  const lecciones = progreso.completadas + "/" + progreso.total + " lecciones";
  const url = "unidad.html?curso=" + idCurso + "&unidad=" + unidad.numero;
  const idBarra = "progreso-u" + unidad.numero;

  let claseTarjeta = "tarjeta-unidad";
  let boton = "";
  let detalle = "";

  if (estado === "completada") {
    boton = `<a class="boton-repasar boton-verde" href="${url}">Repasar</a>`;
    detalle = `
      <label for="${idBarra}">Completada · ${lecciones}</label>
      <progress id="${idBarra}" class="barra-completada" value="100" max="100">100%</progress>`;
  } else if (estado === "en-curso") {
    claseTarjeta += " tarjeta-en-curso";
    const texto = progreso.completadas === 0 ? "Comenzar" : "Continuar";
    boton = `<a class="boton-repasar boton-naranja" href="${url}">${texto}</a>`;
    detalle = `
      <label for="${idBarra}">En curso · ${lecciones}</label>
      <progress id="${idBarra}" class="barra-en-curso" value="${progreso.porcentaje}" max="100">${progreso.porcentaje}%</progress>`;
  } else {
    claseTarjeta += " tarjeta-bloqueada";
    const texto = estado === "proximamente" ? "Próximamente" : "Bloqueada · " + lecciones;
    detalle = `<label>${texto}</label>`;
  }

  // completada y en-curso tienen su ícono; bloqueada y próximamente, el candado
  const claseIcono = estado === "completada" || estado === "en-curso" ? estado : "bloqueada";

  return `
    <article class="fila-unidad">
      <span class="icono-estado estado-${claseIcono}">${ICONOS_UNIDAD[claseIcono]}</span>
      <article class="${claseTarjeta}">
        <article class="info-unidad">
          <img src="../../imagenes/unidades/${unidad.imagen}" alt="Imagen de la unidad ${unidad.titulo}" />
          <section class="datos-unidad">
            <h3>Unidad ${unidad.numero} ${unidad.titulo}</h3>
            ${boton}
          </section>
        </article>
        <section class="progreso-curso estado-unidad">${detalle}</section>
      </article>
    </article>`;
}

/* ===================== Valoraciones ===================== */

// "★★★★☆" para 4 estrellas
function estrellasEnTexto(cantidad) {
  const llenas = Math.round(cantidad);
  return "★".repeat(llenas) + "☆".repeat(5 - llenas);
}

// "2026-10-20" -> "20/10/2026"
function formatearFechaCorta(fecha) {
  const partes = fecha.split("-");
  return partes[2] + "/" + partes[1] + "/" + partes[0];
}

function mostrarValoraciones(usuario, curso) {
  const comentarios = obtenerComentarios(curso.id);
  const promedio = promedioEstrellas(curso.id);

  // Promedio arriba a la derecha
  const textoPromedio = document.getElementById("promedio-curso");
  if (comentarios.length === 0) {
    textoPromedio.textContent = "Sin valoraciones todavía";
  } else {
    const cuantas = comentarios.length === 1 ? "1 opinión" : comentarios.length + " opiniones";
    textoPromedio.innerHTML =
      `<span class="estrellas-texto" aria-hidden="true">${estrellasEnTexto(promedio)}</span> ` +
      `${promedio} de 5 · ${cuantas}`;
  }

  // Lista de comentarios (el texto lo escribió un usuario: va con textContent)
  const lista = document.getElementById("lista-comentarios");
  lista.innerHTML = "";

  if (comentarios.length === 0) {
    lista.innerHTML = '<li class="sin-comentarios">Nadie opinó todavía. ¡Sé el primero!</li>';
  }

  comentarios.forEach((c) => {
    const item = document.createElement("li");
    item.className = "comentario";
    item.innerHTML = `
      <img src="../../imagenes/avatares/${c.avatar}" alt="" />
      <article>
        <header class="comentario-cabecera">
          <strong></strong>
          <span class="estrellas-texto" aria-label="${c.estrellas} de 5 estrellas">${estrellasEnTexto(c.estrellas)}</span>
          <span class="comentario-fecha">${formatearFechaCorta(c.fecha)}</span>
        </header>
        <p></p>
      </article>`;
    item.querySelector("strong").textContent = c.usuario;
    item.querySelector("p").textContent = c.texto;
    lista.appendChild(item);
  });

  // Si ya opinó, en vez del formulario mostramos el agradecimiento
  const yaOpino = comentarios.some((c) => c.usuario === usuario.usuario);
  document.getElementById("form-comentario").hidden = yaOpino;
  document.getElementById("ya-opinaste").hidden = !yaOpino;
}

function prepararFormularioComentario(curso) {
  const formulario = document.getElementById("form-comentario");
  const texto = document.getElementById("texto-comentario");

  formulario.addEventListener("submit", (e) => {
    e.preventDefault();

    const elegida = formulario.querySelector('input[name="estrellas"]:checked');
    const estrellas = elegida ? elegida.value : 0;

    // estado.js valida: de 1 a 5 estrellas y texto no vacío
    const resultado = agregarComentario(curso.id, estrellas, texto.value);

    if (!resultado.ok) {
      if (resultado.campo === "texto") {
        texto.setAttribute("aria-invalid", "true");
        texto.focus();
      }
      mostrarMensaje("mensaje-comentario", resultado.mensaje, "error");
      return;
    }

    formulario.reset();
    ocultarMensaje("mensaje-comentario");
    mostrarValoraciones(usuarioActual(), curso); // redibuja con el comentario nuevo
  });

  // Al escribir o elegir estrellas, se limpia el error
  formulario.addEventListener("input", () => {
    texto.removeAttribute("aria-invalid");
    ocultarMensaje("mensaje-comentario");
  });
}
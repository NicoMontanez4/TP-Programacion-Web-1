/* unidad.js: recorrido de lecciones de una unidad
   (paginas/cursos/unidad.html?curso=ingles&unidad=1)
   Necesita datos.js, estado.js, utils.js y navbar.js cargados antes. */

// Íconos de los botones de lección (Boxicons)
const ICONOS_LECCION = {
  completada: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#ffffff" viewBox="0 0 24 24"><path d="M9 15.59 4.71 11.3 3.3 12.71l5 5c.2.2.45.29.71.29s.51-.1.71-.29l11-11-1.41-1.41L9.02 15.59Z"></path></svg>',
  disponible: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#ffffff" viewBox="0 0 24 24"><path d="M5 16c-2 1-2 5-2 5s3 0 5-2zM21 2h-3.69c-2.4 0-4.66.94-6.36 2.64L8.69 6.9a8.4 8.4 0 0 0-6.24 1.27c-.25.17-.41.44-.44.73s.08.59.29.81l12 12c.2.2.45.29.71.29s.51-.1.71-.29c1.9-1.9 1.6-5.08 1.38-6.38l2.28-2.28c1.7-1.7 2.64-3.96 2.64-6.36V3c0-.55-.45-1-1-1Zm-3.59 7.41c-.78.78-2.05.78-2.83 0s-.78-2.05 0-2.83 2.05-.78 2.83 0 .78 2.05 0 2.83"></path></svg>',
  bloqueada: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#ffffff" viewBox="0 0 24 24"><path d="M6 22h12c1.1 0 2-.9 2-2v-9c0-1.1-.9-2-2-2h-1V7c0-2.76-2.24-5-5-5S7 4.24 7 7v2H6c-1.1 0-2 .9-2 2v9c0 1.1.9 2 2 2M9 7c0-1.65 1.35-3 3-3s3 1.35 3 3v2H9z"></path></svg>',
};

const FLECHA = '<span class="flecha-recorrido"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#f06c00" viewBox="0 0 24 24"><path d="M12 2C6.49 2 2 6.49 2 12s4.49 10 10 10 10-4.49 10-10S17.51 2 12 2M7 14l5-6 5 6z"></path></svg></span>';

// Cómo se ve cada estado: clase del CSS (mapa.css) y texto de la burbuja
const ESTILO_ESTADO = {
  completada: { clase: "leccion-completada-recorrido", burbuja: "Repasar" },
  disponible: { clase: "leccion-en-curso-recorrido", burbuja: "Comenzar" },
  bloqueada: { clase: "leccion-bloqueada-recorrido", burbuja: "Bloqueada" },
  proximamente: { clase: "leccion-bloqueada-recorrido", burbuja: "Próximamente" },
};

document.addEventListener("DOMContentLoaded", () => { /* DOMContentLoaded lee ?curso= y ?unidad= de la URL, 
    controla que existan y que el usuario esté inscripto, y llama a las 3 funciones que dibujan la página */
  const usuario = usuarioActual();
  if (!usuario) return; // navbar.js ya lo manda al login

  const idCurso = leerParametro("curso");
  const numeroUnidad = Number(leerParametro("unidad"));
  const curso = obtenerCurso(idCurso);
  const unidad = obtenerUnidad(idCurso, numeroUnidad);

  // URL mal armada (curso o unidad que no existen)
  if (!curso || !unidad) {
    mostrarModal({
      titulo: "No encontramos esta unidad",
      texto: "Puede que el link esté mal escrito. Volvé a tus cursos para elegir una.",
      botones: [{ texto: "Ir a mis cursos", tipo: "principal", alHacerClic: () => (window.location.href = "mis-cursos.html") }],
      cerrable: false,
    });
    return;
  }

  // Curso en el que no se inscribió
  if (!estaInscripto(usuario, idCurso)) {
    mostrarModal({
      titulo: "Todavía no estás inscripto en " + curso.nombre,
      texto: "Inscribite desde el catálogo para empezar sus lecciones.",
      botones: [{ texto: "Ir al catálogo", tipo: "principal", alHacerClic: () => (window.location.href = "catalogo.html") }],
      cerrable: false,
    });
    return;
  }

  mostrarCabecera(curso, unidad);
  mostrarPoli(usuario, idCurso, unidad);
  mostrarRecorrido(usuario, idCurso, unidad);
});

// Bandera, nombre del curso, título y descripción de la unidad
function mostrarCabecera(curso, unidad) {
  document.title = "PoliLingo - " + curso.nombre + " - Unidad " + unidad.numero;

  const bandera = document.getElementById("bandera-curso");
  bandera.src = "../../imagenes/banderas/" + curso.bandera;
  bandera.alt = "Bandera de " + curso.nombre;

  document.getElementById("nombre-curso").textContent = curso.nombre;
  document.getElementById("titulo-unidad").textContent = "Unidad " + unidad.numero + " - " + unidad.titulo;
  document.getElementById("descripcion-unidad").textContent = unidad.descripcion;
}

// Poli festejando si terminó la unidad, leyendo si todavía no
function mostrarPoli(usuario, idCurso, unidad) {
  const progreso = obtenerProgresoUnidad(usuario, idCurso, unidad.numero);
  const mensaje = document.getElementById("mensaje-unidad");
  const imagen = document.getElementById("imagen-unidad");

  imagen.src = "../../imagenes/poli/Poli-leyendo.png";
  imagen.alt = "Poli leyendo";

  if (progreso.total === 0) {
    mensaje.textContent = "Próximamente";
  } else if (progreso.completadas === progreso.total) {
    mensaje.textContent = "¡Listo!";
    imagen.src = "../../imagenes/poli/Poli-check.png";
    imagen.alt = "Poli festejando que terminaste la unidad";
  } else {
    mensaje.textContent = progreso.completadas + " de " + progreso.total + " lecciones";
  }

  document.getElementById("volver-al-curso").href = "mapa.html?curso=" + idCurso;
}

// Arma el camino: lección, flecha, lección, flecha, cofre, flecha, lección...
function mostrarRecorrido(usuario, idCurso, unidad) {
  const recorrido = document.getElementById("recorrido");

  if (unidad.lecciones.length === 0) {
    recorrido.innerHTML = '<p class="texto-unidad">Esta unidad llega próximamente.</p>';
    return;
  }

  const mitad = Math.floor(unidad.lecciones.length / 2); // el cofre va en la mitad
  let html = "";

  unidad.lecciones.forEach((leccion, indice) => {
    if (indice > 0) html += FLECHA;
    if (indice === mitad && mitad > 0) {
      html += armarCofre(usuario, idCurso, unidad, mitad) + FLECHA;
    }
    html += armarLeccion(usuario, idCurso, unidad.numero, leccion);
  });

  recorrido.innerHTML = html;

  // Las bloqueadas son <button>: al tocarlas explicamos por qué no se puede
  recorrido.querySelectorAll("button.boton-leccion").forEach((boton) => {
    boton.addEventListener("click", () => {
      mostrarModal({
        titulo: "Lección bloqueada",
        texto: boton.dataset.motivo,
      });
    });
  });
}

// Una lección del recorrido, según su estado
function armarLeccion(usuario, idCurso, numeroUnidad, leccion) {
    /* armarLeccion le pregunta a estadoLeccion() de estado.js en qué estado está la lección. 
    Las completadas y disponibles son un <a> que va a la lección. 
    Las bloqueadas son un <button> que, al tocarlo, muestra el motivo en un cartel. */
  const estado = estadoLeccion(usuario, idCurso, numeroUnidad, leccion.numero);
  const estilo = ESTILO_ESTADO[estado];
  const icono = ICONOS_LECCION[estado] || ICONOS_LECCION.bloqueada;
  const nombre = "Lección " + leccion.numero + ": " + leccion.titulo;
  let boton;

  if (estado === "completada" || estado === "disponible") {
    const url = "leccion.html?curso=" + idCurso + "&unidad=" + numeroUnidad + "&leccion=" + leccion.numero;
    boton = `<a class="boton-leccion" href="${url}" aria-label="${estilo.burbuja} ${nombre}">${icono}</a>`;
  } else {
    const motivo = estado === "proximamente"
      ? "Esta lección todavía no tiene ejercicios. ¡Llega pronto!"
      : "Completá la lección anterior para desbloquear esta.";
    boton = `<button class="boton-leccion" type="button" data-motivo="${motivo}" aria-label="${nombre} (${estilo.burbuja})">${icono}</button>`;
  }

  return `
    <article class="contenedor ${estilo.clase}">
      <h3 class="titulo-leccion">${leccion.titulo}</h3>
      <span class="burbuja-emergente">${estilo.burbuja}</span>
      ${boton}
      <article class="progreso-leccion">
        <article class="progreso-leccion-porcentaje" style="width: ${estado === "completada" ? 100 : 0}%"></article>
      </article>
    </article>`;
}

// El cofre se abre cuando completás todas las lecciones de antes de la mitad
function armarCofre(usuario, idCurso, unidad, mitad) {
  const abierto = unidad.lecciones
    .slice(0, mitad)
    .every((l) => leccionCompletada(usuario, idCurso, unidad.numero, l.numero));

  if (abierto) {
    return `
      <span class="cofre-contenedor">
        <span class="burbuja-emergente">¡Mitad de la unidad!</span>
        <img class="cofre-abierto" src="../../imagenes/tienda/Cofre-abierto.png" alt="Cofre abierto: ya llegaste a la mitad" />
      </span>`;
  }
  return `
    <span class="cofre-contenedor">
      <span class="burbuja-emergente">Completá ${mitad} lecciones</span>
      <img class="cofre-cerrado" src="../../imagenes/tienda/Cofre-cerrado.png" alt="Cofre cerrado" />
    </span>`;
}
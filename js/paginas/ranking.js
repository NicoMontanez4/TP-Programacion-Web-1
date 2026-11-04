/* ranking.js: tabla de clasificación por liga.
   Necesita datos.js, estado.js, utils.js y navbar.js cargados antes.
   Al cambiar la liga en el selector se actualiza todo sin recargar la página.
   También se puede entrar directo con ranking.html?liga=plata */

const MEDALLAS = {
  1: "medalla-oro.png",
  2: "medalla-plata.png",
  3: "medalla-bronce.png",
};

document.addEventListener("DOMContentLoaded", () => {
  const usuario = usuarioActual();
  if (!usuario) return; // navbar.js ya redirige al login

  const selector = document.getElementById("selector-liga");

  // Opciones del selector: una por liga
  LIGAS.forEach((liga) => {
    const opcion = crearElemento("option", liga.nombre);
    opcion.value = liga.id;
    selector.appendChild(opcion);
  });

  // Liga inicial: la del parámetro de la URL o, si no hay, la del usuario
  const inicial = obtenerLiga(leerParametro("liga")) || obtenerLiga(usuario.liga) || LIGAS[0];
  selector.value = inicial.id;
  mostrarLiga(inicial.id);

  // Al elegir otra liga se redibuja todo
  selector.addEventListener("change", () => {
    mostrarLiga(selector.value);
    history.replaceState(null, "", "?liga=" + selector.value); // la URL queda compartible
  });

  // Coherencia con la actividad: si el XP cambió (otra pestaña, volver atrás
  // desde una lección), se vuelve a dibujar con los datos guardados.
  window.addEventListener("storage", () => mostrarLiga(selector.value));
  window.addEventListener("pageshow", () => mostrarLiga(selector.value));
});

/* ===================== Dibujo de una liga ===================== */

function mostrarLiga(idLiga) {
  const usuario = usuarioActual();
  const liga = obtenerLiga(idLiga);
  if (!usuario || !liga) return;

  const filas = obtenerRanking(liga.id);
  const esMiLiga = liga.id === usuario.liga;

  // Banner: nombre de la liga, color y texto
  document.getElementById("banner-liga").className = "ranking-liga-" + liga.id;
  document.getElementById("titulo-liga").textContent = "Ranking " + liga.nombre;
  const texto = document.getElementById("texto-liga");
  texto.textContent = liga.texto + " ";
  if (!liga.siguiente) {
    const gema = document.createElement("span");
    gema.innerHTML = ICONOS.gemas.replace("<svg ", '<svg class="icono-gema-ranking" ');
    texto.appendChild(gema);
  }

  // Mensaje de arriba + indicación de ascenso / permanencia
  const mensaje = document.getElementById("mensaje-liga");
  mensaje.textContent = "";
  if (esMiLiga) {
    mensaje.append(
      "¡Felicidades, ",
      crearElemento("strong", usuario.nombre),
      "! Estás en la liga de ",
      crearElemento("strong", liga.id),
      "."
    );
  } else {
    mensaje.textContent = "Mirá los usuarios que están en la " + liga.nombre + ".";
  }
  const miFila = filas.find((f) => f.esActual);
  document.getElementById("indicacion-liga").textContent = indicacion(liga, miFila, esMiLiga);

  // Tabla, o mensaje si no hay nadie
  const tabla = document.getElementById("tabla-ranking");
  const vacio = document.getElementById("mensaje-vacio");
  tabla.hidden = filas.length === 0;
  vacio.hidden = filas.length > 0;
  dibujarTabla(filas);
}

// Frase que explica qué pasa con tu posición (solo si estás en esa liga)
function indicacion(liga, miFila, esMiLiga) {
  if (!esMiLiga || !miFila) {
    return "Reglas de esta liga: " + liga.texto;
  }
  if (!liga.siguiente && miFila.estado.startsWith("Top")) {
    return "Vas " + miFila.puesto + "º: ¡recibirás 350 PoliGemas esta semana!";
  }
  if (miFila.estado === "Zona de ascenso") {
    return "Vas " + miFila.puesto + "º: estás en zona de ascenso, ¡subís a la " +
      obtenerLiga(liga.siguiente).nombre + " esta semana!";
  }
  if (miFila.estado === "Zona de descenso") {
    return "Vas " + miFila.puesto + "º: estás en zona de descenso. ¡Sumá XP para mantenerte!";
  }
  return "Vas " + miFila.puesto + "º: permanecés en la " + liga.nombre + ". ¡Sumá XP para ascender!";
}

function dibujarTabla(filas) {
  const cuerpo = document.getElementById("cuerpo-ranking");
  cuerpo.innerHTML = "";
  let filaActual = null;

  filas.forEach((datos) => {
    const tr = document.createElement("tr");

    // Tu fila siempre va resaltada; el resto se colorea según la zona
    if (datos.esActual) {
      tr.className = "tu-fila";
      filaActual = tr;
    } else if (datos.estado.startsWith("Top")) {
      tr.className = "zona-top";
    } else if (datos.estado === "Zona de descenso") {
      tr.className = "zona-descenso";
    }

    const tdAvatar = document.createElement("td");
    const avatar = document.createElement("img");
    avatar.className = "avatar";
    avatar.src = "../../imagenes/avatares/" + datos.avatar;
    avatar.alt = "Avatar de " + datos.usuario;
    tdAvatar.appendChild(avatar);

    const tdPuesto = document.createElement("td");
    if (MEDALLAS[datos.puesto]) {
      const medalla = document.createElement("img");
      medalla.className = "medalla";
      medalla.src = "../../imagenes/logros/" + MEDALLAS[datos.puesto];
      medalla.alt = "Medalla del puesto " + datos.puesto;
      tdPuesto.append(medalla, " ");
    }
    tdPuesto.append(String(datos.puesto));

    // "Zona neutral" se muestra como "Permanencia"
    const estado = datos.estado === "Zona neutral" ? "Permanencia" : datos.estado;

    tr.append(
      tdAvatar,
      tdPuesto,
      crearElemento("td", datos.usuario + (datos.esActual ? " (Tú)" : "")),
      crearElemento("td", datos.xpSemanal + " XP"),
      crearElemento("td", estado)
    );
    cuerpo.appendChild(tr);
  });

  if (filaActual) centrarFilaEnTabla(filaActual);
}

// Mueve el scroll de la tabla (no el de la página) hasta la fila indicada
function centrarFilaEnTabla(fila) {
  const tabla = document.getElementById("tabla-ranking");
  const distancia = fila.getBoundingClientRect().top - tabla.getBoundingClientRect().top;
  tabla.scrollTop += distancia - tabla.clientHeight / 2;
}

function crearElemento(etiqueta, texto) {
  const elemento = document.createElement(etiqueta);
  elemento.textContent = texto;
  return elemento;
}
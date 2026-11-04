/* racha.js: calendario de racha (paginas/racha/racha.html)
   Necesita datos.js, estado.js, utils.js y navbar.js cargados antes. */

const NOMBRES_MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio",
  "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

// Mes que se está mostrando (arranca en el mes actual)
let mesVisible = new Date().getMonth();
let anioVisible = new Date().getFullYear();

document.addEventListener("DOMContentLoaded", () => {
  const usuario = usuarioActual();
  if (!usuario) return; // navbar.js ya lo manda al login

  mostrarEncabezado(usuario);
  mostrarCalendario(usuario);

  document.getElementById("mes-anterior").addEventListener("click", () => cambiarMes(-1));
  document.getElementById("mes-siguiente").addEventListener("click", () => cambiarMes(1));
});

// Título, mensaje y los números de "Racha actual" y "Mejor racha"
function mostrarEncabezado(usuario) {
  const racha = rachaActual(usuario);

  document.getElementById("titulo-racha").textContent =
    "Racha de " + racha + (racha === 1 ? " día" : " días");

  let mensaje;
  if (hizoActividadHoy(usuario)) {
    mensaje = "¡Ya practicaste hoy, seguí así!";
  } else if (racha > 0) {
    mensaje = "Completá una lección hoy para no cortarla.";
  } else {
    mensaje = "Completá una lección para empezar tu racha.";
  }
  document.getElementById("mensaje-racha").textContent = mensaje;

  document.getElementById("resumen-actual").textContent = racha;
  document.getElementById("resumen-mejor").textContent = Math.max(usuario.mejorRacha, racha);
}

// Arma la grilla del mes visible: días vacíos al principio + un <li> por día
function mostrarCalendario(usuario) {
  const grilla = document.getElementById("grilla-dias");
  const hoy = fechaHoy();

  document.getElementById("nombre-mes").textContent = NOMBRES_MESES[mesVisible] + " " + anioVisible;

  // getDay(): 0 = domingo. Lo pasamos a 0 = lunes para que la semana arranque en L
  const primerDia = new Date(anioVisible, mesVisible, 1);
  const vaciosAlPrincipio = (primerDia.getDay() + 6) % 7;
  /* getDay() da 0 para el domingo, pero el calendario arranca el lunes. 
  Con esta cuenta el lunes da 0 y el domingo da 6. Ese número son los casilleros vacíos antes del día 1. */
  const diasDelMes = new Date(anioVisible, mesVisible + 1, 0).getDate(); 
  // día 0 del mes siguiente = último de este

  let html = "";
  for (let i = 0; i < vaciosAlPrincipio; i++) {
    html += '<li class="dia vacio"></li>';
  }

  let practicados = 0;
  for (let dia = 1; dia <= diasDelMes; dia++) {
    const fecha = fechaATexto(new Date(anioVisible, mesVisible, dia));
    const practico = usuario.diasActivos.includes(fecha);
    if (practico) practicados++;

    let clases = "dia";
    if (practico) clases += " racha";
    if (fecha === hoy) clases += " hoy";

    const descripcion = dia + " de " + NOMBRES_MESES[mesVisible] + (practico ? ": practicaste" : "");
    html += `<li class="${clases}" aria-label="${descripcion}">${dia}</li>`;
  }

  grilla.innerHTML = html;
  document.getElementById("resumen-mes").textContent = practicados;

  // No dejamos ir a meses futuros
  const ahora = new Date();
  const esMesActual = anioVisible === ahora.getFullYear() && mesVisible === ahora.getMonth();
  document.getElementById("mes-siguiente").disabled = esMesActual;
}

// -1 = mes anterior, 1 = mes siguiente
function cambiarMes(direccion) {
  mesVisible += direccion;
  if (mesVisible < 0) {
    mesVisible = 11;
    anioVisible--;
  } else if (mesVisible > 11) {
    mesVisible = 0;
    anioVisible++;
  }
  mostrarCalendario(usuarioActual());
}
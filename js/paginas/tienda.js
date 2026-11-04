/* tienda.js: tienda (paginas/tienda/tienda.html)
   Necesita datos.js, estado.js, utils.js y navbar.js cargados antes. */

document.addEventListener("DOMContentLoaded", () => {
  if (!usuarioActual()) return; // navbar.js ya lo manda al login

  // Opciones del filtro, desde CATEGORIAS_TIENDA (datos.js)
  const filtro = document.getElementById("filtro-categoria");
  filtro.innerHTML = CATEGORIAS_TIENDA
    .map((c) => `<option value="${c.id}">${c.nombre}</option>`)
    .join("");
  filtro.addEventListener("change", mostrarProductos);

  mostrarProductos();

  // Un solo listener para todos los botones de compra con gemas (incluida la oferta del día)
  document.querySelector("main").addEventListener("click", (e) => {
    const boton = e.target.closest("button[data-producto]");
    if (boton) confirmarCompra(boton.dataset.producto);
  });
});

// Dibuja los productos de la categoría elegida, agrupados por sección
function mostrarProductos() {
  const usuario = usuarioActual();
  const elegida = document.getElementById("filtro-categoria").value;
  const contenedor = document.getElementById("productos-tienda");

  const categorias = CATEGORIAS_TIENDA.filter((c) => c.id !== "todas" && (elegida === "todas" || c.id === elegida));

  contenedor.innerHTML = categorias.map((categoria) => {
    const productos = PRODUCTOS.filter((p) => p.categoria === categoria.id);
    if (productos.length === 0) return "";
    return `
      <section class="seccion-tienda">
        <h2>${categoria.nombre}</h2>
        ${productos.map((p) => armarProducto(p, usuario)).join("")}
      </section>`;
  }).join("");
}

// Una fila de producto con su botón según el tipo
function armarProducto(producto, usuario) {
  let boton;
  let extra = "";

  if (producto.tipo === "gemas") {
    const lleno =
      (producto.id === "recarga-vidas" && usuario.vidas >= VIDAS_MAX) ||
      (producto.id === "protector-racha" && usuario.protectoresRacha >= producto.maximo);

    if (producto.id === "protector-racha") {
      extra = `<span class="contador-equipados">${usuario.protectoresRacha}/${producto.maximo} equipados</span>`;
    }

    boton = lleno
      ? `<span class="boton-item boton-deshabilitado">${producto.id === "recarga-vidas" ? "Vidas llenas" : "Equipado"}</span>`
      : `<button type="button" class="boton-item" data-producto="${producto.id}">Obtener por ${ICONOS.gemas} ${producto.precio}</button>`;
  } else if (producto.tipo === "dinero") {
    boton = `<a class="boton-item" href="metodo-de-pago.html?producto=${producto.id}">Obtener por USD ${producto.precio.toFixed(2)}</a>`;
  } else {
    boton = `<a class="boton-item" href="superpoli.html">Conocer más</a>`;
  }

  const imagen = producto.imagen === "SuperPoli.png"
    ? "../../imagenes/poli/SuperPoli.png"
    : "../../imagenes/tienda/" + producto.imagen;

  return `
    <article class="fila-item">
      <img class="icono-item" src="${imagen}" alt="" />
      <section class="texto-item">
        <h3>${producto.nombre} ${extra}</h3>
        <p>${producto.descripcion}</p>
      </section>
      ${boton}
    </article>`;
}

// Pregunta antes de gastar gemas
function confirmarCompra(idProducto) {
  const producto = obtenerProducto(idProducto);
  const usuario = usuarioActual();

  mostrarModal({
    titulo: "¿Comprar " + producto.nombre + "?",
    texto: "Cuesta " + producto.precio + " gemas. Tenés " + usuario.gemas + ".",
    botones: [
      { texto: "Comprar", tipo: "principal", alHacerClic: () => comprar(idProducto) },
      { texto: "Cancelar", tipo: "secundario" },
    ],
  });
}

function comprar(idProducto) {
  const resultado = comprarConGemas(idProducto); // estado.js: valida, descuenta y guarda

  if (!resultado.ok) {
    mostrarMensaje("mensaje-tienda", resultado.mensaje, "error");
    return;
  }

  mostrarMensaje("mensaje-tienda", resultado.mensaje + " Te quedan " + usuarioActual().gemas + " gemas.", "ok");
  actualizarNavbar(); // gemas, vidas y protectores nuevos arriba
  mostrarProductos(); // por si ahora quedó "Equipado" o "Vidas llenas"
}
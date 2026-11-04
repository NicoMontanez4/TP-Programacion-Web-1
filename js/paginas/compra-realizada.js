/* compra-realizada.js: confirmación del pago simulado
   (paginas/tienda/compra-realizada.html?producto=paquete-gemas) */

document.addEventListener("DOMContentLoaded", () => {
  const usuario = usuarioActual();
  if (!usuario) return; // navbar.js ya lo manda al login

  const producto = obtenerProducto(leerParametro("producto"));
  if (!producto) return; // sin producto queda el texto genérico del HTML

  const detalle = document.getElementById("detalle-compra");
  detalle.textContent =
    "Compraste " + producto.nombre + ": sumaste " + producto.gemas + " gemas" +
    (producto.protectores ? " y " + producto.protectores + " protectores de racha" : "") +
    ". Ahora tenés " + usuario.gemas + " gemas.";
});
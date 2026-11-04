/* metodo-de-pago.js: pago simulado (paginas/tienda/metodo-de-pago.html?producto=paquete-gemas)
   Necesita datos.js, estado.js, utils.js y navbar.js cargados antes. */

document.addEventListener("DOMContentLoaded", () => {
  if (!usuarioActual()) return; // navbar.js ya lo manda al login

  const producto = obtenerProducto(leerParametro("producto"));

  // Sin producto válido no hay nada que pagar
  if (!producto || producto.tipo !== "dinero") {
    mostrarModal({
      titulo: "No encontramos ese producto",
      texto: "Volvé a la tienda y elegí un paquete.",
      botones: [{ texto: "Ir a la tienda", tipo: "principal", alHacerClic: () => (window.location.href = "tienda.html") }],
      cerrable: false,
    });
    return;
  }

  document.getElementById("resumen-compra").textContent =
    "Estás comprando: " + producto.nombre + " — USD " + producto.precio.toFixed(2);

  const formulario = document.getElementById("form-pago");

  formulario.addEventListener("submit", (e) => {
    e.preventDefault();

    const error = validarPago();
    if (error) {
      const campo = document.getElementById(error.campo);
      campo.setAttribute("aria-invalid", "true");
      campo.focus();
      mostrarMensaje("mensaje-pago", error.mensaje, "error");
      return;
    }

    const resultado = acreditarCompraSimulada(producto.id); // estado.js: suma gemas y protectores
    if (!resultado.ok) {
      mostrarMensaje("mensaje-pago", resultado.mensaje, "error");
      return;
    }
    window.location.href = "compra-realizada.html?producto=" + producto.id;
  });

  // Al corregir, se limpia el error
  formulario.addEventListener("input", (e) => {
    e.target.removeAttribute("aria-invalid");
    ocultarMensaje("mensaje-pago");
  });
});

// Devuelve { campo, mensaje } con el primer error, o null si está todo bien
function validarPago() {
  const valor = (id) => document.getElementById(id).value.trim();

  if (!valor("nombre")) return { campo: "nombre", mensaje: "Escribí el nombre que figura en la tarjeta." };
  if (!/^\d{16}$/.test(valor("numero-tarjeta"))) return { campo: "numero-tarjeta", mensaje: "El número de tarjeta tiene que tener 16 números." };
  if (!valor("apellido")) return { campo: "apellido", mensaje: "Escribí el apellido." };

  const vencimiento = valor("vencimiento");
  if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(vencimiento)) {
    return { campo: "vencimiento", mensaje: "El vencimiento tiene que tener el formato MM/AA. Ej: 08/28" };
  }
  const [mes, anio] = vencimiento.split("/").map(Number);
  const ultimoDia = new Date(2000 + anio, mes, 0); // último día de ese mes
  if (ultimoDia < new Date()) return { campo: "vencimiento", mensaje: "La tarjeta está vencida." };

  if (!/^\d{7,8}$/.test(valor("dni"))) return { campo: "dni", mensaje: "El DNI tiene que tener 7 u 8 números." };
  if (!/^\d{3,4}$/.test(valor("codigo-seguridad"))) return { campo: "codigo-seguridad", mensaje: "El código de seguridad tiene 3 o 4 números." };

  return null;
}
// Lee el carrito almacenado en localStorage y lo muestra en pantalla.
let carrito = JSON.parse(localStorage.getItem("carrito"));
if (carrito == null) carrito = [];

let listaCarrito = document.getElementById("listaCarrito");
let totalCarrito = document.getElementById("totalCarrito");
let carritoContador = document.getElementById("carritoContador");

function mostrarCarrito() {
  listaCarrito.innerHTML = "";
  let total = 0;

  if (carrito.length == 0) {
    listaCarrito.innerHTML = '<p class="carrito-vacio">Tu carrito está vacío.</p>';
  }

  for (let i = 0; i < carrito.length; i++) {
    listaCarrito.innerHTML += `
      <div class="carrito-producto">
        <img src="${carrito[i].imagen}" alt="${carrito[i].nombre}">
        <div>
          <h3>${carrito[i].nombre}</h3>
          <p>${carrito[i].categoria}</p>
          <p class="carrito-precio">$${carrito[i].precio.toLocaleString("es-CL")}</p>
        </div>
        <button class="btn-eliminar" onclick="eliminarProducto(${i})">Eliminar</button>
      </div>`;
    total += carrito[i].precio;
  }

  totalCarrito.innerHTML = "$" + total.toLocaleString("es-CL");
  carritoContador.innerHTML = carrito.length;
}

function eliminarProducto(posicion) {
  carrito.splice(posicion, 1);
  localStorage.setItem("carrito", JSON.stringify(carrito));
  mostrarCarrito();
}

mostrarCarrito();

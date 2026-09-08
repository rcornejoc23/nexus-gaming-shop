// Catálogo de productos de NEXUS Gaming.
// Se usa un arreglo y un ciclo for, tal como solicita la evaluación.
let productos = [
  { id:1, nombre:"Teclado Mecánico RGB", precio:39990, categoria:"Teclados", imagen:"img/teclado.jpg", descripcion:"Teclado mecánico con iluminación RGB y diseño compacto, ideal para jugar y estudiar." },
  { id:2, nombre:"Mouse Gamer Pro", precio:24990, categoria:"Mouse", imagen:"img/mouse.jpg", descripcion:"Mouse gamer ergonómico con buena precisión y botones de acceso rápido." },
  { id:3, nombre:"Headset Gaming 7.1", precio:49990, categoria:"Audio", imagen:"img/audifonos.jpg", descripcion:"Audífonos gamer con micrófono y sonido envolvente para una mejor experiencia de juego." },
  { id:4, nombre:"Mousepad XL", precio:14990, categoria:"Accesorios", imagen:"img/mousepad.jpg", descripcion:"Mousepad de gran tamaño para teclado y mouse, con superficie cómoda y estable." },
  { id:5, nombre:"Soporte para Audífonos", precio:12990, categoria:"Accesorios", imagen:"img/soporte.jpg", descripcion:"Soporte para mantener tus audífonos ordenados y protegerlos cuando no están en uso." },
  { id:6, nombre:"Control Gamer Inalámbrico", precio:34990, categoria:"Controles", imagen:"img/control.jpg", descripcion:"Control inalámbrico cómodo y versátil para juegos compatibles en computador." }
];

function obtenerCarrito() {
  let carrito = JSON.parse(localStorage.getItem("carrito"));
  if (carrito == null) carrito = [];
  return carrito;
}

function actualizarContador() {
  let contador = document.getElementById("carritoContador");
  if (contador != null) contador.innerHTML = obtenerCarrito().length;
}

function agregarCarrito(idProducto, cantidad) {
  let carrito = obtenerCarrito();
  if (cantidad == null || cantidad < 1) cantidad = 1;

  for (let i = 0; i < productos.length; i++) {
    if (productos[i].id == idProducto) {
      for (let j = 0; j < cantidad; j++) carrito.push(productos[i]);
      localStorage.setItem("carrito", JSON.stringify(carrito));
      actualizarContador();
      alert(productos[i].nombre + " fue añadido al carrito");
      return;
    }
  }
}

function mostrarProductos() {
  let lista = document.getElementById("listaProductos");
  if (lista == null) return;
  lista.innerHTML = "";

  for (let i = 0; i < productos.length; i++) {
    lista.innerHTML += `
      <article class="producto">
        <img src="${productos[i].imagen}" alt="${productos[i].nombre}" class="imagen-producto">
        <h3>${productos[i].nombre}</h3>
        <p class="categoria-producto">${productos[i].categoria}</p>
        <p class="precio-producto">$${productos[i].precio.toLocaleString("es-CL")}</p>
        <div class="producto-acciones">
          <a href="detalle-producto.html?id=${productos[i].id}" class="btn-detalle">Ver detalle</a>
          <button class="btn-agregar" onclick="agregarCarrito(${productos[i].id}, 1)">Añadir</button>
        </div>
      </article>`;
  }
}

function mostrarDetalle() {
  let contenedor = document.getElementById("detalleProductoDinamico");
  if (contenedor == null) return;

  let parametros = new URLSearchParams(window.location.search);
  let id = parseInt(parametros.get("id"));
  if (isNaN(id)) id = 1;

  let producto = null;
  for (let i = 0; i < productos.length; i++) {
    if (productos[i].id == id) producto = productos[i];
  }
  if (producto == null) producto = productos[0];

  contenedor.innerHTML = `
    <div class="detalle-producto-imagen">
      <img src="${producto.imagen}" alt="${producto.nombre}">
    </div>
    <div class="detalle-producto-info">
      <p class="categoria-producto">${producto.categoria}</p>
      <h1>${producto.nombre}</h1>
      <p class="detalle-precio">$${producto.precio.toLocaleString("es-CL")}</p>
      <p class="detalle-descripcion">${producto.descripcion}</p>
      <div class="form-group">
        <label for="cantidad">Cantidad</label>
        <input type="number" id="cantidad" value="1" min="1" max="10">
      </div>
      <button id="btnAgregarCarrito" class="btn-formulario">Agregar al carrito</button>
    </div>`;

  document.getElementById("btnAgregarCarrito").addEventListener("click", function(){
    let cantidad = parseInt(document.getElementById("cantidad").value);
    agregarCarrito(producto.id, cantidad);
  });
}

mostrarProductos();
mostrarDetalle();
actualizarContador();

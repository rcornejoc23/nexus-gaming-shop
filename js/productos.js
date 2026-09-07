// ARREGLO DE PRODUCTOS

let productos = [
    {
        id: 1,
        nombre: "Teclado Mecánico RGB",
        precio: 39990,
        categoria: "Teclados",
        imagen: "img/teclado.jpg"
    },
    {
        id: 2,
        nombre: "Mouse Gamer Pro",
        precio: 24990,
        categoria: "Mouse",
        imagen: "img/mouse.jpg"
    },
    {
        id: 3,
        nombre: "Headset Gaming 7.1",
        precio: 49990,
        categoria: "Audio",
        imagen: "img/headset.jpg"
    },
    {
        id: 4,
        nombre: "Mousepad XL",
        precio: 14990,
        categoria: "Accesorios",
        imagen: "img/mousepad.jpg"
    },
    {
        id: 5,
        nombre: "Soporte para Audífonos",
        precio: 12990,
        categoria: "Accesorios",
        imagen: "img/soporte.jpg"
    },
    {
        id: 6,
        nombre: "Control Gamer Inalámbrico",
        precio: 34990,
        categoria: "Controles",
        imagen: "img/control.jpg"
    }
];


// CONTENEDOR DE PRODUCTOS

let listaProductos = document.getElementById("listaProductos");


// MOSTRAR PRODUCTOS

for (let i = 0; i < productos.length; i++) {

    listaProductos.innerHTML += `
        <div class="producto">

            <img
                src="${productos[i].imagen}"
                alt="${productos[i].nombre}"
                class="imagen-producto"
            >

            <h3>
                ${productos[i].nombre}
            </h3>

            <p class="categoria-producto">
                ${productos[i].categoria}
            </p>

            <p class="precio-producto">
                $${productos[i].precio.toLocaleString("es-CL")}
            </p>

            <a
                href="detalle-producto.html"
                class="btn-detalle"
            >
                Ver detalle
            </a>

            <button
                class="btn-agregar"
                onclick="agregarCarrito(${productos[i].id})"
            >
                Añadir
            </button>

        </div>
    `;
}


// OBTENER CARRITO GUARDADO

let carrito = JSON.parse(localStorage.getItem("carrito"));


// SI NO EXISTE CARRITO

if (carrito == null) {
    carrito = [];
}


// AÑADIR PRODUCTO

function agregarCarrito(idProducto) {

    for (let i = 0; i < productos.length; i++) {

        if (productos[i].id == idProducto) {

            carrito.push(productos[i]);

            localStorage.setItem(
                "carrito",
                JSON.stringify(carrito)
            );

            actualizarContador();

            alert(
                productos[i].nombre +
                " fue añadido al carrito"
            );

        }

    }

}


// ACTUALIZAR CONTADOR

function actualizarContador() {

    let contador = document.getElementById("carritoContador");

    contador.innerHTML = carrito.length;

}


actualizarContador();
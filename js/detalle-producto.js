// ==========================================
// PRODUCTOS
// ==========================================

let productosDetalle = [
    {
        id: 1,
        nombre: "Teclado Mecánico RGB",
        precio: 39990,
        categoria: "Teclados",
        imagen: "img/teclado.jpg",
        descripcion:
            "Teclado mecánico diseñado para jugadores, con iluminación RGB y estructura resistente. Ideal para mejorar la comodidad y respuesta durante largas sesiones de juego."
    },
    {
        id: 2,
        nombre: "Mouse Gamer Pro",
        precio: 24990,
        categoria: "Mouse",
        imagen: "img/mouse.jpg",
        descripcion:
            "Mouse gamer ergonómico con alta precisión, respuesta rápida y diseño cómodo para largas sesiones de juego."
    },
    {
        id: 3,
        nombre: "Headset Gaming 7.1",
        precio: 49990,
        categoria: "Audio",
        imagen: "img/audifonos.jpg",
        descripcion:
            "Audífonos gamer con sonido envolvente 7.1, micrófono integrado y diseño cómodo para jugar y comunicarte con tu equipo."
    },
    {
        id: 4,
        nombre: "Mousepad XL",
        precio: 14990,
        categoria: "Accesorios",
        imagen: "img/mousepad.jpg",
        descripcion:
            "Mousepad XL con amplia superficie para teclado y mouse, ideal para mejorar el control y mantener el setup ordenado."
    },
    {
        id: 5,
        nombre: "Soporte para Audífonos",
        precio: 12990,
        categoria: "Accesorios",
        imagen: "img/soporte.jpg",
        descripcion:
            "Soporte para audífonos diseñado para mantener tu escritorio ordenado y proteger tus accesorios cuando no los estás utilizando."
    },
    {
        id: 6,
        nombre: "Control Gamer Inalámbrico",
        precio: 34990,
        categoria: "Controles",
        imagen: "img/control.jpg",
        descripcion:
            "Control gamer inalámbrico con diseño ergonómico y conexión estable para disfrutar tus juegos con mayor comodidad."
    }
];


// ==========================================
// OBTENER ID DE LA URL
// ==========================================

// Ejemplo:
// detalle-producto.html?id=2

let parametros =
    new URLSearchParams(
        window.location.search
    );


let idProducto =
    parseInt(
        parametros.get("id")
    );


// ==========================================
// BUSCAR PRODUCTO
// ==========================================

let productoSeleccionado = null;


for (let i = 0; i < productosDetalle.length; i++) {

    if (productosDetalle[i].id == idProducto) {

        productoSeleccionado =
            productosDetalle[i];

    }

}


// ==========================================
// MOSTRAR PRODUCTO
// ==========================================

if (productoSeleccionado != null) {

    document.getElementById("detalleImagen").src =
        productoSeleccionado.imagen;

    document.getElementById("detalleImagen").alt =
        productoSeleccionado.nombre;


    document.getElementById("detalleCategoria").innerHTML =
        productoSeleccionado.categoria;


    document.getElementById("detalleNombre").innerHTML =
        productoSeleccionado.nombre;


    document.getElementById("detallePrecio").innerHTML =
        "$" +
        productoSeleccionado.precio.toLocaleString("es-CL");


    document.getElementById("detalleDescripcion").innerHTML =
        productoSeleccionado.descripcion;

} else {

    alert("Producto no encontrado");

    window.location.href =
        "productos.html";

}


// ==========================================
// CARRITO
// ==========================================

let carrito =
    JSON.parse(
        localStorage.getItem("carrito")
    );


if (carrito == null) {

    carrito = [];

}


// ==========================================
// BOTÓN AGREGAR AL CARRITO
// ==========================================

let botonAgregar =
    document.getElementById("btnAgregarCarrito");


botonAgregar.addEventListener(
    "click",
    function() {

        let cantidad =
            parseInt(
                document.getElementById("cantidad").value
            );


        /*
            Agregamos el producto según
            la cantidad seleccionada.
        */

        for (let i = 0; i < cantidad; i++) {

            carrito.push(
                productoSeleccionado
            );

        }


        /*
            Guardamos carrito en localStorage.
        */

        localStorage.setItem(
            "carrito",
            JSON.stringify(carrito)
        );


        actualizarContador();


        alert(
            productoSeleccionado.nombre +
            " fue añadido al carrito"
        );

    }
);


// ==========================================
// ACTUALIZAR CONTADOR
// ==========================================

function actualizarContador() {

    let contador =
        document.getElementById(
            "carritoContador"
        );


    contador.innerHTML =
        carrito.length;

}


actualizarContador();
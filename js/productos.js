(function () {
    "use strict";

    const listaProductos = document.getElementById("listaProductos");
    const productos = window.NexusCatalogo.obtenerProductos();

    function formatoPrecio(precio) {
        return "$" + Number(precio).toLocaleString("es-CL");
    }

    function crearTarjeta(producto) {
        const tarjeta = document.createElement("article");
        tarjeta.className = "producto";

        const imagen = document.createElement("img");
        imagen.className = "imagen-producto";
        imagen.src = producto.imagen;
        imagen.alt = producto.nombre;

        const nombre = document.createElement("h3");
        nombre.textContent = producto.nombre;

        const categoria = document.createElement("p");
        categoria.className = "categoria-producto";
        categoria.textContent = producto.categoria;

        const precio = document.createElement("p");
        precio.className = "precio-producto";
        precio.textContent = formatoPrecio(producto.precio);

        const detalle = document.createElement("a");
        detalle.className = "btn-detalle";
        detalle.href = "detalle-producto.html?id=" + encodeURIComponent(producto.id);
        detalle.textContent = "Ver detalle";

        const boton = document.createElement("button");
        boton.className = "btn-agregar";
        boton.type = "button";
        boton.textContent = producto.stock > 0 ? "Añadir" : "Sin stock";
        boton.disabled = producto.stock <= 0;
        boton.addEventListener("click", function () {
            window.NexusCarrito.agregar(producto, 1);
            alert(producto.nombre + " fue añadido al carrito");
        });

        tarjeta.append(imagen, nombre, categoria, precio, detalle, boton);
        return tarjeta;
    }

    productos.forEach(function (producto) {
        listaProductos.appendChild(crearTarjeta(producto));
    });
})();

(function () {
    "use strict";

    const idProducto = new URLSearchParams(window.location.search).get("id");
    const producto = window.NexusCatalogo.obtenerProductoPorId(idProducto);

    if (!producto) {
        alert("Producto no encontrado.");
        window.location.replace("productos.html");
        return;
    }

    document.getElementById("detalleImagen").src = producto.imagen;
    document.getElementById("detalleImagen").alt = producto.nombre;
    document.getElementById("detalleCategoria").textContent = producto.categoria;
    document.getElementById("detalleNombre").textContent = producto.nombre;
    document.getElementById("detallePrecio").textContent = "$" + producto.precio.toLocaleString("es-CL");
    document.getElementById("detalleDescripcion").textContent = producto.descripcion;

    const cantidad = document.getElementById("cantidad");
    const botonAgregar = document.getElementById("btnAgregarCarrito");
    cantidad.max = String(Math.min(10, Math.max(1, producto.stock)));
    botonAgregar.disabled = producto.stock <= 0;

    botonAgregar.addEventListener("click", function () {
        const cantidadSolicitada = Math.min(
            Math.max(1, Number.parseInt(cantidad.value, 10) || 1),
            Number(cantidad.max)
        );

        window.NexusCarrito.agregar(producto, cantidadSolicitada);
        alert(producto.nombre + " fue añadido al carrito");
    });
})();

(function () {
    "use strict";

    const idProducto = new URLSearchParams(window.location.search).get("id");
    const producto = window.NexusCatalogo.obtenerProductoPorId(idProducto);

    if (!producto) {
        alert("Producto no encontrado.");
        window.location.replace("productos.html");
        return;
    }

    const cantidad = document.getElementById("cantidad");
    const botonAgregar = document.getElementById("btnAgregarCarrito");

    function actualizarVista(productoActualizado) {
        document.getElementById("detalleImagen").src = productoActualizado.imagen;
        document.getElementById("detalleImagen").alt = productoActualizado.nombre;
        document.getElementById("detalleCategoria").textContent = productoActualizado.categoria;
        document.getElementById("detalleNombre").textContent = productoActualizado.nombre;
        document.getElementById("detallePrecio").textContent = "$" + productoActualizado.precio.toLocaleString("es-CL");

        const stock = Number(productoActualizado.stock) || 0;
        const stockElemento = document.getElementById("detalleStock");
        stockElemento.textContent = stock > 0
            ? "Stock disponible: " + stock + (stock === 1 ? " unidad" : " unidades")
            : "Sin stock disponible";
        stockElemento.classList.toggle("sin-stock", stock <= 0);

        document.getElementById("detalleDescripcion").textContent = productoActualizado.descripcion;
        cantidad.max = String(Math.min(10, Math.max(1, stock)));
        cantidad.value = String(Math.min(Math.max(1, Number(cantidad.value) || 1), Math.max(1, stock)));
        cantidad.disabled = stock <= 0;
        botonAgregar.disabled = stock <= 0;
    }

    actualizarVista(producto);

    botonAgregar.addEventListener("click", function () {
        const productoActualizado = window.NexusCatalogo.obtenerProductoPorId(idProducto);
        if (!productoActualizado || productoActualizado.stock <= 0) {
            actualizarVista(productoActualizado || producto);
            return;
        }

        const cantidadSolicitada = Math.min(
            Math.max(1, Number.parseInt(cantidad.value, 10) || 1),
            Number(cantidad.max)
        );

        window.NexusCarrito.agregar(productoActualizado, cantidadSolicitada);
        alert(productoActualizado.nombre + " fue añadido al carrito");
    });

    window.addEventListener("storage", function (evento) {
        if (evento.key !== "productosAdmin") {
            return;
        }

        const productoActualizado = window.NexusCatalogo.obtenerProductoPorId(idProducto);
        if (productoActualizado) {
            actualizarVista(productoActualizado);
        }
    });
})();

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
    const mensajeDetalle = document.getElementById("mensajeDetalle");

    function mostrarMensaje(texto) {
        mensajeDetalle.textContent = texto;
    }

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
        cantidad.max = String(Math.max(1, stock));
        cantidad.value = String(Math.min(Math.max(1, Number(cantidad.value) || 1), Math.max(1, stock)));
        cantidad.disabled = stock <= 0;
        botonAgregar.disabled = stock <= 0;
    }

    actualizarVista(producto);

    botonAgregar.addEventListener("click", function () {
        const productoActualizado = window.NexusCatalogo.obtenerProductoPorId(idProducto);
        if (!productoActualizado || productoActualizado.stock <= 0) {
            actualizarVista(productoActualizado || producto);
            mostrarMensaje("Este producto no tiene stock disponible.");
            return;
        }

        const cantidadSolicitada = Math.max(1, Number.parseInt(cantidad.value, 10) || 1);
        const resultado = window.NexusCarrito.agregar(productoActualizado, cantidadSolicitada);

        if (resultado.excedido) {
            mostrarMensaje(resultado.cantidadAgregada > 0
                ? "Solo se agregaron " + resultado.cantidadAgregada +
                  " unidad(es). El stock disponible es de " + resultado.stock + "."
                : "No se agregaron unidades porque el carrito ya alcanzó el stock disponible de " + resultado.stock + ".");
            return;
        }

        mostrarMensaje("");
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

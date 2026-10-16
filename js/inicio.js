(function () {
    "use strict";

    document.querySelectorAll("[data-producto-id]").forEach(function (boton) {
        boton.addEventListener("click", function () {
            const producto = window.NexusCatalogo.obtenerProductoPorId(boton.dataset.productoId);
            if (!producto) {
                return;
            }

            window.NexusCarrito.agregar(producto, 1);
            alert(producto.nombre + " fue añadido al carrito");
        });
    });
})();

(function () {
    "use strict";

    const listaCarrito = document.getElementById("listaCarrito");
    const totalCarrito = document.getElementById("totalCarrito");
    const mensajeCarrito = document.getElementById("mensajeCarrito");

    function mostrarMensaje(texto) {
        mensajeCarrito.textContent = texto;
    }

    function mostrarCarrito() {
        listaCarrito.replaceChildren();
        const items = window.NexusCarrito.obtenerItems();

        if (items.length === 0) {
            const vacio = document.createElement("p");
            vacio.className = "carrito-vacio";
            vacio.textContent = "Tu carrito está vacío.";
            listaCarrito.appendChild(vacio);
            totalCarrito.textContent = "$0";
            return;
        }

        let total = 0;

        items.forEach(function (item) {
            const producto = item.producto;
            const stock = Math.max(0, Math.floor(Number(producto.stock) || 0));
            total += producto.precio * item.cantidad;

            const tarjeta = document.createElement("article");
            tarjeta.className = "carrito-producto";

            const informacion = document.createElement("div");
            const nombre = document.createElement("h3");
            nombre.textContent = producto.nombre;
            const categoria = document.createElement("p");
            categoria.textContent = producto.categoria;
            informacion.append(nombre, categoria);

            const acciones = document.createElement("div");
            const precio = document.createElement("p");
            precio.className = "carrito-precio";
            precio.textContent = "$" + (producto.precio * item.cantidad).toLocaleString("es-CL");

            const cantidad = document.createElement("input");
            cantidad.type = "number";
            cantidad.min = stock > 0 ? "1" : "0";
            cantidad.max = String(stock);
            cantidad.value = String(item.cantidad);
            cantidad.disabled = stock <= 0;
            cantidad.className = "carrito-cantidad";
            cantidad.setAttribute("aria-label", "Cantidad de " + producto.nombre);
            cantidad.addEventListener("change", function () {
                const resultado = window.NexusCarrito.actualizarCantidad(producto.id, cantidad.value);
                if (resultado.excedido) {
                    mostrarMensaje("La cantidad solicitada supera el stock disponible. Se ajustó a " + resultado.stock + " unidad(es).");
                } else if (resultado.stock <= 0) {
                    mostrarMensaje("" + producto.nombre + " no tiene stock disponible.");
                } else {
                    mostrarMensaje("");
                }
                mostrarCarrito();
            });

            const eliminar = document.createElement("button");
            eliminar.type = "button";
            eliminar.className = "btn-eliminar";
            eliminar.textContent = "Eliminar";
            eliminar.addEventListener("click", function () {
                window.NexusCarrito.eliminar(producto.id);
                mostrarCarrito();
            });

            acciones.append(precio, cantidad, eliminar);
            tarjeta.append(informacion, acciones);
            listaCarrito.appendChild(tarjeta);
        });

        totalCarrito.textContent = "$" + total.toLocaleString("es-CL");
    }

    mostrarCarrito();

    window.addEventListener("storage", function (evento) {
        if (evento.key === "productosAdmin") {
            mostrarCarrito();
        }
    });
})();

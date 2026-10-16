(function () {
    "use strict";

    const listaCarrito = document.getElementById("listaCarrito");
    const totalCarrito = document.getElementById("totalCarrito");
    const mensajeCarrito = document.getElementById("mensajeCarrito");
    const botonFinalizarCompra = document.getElementById("btnFinalizarCompra");

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
            botonFinalizarCompra.disabled = true;
            return;
        }

        botonFinalizarCompra.disabled = false;

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
                const cantidadNumerica = Number(cantidad.value);
                if (!Number.isFinite(cantidadNumerica) || cantidadNumerica < 0) {
                    mostrarMensaje("No se aceptan cantidades negativas.");
                    mostrarCarrito();
                    return;
                }

                const cantidadSolicitada = Math.max(0, Math.floor(cantidadNumerica));
                let cantidadParaGuardar = cantidadSolicitada;

                if (cantidadSolicitada > stock) {
                    const deseaAjustar = window.confirm(
                        "Solicitaste " + cantidadSolicitada + " unidad(es), pero solo hay " +
                        stock + ". ¿Deseas ajustar la cantidad a las unidades disponibles?"
                    );
                    if (!deseaAjustar) {
                        mostrarMensaje("No se modificó la cantidad del producto.");
                        mostrarCarrito();
                        return;
                    }

                    cantidadParaGuardar = stock;
                }

                const resultado = window.NexusCarrito.actualizarCantidad(producto.id, cantidadParaGuardar);
                if (resultado.excedido) {
                    mostrarMensaje("La cantidad solicitada supera el stock disponible. Se ajustó a " + resultado.stock + " unidad(es).");
                } else if (resultado.stock <= 0) {
                    mostrarMensaje("" + producto.nombre + " no tiene stock disponible.");
                } else if (cantidadParaGuardar < cantidadSolicitada) {
                    mostrarMensaje("La cantidad se ajustó a " + cantidadParaGuardar + " unidad(es) disponibles.");
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

    botonFinalizarCompra.addEventListener("click", function () {
        const resultado = window.NexusCarrito.finalizarCompra();
        if (!resultado.ok) {
            mostrarMensaje(resultado.mensaje);
            mostrarCarrito();
            return;
        }

        alert("Compra finalizada correctamente. El stock fue actualizado.");
        mostrarMensaje("");
        mostrarCarrito();
    });

    mostrarCarrito();

    window.addEventListener("storage", function (evento) {
        if (evento.key === "productosAdmin") {
            mostrarCarrito();
        }
    });
})();

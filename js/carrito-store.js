(function () {
    "use strict";

    const STORAGE_KEY = "carrito";

    function leerCarrito() {
        try {
            const guardado = JSON.parse(localStorage.getItem(STORAGE_KEY));
            if (!Array.isArray(guardado)) {
                return [];
            }

            const agrupado = new Map();
            guardado.forEach(function (item) {
                const producto = item.producto || item;
                const id = Number(producto.id);
                if (!producto || !Number.isFinite(id)) {
                    return;
                }

                const cantidad = Math.max(1, Number(item.cantidad) || 1);
                const existente = agrupado.get(id);
                if (existente) {
                    existente.cantidad += cantidad;
                } else {
                    agrupado.set(id, {
                        producto: Object.assign({}, producto, { id: id }),
                        cantidad: cantidad
                    });
                }
            });

            return Array.from(agrupado.values());
        } catch (error) {
            console.warn("No se pudo leer el carrito.", error);
            return [];
        }
    }

    function guardarCarrito(items) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
        actualizarContadores();
    }

    function actualizarContadores() {
        const cantidad = obtenerCantidad();
        document.querySelectorAll("[data-carrito-contador]").forEach(function (contador) {
            contador.textContent = cantidad;
        });
    }

    function obtenerCantidad() {
        return leerCarrito().reduce(function (total, item) {
            return total + item.cantidad;
        }, 0);
    }

    window.NexusCarrito = {
        obtenerItems: leerCarrito,
        obtenerCantidad: obtenerCantidad,
        agregar: function (producto, cantidad) {
            const cantidadSolicitada = Math.max(1, Math.floor(Number(cantidad) || 1));
            const stockDisponible = Number(producto.stock);
            const limite = Number.isFinite(stockDisponible) && stockDisponible > 0 ? stockDisponible : cantidadSolicitada;
            const items = leerCarrito();
            const existente = items.find(function (item) {
                return item.producto.id === Number(producto.id);
            });

            if (existente) {
                existente.cantidad = Math.min(existente.cantidad + cantidadSolicitada, limite);
            } else {
                items.push({
                    producto: Object.assign({}, producto),
                    cantidad: Math.min(cantidadSolicitada, limite)
                });
            }

            guardarCarrito(items);
        },
        eliminar: function (id) {
            guardarCarrito(leerCarrito().filter(function (item) {
                return item.producto.id !== Number(id);
            }));
        },
        actualizarCantidad: function (id, cantidad) {
            const nuevaCantidad = Math.max(1, Math.floor(Number(cantidad) || 1));
            const items = leerCarrito();
            const item = items.find(function (elemento) {
                return elemento.producto.id === Number(id);
            });

            if (item) {
                const stock = Number(item.producto.stock);
                const limite = Number.isFinite(stock) && stock > 0 ? stock : nuevaCantidad;
                item.cantidad = Math.min(nuevaCantidad, limite);
                guardarCarrito(items);
            }
        }
    };

    actualizarContadores();
})();

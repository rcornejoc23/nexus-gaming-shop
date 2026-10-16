(function () {
    "use strict";

    const STORAGE_KEY = "carrito";

    function obtenerProductoActual(producto) {
        if (window.NexusCatalogo) {
            return window.NexusCatalogo.obtenerProductoPorId(producto.id) || producto;
        }

        return producto;
    }

    function obtenerStock(producto) {
        const stock = Number(producto.stock);
        return Number.isFinite(stock) ? Math.max(0, Math.floor(stock)) : 0;
    }

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

            return Array.from(agrupado.values()).map(function (item) {
                const productoActual = obtenerProductoActual(item.producto);
                const stock = obtenerStock(productoActual);

                return {
                    producto: Object.assign({}, productoActual),
                    cantidad: stock > 0 ? Math.min(item.cantidad, stock) : 0
                };
            });
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
            const productoActual = obtenerProductoActual(producto);
            const stockDisponible = obtenerStock(productoActual);
            const items = leerCarrito();
            const existente = items.find(function (item) {
                return item.producto.id === Number(productoActual.id);
            });
            const cantidadAnterior = existente ? existente.cantidad : 0;
            const cantidadNueva = Math.min(cantidadAnterior + cantidadSolicitada, stockDisponible);
            const cantidadAgregada = Math.max(0, cantidadNueva - cantidadAnterior);

            if (existente && cantidadAgregada > 0) {
                existente.producto = Object.assign({}, productoActual);
                existente.cantidad = cantidadNueva;
            } else if (!existente && cantidadAgregada > 0) {
                items.push({
                    producto: Object.assign({}, productoActual),
                    cantidad: cantidadNueva
                });
            }

            if (cantidadAgregada > 0) {
                guardarCarrito(items);
            }

            return {
                ok: cantidadAgregada > 0,
                excedido: cantidadAgregada < cantidadSolicitada,
                cantidadAgregada: cantidadAgregada,
                cantidadTotal: cantidadNueva,
                stock: stockDisponible
            };
        },
        eliminar: function (id) {
            guardarCarrito(leerCarrito().filter(function (item) {
                return item.producto.id !== Number(id);
            }));
        },
        actualizarCantidad: function (id, cantidad) {
            const nuevaCantidad = Math.max(0, Math.floor(Number(cantidad) || 0));
            const items = leerCarrito();
            const item = items.find(function (elemento) {
                return elemento.producto.id === Number(id);
            });

            if (!item) {
                return { ok: false, excedido: false, cantidad: 0, stock: 0 };
            }

            const productoActual = obtenerProductoActual(item.producto);
            const stock = obtenerStock(productoActual);
            const cantidadValidada = Math.min(nuevaCantidad, stock);
            item.producto = Object.assign({}, productoActual);
            item.cantidad = cantidadValidada;
            guardarCarrito(items);

            return {
                ok: true,
                excedido: nuevaCantidad > stock,
                cantidad: cantidadValidada,
                stock: stock
            };
        }
    };

    actualizarContadores();
})();

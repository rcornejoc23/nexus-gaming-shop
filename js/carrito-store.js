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
            const cantidadNumerica = Number(cantidad);
            if (!Number.isFinite(cantidadNumerica) || cantidadNumerica < 0) {
                return { ok: false, invalida: true, excedido: false, cantidadAgregada: 0, cantidadTotal: 0, stock: 0 };
            }

            const cantidadSolicitada = Math.max(1, Math.floor(cantidadNumerica));
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
            const cantidadNumerica = Number(cantidad);
            if (!Number.isFinite(cantidadNumerica) || cantidadNumerica < 0) {
                return { ok: false, invalida: true, excedido: false, cantidad: 0, stock: 0 };
            }

            const nuevaCantidad = Math.max(0, Math.floor(cantidadNumerica));
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
        },
        finalizarCompra: function () {
            const items = leerCarrito().filter(function (item) {
                return item.cantidad > 0;
            });

            if (items.length === 0) {
                return { ok: false, mensaje: "El carrito está vacío." };
            }

            if (!window.NexusCatalogo) {
                return { ok: false, mensaje: "No se pudo acceder al catálogo de productos." };
            }

            const productos = window.NexusCatalogo.obtenerProductos();
            const productosCompra = productos.map(function (producto) {
                return Object.assign({}, producto);
            });
            let total = 0;

            for (const item of items) {
                const producto = productosCompra.find(function (elemento) {
                    return elemento.id === Number(item.producto.id);
                });
                const cantidad = Math.floor(Number(item.cantidad));

                if (!producto) {
                    return { ok: false, mensaje: "Uno de los productos del carrito ya no está disponible." };
                }
                if (!Number.isInteger(cantidad) || cantidad <= 0) {
                    return { ok: false, mensaje: "La cantidad de un producto no es válida." };
                }
                if (producto.stock < cantidad) {
                    return {
                        ok: false,
                        mensaje: "El stock de " + producto.nombre + " cambió. Revisa el carrito antes de continuar."
                    };
                }

                producto.stock -= cantidad;
                total += producto.precio * cantidad;
            }

            window.NexusCatalogo.guardarProductos(productosCompra);
            localStorage.removeItem(STORAGE_KEY);
            actualizarContadores();

            return { ok: true, total: total };
        }
    };

    actualizarContadores();
})();

(function () {
    "use strict";

    const STORAGE_KEY = "productosAdmin";

    const productosBase = [
        {
            id: 1,
            codigo: "TEC001",
            nombre: "Teclado Mecánico RGB",
            descripcion: "Teclado mecánico con iluminación RGB.",
            precio: 39990,
            stock: 15,
            stockCritico: 5,
            categoria: "Teclados",
            imagen: "img/teclado.jpg"
        },
        {
            id: 2,
            codigo: "MOU001",
            nombre: "Mouse Gamer Pro",
            descripcion: "Mouse gamer ergonómico.",
            precio: 24990,
            stock: 8,
            stockCritico: 3,
            categoria: "Mouse",
            imagen: "img/mouse.jpg"
        },
        {
            id: 3,
            codigo: "AUD001",
            nombre: "Headset Gaming 7.1",
            descripcion: "Audífonos gamer con sonido envolvente.",
            precio: 49990,
            stock: 2,
            stockCritico: 3,
            categoria: "Audio",
            imagen: "img/audifonos.jpg"
        },
        {
            id: 4,
            codigo: "ACC001",
            nombre: "Mousepad XL",
            descripcion: "Mousepad grande para teclado y mouse.",
            precio: 14990,
            stock: 20,
            stockCritico: 5,
            categoria: "Accesorios",
            imagen: "img/mousepad.jpg"
        },
        {
            id: 5,
            codigo: "ACC002",
            nombre: "Soporte para Audífonos",
            descripcion: "Soporte de escritorio para audífonos.",
            precio: 12990,
            stock: 12,
            stockCritico: 4,
            categoria: "Accesorios",
            imagen: "img/soporte.jpg"
        },
        {
            id: 6,
            codigo: "CON001",
            nombre: "Control Gamer Inalámbrico",
            descripcion: "Control inalámbrico con diseño ergonómico.",
            precio: 34990,
            stock: 9,
            stockCritico: 3,
            categoria: "Controles",
            imagen: "img/control.jpg"
        }
    ];

    function copiarProductos(productos) {
        return productos.map(function (producto, indice) {
            const precio = Number(producto.precio);
            const stock = Number(producto.stock);
            const stockCritico = Number(producto.stockCritico);

            return Object.assign({}, producto, {
                id: Number(producto.id) || indice + 1,
                precio: Number.isFinite(precio) ? Math.max(0, precio) : 0,
                stock: Number.isFinite(stock) ? Math.max(0, Math.floor(stock)) : 0,
                stockCritico: Number.isFinite(stockCritico) ? Math.max(0, Math.floor(stockCritico)) : 0,
                imagen: producto.imagen || productosBase[indice % productosBase.length].imagen
            });
        });
    }

    function obtenerProductos() {
        try {
            const guardados = JSON.parse(localStorage.getItem(STORAGE_KEY));
            if (Array.isArray(guardados) && guardados.length > 0) {
                return copiarProductos(guardados);
            }
        } catch (error) {
            console.warn("No se pudo leer el catálogo guardado.", error);
        }

        const iniciales = copiarProductos(productosBase);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(iniciales));
        return iniciales;
    }

    function guardarProductos(productos) {
        const normalizados = copiarProductos(productos);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizados));
        return normalizados;
    }

    window.NexusCatalogo = {
        obtenerProductos: obtenerProductos,
        guardarProductos: guardarProductos,
        obtenerProductoPorId: function (id) {
            return obtenerProductos().find(function (producto) {
                return producto.id === Number(id);
            });
        }
    };
})();

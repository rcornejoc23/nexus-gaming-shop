(function () {
    "use strict";

    let productos = window.NexusCatalogo.obtenerProductos();
    const categorias = ["Teclados", "Mouse", "Audio", "Accesorios", "Controles"];

    function obtener(id) {
        return document.getElementById(id);
    }

    function mostrarError(id, mensaje) {
        const elemento = obtener(id);
        if (elemento) {
            elemento.textContent = mensaje;
        }
    }

    function limpiarErrores() {
        ["errorCodigoProducto", "errorNombreProducto", "errorDescripcionProducto", "errorPrecioProducto", "errorStockProducto", "errorStockCritico", "errorCategoriaProducto"].forEach(function (id) {
            mostrarError(id, "");
        });
    }

    function crearCelda(valor) {
        const celda = document.createElement("td");
        celda.textContent = valor;
        return celda;
    }

    function cargarTablaProductos() {
        const tabla = obtener("tablaProductos");
        if (!tabla) {
            return;
        }

        tabla.replaceChildren();
        productos.forEach(function (producto) {
            const fila = document.createElement("tr");
            if (producto.stock <= producto.stockCritico) {
                fila.className = "stock-critico";
            }

            fila.append(
                crearCelda(producto.codigo),
                crearCelda(producto.nombre),
                crearCelda(producto.categoria),
                crearCelda("$" + producto.precio.toLocaleString("es-CL")),
                crearCelda(producto.stock)
            );

            const acciones = document.createElement("td");
            const editar = document.createElement("a");
            editar.className = "btn-editar";
            editar.href = "producto-form.html?codigo=" + encodeURIComponent(producto.codigo);
            editar.textContent = "Editar";

            const eliminar = document.createElement("button");
            eliminar.type = "button";
            eliminar.className = "btn-eliminar-admin";
            eliminar.textContent = "Eliminar";
            eliminar.addEventListener("click", function () {
                if (!confirm("¿Eliminar producto?")) {
                    return;
                }

                productos = productos.filter(function (elemento) {
                    return elemento.codigo !== producto.codigo;
                });
                window.NexusCatalogo.guardarProductos(productos);
                productos = window.NexusCatalogo.obtenerProductos();
                cargarTablaProductos();
                cargarDashboard();
            });

            acciones.append(editar, eliminar);
            fila.appendChild(acciones);
            tabla.appendChild(fila);
        });
    }

    function cargarProductoParaEditar() {
        const formulario = obtener("formProducto");
        if (!formulario) {
            return;
        }

        const codigoEditar = new URLSearchParams(window.location.search).get("codigo");
        if (!codigoEditar) {
            return;
        }

        const producto = productos.find(function (elemento) {
            return elemento.codigo === codigoEditar;
        });
        if (!producto) {
            return;
        }

        obtener("codigoProducto").value = producto.codigo;
        obtener("codigoProducto").readOnly = true;
        obtener("nombreProducto").value = producto.nombre;
        obtener("descripcionProducto").value = producto.descripcion;
        obtener("precioProducto").value = producto.precio;
        obtener("stockProducto").value = producto.stock;
        obtener("stockCritico").value = producto.stockCritico;
        obtener("categoriaProducto").value = producto.categoria;
        obtener("tituloFormularioProducto").textContent = "Editar producto";
        obtener("btnGuardarProducto").textContent = "Guardar cambios";
    }

    function validarProducto(datos, codigoOriginal) {
        let valido = true;
        limpiarErrores();

        if (!/^[A-Z0-9-]{3,20}$/i.test(datos.codigo)) {
            mostrarError("errorCodigoProducto", "Usa entre 3 y 20 caracteres alfanuméricos.");
            valido = false;
        } else if (productos.some(function (producto) {
            return producto.codigo === datos.codigo && producto.codigo !== codigoOriginal;
        })) {
            mostrarError("errorCodigoProducto", "Ya existe un producto con ese código.");
            valido = false;
        }
        if (!datos.nombre || datos.nombre.length > 100) {
            mostrarError("errorNombreProducto", "El nombre es obligatorio y admite hasta 100 caracteres.");
            valido = false;
        }
        if (!datos.descripcion || datos.descripcion.length > 500) {
            mostrarError("errorDescripcionProducto", "La descripción es obligatoria y admite hasta 500 caracteres.");
            valido = false;
        }
        if (!Number.isFinite(datos.precio) || datos.precio < 0) {
            mostrarError("errorPrecioProducto", "El precio debe ser un número positivo.");
            valido = false;
        }
        if (!Number.isInteger(datos.stock) || datos.stock < 0) {
            mostrarError("errorStockProducto", "El stock debe ser un número entero positivo.");
            valido = false;
        }
        if (!Number.isInteger(datos.stockCritico) || datos.stockCritico < 0) {
            mostrarError("errorStockCritico", "El stock crítico debe ser un entero positivo.");
            valido = false;
        }
        if (!categorias.includes(datos.categoria)) {
            mostrarError("errorCategoriaProducto", "Selecciona una categoría válida.");
            valido = false;
        }

        return valido;
    }

    function configurarFormularioProducto() {
        const formulario = obtener("formProducto");
        if (!formulario) {
            return;
        }

        formulario.addEventListener("submit", function (evento) {
            evento.preventDefault();
            const codigoOriginal = new URLSearchParams(window.location.search).get("codigo");
            const precioTexto = obtener("precioProducto").value.trim();
            const stockTexto = obtener("stockProducto").value.trim();
            const stockCriticoTexto = obtener("stockCritico").value.trim();
            const datos = {
                codigo: obtener("codigoProducto").value.trim().toUpperCase(),
                nombre: obtener("nombreProducto").value.trim(),
                descripcion: obtener("descripcionProducto").value.trim(),
                precio: precioTexto === "" ? NaN : Number(precioTexto),
                stock: stockTexto === "" ? NaN : Number(stockTexto),
                stockCritico: stockCriticoTexto === "" ? NaN : Number(stockCriticoTexto),
                categoria: obtener("categoriaProducto").value
            };

            if (!validarProducto(datos, codigoOriginal)) {
                return;
            }

            const indice = codigoOriginal
                ? productos.findIndex(function (producto) { return producto.codigo === codigoOriginal; })
                : -1;
            const productoAnterior = indice >= 0 ? productos[indice] : null;
            const producto = Object.assign({}, productoAnterior || {}, datos, {
                id: productoAnterior ? productoAnterior.id : Date.now(),
                imagen: productoAnterior ? productoAnterior.imagen : "img/hero.jpg"
            });
            const archivo = obtener("imagenProducto").files[0];

            function guardar(imagen) {
                producto.imagen = imagen || producto.imagen;
                if (indice >= 0) {
                    productos[indice] = producto;
                } else {
                    productos.push(producto);
                }

                window.NexusCatalogo.guardarProductos(productos);
                alert("Producto guardado correctamente.");
                window.location.href = "productos.html";
            }

            if (archivo) {
                const lector = new FileReader();
                lector.addEventListener("load", function () { guardar(lector.result); });
                lector.readAsDataURL(archivo);
            } else {
                guardar(producto.imagen);
            }
        });
    }

    function cargarDashboard() {
        const totalProductos = obtener("totalProductos");
        const totalUsuarios = obtener("totalUsuarios");
        const stockCritico = obtener("stockCritico");

        if (!totalProductos && !totalUsuarios && !stockCritico) {
            return;
        }

        const usuarios = window.NexusUsuarios ? window.NexusUsuarios.obtenerUsuarios() : [];
        if (totalUsuarios) {
            totalUsuarios.textContent = usuarios.length;
        }
        if (totalProductos) {
            totalProductos.textContent = productos.length;
        }
        if (stockCritico) {
            stockCritico.textContent = productos.filter(function (producto) {
                return producto.stock <= producto.stockCritico;
            }).length;
        }
    }

    cargarProductoParaEditar();
    configurarFormularioProducto();
    cargarTablaProductos();
    cargarDashboard();

    window.addEventListener("storage", function (evento) {
        if (evento.key !== "productosAdmin") {
            return;
        }

        productos = window.NexusCatalogo.obtenerProductos();
        cargarTablaProductos();
        cargarDashboard();
    });
})();

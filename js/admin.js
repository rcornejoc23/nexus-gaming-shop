/* =========================================================
   NEXUS GAMING - ADMINISTRACIÓN DE PRODUCTOS
   =========================================================
   Este archivo se utiliza en:
   - admin/productos.html
   - admin/producto-form.html

   Funciones principales:
   1. Validar el formulario de productos.
   2. Simular la edición de un producto usando ?codigo=.
   3. Confirmar la eliminación de un producto.

   Nota: en esta primera evaluación no existe backend ni BD.
   Por eso guardar/eliminar se representa visualmente con alertas.
   ========================================================= */

// Productos de ejemplo del panel administrativo.
// Sirven para rellenar el formulario cuando se presiona "Editar".
let productosAdmin = [
    {
        codigo: "TEC001",
        nombre: "Teclado Mecánico RGB",
        descripcion: "Teclado mecánico con iluminación RGB y diseño compacto.",
        precio: 39990,
        stock: 15,
        stockCritico: 5,
        categoria: "Teclados"
    },
    {
        codigo: "MOU001",
        nombre: "Mouse Gamer Pro",
        descripcion: "Mouse gamer ergonómico con buena precisión y botones de acceso rápido.",
        precio: 24990,
        stock: 8,
        stockCritico: 3,
        categoria: "Mouse"
    },
    {
        codigo: "AUD001",
        nombre: "Headset Gaming 7.1",
        descripcion: "Audífonos gamer con micrófono y sonido envolvente.",
        precio: 49990,
        stock: 2,
        stockCritico: 3,
        categoria: "Audio"
    },
    {
        codigo: "ACC001",
        nombre: "Mousepad XL",
        descripcion: "Mousepad de gran tamaño para teclado y mouse.",
        precio: 14990,
        stock: 20,
        stockCritico: 5,
        categoria: "Accesorios"
    },
    {
        codigo: "ACC002",
        nombre: "Soporte para Audífonos",
        descripcion: "Soporte para mantener los audífonos ordenados.",
        precio: 12990,
        stock: 12,
        stockCritico: 4,
        categoria: "Accesorios"
    },
    {
        codigo: "CON001",
        nombre: "Control Gamer Inalámbrico",
        descripcion: "Control inalámbrico para juegos compatibles en computador.",
        precio: 34990,
        stock: 9,
        stockCritico: 3,
        categoria: "Controles"
    }
];

let formProducto = document.getElementById("formProducto");

// ---------------------------------------------------------
// MODO EDICIÓN
// ---------------------------------------------------------
// Ejemplo de URL: producto-form.html?codigo=TEC001
function cargarProductoParaEditar() {
    if (formProducto == null) {
        return;
    }

    let parametros = new URLSearchParams(window.location.search);
    let codigoEditar = parametros.get("codigo");

    // Si no existe código en la URL, el formulario queda en modo "nuevo".
    if (codigoEditar == null) {
        return;
    }

    for (let i = 0; i < productosAdmin.length; i++) {
        if (productosAdmin[i].codigo == codigoEditar) {
            let producto = productosAdmin[i];

            document.getElementById("codigoProducto").value = producto.codigo;
            document.getElementById("nombreProducto").value = producto.nombre;
            document.getElementById("descripcionProducto").value = producto.descripcion;
            document.getElementById("precioProducto").value = producto.precio;
            document.getElementById("stockProducto").value = producto.stock;
            document.getElementById("stockCritico").value = producto.stockCritico;
            document.getElementById("categoriaProducto").value = producto.categoria;

            let titulo = document.getElementById("tituloFormularioProducto");
            let boton = document.getElementById("btnGuardarProducto");

            if (titulo != null) {
                titulo.innerHTML = "Editar producto";
            }

            if (boton != null) {
                boton.innerHTML = "Guardar cambios";
            }

            break;
        }
    }
}

// ---------------------------------------------------------
// VALIDACIÓN DEL FORMULARIO
// ---------------------------------------------------------
if (formProducto != null) {
    formProducto.addEventListener("submit", function(evento) {
        // Evita que el formulario recargue la página.
        evento.preventDefault();

        // Obtenemos los valores ingresados.
        let codigo = document.getElementById("codigoProducto").value.trim();
        let nombre = document.getElementById("nombreProducto").value.trim();
        let descripcion = document.getElementById("descripcionProducto").value.trim();
        let precio = document.getElementById("precioProducto").value;
        let stock = document.getElementById("stockProducto").value;
        let stockCritico = document.getElementById("stockCritico").value;
        let categoria = document.getElementById("categoriaProducto").value;

        // Elementos donde mostraremos los mensajes de error.
        let errorCodigo = document.getElementById("errorCodigoProducto");
        let errorNombre = document.getElementById("errorNombreProducto");
        let errorDescripcion = document.getElementById("errorDescripcionProducto");
        let errorPrecio = document.getElementById("errorPrecioProducto");
        let errorStock = document.getElementById("errorStockProducto");
        let errorStockCritico = document.getElementById("errorStockCritico");
        let errorCategoria = document.getElementById("errorCategoriaProducto");

        // Limpiamos mensajes anteriores.
        errorCodigo.innerHTML = "";
        errorNombre.innerHTML = "";
        errorDescripcion.innerHTML = "";
        errorPrecio.innerHTML = "";
        errorStock.innerHTML = "";
        errorStockCritico.innerHTML = "";
        errorCategoria.innerHTML = "";

        let formularioValido = true;

        // Código: requerido y mínimo 3 caracteres.
        if (codigo == "") {
            errorCodigo.innerHTML = "El código es obligatorio.";
            formularioValido = false;
        } else if (codigo.length < 3) {
            errorCodigo.innerHTML = "El código debe tener mínimo 3 caracteres.";
            formularioValido = false;
        }

        // Nombre: requerido y máximo 100 caracteres.
        if (nombre == "") {
            errorNombre.innerHTML = "El nombre es obligatorio.";
            formularioValido = false;
        } else if (nombre.length > 100) {
            errorNombre.innerHTML = "El nombre no puede superar los 100 caracteres.";
            formularioValido = false;
        }

        // Descripción: opcional y máximo 500 caracteres.
        if (descripcion.length > 500) {
            errorDescripcion.innerHTML = "La descripción no puede superar los 500 caracteres.";
            formularioValido = false;
        }

        // Precio: requerido y no puede ser negativo.
        if (precio == "") {
            errorPrecio.innerHTML = "El precio es obligatorio.";
            formularioValido = false;
        } else if (Number(precio) < 0) {
            errorPrecio.innerHTML = "El precio no puede ser negativo.";
            formularioValido = false;
        }

        // Stock: requerido, entero y mínimo 0.
        if (stock == "") {
            errorStock.innerHTML = "El stock es obligatorio.";
            formularioValido = false;
        } else if (Number(stock) < 0 || !Number.isInteger(Number(stock))) {
            errorStock.innerHTML = "El stock debe ser un número entero igual o mayor que 0.";
            formularioValido = false;
        }

        // Stock crítico: opcional, pero si se escribe debe ser entero >= 0.
        if (
            stockCritico != "" &&
            (Number(stockCritico) < 0 || !Number.isInteger(Number(stockCritico)))
        ) {
            errorStockCritico.innerHTML = "El stock crítico debe ser un entero igual o mayor que 0.";
            formularioValido = false;
        }

        // Categoría: requerida.
        if (categoria == "") {
            errorCategoria.innerHTML = "Debe seleccionar una categoría.";
            formularioValido = false;
        }

        // Si no existen errores, simulamos el guardado.
        if (formularioValido == true) {
            let mensaje = "Producto guardado correctamente.";

            if (
                stockCritico != "" &&
                Number(stock) <= Number(stockCritico)
            ) {
                mensaje += " El producto se encuentra en stock crítico.";
            }

            alert(mensaje);
            formProducto.reset();
        }
    });
}

// ---------------------------------------------------------
// ELIMINAR PRODUCTO
// ---------------------------------------------------------
function confirmarEliminarProducto() {
    let respuesta = confirm("¿Está seguro de eliminar este producto?");

    if (respuesta == true) {
        alert("Producto eliminado correctamente.");
    }
}

cargarProductoParaEditar();

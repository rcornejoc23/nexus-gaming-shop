(function () {
    "use strict";

    const lista = document.getElementById("productosDestacados");

    function formatoPrecio(precio) {
        return "$" + Number(precio).toLocaleString("es-CL");
    }

    function crearTarjeta(producto) {
        const tarjeta = document.createElement("div");
        tarjeta.className = "producto";

        const imagen = document.createElement("img");
        imagen.className = "imagen-producto";
        imagen.src = producto.imagen;
        imagen.alt = producto.nombre;

        const nombre = document.createElement("h3");
        nombre.textContent = producto.nombre;

        const precio = document.createElement("p");
        precio.textContent = formatoPrecio(producto.precio);

        const boton = document.createElement("button");
        boton.type = "button";
        boton.textContent = producto.stock > 0 ? "Agregar" : "Sin stock";
        boton.disabled = producto.stock <= 0;
        boton.addEventListener("click", function () {
            const productoActualizado = window.NexusCatalogo.obtenerProductoPorId(producto.id);
            if (!productoActualizado || productoActualizado.stock <= 0) {
                renderizarProductos();
                return;
            }

            const resultado = window.NexusCarrito.agregar(productoActualizado, 1);
            if (resultado.excedido) {
                alert("No hay más stock disponible para " + productoActualizado.nombre + ".");
            } else if (resultado.ok) {
                alert(productoActualizado.nombre + " fue añadido al carrito");
            }
        });

        tarjeta.append(imagen, nombre, precio, boton);
        return tarjeta;
    }

    function renderizarProductos() {
        if (!lista) {
            return;
        }

        lista.replaceChildren();
        window.NexusCatalogo.obtenerProductos()
            .slice(0, 4)
            .forEach(function (producto) {
                lista.appendChild(crearTarjeta(producto));
            });
    }

    renderizarProductos();

    window.addEventListener("storage", function (evento) {
        if (evento.key === "productosAdmin") {
            renderizarProductos();
        }
    });
})();

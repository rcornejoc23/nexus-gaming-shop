// OBTENER CARRITO GUARDADO

let carrito = JSON.parse(localStorage.getItem("carrito"));


// SI EL CARRITO NO EXISTE

if (carrito == null) {
    carrito = [];
}


// ELEMENTOS HTML

let listaCarrito = document.getElementById("listaCarrito");

let totalCarrito = document.getElementById("totalCarrito");

let carritoContador = document.getElementById("carritoContador");


// MOSTRAR CARRITO

function mostrarCarrito() {

    listaCarrito.innerHTML = "";

    let total = 0;


    if (carrito.length == 0) {

        listaCarrito.innerHTML = `
            <p class="carrito-vacio">
                Tu carrito está vacío.
            </p>
        `;

    }


    for (let i = 0; i < carrito.length; i++) {

        listaCarrito.innerHTML += `
            <div class="carrito-producto">

                <div>

                    <h3>
                        ${carrito[i].nombre}
                    </h3>

                    <p>
                        ${carrito[i].categoria}
                    </p>

                </div>


                <div>

                    <p class="carrito-precio">
                        $${carrito[i].precio.toLocaleString("es-CL")}
                    </p>

                    <button
                        class="btn-eliminar"
                        onclick="eliminarProducto(${i})"
                    >
                        Eliminar
                    </button>

                </div>

            </div>
        `;


        total = total + carrito[i].precio;

    }


    totalCarrito.innerHTML =
        "$" + total.toLocaleString("es-CL");


    carritoContador.innerHTML =
        carrito.length;

}


// ELIMINAR PRODUCTO

function eliminarProducto(posicion) {

    carrito.splice(posicion, 1);


    localStorage.setItem(
        "carrito",
        JSON.stringify(carrito)
    );


    mostrarCarrito();

}


// MOSTRAR AL CARGAR PÁGINA

mostrarCarrito();
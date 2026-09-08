/*
    ==============================================
    USUARIOS ADMINISTRATIVOS - NEXUS GAMING
    ==============================================

    Este archivo contiene:

    1. Arreglo de regiones y comunas.
    2. Carga de regiones en el <select>.
    3. Cambio automático de comunas.
    4. Validación del RUN chileno.
    5. Validación del formulario de usuario.
    6. Confirmación para eliminar usuarios.

*/


/*
    ==============================================
    1. ARREGLO DE REGIONES
    ==============================================

    Cada elemento tiene:

    - nombre de la región
    - arreglo de comunas

    Así relacionamos una región con sus comunas.
*/

let regiones = [

    {
        nombre: "Región Metropolitana",

        comunas: [
            "Santiago",
            "Puente Alto",
            "La Florida",
            "Maipú",
            "San Miguel",
            "Providencia"
        ]
    },

    {
        nombre: "Región de Valparaíso",

        comunas: [
            "Valparaíso",
            "Viña del Mar",
            "Quilpué",
            "Villa Alemana"
        ]
    },

    {
        nombre: "Región del Biobío",

        comunas: [
            "Concepción",
            "Talcahuano",
            "Chiguayante",
            "San Pedro de la Paz"
        ]
    }

];


/*
    Buscamos los elementos del HTML.

    Puede ocurrir que este JavaScript esté cargado
    desde usuarios.html, donde no existe el formulario.

    Por eso después comprobamos si existen.
*/

let regionAdmin =
    document.getElementById("regionAdmin");

let comunaAdmin =
    document.getElementById("comunaAdmin");

let formUsuarioAdmin =
    document.getElementById("formUsuarioAdmin");


/*
    ==============================================
    2. CARGAR REGIONES
    ==============================================

    Solo ejecutamos este código si encontramos
    el select de regiones.
*/

if (regionAdmin != null) {

    /*
        Recorremos el arreglo regiones usando for.

        Cada vuelta agrega una <option>
        dentro del select.
    */

    for (let i = 0; i < regiones.length; i++) {

        regionAdmin.innerHTML += `
            <option value="${i}">
                ${regiones[i].nombre}
            </option>
        `;

    }

}


/*
    ==============================================
    3. CAMBIO DE REGIÓN Y COMUNAS
    ==============================================

    Cuando el usuario cambia la región,
    necesitamos cambiar las comunas.
*/

if (regionAdmin != null) {

    regionAdmin.addEventListener(
        "change",
        function() {

            /*
                Primero limpiamos las comunas anteriores.
            */

            comunaAdmin.innerHTML = `
                <option value="">
                    Seleccione una comuna
                </option>
            `;


            /*
                Si todavía no seleccionó una región,
                terminamos aquí.
            */

            if (regionAdmin.value == "") {

                return;

            }


            /*
                El value de la región corresponde
                a la posición del arreglo.

                Ejemplo:

                0 = Región Metropolitana
                1 = Valparaíso
                2 = Biobío
            */

            let posicionRegion =
                parseInt(regionAdmin.value);


            /*
                Obtenemos las comunas correspondientes
                a la región seleccionada.
            */

            let comunas =
                regiones[posicionRegion].comunas;


            /*
                Recorremos las comunas y las
                agregamos al select.
            */

            for (let i = 0; i < comunas.length; i++) {

                comunaAdmin.innerHTML += `
                    <option value="${comunas[i]}">
                        ${comunas[i]}
                    </option>
                `;

            }

        }
    );

}


/*
    ==============================================
    4. VALIDACIÓN DEL RUN
    ==============================================

    El RUN debe llegar sin puntos ni guion.

    Ejemplo:
    19011022K
*/

function validarRun(run) {

    /*
        Convertimos todo a mayúsculas para que
        una k minúscula también pueda validarse.
    */

    run = run.toUpperCase();


    /*
        La pauta indica entre 7 y 9 caracteres.
    */

    if (run.length < 7 || run.length > 9) {

        return false;

    }


    /*
        Separamos el cuerpo del RUN
        y el dígito verificador.

        Ejemplo:

        19011022K

        cuerpo = 19011022
        digito = K
    */

    let cuerpo =
        run.substring(0, run.length - 1);

    let digitoVerificador =
        run.substring(run.length - 1);


    /*
        El cuerpo tiene que contener solo números.
    */

    if (isNaN(cuerpo)) {

        return false;

    }


    /*
        Variables necesarias para calcular
        el dígito verificador.
    */

    let suma = 0;

    let multiplicador = 2;


    /*
        Recorremos el RUN desde derecha a izquierda.
    */

    for (
        let i = cuerpo.length - 1;
        i >= 0;
        i--
    ) {

        suma =
            suma +
            parseInt(cuerpo[i]) * multiplicador;


        multiplicador++;


        /*
            Los multiplicadores van:

            2, 3, 4, 5, 6, 7

            y después vuelven a 2.
        */

        if (multiplicador == 8) {

            multiplicador = 2;

        }

    }


    /*
        Fórmula del dígito verificador.
    */

    let resto =
        suma % 11;

    let resultado =
        11 - resto;


    let digitoCalculado;


    /*
        Casos especiales:

        11 = 0
        10 = K
    */

    if (resultado == 11) {

        digitoCalculado = "0";

    } else if (resultado == 10) {

        digitoCalculado = "K";

    } else {

        digitoCalculado =
            resultado.toString();

    }


    /*
        Comparamos el dígito calculado
        con el que ingresó el usuario.
    */

    if (digitoCalculado == digitoVerificador) {

        return true;

    } else {

        return false;

    }

}


/*
    ==============================================
    5. VALIDACIÓN DEL FORMULARIO
    ==============================================
*/

if (formUsuarioAdmin != null) {

    formUsuarioAdmin.addEventListener(
        "submit",
        function(evento) {

            /*
                preventDefault evita que el formulario
                recargue la página automáticamente.
            */

            evento.preventDefault();


            /*
                OBTENER VALORES DEL FORMULARIO
            */

            let run =
                document.getElementById("runAdmin").value;

            let nombre =
                document.getElementById("nombreAdmin").value;

            let apellidos =
                document.getElementById("apellidosAdmin").value;

            let correo =
                document.getElementById("correoAdmin").value;

            let tipoUsuario =
                document.getElementById("tipoUsuario").value;

            let direccion =
                document.getElementById("direccionAdmin").value;


            /*
                OBTENER LOS ELEMENTOS DONDE
                MOSTRAREMOS LOS ERRORES.
            */

            let errorRun =
                document.getElementById("errorRunAdmin");

            let errorNombre =
                document.getElementById("errorNombreAdmin");

            let errorApellidos =
                document.getElementById("errorApellidosAdmin");

            let errorCorreo =
                document.getElementById("errorCorreoAdmin");

            let errorTipoUsuario =
                document.getElementById("errorTipoUsuario");

            let errorRegion =
                document.getElementById("errorRegionAdmin");

            let errorComuna =
                document.getElementById("errorComunaAdmin");

            let errorDireccion =
                document.getElementById("errorDireccionAdmin");


            /*
                Esta variable indica si podemos
                guardar el formulario.

                Partimos suponiendo que está correcto.
            */

            let formularioValido = true;


            /*
                LIMPIAR MENSAJES ANTERIORES.
            */

            errorRun.innerHTML = "";
            errorNombre.innerHTML = "";
            errorApellidos.innerHTML = "";
            errorCorreo.innerHTML = "";
            errorTipoUsuario.innerHTML = "";
            errorRegion.innerHTML = "";
            errorComuna.innerHTML = "";
            errorDireccion.innerHTML = "";


            /*
                ==================================
                VALIDAR RUN
                ==================================
            */

            if (run == "") {

                errorRun.innerHTML =
                    "El RUN es obligatorio.";

                formularioValido = false;

            } else if (validarRun(run) == false) {

                errorRun.innerHTML =
                    "El RUN ingresado no es válido.";

                formularioValido = false;

            }


            /*
                ==================================
                VALIDAR NOMBRE
                ==================================
            */

            if (nombre == "") {

                errorNombre.innerHTML =
                    "El nombre es obligatorio.";

                formularioValido = false;

            } else if (nombre.length > 50) {

                errorNombre.innerHTML =
                    "El nombre no puede superar los 50 caracteres.";

                formularioValido = false;

            }


            /*
                ==================================
                VALIDAR APELLIDOS
                ==================================
            */

            if (apellidos == "") {

                errorApellidos.innerHTML =
                    "Los apellidos son obligatorios.";

                formularioValido = false;

            } else if (apellidos.length > 100) {

                errorApellidos.innerHTML =
                    "Los apellidos no pueden superar los 100 caracteres.";

                formularioValido = false;

            }


            /*
                ==================================
                VALIDAR CORREO
                ==================================
            */

            if (correo == "") {

                errorCorreo.innerHTML =
                    "El correo es obligatorio.";

                formularioValido = false;

            } else if (correo.length > 100) {

                errorCorreo.innerHTML =
                    "El correo no puede superar los 100 caracteres.";

                formularioValido = false;

            } else if (
                !correo.endsWith("@duoc.cl") &&
                !correo.endsWith("@profesor.duoc.cl") &&
                !correo.endsWith("@gmail.com")
            ) {

                errorCorreo.innerHTML =
                    "El dominio del correo no está permitido.";

                formularioValido = false;

            }


            /*
                ==================================
                VALIDAR TIPO DE USUARIO
                ==================================
            */

            if (tipoUsuario == "") {

                errorTipoUsuario.innerHTML =
                    "Debe seleccionar un tipo de usuario.";

                formularioValido = false;

            }


            /*
                ==================================
                VALIDAR REGIÓN
                ==================================
            */

            if (regionAdmin.value == "") {

                errorRegion.innerHTML =
                    "Debe seleccionar una región.";

                formularioValido = false;

            }


            /*
                ==================================
                VALIDAR COMUNA
                ==================================
            */

            if (comunaAdmin.value == "") {

                errorComuna.innerHTML =
                    "Debe seleccionar una comuna.";

                formularioValido = false;

            }


            /*
                ==================================
                VALIDAR DIRECCIÓN
                ==================================
            */

            if (direccion == "") {

                errorDireccion.innerHTML =
                    "La dirección es obligatoria.";

                formularioValido = false;

            } else if (direccion.length > 300) {

                errorDireccion.innerHTML =
                    "La dirección no puede superar los 300 caracteres.";

                formularioValido = false;

            }


            /*
                ==================================
                FORMULARIO CORRECTO
                ==================================

                Como esta primera evaluación no usa
                base de datos todavía, simulamos
                el guardado mostrando un mensaje.
            */

            if (formularioValido == true) {

                alert(
                    "Usuario guardado correctamente."
                );


                /*
                    Limpiamos todos los campos.
                */

                formUsuarioAdmin.reset();


                /*
                    También restauramos el select
                    de comunas.
                */

                comunaAdmin.innerHTML = `
                    <option value="">
                        Seleccione una comuna
                    </option>
                `;

            }

        }
    );

}


/*
    ==============================================
    6. ELIMINAR USUARIO
    ==============================================

    Por ahora no existe base de datos.

    Solamente mostramos una confirmación para
    representar la acción del mantenedor.
*/

function confirmarEliminarUsuario() {

    let respuesta =
        confirm(
            "¿Está seguro de eliminar este usuario?"
        );


    if (respuesta == true) {

        alert(
            "Usuario eliminado correctamente."
        );

    }

}
/*
    ==============================================
    7. MODO EDICIÓN DE USUARIO
    ==============================================

    Los botones "Editar" envían el RUN por la URL.
    Ejemplo:
    usuarios-form.html?run=190110222

    Como no existe base de datos en esta entrega,
    usamos usuarios de ejemplo para rellenar el formulario.
*/

let usuariosDemo = [
    {
        run: "190110222",
        nombre: "Usuario",
        apellidos: "Administrador",
        correo: "admin@duoc.cl",
        fechaNacimiento: "2000-05-10",
        tipo: "Administrador",
        region: 0,
        comuna: "Santiago",
        direccion: "Av. Principal 123"
    },
    {
        run: "201234565",
        nombre: "Cliente",
        apellidos: "Ejemplo",
        correo: "cliente@gmail.com",
        fechaNacimiento: "2001-08-15",
        tipo: "Cliente",
        region: 0,
        comuna: "Puente Alto",
        direccion: "Calle Ejemplo 456"
    },
    {
        run: "183456784",
        nombre: "Vendedor",
        apellidos: "Ejemplo",
        correo: "vendedor@gmail.com",
        fechaNacimiento: "1999-03-20",
        tipo: "Vendedor",
        region: 1,
        comuna: "Valparaíso",
        direccion: "Av. Puerto 789"
    }
];

function cargarUsuarioParaEditar() {
    if (formUsuarioAdmin == null) {
        return;
    }

    let parametros = new URLSearchParams(window.location.search);
    let runEditar = parametros.get("run");

    if (runEditar == null) {
        return;
    }

    for (let i = 0; i < usuariosDemo.length; i++) {
        if (usuariosDemo[i].run == runEditar) {
            let usuario = usuariosDemo[i];

            document.getElementById("runAdmin").value = usuario.run;
            document.getElementById("nombreAdmin").value = usuario.nombre;
            document.getElementById("apellidosAdmin").value = usuario.apellidos;
            document.getElementById("correoAdmin").value = usuario.correo;
            document.getElementById("fechaNacimientoAdmin").value = usuario.fechaNacimiento;
            document.getElementById("tipoUsuario").value = usuario.tipo;
            document.getElementById("direccionAdmin").value = usuario.direccion;

            regionAdmin.value = usuario.region;
            regionAdmin.dispatchEvent(new Event("change"));
            comunaAdmin.value = usuario.comuna;

            let titulo = document.querySelector(".admin-header h1");
            let boton = formUsuarioAdmin.querySelector('button[type="submit"]');

            if (titulo != null) {
                titulo.innerHTML = "Editar usuario";
            }

            if (boton != null) {
                boton.innerHTML = "Guardar cambios";
            }

            break;
        }
    }
}

cargarUsuarioParaEditar();

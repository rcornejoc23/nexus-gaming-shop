let formRegistro =
    document.getElementById("formRegistro");


let region =
    document.getElementById("region");

let comuna =
    document.getElementById("comuna");


// COMUNAS

let comunasMetropolitana = [
    "Puente Alto",
    "Santiago",
    "La Florida",
    "San Miguel",
    "Providencia",
    "Maipú",
    "Las Condes",
    "Ñuñoa",
    "La Reina",
    "Vitacura",
    "Lo Barnechea",
    "Peñalolén",
    "Macul",
    "San Joaquín",
    "La Granja",
    "La Cisterna",
    "El Bosque",
    "Pedro Aguirre Cerda",
    "San Ramón",
    "Cerrillos",
    "Lo Espejo",
    "Quilicura",
    "Pudahuel",
    "Independencia",
    "Recoleta",
    "Renca",
    "Cerro Navia",
    "Conchalí",
    "Huechuraba",
    "Lo Prado",
    "El Monte",
    "Talagante",
    "San Bernardo",

];


// CAMBIO DE REGIÓN

region.addEventListener("change", function() {

    comuna.innerHTML =
        '<option value="">Seleccione una comuna</option>';


    if (region.value == "metropolitana") {

        for (
            let i = 0;
            i < comunasMetropolitana.length;
            i++
        ) {

            comuna.innerHTML += `
                <option value="${comunasMetropolitana[i]}">
                    ${comunasMetropolitana[i]}
                </option>
            `;
        }

    }

});


// VALIDAR RUN

function validarRun(run) {

    run = run.toUpperCase();

    if (run.length < 7 || run.length > 9) {
        return false;
    }


    let cuerpo =
        run.substring(0, run.length - 1);

    let digitoVerificador =
        run.substring(run.length - 1);


    if (isNaN(cuerpo)) {
        return false;
    }


    let suma = 0;
    let multiplicador = 2;


    for (
        let i = cuerpo.length - 1;
        i >= 0;
        i--
    ) {

        suma =
            suma +
            parseInt(cuerpo[i]) * multiplicador;


        multiplicador++;


        if (multiplicador == 8) {
            multiplicador = 2;
        }

    }


    let resto = suma % 11;

    let resultado = 11 - resto;

    let digitoCalculado;


    if (resultado == 11) {

        digitoCalculado = "0";

    } else if (resultado == 10) {

        digitoCalculado = "K";

    } else {

        digitoCalculado =
            resultado.toString();
    }


    if (digitoCalculado == digitoVerificador) {

        return true;

    } else {

        return false;
    }

}


// SUBMIT

formRegistro.addEventListener(
    "submit",
    function(evento) {

        evento.preventDefault();


        let run =
            document.getElementById("run").value;

        let nombre =
            document.getElementById("nombre").value;

        let apellidos =
            document.getElementById("apellidos").value;

        let correo =
            document.getElementById("correo").value;

        let direccion =
            document.getElementById("direccion").value;


        let errorRun =
            document.getElementById("errorRun");

        let errorNombre =
            document.getElementById("errorNombre");

        let errorApellidos =
            document.getElementById("errorApellidos");

        let errorCorreo =
            document.getElementById("errorCorreo");

        let errorDireccion =
            document.getElementById("errorDireccion");


        let formularioValido = true;


        // LIMPIAR ERRORES

        errorRun.innerHTML = "";
        errorNombre.innerHTML = "";
        errorApellidos.innerHTML = "";
        errorCorreo.innerHTML = "";
        errorDireccion.innerHTML = "";


        // RUN

        if (run == "") {

            errorRun.innerHTML =
                "El RUN es obligatorio.";

            formularioValido = false;

        } else if (validarRun(run) == false) {

            errorRun.innerHTML =
                "El RUN ingresado no es válido.";

            formularioValido = false;
        }


        // NOMBRE

        if (nombre == "") {

            errorNombre.innerHTML =
                "El nombre es obligatorio.";

            formularioValido = false;

        } else if (nombre.length > 50) {

            errorNombre.innerHTML =
                "El nombre no puede superar los 50 caracteres.";

            formularioValido = false;
        }


        // APELLIDOS

        if (apellidos == "") {

            errorApellidos.innerHTML =
                "Los apellidos son obligatorios.";

            formularioValido = false;

        } else if (apellidos.length > 100) {

            errorApellidos.innerHTML =
                "Los apellidos no pueden superar los 100 caracteres.";

            formularioValido = false;
        }


        // CORREO

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


        // DIRECCIÓN

        if (direccion == "") {

            errorDireccion.innerHTML =
                "La dirección es obligatoria.";

            formularioValido = false;

        } else if (direccion.length > 300) {

            errorDireccion.innerHTML =
                "La dirección no puede superar los 300 caracteres.";

            formularioValido = false;
        }


        // REGIÓN

        if (region.value == "") {

            alert("Debe seleccionar una región.");

            formularioValido = false;
        }


        // COMUNA

        if (comuna.value == "") {

            alert("Debe seleccionar una comuna.");

            formularioValido = false;
        }


        // RESULTADO

        if (formularioValido == true) {

            alert(
                "Usuario registrado correctamente."
            );

            formRegistro.reset();

            comuna.innerHTML =
                '<option value="">Seleccione una comuna</option>';
        }

    }
);
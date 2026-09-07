let formContacto = document.getElementById("formContacto");

formContacto.addEventListener("submit", function(evento) {

    evento.preventDefault();


    let nombre =
        document.getElementById("nombreContacto").value;

    let correo =
        document.getElementById("correoContacto").value;

    let comentario =
        document.getElementById("comentario").value;


    let errorNombre =
        document.getElementById("errorNombreContacto");

    let errorCorreo =
        document.getElementById("errorCorreoContacto");

    let errorComentario =
        document.getElementById("errorComentario");


    let formularioValido = true;


    // LIMPIAR ERRORES

    errorNombre.innerHTML = "";
    errorCorreo.innerHTML = "";
    errorComentario.innerHTML = "";


    // NOMBRE

    if (nombre == "") {

        errorNombre.innerHTML =
            "El nombre es obligatorio.";

        formularioValido = false;

    } else if (nombre.length > 100) {

        errorNombre.innerHTML =
            "El nombre no puede superar los 100 caracteres.";

        formularioValido = false;
    }


    // CORREO

    if (correo != "") {

        if (correo.length > 100) {

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

    }


    // COMENTARIO

    if (comentario == "") {

        errorComentario.innerHTML =
            "El comentario es obligatorio.";

        formularioValido = false;

    } else if (comentario.length > 500) {

        errorComentario.innerHTML =
            "El comentario no puede superar los 500 caracteres.";

        formularioValido = false;
    }


    // RESULTADO

    if (formularioValido == true) {

        alert("Mensaje enviado correctamente.");

        formContacto.reset();
    }

});
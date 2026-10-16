let formContacto = document.getElementById("formContacto");

formContacto.addEventListener("submit", function(evento) {

    evento.preventDefault();


    let nombre =
        document.getElementById("nombreContacto").value.trim();

    let correo =
        document.getElementById("correoContacto").value.trim();

    let comentario =
        document.getElementById("comentario").value.trim();


    let errorNombre =
        document.getElementById("errorNombreContacto");

    let errorCorreo =
        document.getElementById("errorCorreoContacto");

    let errorComentario =
        document.getElementById("errorComentario");


    let formularioValido = true;


    // LIMPIAR ERRORES

    errorNombre.textContent = "";
    errorCorreo.textContent = "";
    errorComentario.textContent = "";


    // NOMBRE

    if (nombre == "") {

        errorNombre.textContent =
            "El nombre es obligatorio.";

        formularioValido = false;

    } else if (nombre.length > 100) {

            errorNombre.textContent =
            "El nombre no puede superar los 100 caracteres.";

        formularioValido = false;
    }


    // CORREO

    if (correo != "") {

        if (correo.length > 100) {

            errorCorreo.textContent =
                "El correo no puede superar los 100 caracteres.";

            formularioValido = false;

        } else if (
            !correo.endsWith("@duoc.cl") &&
            !correo.endsWith("@profesor.duoc.cl") &&
            !correo.endsWith("@gmail.com")
        ) {

            errorCorreo.textContent =
                "El dominio del correo no está permitido.";

            formularioValido = false;
        }

    }


    // COMENTARIO

    if (comentario == "") {

        errorComentario.textContent =
            "El comentario es obligatorio.";

        formularioValido = false;

    } else if (comentario.length > 500) {

        errorComentario.textContent =
            "El comentario no puede superar los 500 caracteres.";

        formularioValido = false;
    }


    // RESULTADO

    if (formularioValido == true) {

        alert("Mensaje enviado correctamente.");

        formContacto.reset();
    }

});

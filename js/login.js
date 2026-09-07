let formLogin = document.getElementById("formLogin");

formLogin.addEventListener("submit", function(evento) {

    evento.preventDefault();

    let correo = document.getElementById("correoLogin").value;
    let password = document.getElementById("password").value;

    let errorCorreo = document.getElementById("errorCorreoLogin");
    let errorPassword = document.getElementById("errorPassword");

    let formularioValido = true;


    // LIMPIAR MENSAJES

    errorCorreo.innerHTML = "";
    errorPassword.innerHTML = "";


    // VALIDAR CORREO

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


    // VALIDAR CONTRASEÑA

    if (password == "") {

        errorPassword.innerHTML =
            "La contraseña es obligatoria.";

        formularioValido = false;

    } else if (
        password.length < 4 ||
        password.length > 10
    ) {

        errorPassword.innerHTML =
            "La contraseña debe tener entre 4 y 10 caracteres.";

        formularioValido = false;
    }


    // RESULTADO

    if (formularioValido == true) {

        alert("Inicio de sesión correcto.");

        formLogin.reset();
    }

});
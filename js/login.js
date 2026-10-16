(function () {
    "use strict";

    const formulario = document.getElementById("formLogin");
    const errorCorreo = document.getElementById("errorCorreoLogin");
    const errorPassword = document.getElementById("errorPassword");

    formulario.addEventListener("submit", function (evento) {
        evento.preventDefault();
        errorCorreo.textContent = "";
        errorPassword.textContent = "";

        const correo = document.getElementById("correoLogin").value.trim();
        const password = document.getElementById("password").value;
        let valido = true;

        if (!correo) {
            errorCorreo.textContent = "El correo es obligatorio.";
            valido = false;
        } else if (!/^[^\s@]+@(?:duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i.test(correo)) {
            errorCorreo.textContent = "Utiliza un correo @duoc.cl, @profesor.duoc.cl o @gmail.com.";
            valido = false;
        }

        if (!password) {
            errorPassword.textContent = "La contraseña es obligatoria.";
            valido = false;
        } else if (password.length < 4 || password.length > 20) {
            errorPassword.textContent = "La contraseña debe tener entre 4 y 20 caracteres.";
            valido = false;
        }

        if (!valido) {
            return;
        }

        const usuario = window.NexusUsuarios.iniciarSesion(correo, password);
        if (!usuario) {
            errorPassword.textContent = "Correo o contraseña incorrectos.";
            return;
        }

        alert("Inicio de sesión correcto.");
        window.location.href = usuario.tipo === "Administrador" ? "admin/index.html" : "index.html";
    });
})();

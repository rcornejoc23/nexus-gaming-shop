(function () {
    "use strict";

    const usuario = window.NexusUsuarios && window.NexusUsuarios.obtenerSesion();
    const rutaLogin = "../login.html";

    if (!usuario || usuario.tipo !== "Administrador") {
        window.location.replace(rutaLogin);
        return;
    }

    document.querySelectorAll("[data-usuario-sesion]").forEach(function (elemento) {
        elemento.textContent = usuario.nombre + " " + usuario.apellidos;
    });

    const botonCerrarSesion = document.getElementById("btnCerrarSesion");
    if (botonCerrarSesion) {
        botonCerrarSesion.addEventListener("click", function () {
            window.NexusUsuarios.cerrarSesion();
            window.location.replace(rutaLogin);
        });
    }
})();

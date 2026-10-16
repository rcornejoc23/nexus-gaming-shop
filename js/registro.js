(function () {
    "use strict";

    const formulario = document.getElementById("formRegistro");
    const region = document.getElementById("region");
    const comuna = document.getElementById("comuna");
    const regiones = window.NexusUsuarios.regiones;

    function mostrarError(id, mensaje) {
        document.getElementById(id).textContent = mensaje;
    }

    region.replaceChildren();
    const regionInicial = document.createElement("option");
    regionInicial.value = "";
    regionInicial.textContent = "Seleccione una región";
    region.appendChild(regionInicial);

    regiones.forEach(function (elemento, indice) {
        const opcion = document.createElement("option");
        opcion.value = String(indice);
        opcion.textContent = elemento.nombre;
        region.appendChild(opcion);
    });

    region.addEventListener("change", function () {
        comuna.replaceChildren();
        const inicial = document.createElement("option");
        inicial.value = "";
        inicial.textContent = "Seleccione una comuna";
        comuna.appendChild(inicial);

        const seleccion = regiones[Number(region.value)];
        if (!seleccion) {
            return;
        }

        seleccion.comunas.forEach(function (nombre) {
            const opcion = document.createElement("option");
            opcion.value = nombre;
            opcion.textContent = nombre;
            comuna.appendChild(opcion);
        });
    });

    function validarRun(run) {
        const valor = run.trim().toUpperCase();
        if (!/^\d{7,8}[0-9K]$/.test(valor)) {
            return false;
        }

        const cuerpo = valor.slice(0, -1);
        const verificador = valor.slice(-1);
        let suma = 0;
        let multiplicador = 2;

        for (let posicion = cuerpo.length - 1; posicion >= 0; posicion -= 1) {
            suma += Number(cuerpo[posicion]) * multiplicador;
            multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
        }

        const resultado = 11 - (suma % 11);
        const calculado = resultado === 11 ? "0" : resultado === 10 ? "K" : String(resultado);
        return calculado === verificador;
    }

    formulario.addEventListener("submit", function (evento) {
        evento.preventDefault();
        ["errorRun", "errorNombre", "errorApellidos", "errorCorreo", "errorPasswordRegistro", "errorDireccion"].forEach(function (id) {
            const elemento = document.getElementById(id);
            if (elemento) {
                elemento.textContent = "";
            }
        });

        const run = document.getElementById("run").value.trim().toUpperCase();
        const nombre = document.getElementById("nombre").value.trim();
        const apellidos = document.getElementById("apellidos").value.trim();
        const correo = document.getElementById("correo").value.trim().toLowerCase();
        const password = document.getElementById("passwordRegistro").value;
        const direccion = document.getElementById("direccion").value.trim();
        let valido = true;

        if (!validarRun(run)) {
            mostrarError("errorRun", "El RUN ingresado no es válido.");
            valido = false;
        }
        if (!nombre || nombre.length > 50) {
            mostrarError("errorNombre", "Ingresa un nombre de hasta 50 caracteres.");
            valido = false;
        }
        if (!apellidos || apellidos.length > 100) {
            mostrarError("errorApellidos", "Ingresa apellidos de hasta 100 caracteres.");
            valido = false;
        }
        if (!/^[^\s@]+@(?:duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i.test(correo)) {
            mostrarError("errorCorreo", "Utiliza un correo @duoc.cl, @profesor.duoc.cl o @gmail.com.");
            valido = false;
        }
        if (password.length < 4 || password.length > 20) {
            mostrarError("errorPasswordRegistro", "La contraseña debe tener entre 4 y 20 caracteres.");
            valido = false;
        }
        if (!region.value) {
            alert("Debe seleccionar una región.");
            valido = false;
        }
        if (!comuna.value) {
            alert("Debe seleccionar una comuna.");
            valido = false;
        }
        if (!direccion || direccion.length > 300) {
            mostrarError("errorDireccion", "Ingresa una dirección de hasta 300 caracteres.");
            valido = false;
        }

        if (!valido) {
            return;
        }

        const registro = window.NexusUsuarios.registrar({
            run: run,
            nombre: nombre,
            apellidos: apellidos,
            correo: correo,
            password: password,
            tipo: "Cliente",
            region: regiones[Number(region.value)].nombre,
            comuna: comuna.value,
            direccion: direccion,
            fechaNacimiento: document.getElementById("fechaNacimiento").value
        });

        if (!registro.ok) {
            mostrarError("errorCorreo", registro.motivo);
            return;
        }

        alert("Usuario registrado correctamente.");
        window.location.href = "login.html";
    });
})();

(function () {
    "use strict";

    let usuarios = window.NexusUsuarios.obtenerUsuarios();
    const regiones = window.NexusUsuarios.regiones;
    const regionSelect = document.getElementById("regionAdmin");
    const comunaSelect = document.getElementById("comunaAdmin");
    const formulario = document.getElementById("formUsuarioAdmin");

    function elemento(id) {
        return document.getElementById(id);
    }

    function error(id, mensaje) {
        const campo = elemento(id);
        if (campo) {
            campo.textContent = mensaje;
        }
    }

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

    function cargarRegiones() {
        if (!regionSelect) {
            return;
        }

        regiones.forEach(function (region, indice) {
            const opcion = document.createElement("option");
            opcion.value = String(indice);
            opcion.textContent = region.nombre;
            regionSelect.appendChild(opcion);
        });

        regionSelect.addEventListener("change", cargarComunas);
    }

    function cargarComunas() {
        if (!comunaSelect || !regionSelect) {
            return;
        }

        comunaSelect.replaceChildren();
        const inicial = document.createElement("option");
        inicial.value = "";
        inicial.textContent = "Seleccione una comuna";
        comunaSelect.appendChild(inicial);

        const region = regiones[Number(regionSelect.value)];
        if (!region) {
            return;
        }

        region.comunas.forEach(function (nombre) {
            const opcion = document.createElement("option");
            opcion.value = nombre;
            opcion.textContent = nombre;
            comunaSelect.appendChild(opcion);
        });
    }

    function cargarUsuarioParaEditar() {
        if (!formulario) {
            return;
        }

        const runEditar = new URLSearchParams(window.location.search).get("run");
        if (!runEditar) {
            return;
        }

        const usuario = usuarios.find(function (elementoUsuario) {
            return elementoUsuario.run === runEditar;
        });
        if (!usuario) {
            return;
        }

        elemento("runAdmin").value = usuario.run;
        elemento("runAdmin").readOnly = true;
        elemento("nombreAdmin").value = usuario.nombre;
        elemento("apellidosAdmin").value = usuario.apellidos;
        elemento("correoAdmin").value = usuario.correo;
        elemento("fechaNacimientoAdmin").value = usuario.fechaNacimiento || "";
        elemento("tipoUsuario").value = usuario.tipo;
        elemento("direccionAdmin").value = usuario.direccion || "";

        const indiceRegion = regiones.findIndex(function (region) {
            return region.nombre === usuario.region;
        });
        if (indiceRegion >= 0) {
            regionSelect.value = String(indiceRegion);
            cargarComunas();
            comunaSelect.value = usuario.comuna || "";
        }

        document.querySelector(".admin-header h1").textContent = "Editar usuario";
        formulario.querySelector("button[type='submit']").textContent = "Guardar cambios";
    }

    function limpiarErrores() {
        ["errorRunAdmin", "errorNombreAdmin", "errorApellidosAdmin", "errorCorreoAdmin", "errorTipoUsuario", "errorRegionAdmin", "errorComunaAdmin", "errorDireccionAdmin"].forEach(function (id) {
            error(id, "");
        });
    }

    function guardarUsuario(evento) {
        evento.preventDefault();
        limpiarErrores();

        const run = elemento("runAdmin").value.trim().toUpperCase();
        const nombre = elemento("nombreAdmin").value.trim();
        const apellidos = elemento("apellidosAdmin").value.trim();
        const correo = elemento("correoAdmin").value.trim().toLowerCase();
        const tipo = elemento("tipoUsuario").value;
        const region = regionSelect && regionSelect.value !== "" ? regiones[Number(regionSelect.value)] : null;
        const comuna = comunaSelect ? comunaSelect.value : "";
        let valido = true;

        if (!validarRun(run)) {
            error("errorRunAdmin", "El RUN ingresado no es válido.");
            valido = false;
        }
        if (!nombre || nombre.length > 50) {
            error("errorNombreAdmin", "Ingresa un nombre de hasta 50 caracteres.");
            valido = false;
        }
        if (!apellidos || apellidos.length > 100) {
            error("errorApellidosAdmin", "Ingresa apellidos de hasta 100 caracteres.");
            valido = false;
        }
        if (!/^[^\s@]+@(?:duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i.test(correo)) {
            error("errorCorreoAdmin", "Ingresa un correo permitido.");
            valido = false;
        }
        if (!tipo) {
            error("errorTipoUsuario", "Selecciona un tipo de usuario.");
            valido = false;
        }
        if (!region) {
            error("errorRegionAdmin", "Selecciona una región.");
            valido = false;
        }
        if (!comuna) {
            error("errorComunaAdmin", "Selecciona una comuna.");
            valido = false;
        }
        if (!elemento("direccionAdmin").value.trim()) {
            error("errorDireccionAdmin", "La dirección es obligatoria.");
            valido = false;
        }

        if (!valido) {
            return;
        }

        const anterior = usuarios.find(function (usuario) { return usuario.run === run; });
        const usuario = Object.assign({}, anterior || {}, {
            run: run,
            nombre: nombre,
            apellidos: apellidos,
            correo: correo,
            tipo: tipo,
            region: region.nombre,
            comuna: comuna,
            direccion: elemento("direccionAdmin").value.trim(),
            fechaNacimiento: elemento("fechaNacimientoAdmin").value
        });

        if (anterior) {
            usuarios = usuarios.map(function (elementoUsuario) {
                return elementoUsuario.run === run ? usuario : elementoUsuario;
            });
        } else {
            usuarios.push(usuario);
        }

        window.NexusUsuarios.guardarUsuarios(usuarios);
        alert("Usuario guardado correctamente.");
        window.location.href = "usuarios.html";
    }

    function cargarTablaUsuarios() {
        const tabla = elemento("tablaUsuarios");
        if (!tabla) {
            return;
        }

        tabla.replaceChildren();
        usuarios.forEach(function (usuario) {
            const fila = document.createElement("tr");
            [usuario.run, usuario.nombre + " " + usuario.apellidos, usuario.correo, usuario.tipo, usuario.region].forEach(function (valor) {
                const celda = document.createElement("td");
                celda.textContent = valor;
                fila.appendChild(celda);
            });

            const acciones = document.createElement("td");
            const editar = document.createElement("a");
            editar.className = "btn-editar";
            editar.href = "usuarios-form.html?run=" + encodeURIComponent(usuario.run);
            editar.textContent = "Editar";

            const eliminar = document.createElement("button");
            eliminar.type = "button";
            eliminar.className = "btn-eliminar-admin";
            eliminar.textContent = "Eliminar";
            eliminar.addEventListener("click", function () {
                if (!confirm("¿Está seguro de eliminar este usuario?")) {
                    return;
                }

                usuarios = usuarios.filter(function (elementoUsuario) {
                    return elementoUsuario.run !== usuario.run;
                });
                window.NexusUsuarios.guardarUsuarios(usuarios);
                cargarTablaUsuarios();
            });

            acciones.append(editar, eliminar);
            fila.appendChild(acciones);
            tabla.appendChild(fila);
        });
    }

    cargarRegiones();
    if (formulario) {
        formulario.addEventListener("submit", guardarUsuario);
    }
    cargarUsuarioParaEditar();
    cargarTablaUsuarios();
})();

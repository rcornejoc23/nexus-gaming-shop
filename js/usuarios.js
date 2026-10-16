(function () {
    "use strict";

    const STORAGE_KEY = "usuariosAdmin";
    const SESSION_KEY = "usuarioActual";

    const regiones = [
        {
            nombre: "Región Metropolitana",
            comunas: ["Santiago", "Puente Alto", "La Florida", "Maipú", "San Miguel", "Providencia", "Las Condes", "Ñuñoa"]
        },
        {
            nombre: "Región de Valparaíso",
            comunas: ["Valparaíso", "Viña del Mar", "Quilpué", "Villa Alemana"]
        },
        {
            nombre: "Región del Biobío",
            comunas: ["Concepción", "Talcahuano", "Chiguayante", "San Pedro de la Paz"]
        }
    ];

    const usuariosBase = [
        {
            run: "190110222",
            nombre: "Usuario",
            apellidos: "Administrador",
            correo: "admin@duoc.cl",
            password: "Admin123",
            tipo: "Administrador",
            region: "Región Metropolitana",
            comuna: "Santiago",
            direccion: "Casa matriz",
            fechaNacimiento: ""
        },
        {
            run: "201234565",
            nombre: "Cliente",
            apellidos: "Ejemplo",
            correo: "cliente@gmail.com",
            password: "Cliente123",
            tipo: "Cliente",
            region: "Región Metropolitana",
            comuna: "Maipú",
            direccion: "Dirección de ejemplo",
            fechaNacimiento: ""
        }
    ];

    function normalizarUsuario(usuario) {
        const nombreCompleto = String(usuario.nombre || "Usuario").trim();
        const partes = nombreCompleto.split(/\s+/);
        const nombre = usuario.apellidos ? nombreCompleto : (partes.shift() || "Usuario");
        const apellidos = usuario.apellidos || partes.join(" ");
        let region = usuario.region || "";
        if (region === "Metropolitana") {
            region = "Región Metropolitana";
        }
        if (region === "Valparaíso") {
            region = "Región de Valparaíso";
        }

        return Object.assign({
            run: "",
            nombre: nombre,
            apellidos: apellidos,
            correo: "",
            password: "",
            tipo: "Cliente",
            region: "",
            comuna: "",
            direccion: "",
            fechaNacimiento: ""
        }, usuario, {
            nombre: nombre,
            apellidos: apellidos,
            region: region
        });
    }

    function obtenerUsuarios() {
        let usuarios;
        try {
            usuarios = JSON.parse(localStorage.getItem(STORAGE_KEY));
        } catch (error) {
            usuarios = null;
        }

        if (!Array.isArray(usuarios) || usuarios.length === 0) {
            usuarios = usuariosBase;
        }

        usuarios = usuarios.map(normalizarUsuario);

        const admin = usuarios.find(function (usuario) {
            return usuario.correo.toLowerCase() === "admin@duoc.cl";
        });
        if (admin && !admin.password) {
            admin.password = "Admin123";
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(usuarios));
        return usuarios;
    }

    function guardarUsuarios(usuarios) {
        const normalizados = usuarios.map(normalizarUsuario);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizados));
        return normalizados;
    }

    function obtenerSesion() {
        try {
            return JSON.parse(sessionStorage.getItem(SESSION_KEY));
        } catch (error) {
            return null;
        }
    }

    window.NexusUsuarios = {
        regiones: regiones,
        obtenerUsuarios: obtenerUsuarios,
        guardarUsuarios: guardarUsuarios,
        obtenerSesion: obtenerSesion,
        iniciarSesion: function (correo, password) {
            const usuario = obtenerUsuarios().find(function (elemento) {
                return elemento.correo.toLowerCase() === correo.trim().toLowerCase() && elemento.password === password;
            });

            if (usuario) {
                const sesion = Object.assign({}, usuario);
                delete sesion.password;
                sessionStorage.setItem(SESSION_KEY, JSON.stringify(sesion));
                return sesion;
            }

            return null;
        },
        cerrarSesion: function () {
            sessionStorage.removeItem(SESSION_KEY);
        },
        registrar: function (usuario) {
            const usuarios = obtenerUsuarios();
            const existe = usuarios.some(function (elemento) {
                return elemento.run === usuario.run || elemento.correo.toLowerCase() === usuario.correo.toLowerCase();
            });

            if (existe) {
                return { ok: false, motivo: "El RUN o correo ya está registrado." };
            }

            usuarios.push(normalizarUsuario(usuario));
            guardarUsuarios(usuarios);
            return { ok: true };
        }
    };
})();

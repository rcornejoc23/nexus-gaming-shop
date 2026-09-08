// Registro público: regiones, comunas y validaciones.
let formRegistro = document.getElementById("formRegistro");
let region = document.getElementById("region");
let comuna = document.getElementById("comuna");

let regiones = [
  {
    "nombre": "Arica y Parinacota",
    "comunas": [
      "Arica",
      "Camarones",
      "Putre"
    ]
  },
  {
    "nombre": "Tarapacá",
    "comunas": [
      "Iquique",
      "Alto Hospicio",
      "Pozo Almonte"
    ]
  },
  {
    "nombre": "Antofagasta",
    "comunas": [
      "Antofagasta",
      "Calama",
      "Tocopilla"
    ]
  },
  {
    "nombre": "Atacama",
    "comunas": [
      "Copiapó",
      "Caldera",
      "Vallenar"
    ]
  },
  {
    "nombre": "Coquimbo",
    "comunas": [
      "La Serena",
      "Coquimbo",
      "Ovalle"
    ]
  },
  {
    "nombre": "Valparaíso",
    "comunas": [
      "Valparaíso",
      "Viña del Mar",
      "Quilpué",
      "Villa Alemana"
    ]
  },
  {
    "nombre": "Metropolitana",
    "comunas": [
      "Santiago",
      "Puente Alto",
      "La Florida",
      "Maipú",
      "San Miguel",
      "Providencia",
      "Las Condes",
      "Ñuñoa"
    ]
  },
  {
    "nombre": "O'Higgins",
    "comunas": [
      "Rancagua",
      "Machalí",
      "San Fernando"
    ]
  },
  {
    "nombre": "Maule",
    "comunas": [
      "Talca",
      "Curicó",
      "Linares"
    ]
  },
  {
    "nombre": "Ñuble",
    "comunas": [
      "Chillán",
      "San Carlos",
      "Bulnes"
    ]
  },
  {
    "nombre": "Biobío",
    "comunas": [
      "Concepción",
      "Talcahuano",
      "Chiguayante",
      "San Pedro de la Paz"
    ]
  },
  {
    "nombre": "La Araucanía",
    "comunas": [
      "Temuco",
      "Padre Las Casas",
      "Villarrica"
    ]
  },
  {
    "nombre": "Los Ríos",
    "comunas": [
      "Valdivia",
      "La Unión",
      "Panguipulli"
    ]
  },
  {
    "nombre": "Los Lagos",
    "comunas": [
      "Puerto Montt",
      "Osorno",
      "Castro"
    ]
  },
  {
    "nombre": "Aysén",
    "comunas": [
      "Coyhaique",
      "Aysén",
      "Chile Chico"
    ]
  },
  {
    "nombre": "Magallanes",
    "comunas": [
      "Punta Arenas",
      "Puerto Natales",
      "Porvenir"
    ]
  }
];

// Cargar regiones desde el arreglo.
for (let i = 0; i < regiones.length; i++) {
  region.innerHTML += `<option value="${i}">Región de ${regiones[i].nombre}</option>`;
}

// Al cambiar región, se cargan solamente sus comunas.
region.addEventListener("change", function() {
  comuna.innerHTML = '<option value="">Seleccione una comuna</option>';
  if (region.value == "") return;
  let posicion = parseInt(region.value);
  for (let i = 0; i < regiones[posicion].comunas.length; i++) {
    comuna.innerHTML += `<option value="${regiones[posicion].comunas[i]}">${regiones[posicion].comunas[i]}</option>`;
  }
});

function validarRun(run) {
  run = run.trim().toUpperCase();
  if (run.length < 7 || run.length > 9) return false;
  let cuerpo = run.substring(0, run.length - 1);
  let dv = run.substring(run.length - 1);
  if (isNaN(cuerpo)) return false;
  let suma = 0;
  let multiplicador = 2;
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo[i]) * multiplicador;
    multiplicador++;
    if (multiplicador == 8) multiplicador = 2;
  }
  let resultado = 11 - (suma % 11);
  let calculado;
  if (resultado == 11) calculado = "0";
  else if (resultado == 10) calculado = "K";
  else calculado = resultado.toString();
  return calculado == dv;
}

formRegistro.addEventListener("submit", function(evento) {
  evento.preventDefault();
  let run = document.getElementById("run").value.trim();
  let nombre = document.getElementById("nombre").value.trim();
  let apellidos = document.getElementById("apellidos").value.trim();
  let correo = document.getElementById("correo").value.trim();
  let direccion = document.getElementById("direccion").value.trim();

  let errorRun = document.getElementById("errorRun");
  let errorNombre = document.getElementById("errorNombre");
  let errorApellidos = document.getElementById("errorApellidos");
  let errorCorreo = document.getElementById("errorCorreo");
  let errorDireccion = document.getElementById("errorDireccion");
  let errorRegion = document.getElementById("errorRegion");
  let errorComuna = document.getElementById("errorComuna");

  errorRun.innerHTML = ""; errorNombre.innerHTML = ""; errorApellidos.innerHTML = "";
  errorCorreo.innerHTML = ""; errorDireccion.innerHTML = ""; errorRegion.innerHTML = ""; errorComuna.innerHTML = "";
  let valido = true;

  if (run == "") { errorRun.innerHTML = "El RUN es obligatorio."; valido = false; }
  else if (!validarRun(run)) { errorRun.innerHTML = "El RUN ingresado no es válido."; valido = false; }
  if (nombre == "") { errorNombre.innerHTML = "El nombre es obligatorio."; valido = false; }
  else if (nombre.length > 50) { errorNombre.innerHTML = "Máximo 50 caracteres."; valido = false; }
  if (apellidos == "") { errorApellidos.innerHTML = "Los apellidos son obligatorios."; valido = false; }
  else if (apellidos.length > 100) { errorApellidos.innerHTML = "Máximo 100 caracteres."; valido = false; }
  if (correo == "") { errorCorreo.innerHTML = "El correo es obligatorio."; valido = false; }
  else if (correo.length > 100) { errorCorreo.innerHTML = "Máximo 100 caracteres."; valido = false; }
  else if (!correo.endsWith("@duoc.cl") && !correo.endsWith("@profesor.duoc.cl") && !correo.endsWith("@gmail.com")) { errorCorreo.innerHTML = "El dominio del correo no está permitido."; valido = false; }
  if (region.value == "") { errorRegion.innerHTML = "Debe seleccionar una región."; valido = false; }
  if (comuna.value == "") { errorComuna.innerHTML = "Debe seleccionar una comuna."; valido = false; }
  if (direccion == "") { errorDireccion.innerHTML = "La dirección es obligatoria."; valido = false; }
  else if (direccion.length > 300) { errorDireccion.innerHTML = "Máximo 300 caracteres."; valido = false; }

  if (valido) {
    alert("Usuario registrado correctamente.");
    formRegistro.reset();
    comuna.innerHTML = '<option value="">Seleccione una comuna</option>';
  }
});

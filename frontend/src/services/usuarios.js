const USERS_KEY = "usuariosAdmin";

export const regiones = [
  { nombre: "Región Metropolitana", comunas: ["Santiago", "Puente Alto", "La Florida", "Maipú", "San Miguel", "Providencia", "Las Condes", "Ñuñoa"] },
  { nombre: "Región de Valparaíso", comunas: ["Valparaíso", "Viña del Mar", "Quilpué", "Villa Alemana"] },
  { nombre: "Región del Biobío", comunas: ["Concepción", "Talcahuano", "Chiguayante", "San Pedro de la Paz"] }
];

export const usuariosBase = [
  { run: "190110222", nombre: "Usuario", apellidos: "Administrador", correo: "admin@duoc.cl", password: "Admin123", tipo: "Administrador", region: "Región Metropolitana", comuna: "Santiago", direccion: "Casa matriz", fechaNacimiento: "" },
  { run: "201234565", nombre: "Cliente", apellidos: "Ejemplo", correo: "cliente@gmail.com", password: "Cliente123", tipo: "Cliente", region: "Región Metropolitana", comuna: "Maipú", direccion: "Dirección de ejemplo", fechaNacimiento: "" }
];

function normalizarRun(run) {
  return String(run || "").replace(/[.-]/g, "").trim().toUpperCase();
}

function normalizeUser(user) {
  const defaultUser = usuariosBase.find((item) => item.correo.toLowerCase() === String(user.correo || "").toLowerCase());
  const merged = { ...defaultUser, ...user };
  return {
    ...merged,
    run: normalizarRun(merged.run),
    nombre: String(merged.nombre || "").trim(),
    apellidos: String(merged.apellidos || "").trim(),
    correo: String(merged.correo || "").trim().toLowerCase(),
    tipo: merged.tipo === "Administrador" ? "Administrador" : "Cliente",
    region: String(merged.region || defaultUser?.region || ""),
    comuna: String(merged.comuna || defaultUser?.comuna || ""),
    direccion: String(merged.direccion || defaultUser?.direccion || "").trim(),
    fechaNacimiento: merged.fechaNacimiento || ""
  };
}

export function leerUsuarios() {
  try {
    const saved = JSON.parse(localStorage.getItem(USERS_KEY));
    if (Array.isArray(saved) && saved.length > 0) {
      const normalized = saved.map(normalizeUser);
      localStorage.setItem(USERS_KEY, JSON.stringify(normalized));
      return normalized;
    }
  } catch {
    // Se usan los usuarios demo si el almacenamiento no es válido.
  }

  const initial = usuariosBase.map(normalizeUser);
  localStorage.setItem(USERS_KEY, JSON.stringify(initial));
  return initial;
}

export function guardarUsuarios(users) {
  const normalized = users.map(normalizeUser);
  localStorage.setItem(USERS_KEY, JSON.stringify(normalized));
  return normalized;
}

export function validarRun(run) {
  const value = normalizarRun(run);
  if (!/^\d{7,8}[0-9K]$/.test(value)) return false;
  const body = value.slice(0, -1);
  const verifier = value.slice(-1);
  let sum = 0;
  let multiplier = 2;
  for (let index = body.length - 1; index >= 0; index -= 1) {
    sum += Number(body[index]) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }
  const result = 11 - (sum % 11);
  const calculated = result === 11 ? "0" : result === 10 ? "K" : String(result);
  return calculated === verifier;
}

export function crearUsuario(data) {
  const users = leerUsuarios();
  const run = normalizarRun(data.run);
  const correo = String(data.correo || "").trim().toLowerCase();
  if (users.some((user) => user.run === run || user.correo === correo)) return { ok: false, message: "El RUN o correo ya está registrado." };
  const user = normalizeUser(data);
  guardarUsuarios([...users, user]);
  return { ok: true, user };
}

export function actualizarUsuario(run, data) {
  const users = leerUsuarios();
  const normalizedRun = normalizarRun(run);
  const updated = users.map((user) => user.run === normalizedRun ? normalizeUser({ ...user, ...data, run: user.run, password: data.password || user.password }) : user);
  guardarUsuarios(updated);
  return updated.find((user) => user.run === normalizedRun);
}

export function eliminarUsuario(run) {
  const normalizedRun = normalizarRun(run);
  const users = leerUsuarios().filter((user) => user.run !== normalizedRun);
  return guardarUsuarios(users);
}

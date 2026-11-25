import { del, get, post, put } from "./api.js";

export const regiones = [
  { nombre: "Región Metropolitana", comunas: ["Santiago", "Puente Alto", "La Florida", "Maipú", "San Miguel", "Providencia", "Las Condes", "Ñuñoa"] },
  { nombre: "Región de Valparaíso", comunas: ["Valparaíso", "Viña del Mar", "Quilpué", "Villa Alemana"] },
  { nombre: "Región del Biobío", comunas: ["Concepción", "Talcahuano", "Chiguayante", "San Pedro de la Paz"] }
];

function normalizarRun(run) {
  return String(run || "").replace(/[.-]/g, "").trim().toUpperCase();
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

// El backend usa ADMIN y CLIENTE; las pantallas muestran Administrador y Cliente
export function desdeApi(usuario) {
  return usuario && {
    ...usuario,
    tipo: usuario.rol === "ADMIN" ? "Administrador" : "Cliente",
    fechaNacimiento: usuario.fechaNacimiento || ""
  };
}

function haciaApi({ tipo, ...datos }) {
  return { ...datos, rol: tipo === "Administrador" ? "ADMIN" : "CLIENTE" };
}

export const leerUsuarios = async () => (await get("/api/usuarios")).map(desdeApi);
export const registrarUsuario = async (datos) => desdeApi(await post("/api/auth/registro", datos));
export const crearUsuario = async (datos) => desdeApi(await post("/api/usuarios", haciaApi(datos)));
export const actualizarUsuario = async (id, datos) => desdeApi(await put(`/api/usuarios/${id}`, haciaApi(datos)));
export const actualizarPerfil = async (datos) => desdeApi(await put("/api/usuarios/perfil", datos));
export const eliminarUsuario = (id) => del(`/api/usuarios/${id}`);

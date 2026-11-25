// Capa de acceso a la API REST (Spring Boot) usando fetch.
const API_URL = import.meta.env?.VITE_API_URL || "http://localhost:8080";

// El access token vive solo en memoria. El refresh token es una cookie HttpOnly
// que el navegador envía solo y que JavaScript no puede leer.
let accessToken = null;
let usuarioId = null;
let renovacion = null;
let alCambiarSesion = () => {};

// Error con el formato del GlobalExceptionHandler: { status, error, campos? }
export class ApiError extends Error {
  constructor(status, message, campos) {
    super(message);
    this.status = status;
    this.campos = campos || {};
  }
}

// AuthProvider registra aquí la función que actualiza la sesión en React
export function escucharSesion(funcion) {
  alCambiarSesion = funcion;
}

export function guardarSesion(respuesta) {
  accessToken = respuesta?.accessToken || null;
  usuarioId = respuesta?.usuario?.id || null;
  alCambiarSesion(respuesta?.usuario || null);
}

async function enviar(path, { method = "GET", body } = {}) {
  const headers = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;

  let res;
  try {
    res = await fetch(API_URL + path, {
      method,
      headers,
      credentials: path.startsWith("/api/auth/") ? "include" : "same-origin",
      body: body === undefined ? undefined : JSON.stringify(body)
    });
  } catch {
    throw new ApiError(0, "No se pudo conectar con el servidor. ¿Está corriendo el backend?");
  }

  if (res.status === 204) return null;
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const detalle = Object.values(data?.campos || {}).join(" ");
    throw new ApiError(res.status, detalle || data?.error || `Error ${res.status}`, data?.campos);
  }
  return data;
}

// Pide un access token nuevo usando la cookie. Si varias peticiones lo necesitan
// al mismo tiempo, todas esperan la misma renovación.
export function renovarSesion() {
  if (!renovacion) {
    renovacion = enviar("/api/auth/refresh", { method: "POST" })
      .then((respuesta) => {
        guardarSesion(respuesta);
        return respuesta;
      })
      .catch((error) => {
        if (error.status === 401) guardarSesion(null);
        throw error;
      })
      .finally(() => { renovacion = null; });
  }
  return renovacion;
}

async function request(path, options) {
  const tokenUsado = accessToken;
  const usuarioAnterior = usuarioId;
  try {
    return await enviar(path, options);
  } catch (error) {
    const puedeRenovar = error.status === 401 && tokenUsado && !path.startsWith("/api/auth/");
    if (!puedeRenovar) throw error;
    // Si otra petición ya renovó el token no hace falta renovarlo otra vez
    if (accessToken === tokenUsado) await renovarSesion();
    // Si en otra pestaña entró otro usuario no se repite la acción con su cuenta
    if (usuarioId !== usuarioAnterior) throw error;
    return enviar(path, options);
  }
}

export const get = (path) => request(path);
export const post = (path, body) => request(path, { method: "POST", body });
export const put = (path, body) => request(path, { method: "PUT", body });
export const del = (path) => request(path, { method: "DELETE" });

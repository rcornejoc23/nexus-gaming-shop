import { guardarSesion, post, renovarSesion } from "./api.js";

export async function login(correo, password) {
  const respuesta = await post("/api/auth/login", { correo, password });
  guardarSesion(respuesta);
  return respuesta.usuario;
}

// Al recargar la página recupera la sesión desde la cookie HttpOnly
export async function recuperarSesion() {
  try {
    await renovarSesion();
  } catch (error) {
    if (error.status !== 401) console.warn("No se pudo recuperar la sesión.", error.message);
  }
}

// Si el servidor no responde, el error llega a la pantalla: la cookie seguiría activa
export async function logout() {
  await post("/api/auth/logout");
  guardarSesion(null);
}

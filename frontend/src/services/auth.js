const SESSION_KEY = "usuarioActual";
import { leerUsuarios } from "./usuarios.js";

function withoutPassword(usuario) {
  const { password, ...session } = usuario;
  return session;
}

export function getSession() {
  try {
    return JSON.parse(sessionStorage.getItem(SESSION_KEY)) || null;
  } catch {
    return null;
  }
}

export function login(correo, password) {
  const user = leerUsuarios().find((item) => item.correo.toLowerCase() === correo.trim().toLowerCase() && item.password === password);
  if (!user) return null;
  const session = withoutPassword(user);
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

export function logout() {
  sessionStorage.removeItem(SESSION_KEY);
}

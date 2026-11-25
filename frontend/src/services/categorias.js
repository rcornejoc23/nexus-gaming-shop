import { del, get, post, put } from "./api.js";

export const leerCategorias = async () => (await get("/api/categorias")).sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
export const crearCategoria = (nombre) => post("/api/categorias", { nombre });
export const actualizarCategoria = (id, nombre) => put(`/api/categorias/${id}`, { nombre });
export const eliminarCategoria = (id) => del(`/api/categorias/${id}`);

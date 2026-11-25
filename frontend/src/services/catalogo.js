import { del, get, post, put } from "./api.js";

// La API entrega la categoría como objeto; las pantallas usan su nombre
export function desdeApi(producto) {
  return {
    ...producto,
    categoria: producto.categoria?.nombre || "",
    categoriaId: producto.categoria?.id,
    imagen: producto.imagen || "/img/hero.jpg"
  };
}

function haciaApi(datos) {
  return {
    codigo: datos.codigo,
    nombre: datos.nombre,
    descripcion: datos.descripcion,
    precio: datos.precio,
    descuento: datos.descuento,
    stock: datos.stock,
    stockCritico: datos.stockCritico,
    imagen: datos.imagen,
    categoria: { id: datos.categoriaId }
  };
}

export const leerProductos = async () => (await get("/api/productos")).map(desdeApi);
export const crearProducto = async (datos) => desdeApi(await post("/api/productos", haciaApi(datos)));
export const actualizarProducto = async (id, datos) => desdeApi(await put(`/api/productos/${id}`, haciaApi(datos)));
export const eliminarProducto = (id) => del(`/api/productos/${id}`);

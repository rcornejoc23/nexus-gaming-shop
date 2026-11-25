import { del, get, post, put } from "./api.js";

export const estadosPedido = ["Pendiente", "Preparando", "Enviado", "Entregado", "Cancelado"];

// Mismas reglas del backend: no se retrocede y un pedido enviado no se cancela
export function estadosPosibles(actual) {
  if (actual === "Cancelado") return ["Cancelado"];
  const enviado = actual === "Enviado" || actual === "Entregado";
  return estadosPedido.slice(estadosPedido.indexOf(actual)).filter((estado) => !(enviado && estado === "Cancelado"));
}

export function desdeApi(pedido) {
  return {
    id: pedido.id,
    orderNumber: pedido.numero,
    createdAt: new Date(pedido.fecha).toLocaleString("es-CL"),
    estado: pedido.estado.charAt(0) + pedido.estado.slice(1).toLowerCase(),
    usuarioId: pedido.usuario?.id,
    customer: {
      nombre: pedido.nombreContacto,
      correo: pedido.correo,
      telefono: pedido.telefono,
      direccion: pedido.direccion,
      departamento: pedido.departamento,
      comuna: pedido.comuna,
      region: pedido.region,
      codigoPostal: pedido.codigoPostal
    },
    delivery: pedido.entrega === "express" ? "Envío express" : "Envío estándar",
    payment: pedido.pago === "tarjeta" ? "Tarjeta simulada" : "Transferencia bancaria",
    items: pedido.detalles.map((detalle) => ({ nombre: detalle.nombreProducto, quantity: detalle.cantidad, precio: detalle.precioUnitario })),
    subtotal: pedido.subtotal,
    shipping: pedido.costoEnvio,
    total: pedido.total
  };
}

export const leerPedidos = async () => (await get("/api/pedidos")).map(desdeApi);
export const leerMisPedidos = async () => (await get("/api/pedidos/mios")).map(desdeApi);
export const obtenerPedido = async (id) => desdeApi(await get(`/api/pedidos/${encodeURIComponent(id)}`));
export const crearPedido = async (datos) => desdeApi(await post("/api/pedidos", datos));
export const actualizarEstadoPedido = async (id, estado) => desdeApi(await put(`/api/pedidos/${id}/estado`, { estado: estado.toUpperCase() }));
export const eliminarPedido = (id) => del(`/api/pedidos/${id}`);

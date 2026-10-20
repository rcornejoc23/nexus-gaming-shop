const ORDERS_KEY = "pedidosNexus";
const LAST_ORDER_KEY = "ultimoPedidoNexus";

export const estadosPedido = ["Pendiente", "Preparando", "Enviado", "Entregado", "Cancelado"];

function generarNumeroPedido() {
  return `NXS-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

function normalizarPedido(pedido) {
  const orderNumber = String(pedido.orderNumber || pedido.id || generarNumeroPedido());
  const items = Array.isArray(pedido.items) ? pedido.items.map((item) => ({
    nombre: String(item.nombre || "Producto"),
    quantity: Math.max(1, Math.floor(Number(item.quantity) || 1)),
    precio: Math.max(0, Number(item.precio) || 0)
  })) : [];

  return {
    ...pedido,
    id: orderNumber,
    orderNumber,
    createdAt: pedido.createdAt || new Date().toLocaleString("es-CL"),
    estado: estadosPedido.includes(pedido.estado) ? pedido.estado : "Pendiente",
    customer: {
      nombre: String(pedido.customer?.nombre || "Cliente"),
      correo: String(pedido.customer?.correo || ""),
      telefono: String(pedido.customer?.telefono || ""),
      direccion: String(pedido.customer?.direccion || ""),
      departamento: String(pedido.customer?.departamento || ""),
      comuna: String(pedido.customer?.comuna || ""),
      region: String(pedido.customer?.region || ""),
      codigoPostal: String(pedido.customer?.codigoPostal || "")
    },
    delivery: String(pedido.delivery || "Envío estándar"),
    payment: String(pedido.payment || "Pago simulado"),
    items,
    subtotal: Math.max(0, Number(pedido.subtotal) || 0),
    shipping: Math.max(0, Number(pedido.shipping) || 0),
    total: Math.max(0, Number(pedido.total) || 0)
  };
}

export function leerPedidos() {
  try {
    const saved = JSON.parse(localStorage.getItem(ORDERS_KEY));
    if (Array.isArray(saved)) return saved.map(normalizarPedido);
  } catch {
    // Se usa una lista vacía si el almacenamiento no es válido.
  }
  return [];
}

export function guardarPedidos(pedidos) {
  const normalized = pedidos.map(normalizarPedido);
  localStorage.setItem(ORDERS_KEY, JSON.stringify(normalized));
  return normalized;
}

export function crearPedido(data) {
  const order = normalizarPedido({ ...data, orderNumber: data.orderNumber || generarNumeroPedido() });
  guardarPedidos([order, ...leerPedidos().filter((item) => item.id !== order.id)]);
  localStorage.setItem(LAST_ORDER_KEY, JSON.stringify(order));
  return order;
}

export function obtenerUltimoPedido() {
  try {
    const saved = JSON.parse(localStorage.getItem(LAST_ORDER_KEY));
    return saved ? normalizarPedido(saved) : null;
  } catch {
    return null;
  }
}

export function obtenerPedido(id) {
  return leerPedidos().find((pedido) => pedido.id === String(id));
}

export function actualizarEstadoPedido(id, estado) {
  if (!estadosPedido.includes(estado)) return null;
  const pedidos = leerPedidos();
  const updated = pedidos.map((pedido) => pedido.id === String(id) ? { ...pedido, estado } : pedido);
  guardarPedidos(updated);
  return updated.find((pedido) => pedido.id === String(id));
}

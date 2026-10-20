import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { estadosPedido, leerPedidos } from "../services/pedidos";

const formatPrice = (price) => `$ ${Number(price).toLocaleString("es-CL")}`;

export default function AdminOrders() {
  const [orders, setOrders] = useState(() => leerPedidos());

  useEffect(() => {
    const refreshOrders = () => setOrders(leerPedidos());
    const syncOrders = (event) => {
      if (event.key === "pedidosNexus" || event.key === "ultimoPedidoNexus") refreshOrders();
    };
    window.addEventListener("storage", syncOrders);
    window.addEventListener("focus", refreshOrders);
    return () => {
      window.removeEventListener("storage", syncOrders);
      window.removeEventListener("focus", refreshOrders);
    };
  }, []);

  return <div className="container py-5">
    <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
      <div><span className="text-uppercase small text-secondary">Panel interno</span><h1 className="mb-1">Pedidos</h1><p className="text-secondary mb-0">Revisa y actualiza el estado de las compras realizadas.</p></div>
      <div className="d-flex gap-2"><Link className="btn btn-outline-dark" to="/admin">Resumen</Link><Link className="btn btn-dark" to="/admin/productos">Productos</Link></div>
    </div>
    <div className="alert alert-light border d-flex flex-wrap gap-3">
      <span><strong>{orders.length}</strong> pedido(s)</span>
      <span><strong>{orders.filter((order) => order.estado === "Pendiente").length}</strong> pendiente(s)</span>
      <span><strong>{orders.filter((order) => order.estado === "Entregado").length}</strong> entregado(s)</span>
    </div>
    {orders.length === 0 ? <div className="alert alert-info">Todavía no hay pedidos registrados. Las compras realizadas desde el checkout aparecerán aquí.</div> : <div className="table-responsive bg-white rounded shadow-sm"><table className="table align-middle mb-0"><thead><tr><th>Pedido</th><th>Cliente</th><th>Fecha</th><th>Total</th><th>Estado</th><th>Acciones</th></tr></thead><tbody>{orders.map((order) => <tr key={order.id}><td><strong>{order.orderNumber}</strong><br /><small className="text-secondary">{order.items.length} producto(s)</small></td><td>{order.customer.nombre}<br /><small className="text-secondary">{order.customer.correo}</small></td><td>{order.createdAt}</td><td>{formatPrice(order.total)}</td><td><span className={`badge ${order.estado === "Entregado" ? "text-bg-success" : order.estado === "Cancelado" ? "text-bg-danger" : "text-bg-warning"}`}>{order.estado}</span></td><td><Link className="btn btn-sm btn-outline-primary" to={`/admin/pedidos/${encodeURIComponent(order.id)}`}>Ver pedido</Link></td></tr>)}</tbody></table></div>}
    <div className="mt-3"><small className="text-secondary">Estados disponibles: {estadosPedido.join(" · ")}</small></div>
  </div>;
}

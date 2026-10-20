import { Link } from "react-router-dom";
import { useAuth } from "../App";
import { leerPedidos } from "../services/pedidos";

const money = (value) => `$${Number(value || 0).toLocaleString("es-CL")}`;

export default function PurchaseHistory() {
  const { session } = useAuth();
  const orders = leerPedidos().filter((order) => order.customer.correo.toLowerCase() === session.correo.toLowerCase());

  return <section className="container py-5"><div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4"><div><span className="text-uppercase small text-secondary">Cuenta</span><h1 className="mb-1">Historial de compras</h1><p className="text-secondary mb-0">Consulta tus pedidos y sus comprobantes.</p></div><Link className="btn btn-outline-dark" to="/perfil">Mi perfil</Link></div>{orders.length === 0 ? <div className="alert alert-info">Todavía no tienes compras asociadas a {session.correo}.</div> : <div className="d-grid gap-3">{orders.map((order) => <article className="card border-0 shadow-sm" key={order.id}><div className="card-body"><div className="d-flex flex-wrap justify-content-between gap-2"><div><h2 className="h5 mb-1">Pedido {order.orderNumber}</h2><small className="text-secondary">{order.createdAt}</small></div><div className="text-end"><span className="badge text-bg-secondary">{order.estado}</span><strong className="d-block mt-2">{money(order.total)}</strong></div></div><ul className="mb-0 mt-3">{order.items.map((item, index) => <li key={`${order.id}-${index}`}>{item.quantity} × {item.nombre} — {money(item.precio * item.quantity)}</li>)}</ul></div></article>)}</div>}</section>;
}

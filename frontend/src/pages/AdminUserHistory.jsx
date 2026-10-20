import { Link, useParams } from "react-router-dom";
import { useAuth } from "../App";
import { leerPedidos } from "../services/pedidos";

const money = (value) => `$${Number(value || 0).toLocaleString("es-CL")}`;

export default function AdminUserHistory() {
  const { run } = useParams();
  const { users } = useAuth();
  const user = users.find((item) => item.run === decodeURIComponent(run));
  const orders = user ? leerPedidos().filter((order) => order.customer.correo.toLowerCase() === user.correo.toLowerCase()) : [];

  if (!user) return <section className="container py-5"><div className="alert alert-warning">Usuario no encontrado.</div></section>;

  return <div className="container py-5"><div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4"><div><span className="text-uppercase small text-secondary">Panel interno</span><h1 className="mb-1">Historial de compras</h1><p className="text-secondary mb-0">{user.nombre} {user.apellidos} · {user.correo}</p></div><Link className="btn btn-outline-dark" to="/admin/usuarios">Volver a usuarios</Link></div>{orders.length === 0 ? <div className="alert alert-info">Este usuario todavía no registra pedidos.</div> : <div className="table-responsive bg-white rounded shadow-sm"><table className="table align-middle mb-0"><thead><tr><th>Pedido</th><th>Fecha</th><th>Productos</th><th>Estado</th><th>Total</th></tr></thead><tbody>{orders.map((order) => <tr key={order.id}><td><Link to={`/admin/pedidos/${encodeURIComponent(order.id)}`}>{order.orderNumber}</Link></td><td>{order.createdAt}</td><td>{order.items.reduce((sum, item) => sum + item.quantity, 0)}</td><td>{order.estado}</td><td>{money(order.total)}</td></tr>)}</tbody></table></div>}</div>;
}

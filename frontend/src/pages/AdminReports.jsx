import { Link } from "react-router-dom";
import { useStore } from "../App";
import { leerPedidos } from "../services/pedidos";

const money = (value) => `$${Number(value || 0).toLocaleString("es-CL")}`;

export default function AdminReports() {
  const { products } = useStore();
  const orders = leerPedidos();
  const sales = orders.filter((order) => order.estado !== "Cancelado").reduce((sum, order) => sum + order.total, 0);
  const units = orders.filter((order) => order.estado !== "Cancelado").reduce((sum, order) => sum + order.items.reduce((items, item) => items + item.quantity, 0), 0);
  const critical = products.filter((product) => product.stock <= product.stockCritico);

  return <div className="container py-5"><div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4"><div><span className="text-uppercase small text-secondary">Panel interno</span><h1 className="mb-1">Reportes</h1><p className="text-secondary mb-0">Resumen de ventas, pedidos y stock.</p></div><Link className="btn btn-outline-dark" to="/admin">Volver al resumen</Link></div>
    <div className="row g-3 mb-4"><div className="col-sm-6 col-lg-3"><div className="card border-0 shadow-sm h-100"><div className="card-body"><span className="text-secondary">Ventas acumuladas</span><strong className="fs-3 d-block mt-2">{money(sales)}</strong></div></div></div><div className="col-sm-6 col-lg-3"><div className="card border-0 shadow-sm h-100"><div className="card-body"><span className="text-secondary">Pedidos válidos</span><strong className="fs-3 d-block mt-2">{orders.filter((order) => order.estado !== "Cancelado").length}</strong></div></div></div><div className="col-sm-6 col-lg-3"><div className="card border-0 shadow-sm h-100"><div className="card-body"><span className="text-secondary">Unidades vendidas</span><strong className="fs-3 d-block mt-2">{units}</strong></div></div></div><div className="col-sm-6 col-lg-3"><div className="card border-0 shadow-sm h-100"><div className="card-body"><span className="text-secondary">Stock crítico</span><strong className="fs-3 d-block mt-2">{critical.length}</strong></div></div></div></div>
    <div className="card border-0 shadow-sm"><div className="card-body"><h2 className="h5">Pedidos recientes</h2>{orders.length === 0 ? <p className="text-secondary mb-0">Todavía no hay pedidos registrados.</p> : <div className="table-responsive"><table className="table align-middle"><thead><tr><th>Pedido</th><th>Cliente</th><th>Fecha</th><th>Estado</th><th>Total</th></tr></thead><tbody>{orders.slice(0, 10).map((order) => <tr key={order.id}><td><Link to={`/admin/pedidos/${encodeURIComponent(order.id)}`}>{order.orderNumber}</Link></td><td>{order.customer.nombre}</td><td>{order.createdAt}</td><td><span className="badge text-bg-secondary">{order.estado}</span></td><td>{money(order.total)}</td></tr>)}</tbody></table></div>}</div></div>
  </div>;
}

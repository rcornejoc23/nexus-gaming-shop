import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { actualizarEstadoPedido, estadosPedido, obtenerPedido } from "../services/pedidos";

const formatPrice = (price) => `$ ${Number(price).toLocaleString("es-CL")}`;

export default function AdminOrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(() => obtenerPedido(decodeURIComponent(id)));
  const [message, setMessage] = useState("");

  useEffect(() => setOrder(obtenerPedido(decodeURIComponent(id))), [id]);

  if (!order) return <section className="container py-5"><div className="alert alert-warning">No encontramos el pedido solicitado.</div><Link className="btn btn-outline-dark" to="/admin/pedidos">Volver a pedidos</Link></section>;

  const changeStatus = (event) => {
    const updated = actualizarEstadoPedido(order.id, event.target.value);
    setOrder(updated);
    setMessage("Estado del pedido actualizado correctamente.");
  };

  return <div className="container py-5">
    <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4"><div><span className="text-uppercase small text-secondary">Detalle de pedido</span><h1 className="mb-1">{order.orderNumber}</h1><p className="text-secondary mb-0">Registrado el {order.createdAt}</p></div><Link className="btn btn-outline-dark" to="/admin/pedidos">Volver a pedidos</Link></div>
    {message && <div className="alert alert-success" role="alert">{message}</div>}
    <div className="row g-4 align-items-start"><div className="col-lg-7"><div className="card border-0 shadow-sm mb-4"><div className="card-body"><h2 className="h5">Productos comprados</h2><div className="table-responsive"><table className="table align-middle mb-0"><thead><tr><th>Producto</th><th className="text-center">Cantidad</th><th className="text-end">Subtotal</th></tr></thead><tbody>{order.items.map((item) => <tr key={`${item.nombre}-${item.quantity}`}><td>{item.nombre}</td><td className="text-center">{item.quantity}</td><td className="text-end">{formatPrice(item.precio * item.quantity)}</td></tr>)}</tbody></table></div></div></div><div className="card border-0 shadow-sm"><div className="card-body"><h2 className="h5">Estado del pedido</h2><label className="form-label" htmlFor="orderStatus">Actualizar estado</label><select className="form-select" id="orderStatus" value={order.estado} onChange={changeStatus}>{estadosPedido.map((status) => <option key={status} value={status}>{status}</option>)}</select></div></div></div><div className="col-lg-5"><div className="card border-0 shadow-sm mb-4"><div className="card-body"><h2 className="h5">Datos del cliente</h2><p className="mb-0"><strong>{order.customer.nombre}</strong><br />{order.customer.correo}<br />{order.customer.telefono}</p></div></div><div className="card border-0 shadow-sm mb-4"><div className="card-body"><h2 className="h5">Entrega</h2><p>{order.customer.direccion}{order.customer.departamento ? `, ${order.customer.departamento}` : ""}<br />{order.customer.comuna}, {order.customer.region}<br />Código postal: {order.customer.codigoPostal}</p><p className="mb-0"><strong>Método:</strong> {order.delivery}<br /><strong>Pago:</strong> {order.payment}</p></div></div><div className="card border-0 shadow-sm"><div className="card-body"><h2 className="h5">Resumen</h2><div className="d-flex justify-content-between mb-2"><span>Subtotal</span><span>{formatPrice(order.subtotal)}</span></div><div className="d-flex justify-content-between mb-2"><span>Envío</span><span>{order.shipping === 0 ? "Gratis" : formatPrice(order.shipping)}</span></div><hr /><div className="d-flex justify-content-between"><strong>Total</strong><strong>{formatPrice(order.total)}</strong></div></div></div></div></div>
  </div>;
}

import { Link, useLocation } from "react-router-dom";
import { obtenerUltimoPedido } from "../services/pedidos";

export default function PurchaseSuccess() {
  const { state } = useLocation();
  const receipt = state?.receipt || obtenerUltimoPedido();

  if (!receipt) return <section className="container py-5"><div className="alert alert-success text-center"><h1>Compra realizada</h1><p>Tu pedido fue registrado correctamente.</p><Link className="btn btn-success" to="/productos">Seguir comprando</Link></div></section>;

  return <section className="container py-4 py-lg-5 receipt-page">
    <div className="receipt-success text-center mb-4"><div className="receipt-check">✓</div><h1>Compra realizada</h1><p className="text-secondary mb-0">Gracias, {receipt.customer.nombre}. Tu pedido fue registrado correctamente.</p></div>
    <article className="receipt-card">
      <div className="receipt-header"><div><span className="text-uppercase text-secondary small">Comprobante de compra</span><h2>NEXUS Gaming</h2></div><div className="text-end"><strong>{receipt.orderNumber}</strong><small>{receipt.createdAt}</small></div></div>
      <div className="row g-4 receipt-details"><div className="col-md-6"><h3>Datos del cliente</h3><p><strong>{receipt.customer.nombre}</strong><br />{receipt.customer.correo}<br />{receipt.customer.telefono}</p></div><div className="col-md-6"><h3>Dirección de entrega</h3><p>{receipt.customer.direccion}{receipt.customer.departamento ? `, ${receipt.customer.departamento}` : ""}<br />{receipt.customer.comuna}, {receipt.customer.region}<br />Código postal: {receipt.customer.codigoPostal}</p></div></div>
      <div className="receipt-meta"><span><strong>Entrega:</strong> {receipt.delivery}</span><span><strong>Pago:</strong> {receipt.payment}</span></div>
      <div className="table-responsive"><table className="table align-middle receipt-items"><thead><tr><th>Producto</th><th className="text-center">Cantidad</th><th className="text-end">Precio</th><th className="text-end">Total</th></tr></thead><tbody>{receipt.items.map((item) => <tr key={`${item.nombre}-${item.quantity}`}><td>{item.nombre}</td><td className="text-center">{item.quantity}</td><td className="text-end">{formatPrice(item.precio)}</td><td className="text-end">{formatPrice(item.precio * item.quantity)}</td></tr>)}</tbody></table></div>
      <div className="receipt-totals"><div><span>Subtotal</span><span>{formatPrice(receipt.subtotal)}</span></div><div><span>Envío</span><span>{receipt.shipping === 0 ? "Gratis" : formatPrice(receipt.shipping)}</span></div><div className="receipt-grand-total"><strong>Total pagado</strong><strong>{formatPrice(receipt.total)}</strong></div></div>
      <div className="receipt-footer text-center"><p className="mb-3">Guarda este comprobante como respaldo de tu compra.</p><div className="d-flex flex-wrap justify-content-center gap-2"><button className="btn btn-outline-secondary" type="button" onClick={() => window.print()}>Imprimir comprobante</button><Link className="btn btn-success" to="/productos">Seguir comprando</Link></div></div>
    </article>
  </section>;
}

const formatPrice = (price) => `$${Number(price).toLocaleString("es-CL")}`;

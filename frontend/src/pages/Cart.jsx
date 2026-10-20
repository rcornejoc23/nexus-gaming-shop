import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStore } from "../App";
import { obtenerPrecioFinal, tieneDescuento } from "../services/precios";

export default function Cart() {
  const { cart, setCartQuantity, removeFromCart } = useStore();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const total = cart.reduce((sum, item) => sum + obtenerPrecioFinal(item.product) * item.quantity, 0);

  return <section className="container py-5"><h1>Carrito</h1>{cart.length === 0 ? <div className="alert alert-info">Tu carrito está vacío. <Link to="/productos">Ver productos</Link></div> : <>{message && <div className="alert alert-warning" role="alert">{message}</div>}<div className="table-responsive"><table className="table align-middle"><thead><tr><th>Producto</th><th>Precio</th><th>Cantidad</th><th>Subtotal</th><th /></tr></thead><tbody>{cart.map((item) => { const price = obtenerPrecioFinal(item.product); return <tr key={item.productId}><td>{item.product.nombre}</td><td>{tieneDescuento(item.product) ? <><span className="text-decoration-line-through text-secondary me-2">${item.product.precio.toLocaleString("es-CL")}</span><span className="text-danger">${price.toLocaleString("es-CL")}</span></> : `$${price.toLocaleString("es-CL")}`}</td><td><input className="form-control" style={{ maxWidth: 100 }} type="number" min="1" max={item.product.stock} value={item.quantity} onChange={(event) => { const result = setCartQuantity(item.productId, event.target.value); setMessage(result.ok ? "" : result.message); }} /></td><td>${(price * item.quantity).toLocaleString("es-CL")}</td><td><button className="btn btn-outline-danger" type="button" onClick={() => removeFromCart(item.productId)}>Eliminar</button></td></tr>; })}</tbody></table></div><div className="d-flex justify-content-end align-items-center gap-3"><strong className="fs-4">Total: ${total.toLocaleString("es-CL")}</strong><button className="btn btn-primary" type="button" onClick={() => navigate("/checkout")}>Continuar compra</button></div></>}</section>;
}

import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useStore } from "../App";
import { obtenerPrecioFinal, tieneDescuento } from "../services/precios";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, addToCart } = useStore();
  const product = products.find((item) => item.id === Number(id));
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");

  if (!product) return <section className="container py-5"><div className="alert alert-warning">Producto no encontrado.</div></section>;

  const handleAdd = () => {
    const requested = Number(quantity);
    if (!Number.isInteger(requested) || requested < 1) return setMessage("La cantidad debe ser un número entero mayor que cero.");
    let result = addToCart(product, requested);
    if (result.requiresConfirmation) {
      if (!result.available || !window.confirm(`Solo quedan ${result.available} unidad(es). ¿Deseas agregarlas?`)) return setMessage("No se agregaron unidades.");
      result = addToCart(product, result.available);
    }
    if (!result.ok) return setMessage(result.message || "No fue posible agregar el producto.");
    setMessage("Producto agregado correctamente.");
  };

  const finalPrice = obtenerPrecioFinal(product);
  return <section className="container py-5"><Link to="/productos" className="text-decoration-none">← Volver a productos</Link><div className="row g-5 mt-2 align-items-center"><div className="col-md-6"><img className="img-fluid rounded-4 shadow" src={product.imagen} alt={product.nombre} /></div><div className="col-md-6"><span className="badge text-bg-secondary mb-2">{product.categoria}</span><h1>{product.nombre}</h1>{tieneDescuento(product) ? <p className="display-6"><span className="text-decoration-line-through text-secondary me-2">${product.precio.toLocaleString("es-CL")}</span><span className="text-danger">${finalPrice.toLocaleString("es-CL")}</span></p> : <p className="display-6">${finalPrice.toLocaleString("es-CL")}</p>}<p className={product.stock > 0 ? "text-success fw-semibold" : "text-danger fw-semibold"}>{product.stock > 0 ? `Stock disponible: ${product.stock}` : "Sin stock disponible"}</p><p className="lead">{product.descripcion}</p>{message && <p className="alert alert-info">{message}</p>}<div className="input-group mb-3" style={{ maxWidth: 240 }}><label className="input-group-text" htmlFor="quantity">Cantidad</label><input id="quantity" className="form-control" type="number" min="1" max={Math.max(1, product.stock)} value={quantity} disabled={product.stock <= 0} onChange={(event) => setQuantity(event.target.value)} /></div><button className="btn btn-primary btn-lg" type="button" disabled={product.stock <= 0} onClick={handleAdd}>Agregar al carrito</button><button className="btn btn-outline-secondary btn-lg ms-2" type="button" onClick={() => navigate("/carrito")}>Ir al carrito</button></div></div></section>;
}

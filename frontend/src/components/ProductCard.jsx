import { Link } from "react-router-dom";
import { useStore } from "../App";
import { obtenerPrecioFinal, tieneDescuento } from "../services/precios";

export default function ProductCard({ product }) {
  const { addToCart } = useStore();
  const handleAdd = () => {
    const result = addToCart(product, 1);
    if (result.requiresConfirmation && result.available > 0 && window.confirm(`Solo quedan ${result.available} unidad(es). ¿Deseas agregarlas?`)) addToCart(product, result.available);
    else if (!result.ok && !result.requiresConfirmation) window.alert(result.message);
  };

  const finalPrice = obtenerPrecioFinal(product);

  return <article className="card h-100 shadow-sm"><img src={product.imagen} className="card-img-top product-image" alt={product.nombre} /><div className="card-body d-flex flex-column">
    <span className="badge text-bg-secondary align-self-start mb-2">{product.categoria}</span>
    <h2 className="h5">{product.nombre}</h2><p className="text-muted flex-grow-1">{product.descripcion}</p>
    {tieneDescuento(product) ? <p className="mb-1"><span className="text-decoration-line-through text-secondary me-2">${product.precio.toLocaleString("es-CL")}</span><strong className="h5 text-danger">${finalPrice.toLocaleString("es-CL")}</strong><span className="badge text-bg-danger ms-2">-{product.descuento}%</span></p> : <p className="h5">${finalPrice.toLocaleString("es-CL")}</p>}
    <p className={product.stock <= product.stockCritico ? "text-danger small" : "text-success small"}>{product.stock > 0 ? `${product.stock} unidad(es) disponibles` : "Sin stock"}</p>
    <div className="d-flex gap-2"><Link className="btn btn-outline-primary flex-grow-1" to={`/productos/${product.id}`}>Ver detalle</Link><button className="btn btn-primary" type="button" disabled={product.stock <= 0} onClick={handleAdd}>Agregar</button></div>
  </div></article>;
}

import { Link } from "react-router-dom";
import { useStore } from "../App";
import { obtenerPrecioFinal, tieneDescuento } from "../services/precios";

const formatPrice = (price) => `$ ${Number(price).toLocaleString("es-CL")}`;

export default function AdminProducts() {
  const { products, deleteProduct } = useStore();

  const handleDelete = (product) => {
    if (window.confirm(`¿Eliminar ${product.nombre}?`)) deleteProduct(product.id);
  };

  return <div className="container py-5">
    <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
      <div><span className="text-uppercase small text-secondary">Panel interno</span><h1 className="mb-1">Productos</h1><p className="text-secondary mb-0">Los cambios se guardan en el catálogo compartido.</p></div>
      <div className="d-flex gap-2"><Link className="btn btn-outline-dark" to="/admin">Resumen</Link><Link className="btn btn-outline-dark" to="/admin/usuarios">Usuarios</Link><Link className="btn btn-dark" to="/admin/productos/nuevo">Nuevo producto</Link></div>
    </div>
    <div className="table-responsive bg-white rounded shadow-sm">
      <table className="table align-middle mb-0"><thead><tr><th>Código</th><th>Producto</th><th>Categoría</th><th>Precio</th><th>Stock</th><th>Acciones</th></tr></thead>
        <tbody>{products.map((product) => <tr key={product.id}>
          <td>{product.codigo}</td><td><strong>{product.nombre}</strong><br /><small className="text-secondary">{product.descripcion}</small></td><td>{product.categoria}</td><td>{tieneDescuento(product) ? <><span className="text-decoration-line-through text-secondary me-2">{formatPrice(product.precio)}</span><strong className="text-danger">{formatPrice(obtenerPrecioFinal(product))}</strong><br /><small className="text-danger">-{product.descuento}%</small></> : formatPrice(product.precio)}</td>
          <td><span className={product.stock <= product.stockCritico ? "badge text-bg-danger" : "badge text-bg-success"}>{product.stock}</span></td>
          <td><div className="d-flex gap-2"><Link className="btn btn-sm btn-outline-primary" to={`/admin/productos/${product.id}/editar`}>Editar</Link><button className="btn btn-sm btn-outline-danger" type="button" onClick={() => handleDelete(product)}>Eliminar</button></div></td>
        </tr>)}</tbody>
      </table>
    </div>
  </div>;
}

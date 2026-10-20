import { Link } from "react-router-dom";
import { useAuth, useStore } from "../App";
import { leerPedidos } from "../services/pedidos";

export default function AdminDashboard() {
  const { products } = useStore();
  const { users } = useAuth();
  const orders = leerPedidos();
  const sales = orders.filter((order) => order.estado !== "Cancelado").reduce((sum, order) => sum + order.total, 0);
  const critical = products.filter((product) => product.stock <= product.stockCritico);

  return <div className="container py-5">
    <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
      <div><span className="text-uppercase small text-secondary">Panel interno</span><h1 className="mb-1">Administración</h1><p className="text-secondary mb-0">Gestiona el catálogo conectado a la tienda.</p></div>
      <div className="d-flex gap-2"><Link className="btn btn-outline-dark" to="/admin/reportes">Ver reportes</Link><Link className="btn btn-dark" to="/admin/productos">Administrar productos</Link></div>
    </div>
    <div className="row g-3 mb-4">
      <div className="col-sm-6 col-lg-3"><div className="card h-100 border-0 shadow-sm"><div className="card-body"><p className="text-secondary mb-1">Pedidos</p><strong className="fs-2">{orders.length}</strong></div></div></div>
      <div className="col-sm-6 col-lg-3"><div className="card h-100 border-0 shadow-sm"><div className="card-body"><p className="text-secondary mb-1">Productos registrados</p><strong className="fs-2">{products.length}</strong></div></div></div>
      <div className="col-sm-6 col-lg-3"><div className="card h-100 border-0 shadow-sm"><div className="card-body"><p className="text-secondary mb-1">Unidades disponibles</p><strong className="fs-2">{products.reduce((total, product) => total + product.stock, 0)}</strong></div></div></div>
      <div className="col-sm-6 col-lg-3"><div className="card h-100 border-0 shadow-sm"><div className="card-body"><p className="text-secondary mb-1">Usuarios registrados</p><strong className="fs-2">{users.length}</strong></div></div></div>
      <div className="col-sm-6 col-lg-3"><div className="card h-100 border-0 shadow-sm"><div className="card-body"><p className="text-secondary mb-1">Ventas acumuladas</p><strong className="fs-2">${sales.toLocaleString("es-CL")}</strong></div></div></div>
    </div>
    <div className="card border-0 shadow-sm mb-3"><div className="card-body">
      <h2 className="h5">Productos que requieren atención</h2>
      {critical.length === 0 ? <p className="text-secondary mb-0">No hay productos en stock crítico.</p> : <ul className="mb-0">{critical.map((product) => <li key={product.id}>{product.nombre}: {product.stock} unidad(es) disponibles.</li>)}</ul>}
    </div></div><div className="d-flex flex-wrap justify-content-end gap-2"><Link className="btn btn-outline-dark" to="/admin/categorias">Administrar categorías</Link><Link className="btn btn-outline-dark" to="/admin/usuarios">Administrar usuarios</Link><Link className="btn btn-outline-dark" to="/admin/pedidos">Administrar pedidos</Link><Link className="btn btn-outline-dark" to="/admin/reportes">Ver reportes</Link></div>
  </div>;
}

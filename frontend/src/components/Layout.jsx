import { Link, NavLink } from "react-router-dom";
import { useAuth, useStore } from "../App";
import Estado from "./Estado";

export default function Layout({ children }) {
  const { cartCount, cargandoCatalogo, errorCatalogo, refreshProducts, avisoCarrito, cerrarAviso } = useStore();
  const { session, cargandoSesion, signOut } = useAuth();
  const navClass = ({ isActive }) => `nav-link ${isActive ? "active" : ""}`;

  return <>
    <nav className="navbar navbar-expand-lg bg-dark navbar-dark sticky-top"><div className="container">
      <Link className="navbar-brand fw-bold" to="/">NEXUS Gaming</Link>
      <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav"><span className="navbar-toggler-icon" /></button>
      <div className="collapse navbar-collapse" id="mainNav"><div className="navbar-nav me-auto">
        <NavLink className={navClass} to="/productos">Productos</NavLink>
        <NavLink className={navClass} to="/categorias">Categorías</NavLink>
        <NavLink className={navClass} to="/ofertas">Ofertas</NavLink>
        <NavLink className={navClass} to="/nosotros">Nosotros</NavLink>
        <NavLink className={navClass} to="/blog">Blog</NavLink>
        <NavLink className={navClass} to="/contacto">Contacto</NavLink>
        {session?.tipo === "Administrador" && <><NavLink className={navClass} to="/admin">Administración</NavLink><NavLink className={navClass} to="/admin/pedidos">Pedidos</NavLink></>}
      </div><div className="d-flex align-items-center gap-2"><Link className="btn btn-outline-light" to="/carrito">Carrito ({cartCount})</Link>{cargandoSesion ? null : session ? <><Link className="btn btn-sm btn-outline-light" to="/perfil">Mi perfil</Link><button className="btn btn-sm btn-warning" type="button" onClick={signOut}>Salir ({session.tipo})</button></> : <><Link className="btn btn-sm btn-light" to="/login">Ingresar</Link><Link className="btn btn-sm btn-outline-light" to="/registro">Registrarse</Link></>}</div></div>
    </div></nav>
    <main>
      {errorCatalogo && <div className="container pt-4"><div className="alert alert-danger d-flex justify-content-between align-items-center" role="alert">{errorCatalogo}<button className="btn btn-sm btn-outline-danger" type="button" onClick={refreshProducts}>Reintentar</button></div></div>}
      {avisoCarrito && <div className="container pt-4"><div className="alert alert-warning d-flex justify-content-between align-items-center" role="alert">{avisoCarrito}<button className="btn-close" type="button" aria-label="Cerrar" onClick={cerrarAviso} /></div></div>}
      {cargandoCatalogo ? <Estado /> : children}
    </main>
    <footer className="bg-dark text-white py-4 mt-5"><div className="container text-center small">NEXUS Gaming - EA3 Desarrollo Fullstack II</div></footer>
  </>;
}

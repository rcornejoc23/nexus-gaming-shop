import { Link, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../App";
import Estado from "./Estado";

export default function ProtectedRoute({ children, role }) {
  const location = useLocation();
  const { session, cargandoSesion } = useAuth();

  // Tras recargar se espera la respuesta del servidor antes de decidir
  if (cargandoSesion) return <Estado />;
  if (!session) return <Navigate to="/login" replace state={{ from: location.pathname, message: "Inicia sesión para acceder a esta sección." }} />;
  if (role && session.tipo !== role) return <section className="container py-5"><div className="alert alert-danger" role="alert"><h1 className="h4">Acceso denegado</h1><p>No tienes permisos para ver esta sección.</p><Link className="btn btn-outline-danger" to="/">Volver al inicio</Link></div></section>;
  return children;
}

import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../App";

export default function ProtectedRoute({ children, role }) {
  const location = useLocation();
  const { session } = useAuth();

  if (!session) return <Navigate to="/login" replace state={{ from: location.pathname, message: "Inicia sesión para acceder a esta sección." }} />;
  if (role && session.tipo !== role) return <Navigate to="/" replace state={{ message: "No tienes permisos para acceder a administración." }} />;
  return children;
}

import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../App";

export default function AdminUsers() {
  const { users, session, deleteUser } = useAuth();
  const [message, setMessage] = useState("");

  const handleDelete = (user) => {
    if (user.run === session.run) return setMessage("No puedes eliminar el usuario con el que tienes la sesión activa.");
    if (window.confirm(`¿Eliminar a ${user.nombre} ${user.apellidos}?`)) deleteUser(user.run);
  };

  return <div className="container py-5">
    <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4"><div><span className="text-uppercase small text-secondary">Panel interno</span><h1 className="mb-1">Usuarios</h1><p className="text-secondary mb-0">Administra los accesos y roles de la tienda.</p></div><div className="d-flex gap-2"><Link className="btn btn-outline-dark" to="/admin">Resumen</Link><Link className="btn btn-dark" to="/admin/usuarios/nuevo">Nuevo usuario</Link></div></div>
    {message && <div className="alert alert-warning" role="alert">{message}</div>}
    <div className="table-responsive bg-white rounded shadow-sm"><table className="table align-middle mb-0"><thead><tr><th>RUN</th><th>Nombre</th><th>Correo</th><th>Tipo</th><th>Región</th><th>Acciones</th></tr></thead><tbody>{users.map((user) => <tr key={user.run}><td>{user.run}</td><td><strong>{user.nombre} {user.apellidos}</strong><br /><small className="text-secondary">{user.comuna || "Sin comuna"}</small></td><td>{user.correo}</td><td><span className={`badge ${user.tipo === "Administrador" ? "text-bg-dark" : "text-bg-secondary"}`}>{user.tipo}</span></td><td>{user.region || "Sin región"}</td><td><div className="d-flex gap-2"><Link className="btn btn-sm btn-outline-secondary" to={`/admin/usuarios/${encodeURIComponent(user.run)}/historial`}>Historial</Link><Link className="btn btn-sm btn-outline-primary" to={`/admin/usuarios/${encodeURIComponent(user.run)}/editar`}>Editar</Link><button className="btn btn-sm btn-outline-danger" type="button" onClick={() => handleDelete(user)}>Eliminar</button></div></td></tr>)}</tbody></table></div>
  </div>;
}

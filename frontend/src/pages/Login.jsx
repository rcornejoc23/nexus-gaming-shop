import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../App";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { session, signIn } = useAuth();
  const [form, setForm] = useState({ correo: "", password: "" });
  const [error, setError] = useState(location.state?.message || "");

  if (session) return <section className="container py-5"><div className="alert alert-info">Ya tienes una sesión iniciada como {session.nombre}.</div></section>;

  const submit = (event) => {
    event.preventDefault();
    setError("");
    if (!form.correo.trim() || !form.password) return setError("Completa correo y contraseña.");
    const user = signIn(form.correo, form.password);
    if (!user) return setError("Correo o contraseña incorrectos.");
    const destination = user.tipo === "Administrador" ? "/admin" : (location.state?.from || "/");
    navigate(destination, { replace: true });
  };

  return <section className="container py-5"><div className="row justify-content-center"><div className="col-md-6 col-lg-5"><div className="card border-0 shadow-sm"><div className="card-body p-4"><span className="text-uppercase small text-secondary">Acceso</span><h1 className="h2 mb-3">Iniciar sesión</h1><p className="text-secondary">Accede como cliente o administrador.</p>{error && <div className="alert alert-danger" role="alert">{error}</div>}<form onSubmit={submit} noValidate><label className="form-label" htmlFor="loginEmail">Correo</label><input className="form-control mb-3" id="loginEmail" type="email" value={form.correo} onChange={(event) => setForm({ ...form, correo: event.target.value })} autoComplete="username" /><label className="form-label" htmlFor="loginPassword">Contraseña</label><input className="form-control mb-4" id="loginPassword" type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} autoComplete="current-password" /><button className="btn btn-primary w-100" type="submit">Ingresar</button></form><div className="text-center mt-3"><Link to="/registro">Crear una cuenta</Link></div><hr /><p className="small text-secondary mb-1">Demo administrador: admin@duoc.cl / Admin123</p><p className="small text-secondary mb-0">Demo cliente: cliente@gmail.com / Cliente123</p></div></div></div></div></section>;
}

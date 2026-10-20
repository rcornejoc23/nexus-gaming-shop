import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../App";
import { regiones, validarRun } from "../services/usuarios";

const initialForm = { run: "", nombre: "", apellidos: "", correo: "", password: "", region: regiones[0].nombre, comuna: "", direccion: "" };

export default function Register() {
  const navigate = useNavigate();
  const { createUser } = useAuth();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const selectedRegion = regiones.find((region) => region.nombre === form.region) || regiones[0];

  const submit = (event) => {
    event.preventDefault();
    setError("");
    if (!validarRun(form.run)) return setError("Ingresa un RUN válido con su dígito verificador.");
    if (!form.nombre.trim() || !form.apellidos.trim() || !form.correo.trim() || !form.password) return setError("Completa todos los campos obligatorios.");
    if (form.password.length < 6) return setError("La contraseña debe tener al menos 6 caracteres.");
    const result = createUser({ ...form, tipo: "Cliente" });
    if (!result.ok) return setError(result.message);
    navigate("/login", { state: { message: "Registro completado. Ahora puedes iniciar sesión." } });
  };

  return <section className="container py-5"><div className="row justify-content-center"><div className="col-lg-8"><div className="card border-0 shadow-sm p-4"><span className="text-uppercase small text-secondary">Nueva cuenta</span><h1 className="mb-1">Registro de cliente</h1><p className="text-secondary">Crea tu cuenta para consultar tus compras.</p>{error && <div className="alert alert-danger">{error}</div>}<form onSubmit={submit} noValidate><div className="row g-3"><div className="col-md-4"><label className="form-label" htmlFor="registerRun">RUN</label><input id="registerRun" className="form-control" value={form.run} onChange={(event) => setForm({ ...form, run: event.target.value })} placeholder="12345678-5" /></div><div className="col-md-4"><label className="form-label" htmlFor="registerName">Nombre</label><input id="registerName" className="form-control" value={form.nombre} onChange={(event) => setForm({ ...form, nombre: event.target.value })} /></div><div className="col-md-4"><label className="form-label" htmlFor="registerLastName">Apellidos</label><input id="registerLastName" className="form-control" value={form.apellidos} onChange={(event) => setForm({ ...form, apellidos: event.target.value })} /></div><div className="col-md-6"><label className="form-label" htmlFor="registerEmail">Correo</label><input id="registerEmail" type="email" className="form-control" value={form.correo} onChange={(event) => setForm({ ...form, correo: event.target.value })} /></div><div className="col-md-6"><label className="form-label" htmlFor="registerPassword">Contraseña</label><input id="registerPassword" type="password" className="form-control" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} /></div><div className="col-md-6"><label className="form-label" htmlFor="registerRegion">Región</label><select id="registerRegion" className="form-select" value={form.region} onChange={(event) => setForm({ ...form, region: event.target.value, comuna: "" })}>{regiones.map((region) => <option key={region.nombre}>{region.nombre}</option>)}</select></div><div className="col-md-6"><label className="form-label" htmlFor="registerComuna">Comuna</label><select id="registerComuna" className="form-select" value={form.comuna} onChange={(event) => setForm({ ...form, comuna: event.target.value })}><option value="">Selecciona una comuna</option>{selectedRegion.comunas.map((comuna) => <option key={comuna}>{comuna}</option>)}</select></div><div className="col-12"><label className="form-label" htmlFor="registerAddress">Dirección</label><input id="registerAddress" className="form-control" value={form.direccion} onChange={(event) => setForm({ ...form, direccion: event.target.value })} /></div></div><div className="d-flex justify-content-between align-items-center mt-4"><Link to="/login">Ya tengo cuenta</Link><button className="btn btn-dark" type="submit">Crear cuenta</button></div></form></div></div></div></section>;
}

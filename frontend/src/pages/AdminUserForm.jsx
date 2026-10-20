import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../App";
import { regiones, validarRun } from "../services/usuarios";

const emptyForm = { run: "", nombre: "", apellidos: "", correo: "", password: "", tipo: "Cliente", region: "", comuna: "", direccion: "", fechaNacimiento: "" };
const emailPattern = /^[^\s@]+@(?:duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i;

export default function AdminUserForm() {
  const { run } = useParams();
  const navigate = useNavigate();
  const { users, createUser, updateUser } = useAuth();
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const editing = Boolean(run);

  useEffect(() => {
    if (!run) return;
    const user = users.find((item) => item.run === decodeURIComponent(run));
    if (user) setForm({ ...user, password: "" });
  }, [run, users]);

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => name === "region" ? { ...current, region: value, comuna: "" } : { ...current, [name]: value });
  };

  const submit = (event) => {
    event.preventDefault();
    setError("");
    const normalizedRun = form.run.trim().toUpperCase();
    const correo = form.correo.trim().toLowerCase();
    if (!validarRun(normalizedRun)) return setError("El RUN ingresado no es válido.");
    if (!form.nombre.trim() || form.nombre.trim().length > 50) return setError("Ingresa un nombre de hasta 50 caracteres.");
    if (!form.apellidos.trim() || form.apellidos.trim().length > 100) return setError("Ingresa apellidos de hasta 100 caracteres.");
    if (!emailPattern.test(correo)) return setError("Usa un correo @duoc.cl, @profesor.duoc.cl o @gmail.com.");
    if (!form.region || !form.comuna || !form.direccion.trim()) return setError("Completa región, comuna y dirección.");
    if (!editing && form.password.length < 4) return setError("La contraseña debe tener al menos 4 caracteres.");
    if (form.password && (form.password.length < 4 || form.password.length > 20)) return setError("La contraseña debe tener entre 4 y 20 caracteres.");
    if (users.some((user) => user.correo === correo && user.run !== (editing ? decodeURIComponent(run) : normalizedRun))) return setError("Ya existe un usuario con ese correo.");

    const data = { ...form, run: normalizedRun, correo, nombre: form.nombre.trim(), apellidos: form.apellidos.trim(), direccion: form.direccion.trim() };
    const result = editing ? { ok: true, user: updateUser(decodeURIComponent(run), data) } : createUser(data);
    if (!result.ok) return setError(result.message);
    navigate("/admin/usuarios");
  };

  const selectedRegion = regiones.find((region) => region.nombre === form.region);

  return <div className="container py-5"><div className="row justify-content-center"><div className="col-lg-8"><div className="d-flex justify-content-between align-items-center mb-4"><div><span className="text-uppercase small text-secondary">Panel interno</span><h1 className="mb-1">{editing ? "Editar usuario" : "Nuevo usuario"}</h1></div><Link className="btn btn-outline-dark" to="/admin/usuarios">Volver</Link></div><form className="card border-0 shadow-sm p-4" onSubmit={submit} noValidate>{error && <div className="alert alert-danger" role="alert">{error}</div>}<div className="row g-3"><div className="col-md-4"><label className="form-label" htmlFor="userRun">RUN</label><input className="form-control" id="userRun" name="run" value={form.run} onChange={updateField} readOnly={editing} /></div><div className="col-md-4"><label className="form-label" htmlFor="userName">Nombre</label><input className="form-control" id="userName" name="nombre" value={form.nombre} onChange={updateField} /></div><div className="col-md-4"><label className="form-label" htmlFor="userLastName">Apellidos</label><input className="form-control" id="userLastName" name="apellidos" value={form.apellidos} onChange={updateField} /></div><div className="col-md-7"><label className="form-label" htmlFor="userEmail">Correo</label><input className="form-control" id="userEmail" name="correo" type="email" value={form.correo} onChange={updateField} /></div><div className="col-md-5"><label className="form-label" htmlFor="userType">Tipo de usuario</label><select className="form-select" id="userType" name="tipo" value={form.tipo} onChange={updateField}><option>Cliente</option><option>Administrador</option></select></div><div className="col-md-6"><label className="form-label" htmlFor="userPassword">Contraseña {editing && <small className="text-secondary">(vacío = conservar)</small>}</label><input className="form-control" id="userPassword" name="password" type="password" value={form.password} onChange={updateField} /></div><div className="col-md-6"><label className="form-label" htmlFor="userBirth">Fecha de nacimiento</label><input className="form-control" id="userBirth" name="fechaNacimiento" type="date" value={form.fechaNacimiento} onChange={updateField} /></div><div className="col-md-6"><label className="form-label" htmlFor="userRegion">Región</label><select className="form-select" id="userRegion" name="region" value={form.region} onChange={updateField}><option value="">Selecciona una región</option>{regiones.map((region) => <option key={region.nombre}>{region.nombre}</option>)}</select></div><div className="col-md-6"><label className="form-label" htmlFor="userCommune">Comuna</label><select className="form-select" id="userCommune" name="comuna" value={form.comuna} onChange={updateField} disabled={!selectedRegion}><option value="">Selecciona una comuna</option>{selectedRegion?.comunas.map((commune) => <option key={commune}>{commune}</option>)}</select></div><div className="col-12"><label className="form-label" htmlFor="userAddress">Dirección</label><input className="form-control" id="userAddress" name="direccion" value={form.direccion} onChange={updateField} /></div></div><div className="d-flex justify-content-end gap-2 mt-4"><Link className="btn btn-outline-secondary" to="/admin/usuarios">Cancelar</Link><button className="btn btn-dark" type="submit">Guardar usuario</button></div></form></div></div></div>;
}

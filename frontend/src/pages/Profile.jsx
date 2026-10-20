import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../App";
import { regiones } from "../services/usuarios";

export default function Profile() {
  const { session, updateUser } = useAuth();
  const [form, setForm] = useState({ nombre: session?.nombre || "", apellidos: session?.apellidos || "", correo: session?.correo || "", direccion: session?.direccion || "", region: session?.region || regiones[0].nombre, comuna: session?.comuna || "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const selectedRegion = regiones.find((region) => region.nombre === form.region) || regiones[0];

  const submit = (event) => {
    event.preventDefault();
    setError("");
    if (!form.nombre.trim() || !form.apellidos.trim() || !form.correo.trim()) return setError("Nombre, apellidos y correo son obligatorios.");
    updateUser(session.run, form);
    setMessage("Tus datos se actualizaron correctamente.");
  };

  return <section className="container py-5"><div className="row justify-content-center"><div className="col-lg-8"><div className="d-flex justify-content-between align-items-center mb-4"><div><span className="text-uppercase small text-secondary">Cuenta</span><h1 className="mb-1">Mi perfil</h1><p className="text-secondary mb-0">Actualiza tus datos personales y de entrega.</p></div><Link className="btn btn-outline-dark" to="/historial-compras">Mis compras</Link></div><div className="card border-0 shadow-sm p-4">{message && <div className="alert alert-success">{message}</div>}{error && <div className="alert alert-danger">{error}</div>}<form onSubmit={submit} noValidate><div className="row g-3"><div className="col-md-6"><label className="form-label" htmlFor="profileName">Nombre</label><input id="profileName" className="form-control" value={form.nombre} onChange={(event) => setForm({ ...form, nombre: event.target.value })} /></div><div className="col-md-6"><label className="form-label" htmlFor="profileLastName">Apellidos</label><input id="profileLastName" className="form-control" value={form.apellidos} onChange={(event) => setForm({ ...form, apellidos: event.target.value })} /></div><div className="col-12"><label className="form-label" htmlFor="profileEmail">Correo</label><input id="profileEmail" type="email" className="form-control" value={form.correo} onChange={(event) => setForm({ ...form, correo: event.target.value })} /></div><div className="col-md-6"><label className="form-label" htmlFor="profileRegion">Región</label><select id="profileRegion" className="form-select" value={form.region} onChange={(event) => setForm({ ...form, region: event.target.value, comuna: "" })}>{regiones.map((region) => <option key={region.nombre}>{region.nombre}</option>)}</select></div><div className="col-md-6"><label className="form-label" htmlFor="profileComuna">Comuna</label><select id="profileComuna" className="form-select" value={form.comuna} onChange={(event) => setForm({ ...form, comuna: event.target.value })}><option value="">Selecciona una comuna</option>{selectedRegion.comunas.map((comuna) => <option key={comuna}>{comuna}</option>)}</select></div><div className="col-12"><label className="form-label" htmlFor="profileAddress">Dirección</label><input id="profileAddress" className="form-control" value={form.direccion} onChange={(event) => setForm({ ...form, direccion: event.target.value })} /></div></div><button className="btn btn-dark mt-4" type="submit">Guardar cambios</button></form></div></div></div></section>;
}

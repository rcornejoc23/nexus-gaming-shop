import { useState } from "react";

const MESSAGE_KEY = "mensajesNexus";

export default function Contact() {
  const [form, setForm] = useState({ nombre: "", correo: "", mensaje: "" });
  const [message, setMessage] = useState("");

  const submit = (event) => {
    event.preventDefault();
    if (!form.nombre.trim() || !form.correo.trim() || !form.mensaje.trim()) return setMessage("Completa todos los campos para enviar tu mensaje.");
    const saved = JSON.parse(localStorage.getItem(MESSAGE_KEY) || "[]");
    localStorage.setItem(MESSAGE_KEY, JSON.stringify([{ ...form, fecha: new Date().toISOString() }, ...saved]));
    setForm({ nombre: "", correo: "", mensaje: "" });
    setMessage("Mensaje enviado correctamente. Te responderemos pronto.");
  };

  return <section className="container py-5"><div className="row justify-content-center"><div className="col-lg-8"><div className="card border-0 shadow-sm p-4"><span className="text-uppercase small text-secondary">Estamos para ayudarte</span><h1>Contacto</h1><p className="text-secondary">¿Tienes dudas sobre un producto o tu pedido? Escríbenos.</p>{message && <div className="alert alert-info">{message}</div>}<form onSubmit={submit} noValidate><div className="row g-3"><div className="col-md-6"><label className="form-label" htmlFor="contactName">Nombre</label><input id="contactName" className="form-control" value={form.nombre} onChange={(event) => setForm({ ...form, nombre: event.target.value })} /></div><div className="col-md-6"><label className="form-label" htmlFor="contactEmail">Correo</label><input id="contactEmail" type="email" className="form-control" value={form.correo} onChange={(event) => setForm({ ...form, correo: event.target.value })} /></div><div className="col-12"><label className="form-label" htmlFor="contactMessage">Mensaje</label><textarea id="contactMessage" className="form-control" rows="5" value={form.mensaje} onChange={(event) => setForm({ ...form, mensaje: event.target.value })} /></div></div><button className="btn btn-dark mt-4" type="submit">Enviar mensaje</button></form></div></div></div></section>;
}

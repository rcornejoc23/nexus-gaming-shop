import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStore } from "../App";
import { obtenerPrecioFinal } from "../services/precios";

const initialForm = {
  correo: "",
  nombre: "",
  apellidos: "",
  direccion: "",
  departamento: "",
  comuna: "",
  region: "Región Metropolitana",
  codigoPostal: "",
  telefono: "",
  entrega: "estandar",
  pago: "tarjeta",
  numeroTarjeta: "",
  vencimiento: "",
  cvv: ""
};

const formatPrice = (price) => `$${Number(price).toLocaleString("es-CL")}`;

export default function Checkout() {
  const { cart, completePurchase } = useStore();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");

  const subtotal = useMemo(() => cart.reduce((sum, item) => sum + obtenerPrecioFinal(item.product) * item.quantity, 0), [cart]);
  const shipping = form.entrega === "express" ? 4990 : 0;
  const total = subtotal + shipping;

  if (cart.length === 0) return <section className="container py-5"><div className="alert alert-info">No hay productos para comprar. <Link to="/productos">Volver a la tienda</Link></div></section>;

  const updateField = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  const submit = (event) => {
    event.preventDefault();
    setError("");

    const required = ["correo", "nombre", "apellidos", "direccion", "comuna", "region", "codigoPostal", "telefono"];
    if (required.some((field) => !form[field].trim())) return setError("Completa todos los datos de contacto y entrega.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.correo)) return setError("Ingresa un correo electrónico válido.");
    if (!/^\d{4,8}$/.test(form.codigoPostal)) return setError("El código postal debe tener entre 4 y 8 números.");
    if (!/^\+?[0-9\s-]{8,15}$/.test(form.telefono)) return setError("Ingresa un teléfono válido.");

    if (form.pago === "tarjeta") {
      const cardNumber = form.numeroTarjeta.replace(/\s/g, "");
      if (!/^\d{16}$/.test(cardNumber) || !/^\d{2}\/\d{2}$/.test(form.vencimiento) || !/^\d{3,4}$/.test(form.cvv)) return setError("Completa correctamente los datos de la tarjeta simulada.");
    }

    const receipt = {
      orderNumber: `NXS-${Date.now().toString().slice(-8)}`,
      createdAt: new Date().toLocaleString("es-CL"),
      customer: {
        nombre: `${form.nombre} ${form.apellidos}`.trim(),
        correo: form.correo,
        telefono: form.telefono,
        direccion: form.direccion,
        departamento: form.departamento,
        comuna: form.comuna,
        region: form.region,
        codigoPostal: form.codigoPostal
      },
      delivery: form.entrega === "express" ? "Envío express" : "Envío estándar",
      payment: form.pago === "tarjeta" ? "Tarjeta simulada" : "Transferencia bancaria",
      items: cart.map(({ product, quantity }) => ({
        nombre: product.nombre,
        quantity,
        precio: obtenerPrecioFinal(product)
      })),
      subtotal,
      shipping,
      total
    };

    const result = completePurchase(receipt);
    if (!result.ok) return navigate("/compra-fallida", { state: { message: result.message } });
    navigate("/compra-exitosa", { state: { receipt: result.pedido } });
  };

  return <section className="checkout-page container py-4 py-lg-5">
    <div className="checkout-header mb-4"><Link to="/carrito" className="text-decoration-none">← Volver al carrito</Link><h1 className="mt-3 mb-1">Finalizar compra</h1><p className="text-secondary mb-0">Completa tus datos para recibir tu pedido.</p></div>
    <form onSubmit={submit} noValidate>
      <div className="row g-4 align-items-start">
        <div className="col-lg-7">
          {error && <div className="alert alert-danger" role="alert">{error}</div>}
          <div className="checkout-card mb-3"><div className="checkout-section-heading"><span>1</span><div><h2>Contacto</h2><p>Recibirás la confirmación en este correo.</p></div></div><label className="form-label" htmlFor="checkoutEmail">Correo electrónico</label><input className="form-control" id="checkoutEmail" name="correo" type="email" placeholder="tu-correo@ejemplo.com" value={form.correo} onChange={updateField} autoComplete="email" /></div>

          <div className="checkout-card mb-3"><div className="checkout-section-heading"><span>2</span><div><h2>Datos de entrega</h2><p>Indica dónde quieres recibir tu compra.</p></div></div><div className="row g-3"><div className="col-md-6"><label className="form-label" htmlFor="checkoutName">Nombre</label><input className="form-control" id="checkoutName" name="nombre" value={form.nombre} onChange={updateField} autoComplete="given-name" /></div><div className="col-md-6"><label className="form-label" htmlFor="checkoutLastName">Apellidos</label><input className="form-control" id="checkoutLastName" name="apellidos" value={form.apellidos} onChange={updateField} autoComplete="family-name" /></div><div className="col-md-8"><label className="form-label" htmlFor="checkoutAddress">Dirección</label><input className="form-control" id="checkoutAddress" name="direccion" placeholder="Calle y número" value={form.direccion} onChange={updateField} autoComplete="street-address" /></div><div className="col-md-4"><label className="form-label" htmlFor="checkoutApartment">Depto. / casa <small className="text-secondary">(opcional)</small></label><input className="form-control" id="checkoutApartment" name="departamento" value={form.departamento} onChange={updateField} /></div><div className="col-md-6"><label className="form-label" htmlFor="checkoutRegion">Región</label><select className="form-select" id="checkoutRegion" name="region" value={form.region} onChange={updateField}><option>Región Metropolitana</option><option>Región de Valparaíso</option><option>Región del Biobío</option></select></div><div className="col-md-6"><label className="form-label" htmlFor="checkoutCity">Comuna</label><input className="form-control" id="checkoutCity" name="comuna" value={form.comuna} onChange={updateField} autoComplete="address-level2" /></div><div className="col-md-6"><label className="form-label" htmlFor="checkoutPostal">Código postal</label><input className="form-control" id="checkoutPostal" name="codigoPostal" inputMode="numeric" value={form.codigoPostal} onChange={updateField} /></div><div className="col-md-6"><label className="form-label" htmlFor="checkoutPhone">Teléfono</label><input className="form-control" id="checkoutPhone" name="telefono" type="tel" value={form.telefono} onChange={updateField} autoComplete="tel" /></div></div></div>

          <div className="checkout-card mb-3"><div className="checkout-section-heading"><span>3</span><div><h2>Método de entrega</h2><p>Elige cómo quieres recibir tu pedido.</p></div></div><label className={`checkout-option ${form.entrega === "estandar" ? "selected" : ""}`}><input type="radio" name="entrega" value="estandar" checked={form.entrega === "estandar"} onChange={updateField} /><span><strong>Envío estándar</strong><small>Entrega estimada entre 3 y 5 días hábiles</small></span><b>Gratis</b></label><label className={`checkout-option ${form.entrega === "express" ? "selected" : ""}`}><input type="radio" name="entrega" value="express" checked={form.entrega === "express"} onChange={updateField} /><span><strong>Envío express</strong><small>Entrega estimada entre 1 y 2 días hábiles</small></span><b>{formatPrice(4990)}</b></label></div>

          <div className="checkout-card mb-3"><div className="checkout-section-heading"><span>4</span><div><h2>Pago</h2><p>Este proyecto usa un pago simulado para la evaluación.</p></div></div><label className={`checkout-option ${form.pago === "tarjeta" ? "selected" : ""}`}><input type="radio" name="pago" value="tarjeta" checked={form.pago === "tarjeta"} onChange={updateField} /><span><strong>Tarjeta de crédito o débito</strong><small>Pago seguro simulado</small></span><span className="payment-icons">VISA · MC</span></label><label className={`checkout-option ${form.pago === "transferencia" ? "selected" : ""}`}><input type="radio" name="pago" value="transferencia" checked={form.pago === "transferencia"} onChange={updateField} /><span><strong>Transferencia bancaria</strong><small>Se mostrarán los datos después de confirmar</small></span></label>{form.pago === "tarjeta" && <div className="row g-3 mt-1"><div className="col-12"><label className="form-label" htmlFor="cardNumber">Número de tarjeta</label><input className="form-control" id="cardNumber" name="numeroTarjeta" inputMode="numeric" placeholder="0000 0000 0000 0000" maxLength="19" value={form.numeroTarjeta} onChange={updateField} /></div><div className="col-md-6"><label className="form-label" htmlFor="cardExpiry">Vencimiento</label><input className="form-control" id="cardExpiry" name="vencimiento" placeholder="MM/AA" maxLength="5" value={form.vencimiento} onChange={updateField} /></div><div className="col-md-6"><label className="form-label" htmlFor="cardCvv">CVV</label><input className="form-control" id="cardCvv" name="cvv" inputMode="numeric" placeholder="123" maxLength="4" value={form.cvv} onChange={updateField} /></div></div>}</div>
          <button className="btn btn-dark btn-lg w-100 checkout-submit" type="submit">Completar pedido · {formatPrice(total)}</button>
          <p className="small text-secondary text-center mt-3">Al completar el pedido se validará nuevamente el stock disponible.</p>
        </div>

        <div className="col-lg-5"><aside className="checkout-summary checkout-sticky"><h2>Resumen del pedido</h2><div className="checkout-summary-items">{cart.map((item) => <div className="checkout-summary-item" key={item.productId}><div className="checkout-product-image"><img src={item.product.imagen} alt={item.product.nombre} /><span>{item.quantity}</span></div><div className="flex-grow-1"><strong>{item.product.nombre}</strong><small>{item.product.categoria}</small></div><span>{formatPrice(obtenerPrecioFinal(item.product) * item.quantity)}</span></div>)}</div><div className="checkout-total-line"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div><div className="checkout-total-line"><span>Envío</span><span>{shipping === 0 ? "Gratis" : formatPrice(shipping)}</span></div><hr /><div className="checkout-total-line checkout-grand-total"><strong>Total</strong><strong>{formatPrice(total)}</strong></div><p className="checkout-secure-note">🔒 Tus datos se mantienen en este entorno local de demostración.</p></aside></div>
      </div>
    </form>
  </section>;
}

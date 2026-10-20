import { Link, useLocation } from "react-router-dom";

export default function PurchaseFailure() {
  const { state } = useLocation();
  return <section className="container py-5"><div className="alert alert-danger text-center"><h1>No se pudo completar la compra</h1><p>{state?.message || "Revisa los datos y el stock disponible."}</p><Link className="btn btn-outline-danger" to="/carrito">Volver al carrito</Link></div></section>;
}

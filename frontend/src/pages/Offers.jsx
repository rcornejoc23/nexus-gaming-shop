import { useStore } from "../App";
import ProductCard from "../components/ProductCard";

export default function Offers() {
  const { products } = useStore();
  const offers = products.filter((product) => Number(product.descuento) > 0);
  return <section className="container py-5"><h1>Ofertas</h1><p className="text-muted mb-4">Productos con descuento y precio final calculado.</p>{offers.length === 0 ? <div className="alert alert-info">No hay ofertas activas en este momento.</div> : <div className="row g-4">{offers.map((product) => <div className="col-sm-6 col-lg-4" key={product.id}><ProductCard product={product} /></div>)}</div>}</section>;
}

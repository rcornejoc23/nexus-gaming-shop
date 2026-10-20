import { Link } from "react-router-dom";
import { useStore } from "../App";
import { leerCategorias } from "../services/categorias";

export default function Categories() {
  const { products } = useStore();
  const categories = leerCategorias(products);
  return <section className="container py-5"><h1 className="mb-4">Categorías</h1><div className="row g-4">{categories.map((category) => <div className="col-sm-6 col-lg-4" key={category}><div className="card h-100 shadow-sm"><div className="card-body"><h2 className="h4">{category}</h2><p>{products.filter((product) => product.categoria === category).length} producto(s)</p><Link className="btn btn-outline-primary" to={`/productos?categoria=${encodeURIComponent(category)}`}>Ver productos</Link></div></div></div>)}</div></section>;
}

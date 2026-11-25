import { Link } from "react-router-dom";
import { useStore } from "../App";

export default function Categories() {
  const { products, categories } = useStore();
  return <section className="container py-5"><h1 className="mb-4">Categorías</h1><div className="row g-4">{categories.map((category) => <div className="col-sm-6 col-lg-4" key={category.id}><div className="card h-100 shadow-sm"><div className="card-body"><h2 className="h4">{category.nombre}</h2><p>{products.filter((product) => product.categoriaId === category.id).length} producto(s)</p><Link className="btn btn-outline-primary" to={`/productos?categoria=${encodeURIComponent(category.nombre)}`}>Ver productos</Link></div></div></div>)}</div></section>;
}

import { Link } from "react-router-dom";
import { useStore } from "../App";
import ProductCard from "../components/ProductCard";

export default function Home() {
  const { products } = useStore();
  return <><section className="hero-section py-5"><div className="container py-4"><div className="row align-items-center g-4"><div className="col-lg-7 text-white"><p className="text-uppercase fw-semibold mb-2">Nueva experiencia de compra</p><h1 className="display-4 fw-bold">Lleva tu setup al siguiente nivel</h1><p className="lead">Productos gaming, ofertas y una compra simple desde cualquier dispositivo.</p><Link className="btn btn-light btn-lg" to="/productos">Ver productos</Link></div><div className="col-lg-5"><img className="img-fluid rounded-4 shadow" src="/img/hero.jpg" alt="Equipamiento gamer" /></div></div></div></section><section className="container py-5"><div className="d-flex justify-content-between align-items-center mb-4"><h2>Productos destacados</h2><Link to="/ofertas">Ver ofertas</Link></div><div className="row g-4">{products.slice(0, 4).map((product) => <div className="col-sm-6 col-lg-3" key={product.id}><ProductCard product={product} /></div>)}</div></section></>;
}

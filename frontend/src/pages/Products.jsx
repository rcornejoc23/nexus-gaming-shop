import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useStore } from "../App";
import ProductCard from "../components/ProductCard";

export default function Products() {
  const { products } = useStore();
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(searchParams.get("categoria") || "");
  const categories = [...new Set(products.map((product) => product.categoria))];
  const visibleProducts = useMemo(() => products.filter((product) => product.nombre.toLowerCase().includes(search.toLowerCase()) && (!category || product.categoria === category)), [products, search, category]);

  return <section className="container py-5"><div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4"><div><h1>Productos</h1><p className="text-muted mb-0">Busca y filtra el catálogo disponible.</p></div><div className="d-flex gap-2"><input className="form-control" placeholder="Buscar producto" value={search} onChange={(event) => setSearch(event.target.value)} /><select className="form-select" value={category} onChange={(event) => setCategory(event.target.value)}><option value="">Todas las categorías</option>{categories.map((item) => <option key={item} value={item}>{item}</option>)}</select></div></div><div className="row g-4">{visibleProducts.map((product) => <div className="col-sm-6 col-lg-4" key={product.id}><ProductCard product={product} /></div>)}</div>{visibleProducts.length === 0 && <p className="alert alert-info">No encontramos productos con esos filtros.</p>}</section>;
}

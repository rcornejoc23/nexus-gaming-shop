import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useStore } from "../App";
import { leerCategorias } from "../services/categorias";

const emptyForm = { codigo: "", nombre: "", descripcion: "", precio: "", descuento: "0", stock: "", stockCritico: "", categoria: "Accesorios", imagen: "/img/hero.jpg" };

export default function AdminProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, createProduct, updateProduct } = useStore();
  const categories = leerCategorias(products);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const editing = Boolean(id);

  useEffect(() => {
    if (!id) return;
    const product = products.find((item) => item.id === Number(id));
    if (product) setForm({ ...product, precio: String(product.precio), descuento: String(product.descuento || 0), stock: String(product.stock), stockCritico: String(product.stockCritico) });
  }, [id, products]);

  const change = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  const submit = (event) => {
    event.preventDefault();
    const precio = Number(form.precio);
    const descuento = Number(form.descuento);
    const stock = Number(form.stock);
    const stockCritico = Number(form.stockCritico);
    if (!form.codigo.trim() || !form.nombre.trim() || !form.descripcion.trim()) return setError("Completa código, nombre y descripción.");
    if (!Number.isFinite(precio) || precio < 0) return setError("El precio no puede ser negativo.");
    if (!Number.isInteger(descuento) || descuento < 0 || descuento > 100) return setError("El descuento debe ser un entero entre 0 y 100.");
    if (!Number.isInteger(stock) || stock < 0) return setError("El stock debe ser un entero igual o mayor que cero.");
    if (!Number.isInteger(stockCritico) || stockCritico < 0) return setError("El stock crítico debe ser un entero igual o mayor que cero.");
    const data = { ...form, codigo: form.codigo.trim().toUpperCase(), nombre: form.nombre.trim(), descripcion: form.descripcion.trim(), precio, descuento, stock, stockCritico };
    if (editing) updateProduct(id, data); else createProduct(data);
    navigate("/admin/productos");
  };

  return <div className="container py-5"><div className="row justify-content-center"><div className="col-lg-8">
    <div className="d-flex justify-content-between align-items-center mb-4"><div><span className="text-uppercase small text-secondary">Panel interno</span><h1 className="mb-1">{editing ? "Editar producto" : "Nuevo producto"}</h1></div><Link className="btn btn-outline-dark" to="/admin/productos">Volver</Link></div>
    <form className="card border-0 shadow-sm p-4" onSubmit={submit} noValidate>
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      <div className="row g-3">
        <div className="col-md-4"><label className="form-label" htmlFor="codigo">Código</label><input className="form-control" id="codigo" name="codigo" value={form.codigo} onChange={change} /></div>
        <div className="col-md-8"><label className="form-label" htmlFor="nombre">Nombre</label><input className="form-control" id="nombre" name="nombre" value={form.nombre} onChange={change} /></div>
        <div className="col-12"><label className="form-label" htmlFor="descripcion">Descripción</label><textarea className="form-control" id="descripcion" name="descripcion" rows="3" value={form.descripcion} onChange={change} /></div>
        <div className="col-md-4"><label className="form-label" htmlFor="precio">Precio</label><input className="form-control" id="precio" name="precio" type="number" min="0" step="1" value={form.precio} onChange={change} /></div>
        <div className="col-md-4"><label className="form-label" htmlFor="descuento">Descuento (%)</label><input className="form-control" id="descuento" name="descuento" type="number" min="0" max="100" step="1" value={form.descuento} onChange={change} /></div>
        <div className="col-md-4"><label className="form-label" htmlFor="stock">Stock</label><input className="form-control" id="stock" name="stock" type="number" min="0" step="1" value={form.stock} onChange={change} /></div>
        <div className="col-md-4"><label className="form-label" htmlFor="stockCritico">Stock crítico</label><input className="form-control" id="stockCritico" name="stockCritico" type="number" min="0" step="1" value={form.stockCritico} onChange={change} /></div>
        <div className="col-md-6"><label className="form-label" htmlFor="categoria">Categoría</label><select className="form-select" id="categoria" name="categoria" value={form.categoria} onChange={change}>{categories.map((category) => <option key={category}>{category}</option>)}</select></div>
        <div className="col-md-6"><label className="form-label" htmlFor="imagen">Imagen</label><input className="form-control" id="imagen" name="imagen" value={form.imagen} onChange={change} /></div>
      </div>
      <div className="d-flex justify-content-end gap-2 mt-4"><Link className="btn btn-outline-secondary" to="/admin/productos">Cancelar</Link><button className="btn btn-dark" type="submit">Guardar producto</button></div>
    </form>
  </div></div></div>;
}

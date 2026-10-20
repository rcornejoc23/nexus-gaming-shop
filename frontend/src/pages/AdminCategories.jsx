import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useStore } from "../App";
import { guardarCategorias, leerCategorias } from "../services/categorias";

export default function AdminCategories() {
  const { products, updateCategory } = useStore();
  const [categories, setCategories] = useState(() => leerCategorias(products));
  const [newCategory, setNewCategory] = useState("");
  const [editing, setEditing] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => setCategories(leerCategorias(products)), [products]);

  const addCategory = (event) => {
    event.preventDefault();
    const name = newCategory.trim();
    if (!name) return setMessage("Escribe un nombre para la categoría.");
    if (categories.some((category) => category.toLowerCase() === name.toLowerCase())) return setMessage("La categoría ya existe.");
    setCategories(guardarCategorias([...categories, name]));
    setNewCategory("");
    setMessage("Categoría creada correctamente.");
  };

  const renameCategory = (category) => {
    const name = editingName.trim();
    if (!name) return setMessage("El nombre no puede quedar vacío.");
    if (categories.some((item) => item !== category && item.toLowerCase() === name.toLowerCase())) return setMessage("Ya existe otra categoría con ese nombre.");
    updateCategory(category, name);
    setCategories(guardarCategorias(categories.map((item) => item === category ? name : item)));
    setEditing(null);
    setMessage("Categoría actualizada y productos sincronizados.");
  };

  const removeCategory = (category) => {
    if (products.some((product) => product.categoria === category)) return setMessage("No puedes eliminar una categoría que tiene productos asociados.");
    setCategories(guardarCategorias(categories.filter((item) => item !== category)));
    setMessage("Categoría eliminada.");
  };

  return <div className="container py-5">
    <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4"><div><span className="text-uppercase small text-secondary">Panel interno</span><h1 className="mb-1">Categorías</h1><p className="text-secondary mb-0">Organiza el catálogo y sincroniza sus productos.</p></div><Link className="btn btn-outline-dark" to="/admin">Volver al resumen</Link></div>
    {message && <div className="alert alert-info" role="alert">{message}</div>}
    <form className="card border-0 shadow-sm p-3 mb-4" onSubmit={addCategory}><div className="row g-2 align-items-end"><div className="col-md-8"><label className="form-label" htmlFor="newCategory">Nueva categoría</label><input id="newCategory" className="form-control" value={newCategory} onChange={(event) => setNewCategory(event.target.value)} placeholder="Ej: Monitores" /></div><div className="col-md-4"><button className="btn btn-dark w-100" type="submit">Agregar categoría</button></div></div></form>
    <div className="table-responsive bg-white rounded shadow-sm"><table className="table align-middle mb-0"><thead><tr><th>Nombre</th><th>Productos asociados</th><th>Acciones</th></tr></thead><tbody>{categories.map((category) => <tr key={category}><td>{editing === category ? <input className="form-control" value={editingName} onChange={(event) => setEditingName(event.target.value)} /> : <strong>{category}</strong>}</td><td>{products.filter((product) => product.categoria === category).length}</td><td>{editing === category ? <div className="d-flex gap-2"><button className="btn btn-sm btn-primary" type="button" onClick={() => renameCategory(category)}>Guardar</button><button className="btn btn-sm btn-outline-secondary" type="button" onClick={() => setEditing(null)}>Cancelar</button></div> : <div className="d-flex gap-2"><button className="btn btn-sm btn-outline-primary" type="button" onClick={() => { setEditing(category); setEditingName(category); }}>Editar</button><button className="btn btn-sm btn-outline-danger" type="button" onClick={() => removeCategory(category)}>Eliminar</button></div>}</td></tr>)}</tbody></table></div>
  </div>;
}

import { useState } from "react";
import { Link } from "react-router-dom";
import { useStore } from "../App";

export default function AdminCategories() {
  const { products, categories, createCategory, updateCategory, deleteCategory } = useStore();
  const [newCategory, setNewCategory] = useState("");
  const [editing, setEditing] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [message, setMessage] = useState("");

  // Ejecuta la acción en la API y muestra el resultado o el error del servidor
  const ejecutar = async (accion, exito) => {
    try {
      await accion();
      setMessage(exito);
      return true;
    } catch (err) {
      setMessage(err.message);
      return false;
    }
  };

  const addCategory = async (event) => {
    event.preventDefault();
    const name = newCategory.trim();
    if (!name) return setMessage("Escribe un nombre para la categoría.");
    if (await ejecutar(() => createCategory(name), "Categoría creada correctamente.")) setNewCategory("");
  };

  const renameCategory = async (category) => {
    const name = editingName.trim();
    if (!name) return setMessage("El nombre no puede quedar vacío.");
    if (await ejecutar(() => updateCategory(category.id, name), "Categoría actualizada.")) setEditing(null);
  };

  const removeCategory = (category) => {
    if (window.confirm(`¿Eliminar ${category.nombre}?`)) return ejecutar(() => deleteCategory(category.id), "Categoría eliminada.");
  };

  return <div className="container py-5">
    <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4"><div><span className="text-uppercase small text-secondary">Panel interno</span><h1 className="mb-1">Categorías</h1><p className="text-secondary mb-0">Organiza el catálogo y sincroniza sus productos.</p></div><Link className="btn btn-outline-dark" to="/admin">Volver al resumen</Link></div>
    {message && <div className="alert alert-info" role="alert">{message}</div>}
    <form className="card border-0 shadow-sm p-3 mb-4" onSubmit={addCategory}><div className="row g-2 align-items-end"><div className="col-md-8"><label className="form-label" htmlFor="newCategory">Nueva categoría</label><input id="newCategory" className="form-control" value={newCategory} onChange={(event) => setNewCategory(event.target.value)} placeholder="Ej: Monitores" /></div><div className="col-md-4"><button className="btn btn-dark w-100" type="submit">Agregar categoría</button></div></div></form>
    <div className="table-responsive bg-white rounded shadow-sm"><table className="table align-middle mb-0"><thead><tr><th>Nombre</th><th>Productos asociados</th><th>Acciones</th></tr></thead><tbody>{categories.map((category) => <tr key={category.id}><td>{editing === category.id ? <input className="form-control" value={editingName} onChange={(event) => setEditingName(event.target.value)} /> : <strong>{category.nombre}</strong>}</td><td>{products.filter((product) => product.categoriaId === category.id).length}</td><td>{editing === category.id ? <div className="d-flex gap-2"><button className="btn btn-sm btn-primary" type="button" onClick={() => renameCategory(category)}>Guardar</button><button className="btn btn-sm btn-outline-secondary" type="button" onClick={() => setEditing(null)}>Cancelar</button></div> : <div className="d-flex gap-2"><button className="btn btn-sm btn-outline-primary" type="button" onClick={() => { setEditing(category.id); setEditingName(category.nombre); }}>Editar</button><button className="btn btn-sm btn-outline-danger" type="button" onClick={() => removeCategory(category)}>Eliminar</button></div>}</td></tr>)}</tbody></table></div>
  </div>;
}

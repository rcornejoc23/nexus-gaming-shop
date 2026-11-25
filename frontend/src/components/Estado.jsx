// Muestra el indicador de carga o el error de una consulta
export default function Estado({ error }) {
  if (error) return <section className="container py-5"><div className="alert alert-danger" role="alert">{error}</div></section>;
  return <section className="container py-5 text-center"><div className="spinner-border" role="status"><span className="visually-hidden">Cargando...</span></div></section>;
}

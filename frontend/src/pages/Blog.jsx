const posts = [
  { title: "Cómo elegir un mouse gamer", text: "Revisa el tipo de agarre, el peso y la sensibilidad que necesitas para tu estilo de juego." },
  { title: "Ordena tu escritorio", text: "Un mousepad amplio y un soporte para audífonos ayudan a mantener tu setup cómodo y organizado." },
  { title: "Cuida tus periféricos", text: "La limpieza periódica y un almacenamiento correcto prolongan la vida útil de tus accesorios." }
];

export default function Blog() {
  return <section className="container py-5"><div className="mb-4"><span className="text-uppercase small text-secondary">Consejos NEXUS</span><h1 className="mb-1">Blog</h1><p className="text-secondary">Ideas simples para mejorar tu espacio de juego.</p></div><div className="row g-4">{posts.map((post) => <div className="col-md-4" key={post.title}><article className="card h-100 border-0 shadow-sm"><div className="card-body"><span className="badge text-bg-primary mb-3">Gaming</span><h2 className="h4">{post.title}</h2><p className="text-secondary mb-0">{post.text}</p></div></article></div>)}</div></section>;
}

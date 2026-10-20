
import { useState } from 'react'
import { Container, Row, Col, Button } from 'react-bootstrap'
import ProductoCard from './ProductoCard'

function Categorias({
  productos,
  verDetalle,
  agregarCarrito,
  obtenerStockDisponible
}) {

  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todas')

  // Obtener categorías guardadas por el administrador
  let categoriasGuardadas = []

  try {
    const guardadas = JSON.parse(
      localStorage.getItem('categoriasNexus') || '[]'
    )

    if (Array.isArray(guardadas)) {
      categoriasGuardadas = guardadas.filter(
        (categoria) => typeof categoria === 'string'
      )
    }
  } catch {
    categoriasGuardadas = []
  }

  // Unir categorías guardadas y categorías de los productos
  const categorias = [
    'Todas',
    ...new Set([
      ...categoriasGuardadas,
      ...productos.map((producto) => producto.categoria)
    ])
  ]

  // Filtrar productos según la categoría seleccionada
  const productosFiltrados = categoriaSeleccionada === 'Todas'
    ? productos
    : productos.filter(
      (producto) => producto.categoria === categoriaSeleccionada
    )

  return (
    <Container className="mt-4 mb-4">

      <h2 className="mb-4">Categorías de Productos</h2>

      <div className="mb-4">

        {categorias.map((categoria) => (
          <Button
            key={categoria}
            variant={
              categoriaSeleccionada === categoria
                ? 'primary'
                : 'outline-primary'
            }
            className="me-2 mb-2"
            onClick={() => setCategoriaSeleccionada(categoria)}
          >
            {categoria}
          </Button>
        ))}

      </div>

      <h4 className="mb-3">
        {categoriaSeleccionada === 'Todas'
          ? 'Todos los productos'
          : categoriaSeleccionada}
      </h4>

      <Row>

        {productosFiltrados.map((producto) => (
          <Col md={4} className="mb-4" key={producto.id}>
            <ProductoCard
              producto={producto}
              verDetalle={verDetalle}
              agregarCarrito={agregarCarrito}
              stockDisponible={obtenerStockDisponible(producto)}
            />
          </Col>
        ))}

      </Row>

      {productosFiltrados.length === 0 && (
        <p>No hay productos disponibles en esta categoría.</p>
      )}

    </Container>
  )
}

export default Categorias

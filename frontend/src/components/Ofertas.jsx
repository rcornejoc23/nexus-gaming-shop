
import { Container, Row, Col, Alert } from 'react-bootstrap'
import ProductoCard from './ProductoCard'

function Ofertas({
  productos,
  verDetalle,
  agregarCarrito,
  obtenerStockDisponible
}) {

  // Obtener solamente los productos en oferta
  const productosEnOferta = productos.filter(
    (producto) => producto.descuento > 0
  )

  return (
    <Container className="mt-4 mb-4">

      <h2 className="mb-4">
        Ofertas Especiales
      </h2>

      <p>
        Descubre nuestros productos con descuentos especiales.
      </p>

      {productosEnOferta.length === 0 ? (

        <Alert variant="info">
          Actualmente no hay productos en oferta.
        </Alert>

      ) : (

        <Row>

          {productosEnOferta.map((producto) => (

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

      )}

    </Container>
  )
}

export default Ofertas

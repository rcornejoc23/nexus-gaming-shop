
import { Container, Row, Col, Card, Button } from 'react-bootstrap'

function Inicio({ cambiarVista, productos }) {

  const cantidadProductos = productos.length

  const cantidadOfertas = productos.filter(
    (producto) => (producto.descuento || 0) > 0
  ).length

  return (
    <Container className="mt-4 mb-4">

      <div className="bg-dark text-white p-5 rounded mb-4">

        <h1>NEXUS Gaming Shop</h1>

        <p className="fs-5">
          Tu tienda de productos y accesorios gaming.
          Encuentra todo lo que necesitas para mejorar
          tu experiencia de juego.
        </p>

        <Button
          variant="success"
          className="me-2 mb-2"
          onClick={() => cambiarVista('productos')}
        >
          Ver Productos
        </Button>

        <Button
          variant="outline-light"
          className="mb-2"
          onClick={() => cambiarVista('ofertas')}
        >
          Ver Ofertas
        </Button>

      </div>

      <h2 className="mb-4">Explora nuestra tienda</h2>

      <Row>

        <Col md={4} className="mb-3">
          <Card className="h-100">
            <Card.Body>

              <Card.Title>Productos Gaming</Card.Title>

              <Card.Text>
                Explora nuestro catálogo de teclados,
                mouse, audífonos, controles y accesorios.
              </Card.Text>

              <p className="fw-bold">
                {cantidadProductos} productos disponibles en el catálogo
              </p>

              <Button
                variant="primary"
                onClick={() => cambiarVista('productos')}
              >
                Explorar Productos
              </Button>

            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className="mb-3">
          <Card className="h-100">
            <Card.Body>

              <Card.Title>Ofertas Especiales</Card.Title>

              <Card.Text>
                Aprovecha los descuentos disponibles
                en nuestros productos seleccionados.
              </Card.Text>

              <p className="fw-bold">
                {cantidadOfertas} productos en oferta
              </p>

              <Button
                variant="danger"
                onClick={() => cambiarVista('ofertas')}
              >
                Ver Ofertas
              </Button>

            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className="mb-3">
          <Card className="h-100">
            <Card.Body>

              <Card.Title>Conoce NEXUS</Card.Title>

              <Card.Text>
                Descubre quiénes somos, nuestra misión
                y nuestra visión como tienda gaming.
              </Card.Text>

              <Button
                variant="secondary"
                onClick={() => cambiarVista('nosotros')}
              >
                Sobre Nosotros
              </Button>

            </Card.Body>
          </Card>
        </Col>

      </Row>

    </Container>
  )
}

export default Inicio

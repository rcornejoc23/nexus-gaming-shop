
import { Container, Row, Col, Card } from 'react-bootstrap'

function Nosotros() {

  return (
    <Container className="mt-4 mb-4">

      <h2 className="mb-4">Sobre Nosotros</h2>

      <Row className="justify-content-center">

        <Col md={10}>

          <Card className="mb-4">
            <Card.Body>

              <Card.Title>
                Bienvenidos a NEXUS Gaming Shop
              </Card.Title>

              <Card.Text>
                Somos una tienda dedicada a ofrecer productos
                y accesorios para los amantes de los videojuegos
                y la tecnología.
              </Card.Text>

              <Card.Text>
                Nuestro catálogo incluye teclados mecánicos,
                mouse gamer, audífonos, controles y accesorios
                para mejorar la experiencia de juego.
              </Card.Text>

            </Card.Body>
          </Card>

          <Row>

            <Col md={6} className="mb-3">
              <Card className="h-100">
                <Card.Body>

                  <Card.Title>Nuestra Misión</Card.Title>

                  <Card.Text>
                    Ofrecer productos gaming de calidad,
                    con una experiencia de compra sencilla,
                    accesible y confiable.
                  </Card.Text>

                </Card.Body>
              </Card>
            </Col>

            <Col md={6} className="mb-3">
              <Card className="h-100">
                <Card.Body>

                  <Card.Title>Nuestra Visión</Card.Title>

                  <Card.Text>
                    Convertirnos en una tienda reconocida
                    por nuestra variedad de productos,
                    atención al cliente e innovación.
                  </Card.Text>

                </Card.Body>
              </Card>
            </Col>

          </Row>

        </Col>

      </Row>

    </Container>
  )
}

export default Nosotros

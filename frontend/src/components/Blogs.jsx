
import { useState } from 'react'
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap'

const publicaciones = [
  {
    id: 1,
    titulo: 'Cómo elegir un teclado mecánico gamer',
    categoria: 'Periféricos',
    fecha: '10/10/2026',
    resumen: 'Conoce los aspectos más importantes al elegir un teclado mecánico.',
    contenido: 'Los teclados mecánicos son una excelente alternativa para quienes buscan precisión y comodidad. Al elegir uno, considera el tipo de interruptores, la distribución de teclas, la iluminación y la calidad de construcción.'
  },
  {
    id: 2,
    titulo: 'Consejos para mejorar tu setup gaming',
    categoria: 'Gaming',
    fecha: '12/10/2026',
    resumen: 'Descubre cómo organizar tu espacio de juego.',
    contenido: 'Un buen setup gaming debe combinar comodidad y funcionalidad. Organiza los cables, ajusta la altura del monitor, utiliza una silla adecuada y procura mantener una buena iluminación en tu escritorio.'
  },
  {
    id: 3,
    titulo: '¿Qué considerar al comprar audífonos gamer?',
    categoria: 'Audio',
    fecha: '15/10/2026',
    resumen: 'Aprende a identificar las características de unos buenos audífonos.',
    contenido: 'Al comprar audífonos gamer, considera la comodidad, la calidad del micrófono, la conexión y el sonido. También es importante revisar la compatibilidad con tu computador o consola.'
  }
]

function Blogs() {

  const [publicacionSeleccionada, setPublicacionSeleccionada] = useState(null)

  return (
    <Container className="mt-4 mb-4">

      {publicacionSeleccionada === null ? (
        <>
          <h2 className="mb-4">Blog NEXUS Gaming Shop</h2>

          <p>
            Noticias, recomendaciones y consejos para los amantes del gaming.
          </p>

          <Row>
            {publicaciones.map((publicacion) => (
              <Col md={4} className="mb-4" key={publicacion.id}>
                <Card className="h-100">

                  <Card.Body className="d-flex flex-column">

                    <Badge bg="primary" className="mb-3 align-self-start">
                      {publicacion.categoria}
                    </Badge>

                    <Card.Title>
                      {publicacion.titulo}
                    </Card.Title>

                    <Card.Text className="text-muted">
                      {publicacion.fecha}
                    </Card.Text>

                    <Card.Text>
                      {publicacion.resumen}
                    </Card.Text>

                    <Button
                      variant="primary"
                      className="mt-auto"
                      onClick={() => setPublicacionSeleccionada(publicacion)}
                    >
                      Leer más
                    </Button>

                  </Card.Body>

                </Card>
              </Col>
            ))}
          </Row>
        </>
      ) : (
        <>
          <Button
            variant="secondary"
            className="mb-4"
            onClick={() => setPublicacionSeleccionada(null)}
          >
            Volver al Blog
          </Button>

          <Card>
            <Card.Body>

              <Badge bg="primary" className="mb-3">
                {publicacionSeleccionada.categoria}
              </Badge>

              <h2>{publicacionSeleccionada.titulo}</h2>

              <p className="text-muted">
                Publicado el {publicacionSeleccionada.fecha}
              </p>

              <hr />

              <p>{publicacionSeleccionada.contenido}</p>

            </Card.Body>
          </Card>
        </>
      )}

    </Container>
  )
}

export default Blogs

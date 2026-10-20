
import { Container, Card, Button, Alert } from 'react-bootstrap'

function CompraFallida({ mensajeError, volverCarrito }) {

  return (
    <Container className="mt-4 mb-4">

      <Card className="text-center">

        <Card.Body>

          <Alert variant="danger">
            <h2>Compra Fallida</h2>
            <p>No fue posible completar tu compra.</p>
          </Alert>

          <p>
            {mensajeError}
          </p>

          <p>
            Revisa tu carrito e intenta nuevamente.
          </p>

          <Button
            variant="secondary"
            onClick={volverCarrito}
          >
            Volver al Carrito
          </Button>

        </Card.Body>

      </Card>

    </Container>
  )
}

export default CompraFallida

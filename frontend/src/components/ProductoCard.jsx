
import { Card, Button, Badge } from 'react-bootstrap'

function ProductoCard({
  producto,
  verDetalle,
  agregarCarrito,
  stockDisponible
}) {

  // Obtener el descuento del producto
  const descuento = producto.descuento || 0

  // Calcular el precio con descuento
  const precioFinal = Math.round(
    producto.precio * (1 - descuento / 100)
  )

  return (
    <Card className="h-100">

      <Card.Img
        variant="top"
        src={producto.imagen}
        style={{
          height: '200px',
          objectFit: 'cover'
        }}
      />

      <Card.Body>

        <Card.Title>
          {producto.nombre}
        </Card.Title>

        {descuento > 0 && (
          <Badge bg="danger" className="mb-2">
            {descuento}% de descuento
          </Badge>
        )}

        <Card.Text>
          {producto.descripcion}
        </Card.Text>

        {descuento > 0 ? (
          <>
            <Card.Text className="mb-1">
              <del>
                Precio original: $
                {producto.precio.toLocaleString('es-CL')}
              </del>
            </Card.Text>

            <Card.Text className="text-success fw-bold">
              Precio oferta: $
              {precioFinal.toLocaleString('es-CL')}
            </Card.Text>
          </>
        ) : (
          <Card.Text>
            Precio: $
            {producto.precio.toLocaleString('es-CL')}
          </Card.Text>
        )}

        <Card.Text>
          Stock: {stockDisponible}
        </Card.Text>

        <Button
          variant="primary"
          className="me-2 mb-2"
          onClick={() => verDetalle(producto)}
        >
          Ver producto
        </Button>

        <Button
          variant="success"
          className="mb-2"
          disabled={stockDisponible === 0}
          onClick={() => agregarCarrito(producto)}
        >
          Añadir al carrito
        </Button>

      </Card.Body>

    </Card>
  )
}

export default ProductoCard

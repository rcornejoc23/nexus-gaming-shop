
import { Table, Button, Alert } from 'react-bootstrap'

function Carrito({
  carrito,
  eliminarProducto,
  aumentarCantidad,
  disminuirCantidad,
  irCheckout,
  stockDisponible
}) {

  // Calcular el precio final de cada producto
  const calcularPrecioFinal = (producto) => {
    const descuento = producto.descuento || 0

    return Math.round(
      producto.precio * (1 - descuento / 100)
    )
  }

  // Calcular el total del carrito con descuentos
  const total = carrito.reduce((acumulador, item) => {
    const precioFinal = calcularPrecioFinal(item.producto)

    return acumulador + precioFinal * item.cantidad
  }, 0)

  return (
    <>
      <h2 className="mb-4">Carrito de Compras</h2>

      {carrito.length === 0 ? (

        <Alert variant="info">
          Tu carrito está vacío.
        </Alert>

      ) : (

        <>
          <Table striped bordered hover responsive>

            <thead>
              <tr>
                <th>Producto</th>
                <th>Precio unitario</th>
                <th>Cantidad</th>
                <th>Subtotal</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>

              {carrito.map((item) => {

                const precioFinal = calcularPrecioFinal(item.producto)
                const subtotal = precioFinal * item.cantidad

                return (
                  <tr key={item.producto.id}>

                    <td>
                      {item.producto.nombre}

                      {(item.producto.descuento || 0) > 0 && (
                        <div className="text-success">
                          Descuento: {item.producto.descuento}%
                        </div>
                      )}
                    </td>

                    <td>
                      ${precioFinal.toLocaleString('es-CL')}
                    </td>

                    <td>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => disminuirCantidad(item.producto.id)}
                      >
                        -
                      </Button>

                      <span className="mx-3">
                        {item.cantidad}
                      </span>

                      <Button
                        variant="secondary"
                        size="sm"
                        disabled={stockDisponible(item.producto) <= 0}
                        onClick={() => aumentarCantidad(item.producto.id)}
                      >
                        +
                      </Button>
                    </td>

                    <td>
                      ${subtotal.toLocaleString('es-CL')}
                    </td>

                    <td>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => eliminarProducto(item.producto.id)}
                      >
                        Eliminar
                      </Button>
                    </td>

                  </tr>
                )
              })}

            </tbody>

          </Table>

          <h4 className="text-end">
            Total: ${total.toLocaleString('es-CL')}
          </h4>

          <div className="text-end mt-3">
            <Button
              variant="success"
              onClick={irCheckout}
            >
              Proceder al pago
            </Button>
          </div>

        </>

      )}

    </>
  )
}

export default Carrito

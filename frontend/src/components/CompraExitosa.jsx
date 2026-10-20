
import { Container, Card, Table, Button, Alert } from 'react-bootstrap'

function CompraExitosa({ datosCliente, total, pedido, volverInicio }) {

  function imprimirBoleta() {
    window.print()
  }

  return (
    <Container className="mt-4 mb-4">

      <Card>

        <Card.Body>

          <Alert variant="success" className="text-center">
            <h2>¡Compra Exitosa!</h2>
            <p>Tu compra se ha realizado correctamente.</p>
          </Alert>

          <h3 className="text-center mb-4">
            NEXUS Gaming Shop
          </h3>

          <h4>Boleta de compra</h4>

          <p>
            <strong>Número de pedido:</strong> {pedido.id}
          </p>

          <p>
            <strong>Fecha:</strong> {pedido.fecha}
          </p>

          <p>
            <strong>Cliente:</strong> {datosCliente.nombre}
          </p>

          <p>
            <strong>Correo:</strong> {datosCliente.correo}
          </p>

          <p>
            <strong>Tipo de entrega:</strong>{' '}
            {datosCliente.tipoEntrega === 'domicilio'
              ? 'Despacho a domicilio'
              : 'Retiro en tienda'}
          </p>

          <p>
            <strong>Dirección:</strong> {datosCliente.direccion}
          </p>

          <h5 className="mt-4">Detalle del pedido</h5>

          <Table striped bordered responsive>

            <thead>
              <tr>
                <th>Producto</th>
                <th>Precio unitario</th>
                <th>Cantidad</th>
                <th>Subtotal</th>
              </tr>
            </thead>

            <tbody>
              {pedido.productos.map((producto, index) => (
                <tr key={index}>
                  <td>{producto.nombre}</td>

                  <td>
                    ${producto.precio.toLocaleString('es-CL')}
                  </td>

                  <td>{producto.cantidad}</td>

                  <td>
                    ${(producto.precio * producto.cantidad)
                      .toLocaleString('es-CL')}
                  </td>
                </tr>
              ))}
            </tbody>

          </Table>

          <h4 className="text-end mt-4">
            Total pagado: ${total.toLocaleString('es-CL')}
          </h4>

          <p>
            <strong>Estado del pedido:</strong> {pedido.estado}
          </p>

          <div className="d-flex justify-content-center gap-3 mt-4 d-print-none">

            <Button
              variant="success"
              onClick={imprimirBoleta}
            >
              Imprimir boleta
            </Button>

            <Button
              variant="primary"
              onClick={volverInicio}
            >
              Volver a Productos
            </Button>

          </div>

        </Card.Body>

      </Card>

    </Container>
  )
}

export default CompraExitosa

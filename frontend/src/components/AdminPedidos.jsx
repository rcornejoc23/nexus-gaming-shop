
import { useState } from 'react'
import {
  Container,
  Card,
  Table,
  Button,
  Alert,
  Badge,
  Form
} from 'react-bootstrap'

function AdminPedidos() {

  const [pedidos, setPedidos] = useState(() => {
    try {
      const guardados = JSON.parse(
        localStorage.getItem('pedidosNexus') || '[]'
      )
      return Array.isArray(guardados) ? guardados : []
    } catch {
      return []
    }
  })

  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null)
  const [mensaje, setMensaje] = useState('')

  function formatoPrecio(valor) {
    return '$' + Number(valor).toLocaleString('es-CL')
  }

  function cambiarEstado(id, nuevoEstado) {
    const actualizados = pedidos.map((pedido) =>
      pedido.id === id
        ? { ...pedido, estado: nuevoEstado }
        : pedido
    )

    setPedidos(actualizados)

    localStorage.setItem(
      'pedidosNexus',
      JSON.stringify(actualizados)
    )

    if (pedidoSeleccionado?.id === id) {
      setPedidoSeleccionado(
        actualizados.find((pedido) => pedido.id === id)
      )
    }

    setMensaje('Estado del pedido actualizado correctamente.')
  }

  function colorEstado(estado) {
    if (estado === 'Entregado') return 'success'
    if (estado === 'En preparación') return 'warning'
    return 'primary'
  }

  return (
    <Container className="mt-4 mb-4">

      <h2>Administración de Pedidos</h2>

      <p>Consulta y administra las compras realizadas en la tienda.</p>

      {mensaje && (
        <Alert variant="success">{mensaje}</Alert>
      )}

      {pedidoSeleccionado === null ? (
        <>
          {pedidos.length === 0 ? (
            <Alert variant="info">
              Todavía no existen pedidos registrados.
            </Alert>
          ) : (
            <Card>
              <Card.Body>
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>N.º Pedido</th>
                      <th>Fecha</th>
                      <th>Cliente</th>
                      <th>Total</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>

                  <tbody>
                    {pedidos.map((pedido) => (
                      <tr key={pedido.id}>
                        <td>{pedido.id}</td>
                        <td>{pedido.fecha}</td>
                        <td>{pedido.cliente?.nombre}</td>
                        <td>{formatoPrecio(pedido.total)}</td>

                        <td>
                          <Badge bg={colorEstado(pedido.estado)}>
                            {pedido.estado}
                          </Badge>
                        </td>

                        <td>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => {
                              setPedidoSeleccionado(pedido)
                              setMensaje('')
                            }}
                          >
                            Ver Detalle
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          )}
        </>
      ) : (
        <>
          <div className="d-flex gap-2 mb-3 d-print-none">
            <Button
              variant="secondary"
              onClick={() => {
                setPedidoSeleccionado(null)
                setMensaje('')
              }}
            >
              Volver a Pedidos
            </Button>

            <Button
              variant="success"
              onClick={() => window.print()}
            >
              Imprimir Pedido
            </Button>
          </div>

          <Card>
            <Card.Header>
              <h4>
                Detalle del Pedido N.º {pedidoSeleccionado.id}
              </h4>
            </Card.Header>

            <Card.Body>
              <p>
                <strong>Fecha:</strong> {pedidoSeleccionado.fecha}
              </p>

              <p>
                <strong>Cliente:</strong>{' '}
                {pedidoSeleccionado.cliente?.nombre}
              </p>

              <p>
                <strong>Correo:</strong>{' '}
                {pedidoSeleccionado.cliente?.correo}
              </p>

              <p>
                <strong>Dirección:</strong>{' '}
                {pedidoSeleccionado.cliente?.direccion}
              </p>

              <p>
                <strong>Tipo de entrega:</strong>{' '}
                {pedidoSeleccionado.cliente?.tipoEntrega === 'retiro'
                  ? 'Retiro en tienda'
                  : pedidoSeleccionado.cliente?.tipoEntrega === 'domicilio'
                    ? 'Despacho a domicilio'
                    : 'No especificado'}
              </p>

              <div className="mb-4 d-print-none">
                <Form.Label>
                  <strong>Actualizar estado del pedido</strong>
                </Form.Label>

                <Form.Select
                  value={pedidoSeleccionado.estado || 'Confirmado'}
                  onChange={(e) =>
                    cambiarEstado(
                      pedidoSeleccionado.id,
                      e.target.value
                    )
                  }
                >
                  <option value="Confirmado">Confirmado</option>
                  <option value="En preparación">En preparación</option>
                  <option value="Entregado">Entregado</option>
                </Form.Select>
              </div>

              <p>
                <strong>Estado:</strong>{' '}
                <Badge bg={colorEstado(pedidoSeleccionado.estado)}>
                  {pedidoSeleccionado.estado}
                </Badge>
              </p>

              <h5>Productos Comprados</h5>

              <Table striped bordered responsive>
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Precio Unitario</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>

                <tbody>
                  {pedidoSeleccionado.productos?.map(
                    (producto, index) => (
                      <tr key={index}>
                        <td>{producto.codigo}</td>
                        <td>{producto.nombre}</td>
                        <td>{producto.cantidad}</td>
                        <td>{formatoPrecio(producto.precio)}</td>
                        <td>
                          {formatoPrecio(
                            producto.precio * producto.cantidad
                          )}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </Table>

              <h4 className="text-end">
                Total: {formatoPrecio(pedidoSeleccionado.total)}
              </h4>
            </Card.Body>
          </Card>
        </>
      )}

    </Container>
  )
}

export default AdminPedidos

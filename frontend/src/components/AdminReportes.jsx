
import { useState } from 'react'
import {
  Container,
  Card,
  Row,
  Col,
  Table,
  Alert,
  Badge
} from 'react-bootstrap'

function AdminReportes({ productos }) {

  const [pedidos] = useState(() => {
    try {
      const guardados = JSON.parse(
        localStorage.getItem('pedidosNexus') || '[]'
      )

      return Array.isArray(guardados) ? guardados : []
    } catch {
      return []
    }
  })

  function formatoPrecio(valor) {
    return '$' + Number(valor).toLocaleString('es-CL')
  }

  const totalVentas = pedidos.reduce(
    (total, pedido) => total + Number(pedido.total || 0),
    0
  )

  const totalProductosVendidos = pedidos.reduce(
    (total, pedido) =>
      total + (pedido.productos || []).reduce(
        (subtotal, producto) =>
          subtotal + Number(producto.cantidad || 0),
        0
      ),
    0
  )

  const productosCriticos = productos.filter(
    (producto) =>
      Number(producto.stock) <= Number(producto.stockCritico)
  )

  return (
    <Container className="mt-4 mb-4">

      <h2>Reportes de Administración</h2>

      <p>Resumen de ventas e inventario de NEXUS Gaming Shop.</p>

      <Row className="g-3 mb-4">

        <Col md={3}>
          <Card className="text-center h-100">
            <Card.Body>
              <h6>Pedidos Realizados</h6>
              <h3>{pedidos.length}</h3>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="text-center h-100">
            <Card.Body>
              <h6>Total de Ventas</h6>
              <h3>{formatoPrecio(totalVentas)}</h3>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="text-center h-100">
            <Card.Body>
              <h6>Unidades Vendidas</h6>
              <h3>{totalProductosVendidos}</h3>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="text-center h-100">
            <Card.Body>
              <h6>Productos con Stock Crítico</h6>
              <h3>{productosCriticos.length}</h3>
            </Card.Body>
          </Card>
        </Col>

      </Row>

      <h4>Productos con Stock Crítico</h4>

      {productosCriticos.length === 0 ? (
        <Alert variant="success">
          No existen productos con stock crítico.
        </Alert>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Código</th>
              <th>Producto</th>
              <th>Stock Actual</th>
              <th>Stock Crítico</th>
              <th>Estado</th>
            </tr>
          </thead>

          <tbody>
            {productosCriticos.map((producto) => (
              <tr key={producto.id}>
                <td>{producto.codigo}</td>
                <td>{producto.nombre}</td>
                <td>{producto.stock}</td>
                <td>{producto.stockCritico}</td>
                <td>
                  <Badge bg="danger">Stock Crítico</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <h4 className="mt-4">Resumen de Pedidos</h4>

      {pedidos.length === 0 ? (
        <Alert variant="info">
          No existen ventas registradas.
        </Alert>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>N.º Pedido</th>
              <th>Fecha</th>
              <th>Cliente</th>
              <th>Total</th>
            </tr>
          </thead>

          <tbody>
            {pedidos.map((pedido) => (
              <tr key={pedido.id}>
                <td>{pedido.id}</td>
                <td>{pedido.fecha}</td>
                <td>{pedido.cliente?.nombre}</td>
                <td>{formatoPrecio(pedido.total)}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

    </Container>
  )
}

export default AdminReportes

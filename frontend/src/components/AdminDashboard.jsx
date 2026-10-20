
import { useState } from 'react'
import { Row, Col, Card } from 'react-bootstrap'

function AdminDashboard({ productos }) {

  const [pedidos] = useState(() => {
    try {
      const datos = JSON.parse(
        localStorage.getItem('pedidosNexus') || '[]'
      )
      return Array.isArray(datos) ? datos : []
    } catch {
      return []
    }
  })

  const [usuarios] = useState(() => {
    try {
      const datos = JSON.parse(
        localStorage.getItem('usuariosNexus') || '[]'
      )
      return Array.isArray(datos) ? datos : []
    } catch {
      return []
    }
  })

  const totalVentas = pedidos.reduce(
    (total, pedido) => total + Number(pedido.total || 0),
    0
  )

  const stockCritico = productos.filter(
    (producto) =>
      Number(producto.stock) <= Number(producto.stockCritico)
  ).length

  return (
    <div className="mt-4">

      <h2>Panel de Administración</h2>

      <p>Resumen general de NEXUS Gaming Shop.</p>

      <Row className="g-3 mb-4">

        <Col md={3}>
          <Card className="text-center h-100">
            <Card.Body>
              <h6>Productos</h6>
              <h3>{productos.length}</h3>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="text-center h-100">
            <Card.Body>
              <h6>Usuarios Registrados</h6>
              <h3>{usuarios.length}</h3>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="text-center h-100">
            <Card.Body>
              <h6>Pedidos</h6>
              <h3>{pedidos.length}</h3>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="text-center h-100">
            <Card.Body>
              <h6>Ventas Totales</h6>
              <h3>
                ${totalVentas.toLocaleString('es-CL')}
              </h3>
            </Card.Body>
          </Card>
        </Col>

      </Row>

      {stockCritico > 0 && (
        <p className="text-danger">
          Atención: existen {stockCritico} productos
          con stock crítico.
        </p>
      )}

    </div>
  )
}

export default AdminDashboard

import { useState } from 'react'
import { Container, Card, Table, Alert, Badge, Button, Form } from 'react-bootstrap'

function leerLista(clave) {
  try {
    const datos = JSON.parse(localStorage.getItem(clave) || '[]')
    return Array.isArray(datos) ? datos : []
  } catch {
    return []
  }
}

function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState(() => leerLista('usuariosNexus'))
  const [pedidos, setPedidos] = useState(() => leerLista('pedidosNexus'))
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null)
  const [usuarioEditando, setUsuarioEditando] = useState(null)
  const [nombre, setNombre] = useState('')
  const [correo, setCorreo] = useState('')
  const [error, setError] = useState('')
  const [mensaje, setMensaje] = useState('')

  function formatoPrecio(valor) {
    return '$' + Number(valor).toLocaleString('es-CL')
  }

  function editar(usuario) {
    setUsuarioEditando(usuario)
    setNombre(usuario.nombre)
    setCorreo(usuario.correo)
    setError('')
    setMensaje('')
  }

  function guardarEdicion(e) {
    e.preventDefault()
    setError('')
    const nombreNuevo = nombre.trim()
    const correoNuevo = correo.trim().toLowerCase()

    if (!nombreNuevo || !correoNuevo) {
      setError('Debes completar el nombre y el correo.')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correoNuevo)) {
      setError('Ingresa un correo válido.')
      return
    }
    if (correoNuevo === 'admin@nexus.cl') {
      setError('Este correo está reservado para el administrador.')
      return
    }
    if (usuarios.some((u) => u.id !== usuarioEditando.id && u.correo.toLowerCase() === correoNuevo)) {
      setError('Este correo ya está registrado.')
      return
    }

    const actualizados = usuarios.map((u) =>
      u.id === usuarioEditando.id
        ? { ...u, nombre: nombreNuevo, correo: correoNuevo }
        : u
    )
    const pedidosActualizados = pedidos.map((pedido) =>
      pedido.cliente?.correo?.toLowerCase() === usuarioEditando.correo.toLowerCase()
        ? { ...pedido, cliente: { ...pedido.cliente, correo: correoNuevo, nombre: nombreNuevo } }
        : pedido
    )

    localStorage.setItem('usuariosNexus', JSON.stringify(actualizados))
    localStorage.setItem('pedidosNexus', JSON.stringify(pedidosActualizados))
    setUsuarios(actualizados)
    setPedidos(pedidosActualizados)

    // Sincronizar la sesión almacenada si corresponde al cliente editado.
    try {
      const sesion = JSON.parse(localStorage.getItem('sesionNexus') || 'null')
      if (sesion?.id === usuarioEditando.id && sesion?.rol !== 'admin') {
        localStorage.setItem('sesionNexus', JSON.stringify({
          ...sesion, nombre: nombreNuevo, correo: correoNuevo
        }))
      }
    } catch {
      // La sesión no se puede leer; la edición de usuario sigue siendo válida.
    }

    setUsuarioEditando(null)
    setMensaje('Usuario actualizado correctamente.')
  }

  function eliminar(usuario) {
    if (!window.confirm(`¿Eliminar al usuario ${usuario.nombre}? Sus pedidos históricos se conservarán.`)) return

    const actualizados = usuarios.filter((u) => u.id !== usuario.id)
    localStorage.setItem('usuariosNexus', JSON.stringify(actualizados))
    setUsuarios(actualizados)
    setMensaje('Usuario eliminado. Su historial de pedidos se conserva.')
    setError('')

    try {
      const sesion = JSON.parse(localStorage.getItem('sesionNexus') || 'null')
      if (sesion?.id === usuario.id && sesion?.rol !== 'admin') {
        localStorage.removeItem('sesionNexus')
      }
    } catch {
      // No hay sesión válida que limpiar.
    }
  }

  const comprasUsuario = usuarioSeleccionado
    ? pedidos.filter((pedido) =>
        pedido.cliente?.correo?.toLowerCase() === usuarioSeleccionado.correo?.toLowerCase()
      )
    : []

  return (
    <Container className="mt-4 mb-4">
      <h2>Administración de Usuarios</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {mensaje && <Alert variant="success">{mensaje}</Alert>}

      {usuarioEditando ? (
        <Card className="mb-3">
          <Card.Body>
            <h4>Editar usuario</h4>
            <Form onSubmit={guardarEdicion}>
              <Form.Group className="mb-3">
                <Form.Label>Nombre completo</Form.Label>
                <Form.Control value={nombre} onChange={(e) => setNombre(e.target.value)} required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Correo electrónico</Form.Label>
                <Form.Control type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} required />
              </Form.Group>
              <Button type="submit" variant="success" className="me-2">Guardar cambios</Button>
              <Button variant="secondary" onClick={() => { setUsuarioEditando(null); setError('') }}>Cancelar</Button>
            </Form>
          </Card.Body>
        </Card>
      ) : usuarioSeleccionado === null ? (
        <>
          <p>Usuarios registrados en NEXUS Gaming Shop.</p>
          {usuarios.length === 0 ? (
            <Alert variant="info">Todavía no existen usuarios registrados.</Alert>
          ) : (
            <Card><Card.Body>
              <Table striped bordered hover responsive>
                <thead><tr><th>N.º</th><th>Nombre</th><th>Correo Electrónico</th><th>Rol</th><th>Acciones</th></tr></thead>
                <tbody>
                  {usuarios.map((usuario, index) => (
                    <tr key={usuario.id ?? index}>
                      <td>{index + 1}</td>
                      <td>{usuario.nombre}</td>
                      <td>{usuario.correo}</td>
                      <td><Badge bg="primary">Cliente</Badge></td>
                      <td>
                        <Button variant="outline-primary" size="sm" className="me-2 mb-1" onClick={() => { setUsuarioSeleccionado(usuario); setMensaje('') }}>Ver Historial</Button>
                        <Button variant="outline-warning" size="sm" className="me-2 mb-1" onClick={() => editar(usuario)}>Editar</Button>
                        <Button variant="outline-danger" size="sm" className="mb-1" onClick={() => eliminar(usuario)}>Eliminar</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body></Card>
          )}
        </>
      ) : (
        <>
          <Button variant="secondary" className="mb-3" onClick={() => setUsuarioSeleccionado(null)}>Volver a Usuarios</Button>
          <Card><Card.Body>
            <h4>Historial de Compras</h4>
            <p><strong>Cliente:</strong> {usuarioSeleccionado.nombre}</p>
            <p><strong>Correo:</strong> {usuarioSeleccionado.correo}</p>
            {comprasUsuario.length === 0 ? (
              <Alert variant="info">Este usuario no tiene compras registradas.</Alert>
            ) : (
              <Table striped bordered hover responsive>
                <thead><tr><th>N.º Pedido</th><th>Fecha</th><th>Productos</th><th>Total</th><th>Estado</th></tr></thead>
                <tbody>
                  {comprasUsuario.map((pedido) => (
                    <tr key={pedido.id}>
                      <td>{pedido.id}</td>
                      <td>{pedido.fecha}</td>
                      <td>{pedido.productos?.map((producto, index) => (
                        <div key={index}>{producto.nombre} (x{producto.cantidad})</div>
                      ))}</td>
                      <td>{formatoPrecio(pedido.total)}</td>
                      <td><Badge bg="success">{pedido.estado}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Card.Body></Card>
        </>
      )}
    </Container>
  )
}

export default AdminUsuarios

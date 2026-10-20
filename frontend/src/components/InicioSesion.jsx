
import { useState } from 'react'
import { Container, Card, Form, Button, Alert } from 'react-bootstrap'

function InicioSesion({ iniciarSesion, cambiarVista }) {

  const [correo, setCorreo] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [error, setError] = useState('')

  function manejarIngreso(e) {
    e.preventDefault()

    setError('')

    if (correo.trim() === '' || contrasena === '') {
      setError('Debes completar todos los campos.')
      return
    }

    const correoIngresado = correo.trim().toLowerCase()

    // Cuenta administradora de demostración
    if (
      correoIngresado === 'admin@nexus.cl' &&
      contrasena === 'Admin1234'
    ) {
      iniciarSesion({
        id: 0,
        nombre: 'Administrador',
        correo: 'admin@nexus.cl',
        rol: 'admin'
      })

      return
    }

    // Buscar usuarios registrados
    let usuarios

    try {
      const guardados = JSON.parse(
        localStorage.getItem('usuariosNexus') || '[]'
      )

      usuarios = Array.isArray(guardados) ? guardados : []
    } catch {
      setError('No se pudieron leer los usuarios registrados.')
      return
    }

    const usuario = usuarios.find(
      (item) =>
        item.correo === correoIngresado &&
        item.contrasena === contrasena
    )

    if (!usuario) {
      setError('Correo o contraseña incorrectos.')
      return
    }

    // Los usuarios registrados ingresan como clientes
    iniciarSesion({
      id: usuario.id,
      nombre: usuario.nombre,
      correo: usuario.correo,
      rol: 'cliente'
    })
  }

  return (
    <Container className="mt-4 mb-4">

      <Card className="mx-auto" style={{ maxWidth: '500px' }}>

        <Card.Header>
          <h3 className="mb-0">Iniciar Sesión</h3>
        </Card.Header>

        <Card.Body>

          {error && (
            <Alert variant="danger">{error}</Alert>
          )}

          <Form onSubmit={manejarIngreso}>

            <Form.Group className="mb-3">
              <Form.Label>Correo electrónico</Form.Label>
              <Form.Control
                type="email"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                required
              />
            </Form.Group>

            <Button
              variant="success"
              type="submit"
              className="me-2"
            >
              Ingresar
            </Button>

            <Button
              variant="secondary"
              type="button"
              onClick={() => cambiarVista('registro')}
            >
              Crear cuenta
            </Button>

          </Form>
          <div
            className="mt-4 p-3 rounded"
            style={{
              backgroundColor: '#f5f5f5',
              border: '1px solid #e5e5e5',
              fontSize: '13px',
              color: '#777'
            }}
          >
            <div className="mb-2">
              <strong>Acceso de demostración (Administrador)</strong>
            </div>

            <div>
              Correo: admin@nexus.cl
            </div>

            <div>
              Contraseña: Admin1234
            </div>
          </div>

        </Card.Body>

      </Card>

    </Container>
  )
}

export default InicioSesion

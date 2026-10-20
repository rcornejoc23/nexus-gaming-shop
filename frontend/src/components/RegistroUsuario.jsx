
import { useState } from 'react'
import { Container, Card, Form, Button, Alert } from 'react-bootstrap'

function RegistroUsuario({ cambiarVista }) {

  const [nombre, setNombre] = useState('')
  const [correo, setCorreo] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [confirmarContrasena, setConfirmarContrasena] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')

  function manejarRegistro(e) {
    e.preventDefault()

    setError('')
    setMensaje('')

    if (
      nombre.trim() === '' ||
      correo.trim() === '' ||
      contrasena === '' ||
      confirmarContrasena === ''
    ) {
      setError('Debes completar todos los campos.')
      return
    }

    if (contrasena.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.')
      return
    }

    if (contrasena !== confirmarContrasena) {
      setError('Las contraseñas no coinciden.')
      return
    }

    const usuarios = JSON.parse(
      localStorage.getItem('usuariosNexus') || '[]'
    )

    const correoNormalizado = correo.trim().toLowerCase()

    const existe = usuarios.some(
      (usuario) => usuario.correo === correoNormalizado
    )

    if (existe) {
      setError('Este correo ya está registrado.')
      return
    }

    const nuevoUsuario = {
      id: Date.now(),
      nombre: nombre.trim(),
      correo: correoNormalizado,
      contrasena
    }

    usuarios.push(nuevoUsuario)

    localStorage.setItem(
      'usuariosNexus',
      JSON.stringify(usuarios)
    )

    setMensaje('Usuario registrado correctamente.')

    setNombre('')
    setCorreo('')
    setContrasena('')
    setConfirmarContrasena('')
  }

  return (
    <Container className="mt-4 mb-4">

      <Card className="mx-auto" style={{ maxWidth: '500px' }}>

        <Card.Header>
          <h3 className="mb-0">Registro de Usuario</h3>
        </Card.Header>

        <Card.Body>

          {error && (
            <Alert variant="danger">{error}</Alert>
          )}

          {mensaje && (
            <Alert variant="success">{mensaje}</Alert>
          )}

          <Form onSubmit={manejarRegistro}>

            <Form.Group className="mb-3">
              <Form.Label>Nombre completo</Form.Label>
              <Form.Control
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </Form.Group>

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

            <Form.Group className="mb-3">
              <Form.Label>Confirmar contraseña</Form.Label>
              <Form.Control
                type="password"
                value={confirmarContrasena}
                onChange={(e) => setConfirmarContrasena(e.target.value)}
                required
              />
            </Form.Group>

            <Button variant="success" type="submit" className="me-2">
              Registrarse
            </Button>

            <Button
              variant="secondary"
              type="button"
              onClick={() => cambiarVista('productos')}
            >
              Volver
            </Button>

          </Form>

        </Card.Body>

      </Card>

    </Container>
  )
}

export default RegistroUsuario

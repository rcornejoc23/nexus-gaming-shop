
import { useState } from 'react'
import { Card, Container, Badge, Alert, Form, Button } from 'react-bootstrap'

function PerfilUsuario({ usuarioActivo, actualizarPerfil }) {

  const [editando, setEditando] = useState(false)
  const [nombre, setNombre] = useState(usuarioActivo?.nombre || '')
  const [correo, setCorreo] = useState(usuarioActivo?.correo || '')
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')

  if (!usuarioActivo) {
    return (
      <Container className="mt-4">
        <Alert variant="warning">
          Debes iniciar sesión para visualizar tu perfil.
        </Alert>
      </Container>
    )
  }

  function guardarCambios(e) {
    e.preventDefault()

    setMensaje('')
    setError('')

    if (nombre.trim() === '' || correo.trim() === '') {
      setError('Debes completar todos los campos.')
      return
    }

    const actualizado = actualizarPerfil({
      nombre,
      correo
    })

    if (!actualizado) {
      setError('No se pudo actualizar el perfil. Verifica que el correo no esté registrado.')
      return
    }

    setEditando(false)
    setMensaje('Perfil actualizado correctamente.')
  }

  function cancelarEdicion() {
    setNombre(usuarioActivo.nombre)
    setCorreo(usuarioActivo.correo)
    setEditando(false)
    setError('')
  }

  return (
    <Container className="mt-4 mb-4">

      <h2>Mi Perfil</h2>

      <p>Información de tu cuenta en NEXUS Gaming Shop.</p>

      {mensaje && (
        <Alert variant="success">{mensaje}</Alert>
      )}

      {error && (
        <Alert variant="danger">{error}</Alert>
      )}

      <Card>
        <Card.Body>

          <h4>{usuarioActivo.nombre}</h4>

          <hr />

          {!editando ? (
            <>
              <p>
                <strong>Nombre:</strong> {usuarioActivo.nombre}
              </p>

              <p>
                <strong>Correo electrónico:</strong> {usuarioActivo.correo}
              </p>

              <p>
                <strong>Tipo de cuenta:</strong>{' '}
                <Badge bg={usuarioActivo.rol === 'admin' ? 'danger' : 'primary'}>
                  {usuarioActivo.rol === 'admin'
                    ? 'Administrador'
                    : 'Cliente'}
                </Badge>
              </p>

              {usuarioActivo.rol !== 'admin' && (
                <Button
                  variant="primary"
                  onClick={() => {
                    setNombre(usuarioActivo.nombre)
                    setCorreo(usuarioActivo.correo)
                    setMensaje('')
                    setError('')
                    setEditando(true)
                  }}
                >
                  Editar Perfil
                </Button>
              )}
            </>
          ) : (
            <Form onSubmit={guardarCambios}>

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

              <Button variant="success" type="submit" className="me-2">
                Guardar Cambios
              </Button>

              <Button
                variant="secondary"
                type="button"
                onClick={cancelarEdicion}
              >
                Cancelar
              </Button>

            </Form>
          )}

        </Card.Body>
      </Card>

    </Container>
  )
}

export default PerfilUsuario

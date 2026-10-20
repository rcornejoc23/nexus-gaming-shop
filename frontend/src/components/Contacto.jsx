
import { useState } from 'react'
import { Container, Card, Form, Button, Alert } from 'react-bootstrap'

function Contacto() {

  const [nombre, setNombre] = useState('')
  const [correo, setCorreo] = useState('')
  const [asunto, setAsunto] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [enviado, setEnviado] = useState(false)
  const [error, setError] = useState('')

  function manejarEnvio(e) {
    e.preventDefault()

    setError('')
    setEnviado(false)

    if (
      nombre.trim() === '' ||
      correo.trim() === '' ||
      asunto.trim() === '' ||
      mensaje.trim() === ''
    ) {
      setError('Debes completar todos los campos.')
      return
    }

    let mensajes

    try {
      const guardados = JSON.parse(
        localStorage.getItem('mensajesNexus') || '[]'
      )

      mensajes = Array.isArray(guardados) ? guardados : []
    } catch {
      setError('No se pudieron recuperar los mensajes.')
      return
    }

    const nuevoMensaje = {
      id: Date.now(),
      nombre: nombre.trim(),
      correo: correo.trim().toLowerCase(),
      asunto: asunto.trim(),
      mensaje: mensaje.trim(),
      fecha: new Date().toLocaleString('es-CL')
    }

    mensajes.push(nuevoMensaje)

    try {
      localStorage.setItem(
        'mensajesNexus',
        JSON.stringify(mensajes)
      )
    } catch {
      setError('No se pudo guardar el mensaje.')
      return
    }

    setEnviado(true)

    setNombre('')
    setCorreo('')
    setAsunto('')
    setMensaje('')
  }

  return (
    <Container className="mt-4 mb-4">

      <Card className="mx-auto" style={{ maxWidth: '650px' }}>

        <Card.Header>
          <h3 className="mb-0">Contacto</h3>
        </Card.Header>

        <Card.Body>

          <p>
            ¿Tienes alguna consulta sobre nuestros productos?
            Completa el formulario y déjanos tu mensaje.
          </p>

          {error && (
            <Alert variant="danger">
              {error}
            </Alert>
          )}

          {enviado && (
            <Alert variant="success">
              ¡Hemos recibido tu mensaje en el formulario de contacto!
            </Alert>
          )}

          <Form onSubmit={manejarEnvio}>

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
              <Form.Label>Asunto</Form.Label>
              <Form.Control
                type="text"
                value={asunto}
                onChange={(e) => setAsunto(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Mensaje</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                value={mensaje}
                onChange={(e) => setMensaje(e.target.value)}
                required
              />
            </Form.Group>

            <Button variant="success" type="submit">
              Enviar mensaje
            </Button>

          </Form>

        </Card.Body>

      </Card>

    </Container>
  )
}

export default Contacto


import { useState } from 'react'
import {
  Form,
  Button,
  Table,
  Alert
} from 'react-bootstrap'

function Checkout({
  carrito,
  confirmarCompra,
  volverCarrito,
  usuarioActivo
}) {

  const [nombre, setNombre] = useState(usuarioActivo?.nombre || '')
  const [correo, setCorreo] = useState(usuarioActivo?.correo || '')
  const [direccion, setDireccion] = useState('')
  const [tipoEntrega, setTipoEntrega] = useState('domicilio')
  const [error, setError] = useState('')

  // Calcular el precio con descuento
  const calcularPrecioFinal = (producto) => {
    const descuento = producto.descuento || 0

    return Math.round(
      producto.precio * (1 - descuento / 100)
    )
  }

  // Calcular el total de la compra
  const total = carrito.reduce((acumulador, item) => {
    const precioFinal = calcularPrecioFinal(item.producto)

    return acumulador + precioFinal * item.cantidad
  }, 0)

  const manejarCompra = (e) => {
    e.preventDefault()

    // Validar campos obligatorios
    if (
      nombre.trim() === '' ||
      correo.trim() === '' ||
      (tipoEntrega === 'domicilio' && direccion.trim() === '')
    ) {
      setError('Debes completar todos los campos obligatorios.')
      return
    }

    // Validar formato del correo electrónico
    const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.trim())

    if (!correoValido) {
      setError('Debes ingresar un correo electrónico válido.')
      return
    }

    setError('')

    confirmarCompra({
      nombre,
      correo,
      direccion: tipoEntrega === 'domicilio'
        ? direccion
        : 'Retiro en tienda',
      tipoEntrega
    })

  }

  return (
    <>
      <h2 className="mb-4">
        Finalizar Compra
      </h2>

      <h4>Resumen del pedido</h4>

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
          {carrito.map((item) => {

            const precioFinal = calcularPrecioFinal(item.producto)

            return (
              <tr key={item.producto.id}>
                <td>{item.producto.nombre}</td>

                <td>
                  ${precioFinal.toLocaleString('es-CL')}
                </td>

                <td>{item.cantidad}</td>

                <td>
                  ${(precioFinal * item.cantidad).toLocaleString('es-CL')}
                </td>
              </tr>
            )
          })}
        </tbody>
      </Table>

      <h4 className="text-end mb-4">
        Total a pagar: ${total.toLocaleString('es-CL')}
      </h4>

      <h4>Datos del cliente</h4>

      {error && (
        <Alert variant="danger">
          {error}
        </Alert>
      )}

      <Form onSubmit={manejarCompra}>

        <Form.Group className="mb-3">
          <Form.Label>Nombre completo</Form.Label>

          <Form.Control
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ingresa tu nombre"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Correo electrónico</Form.Label>

          <Form.Control
            type="email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            placeholder="Ingresa tu correo"
          />
        </Form.Group>

        <h4>Tipo de entrega</h4>

        <Form.Group className="mb-3">
          <Form.Check
            type="radio"
            name="tipoEntrega"
            label="Despacho a domicilio"
            value="domicilio"
            checked={tipoEntrega === 'domicilio'}
            onChange={(e) => setTipoEntrega(e.target.value)}
          />

          <Form.Check
            type="radio"
            name="tipoEntrega"
            label="Retiro en tienda"
            value="retiro"
            checked={tipoEntrega === 'retiro'}
            onChange={(e) => setTipoEntrega(e.target.value)}
          />
        </Form.Group>

        {tipoEntrega === 'domicilio' && (
          <Form.Group className="mb-3">
            <Form.Label>Dirección de entrega</Form.Label>

            <Form.Control
              type="text"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              placeholder="Ingresa tu dirección"
            />
          </Form.Group>
        )}

        <div className="d-flex gap-2">

          <Button
            variant="secondary"
            type="button"
            onClick={volverCarrito}
          >
            Volver al carrito
          </Button>

          <Button
            variant="success"
            type="submit"
          >
            Confirmar compra
          </Button>

        </div>

      </Form>
    </>
  )
}

export default Checkout

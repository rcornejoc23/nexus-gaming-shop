
import { useState } from 'react'
import { Form, Button, Card, Row, Col } from 'react-bootstrap'

function FormularioProducto({
  guardarProducto,
  cancelar,
  productoEditar = null
}) {

  const [codigo, setCodigo] = useState(productoEditar?.codigo || '')
  const [nombre, setNombre] = useState(productoEditar?.nombre || '')
  const [descripcion, setDescripcion] = useState(productoEditar?.descripcion || '')
  const [precio, setPrecio] = useState(productoEditar?.precio ?? '')
  const [stock, setStock] = useState(productoEditar?.stock ?? '')
  const [stockCritico, setStockCritico] = useState(productoEditar?.stockCritico ?? '')
  const [categoria, setCategoria] = useState(productoEditar?.categoria || '')
  const [imagen, setImagen] = useState(productoEditar?.imagen || '')
  const [descuento, setDescuento] = useState(productoEditar?.descuento ?? 0)

  // Categorías iniciales de la tienda
  const categoriasIniciales = [
    'Teclados',
    'Mouse',
    'Audio',
    'Accesorios',
    'Controles'
  ]

  // Recuperar categorías creadas por el administrador
  const [categorias] = useState(() => {
    try {
      const guardadas = JSON.parse(
        localStorage.getItem('categoriasNexus') || 'null'
      )

      if (Array.isArray(guardadas)) {
        return [...new Set([...guardadas, productoEditar?.categoria].filter(Boolean))]
      }
    } catch {
      // Si hay un error, utilizar las categorías iniciales
    }

    return [...new Set([...categoriasIniciales, productoEditar?.categoria].filter(Boolean))]
  })

  function manejarGuardar(e) {
    e.preventDefault()

    if (
      codigo.trim() === '' ||
      nombre.trim() === '' ||
      descripcion.trim() === '' ||
      categoria.trim() === '' ||
      imagen.trim() === ''
    ) {
      alert('Debe completar todos los campos')
      return
    }

    if (
      precio === '' ||
      stock === '' ||
      stockCritico === '' ||
      !Number.isFinite(Number(precio)) ||
      Number(precio) <= 0 ||
      Number(stock) < 0 ||
      Number(stockCritico) < 0 ||
      !Number.isInteger(Number(stock)) ||
      !Number.isInteger(Number(stockCritico))
    ) {
      alert('Revise el precio y las cantidades de stock')
      return
    }

    if (
      descuento === '' ||
      !Number.isInteger(Number(descuento)) ||
      Number(descuento) < 0 ||
      Number(descuento) > 100
    ) {
      alert('El descuento debe ser un número entero entre 0 y 100')
      return
    }

    const producto = {
      codigo: codigo.trim(),
      nombre: nombre.trim(),
      descripcion: descripcion.trim(),
      precio: Number(precio),
      stock: Number(stock),
      stockCritico: Number(stockCritico),
      categoria: categoria.trim(),
      imagen: imagen.trim(),
      descuento: Number(descuento)
    }

    guardarProducto(producto)
  }

  return (
    <Card className="mt-4 mb-4">

      <Card.Header>
        <h4>
          {productoEditar ? 'Editar Producto' : 'Agregar Nuevo Producto'}
        </h4>
      </Card.Header>

      <Card.Body>

        <Form onSubmit={manejarGuardar}>

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Código</Form.Label>
                <Form.Control
                  type="text"
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              required
            />
          </Form.Group>

          <Row>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Precio</Form.Label>
                <Form.Control
                  type="number"
                  min="1"
                  value={precio}
                  onChange={(e) => setPrecio(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>

            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Descuento (%)</Form.Label>
                <Form.Control
                  type="number"
                  min="0"
                  max="100"
                  step="1"
                  value={descuento}
                  onChange={(e) => setDescuento(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>

            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Stock</Form.Label>
                <Form.Control
                  type="number"
                  min="0"
                  step="1"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>

            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Stock Crítico</Form.Label>
                <Form.Control
                  type="number"
                  min="0"
                  step="1"
                  value={stockCritico}
                  onChange={(e) => setStockCritico(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Categoría</Form.Label>

            <Form.Select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              required
            >
              <option value="">Seleccione una categoría</option>

              {categorias.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}

            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Ruta de la imagen</Form.Label>
            <Form.Control
              type="text"
              placeholder="/img/producto.jpg"
              value={imagen}
              onChange={(e) => setImagen(e.target.value)}
              required
            />
            <Form.Text muted>
              La imagen debe estar disponible en public/img.
            </Form.Text>
          </Form.Group>

          <Button
            variant="success"
            type="submit"
            className="me-2"
          >
            {productoEditar ? 'Guardar Cambios' : 'Guardar Producto'}
          </Button>

          <Button
            variant="secondary"
            type="button"
            onClick={cancelar}
          >
            Cancelar
          </Button>

        </Form>

      </Card.Body>

    </Card>
  )
}

export default FormularioProducto

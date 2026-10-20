
import { useState } from 'react'
import {
  Container,
  Card,
  Form,
  Button,
  Table,
  Alert
} from 'react-bootstrap'

function AdminCategorias({ productos, actualizarCategoriaProductos }) {

  const [categorias, setCategorias] = useState(() => {
    try {
      const guardadas = JSON.parse(
        localStorage.getItem('categoriasNexus') || 'null'
      )

      if (Array.isArray(guardadas)) {
        return guardadas
      }
    } catch {
      // Se utilizarán las categorías iniciales
    }

    return [...new Set(productos.map(p => p.categoria))]
  })

  const [nombre, setNombre] = useState('')
  const [categoriaEditar, setCategoriaEditar] = useState(null)
  const [nombreEditado, setNombreEditado] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')

  function guardarCategorias(nuevasCategorias) {
    setCategorias(nuevasCategorias)
    localStorage.setItem(
      'categoriasNexus',
      JSON.stringify(nuevasCategorias)
    )
  }

  function agregarCategoria(e) {
    e.preventDefault()

    setError('')
    setMensaje('')

    const nuevaCategoria = nombre.trim()

    if (nuevaCategoria === '') {
      setError('Debes ingresar el nombre de la categoría.')
      return
    }

    const existe = categorias.some(
      categoria =>
        categoria.toLowerCase() === nuevaCategoria.toLowerCase()
    )

    if (existe) {
      setError('Esta categoría ya existe.')
      return
    }

    guardarCategorias([...categorias, nuevaCategoria])
    setNombre('')
    setMensaje('Categoría agregada correctamente.')
  }

  function editarCategoria(e) {
    e.preventDefault()
    setError('')
    setMensaje('')
    const nuevoNombre = nombreEditado.trim()
    if (!nuevoNombre) {
      setError('Debes ingresar el nuevo nombre de la categoría.')
      return
    }
    if (categorias.some(item => item.toLowerCase() === nuevoNombre.toLowerCase() && item !== categoriaEditar)) {
      setError('Esta categoría ya existe.')
      return
    }
    if (nuevoNombre !== categoriaEditar) {
      actualizarCategoriaProductos(categoriaEditar, nuevoNombre)
      guardarCategorias(categorias.map(item => item === categoriaEditar ? nuevoNombre : item))
    }
    setCategoriaEditar(null)
    setNombreEditado('')
    setMensaje('Categoría actualizada correctamente.')
  }

  function eliminarCategoria(categoria) {

    const tieneProductos = productos.some(
      producto => producto.categoria === categoria
    )

    setError('')
    setMensaje('')

    if (tieneProductos) {
      setError(
        'No puedes eliminar una categoría que tiene productos asociados.'
      )
      return
    }

    const nuevasCategorias = categorias.filter(
      item => item !== categoria
    )

    guardarCategorias(nuevasCategorias)
    setMensaje('Categoría eliminada correctamente.')
  }

  return (
    <Container className="mt-4 mb-4">

      <h2>Administración de Categorías</h2>

      <p>Gestiona las categorías de productos de la tienda.</p>

      {mensaje && (
        <Alert variant="success">{mensaje}</Alert>
      )}

      {error && (
        <Alert variant="danger">{error}</Alert>
      )}

      <Card className="mb-4">
        <Card.Body>

          <h5>Agregar Categoría</h5>

          <Form onSubmit={agregarCategoria}>

            <Form.Group className="mb-3">
              <Form.Label>Nombre de la categoría</Form.Label>
              <Form.Control
                type="text"
                value={nombre}
                onChange={e => setNombre(e.target.value)}
                placeholder="Ejemplo: Monitores"
              />
            </Form.Group>

            <Button type="submit" variant="success">
              Agregar Categoría
            </Button>

          </Form>

        </Card.Body>
      </Card>

      <Card>
        <Card.Body>

          <h5>Listado de Categorías</h5>

          <Table striped bordered hover responsive>

            <thead>
              <tr>
                <th>Nombre</th>
                <th>Productos asociados</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>

              {categorias.map(categoria => (

                <tr key={categoria}>

                  <td>
                    {categoriaEditar === categoria ? (
                      <Form onSubmit={editarCategoria} className="d-flex gap-2">
                        <Form.Control
                          size="sm"
                          aria-label="Nuevo nombre de categoría"
                          value={nombreEditado}
                          onChange={e => setNombreEditado(e.target.value)}
                        />
                        <Button size="sm" type="submit" variant="success">Guardar</Button>
                        <Button size="sm" variant="secondary" onClick={() => setCategoriaEditar(null)}>Cancelar</Button>
                      </Form>
                    ) : categoria}
                  </td>

                  <td>
                    {productos.filter(
                      producto => producto.categoria === categoria
                    ).length}
                  </td>

                  <td>
                    <Button
                      variant="primary"
                      size="sm"
                      className="me-2"
                      disabled={categoriaEditar !== null}
                      onClick={() => {
                        setCategoriaEditar(categoria)
                        setNombreEditado(categoria)
                        setError('')
                        setMensaje('')
                      }}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      disabled={categoriaEditar !== null}
                      onClick={() => eliminarCategoria(categoria)}
                    >
                      Eliminar
                    </Button>
                  </td>

                </tr>

              ))}

            </tbody>

          </Table>

        </Card.Body>
      </Card>

    </Container>
  )
}

export default AdminCategorias

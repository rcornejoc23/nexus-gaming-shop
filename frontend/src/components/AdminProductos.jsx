
import { useState } from 'react'
import { Container, Card, Table, Button, Badge } from 'react-bootstrap'
import FormularioProducto from './FormularioProducto'

function AdminProductos({
  productos,
  guardarProducto,
  editarProducto,
  eliminarProductoCatalogo
}) {

  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [productoEditar, setProductoEditar] = useState(null)

  // Mostrar formulario para agregar
  function agregarNuevo() {
    setProductoEditar(null)
    setMostrarFormulario(true)
  }

  // Mostrar formulario con los datos del producto
  function comenzarEdicion(producto) {
    setProductoEditar(producto)
    setMostrarFormulario(true)
  }

  // Guardar un producto nuevo o editado
  function guardar(producto) {

    let guardado

    if (productoEditar) {
      guardado = editarProducto(productoEditar.id, producto)
    } else {
      guardado = guardarProducto(producto)
    }

    if (guardado) {
      setMostrarFormulario(false)
      setProductoEditar(null)
    }
  }

  // Cancelar el formulario
  function cancelarFormulario() {
    setMostrarFormulario(false)
    setProductoEditar(null)
  }

  // Calcular el precio con descuento
  function calcularPrecioFinal(producto) {

    const descuento = producto.descuento || 0

    return Math.round(
      producto.precio * (1 - descuento / 100)
    )
  }

  return (
    <Container className="mt-4 mb-4">

      <h2 className="mb-4">
        Administración de Productos
      </h2>

      {!mostrarFormulario && (
        <Button
          variant="success"
          className="mb-3"
          onClick={agregarNuevo}
        >
          Agregar Producto
        </Button>
      )}

      {mostrarFormulario && (
        <FormularioProducto
          key={productoEditar ? productoEditar.id : 'nuevo'}
          guardarProducto={guardar}
          cancelar={cancelarFormulario}
          productoEditar={productoEditar}
        />
      )}

      <Card>

        <Card.Header>
          <h4>Listado de Productos</h4>
        </Card.Header>

        <Card.Body>

          <Table striped bordered hover responsive>

            <thead>
              <tr>
                <th>Código</th>
                <th>Producto</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Descuento</th>
                <th>Precio Final</th>
                <th>Stock</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>

              {productos.map((producto) => (

                <tr key={producto.id}>

                  <td>{producto.codigo}</td>

                  <td>{producto.nombre}</td>

                  <td>{producto.categoria}</td>

                  <td>
                    ${producto.precio.toLocaleString('es-CL')}
                  </td>

                  <td>
                    {(producto.descuento || 0) > 0 ? (
                      <Badge bg="danger">
                        {producto.descuento}%
                      </Badge>
                    ) : (
                      <span>0%</span>
                    )}
                  </td>

                  <td className="fw-bold">
                    ${calcularPrecioFinal(producto).toLocaleString('es-CL')}
                  </td>

                  <td>{producto.stock}</td>

                  <td>

                    {producto.stock === 0 ? (

                      <Badge bg="danger">
                        Sin stock
                      </Badge>

                    ) : producto.stock <= producto.stockCritico ? (

                      <Badge bg="warning" text="dark">
                        Stock crítico
                      </Badge>

                    ) : (

                      <Badge bg="success">
                        Disponible
                      </Badge>

                    )}

                  </td>

                  <td>

                    <Button
                      variant="warning"
                      size="sm"
                      className="me-2 mb-1"
                      onClick={() => comenzarEdicion(producto)}
                    >
                      Editar
                    </Button>

                    <Button
                      variant="danger"
                      size="sm"
                      className="mb-1"
                      onClick={() => eliminarProductoCatalogo(producto.id)}
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

export default AdminProductos

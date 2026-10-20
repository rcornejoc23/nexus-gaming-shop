import { useState, useEffect } from 'react'
import { Container, Row, Col, Button, Modal, Alert } from 'react-bootstrap'
import productosBase from './data/catalogo'
import ProductoCard from './components/ProductoCard'
import Carrito from './components/Carrito'
import Menu from './components/Menu'
import Checkout from './components/Checkout'
import CompraExitosa from './components/CompraExitosa'
import CompraFallida from './components/CompraFallida'
import AdminProductos from './components/AdminProductos'
import AdminCategorias from './components/AdminCategorias'
import AdminPedidos from './components/AdminPedidos'
import AdminUsuarios from './components/AdminUsuarios'
import AdminReportes from './components/AdminReportes'
import AdminDashboard from './components/AdminDashboard'
import PerfilUsuario from './components/PerfilUsuario'
import Categorias from './components/Categorias'
import Ofertas from './components/Ofertas'
import RegistroUsuario from './components/RegistroUsuario'
import InicioSesion from './components/InicioSesion'
import Nosotros from './components/Nosotros'
import Contacto from './components/Contacto'
import Blogs from './components/Blogs'
import Inicio from './components/Inicio'
import './App.css'

function App() {

  function actualizarCategoriaProductos(anterior, nueva) {
    setProductos(actuales => {
      const actualizados = actuales.map(producto =>
        producto.categoria === anterior
          ? { ...producto, categoria: nueva }
          : producto
      )
      localStorage.setItem('productosNexus', JSON.stringify(actualizados))
      return actualizados
    })
  }

  // Recuperar el catálogo guardado o usar los productos iniciales

  const [productos, setProductos] = useState(() => {

    try {

      const guardados = JSON.parse(localStorage.getItem('productosNexus'))

      if (Array.isArray(guardados)) {

        // Incorporar los descuentos de catalogo.js

        // sin perder los productos guardados

        return guardados.map((producto) => {

          const productoBase = productosBase.find(

            (item) => item.id === producto.id

          )

          return {

            ...producto,

            descuento: producto.descuento ?? productoBase?.descuento ?? 0

          }

        })

      }

      return productosBase

    } catch {

      return productosBase

    }

  })

  const [vista, setVista] = useState('inicio')

  const [productoSeleccionado, setProductoSeleccionado] = useState(null)

  // Recuperar el carrito guardado

  const [carrito, setCarrito] = useState(() => {

    try {

      const guardado = JSON.parse(localStorage.getItem('carritoNexus'))

      return Array.isArray(guardado) ? guardado : []

    } catch {

      return []

    }

  })

  const [usuarioActivo, setUsuarioActivo] = useState(() => {

    try {

      const guardado = JSON.parse(

        localStorage.getItem('sesionNexus')

      )

      return guardado || null

    } catch {

      return null

    }

  })

  const [mensaje, setMensaje] = useState('')
  const [datosCompra, setDatosCompra] = useState(null)
  const [totalCompra, setTotalCompra] = useState(0)
  const [pedidoCompra, setPedidoCompra] = useState(null)
  const [mensajeError, setMensajeError] = useState('')

  // Guardar el catálogo

  useEffect(() => {

    localStorage.setItem('productosNexus', JSON.stringify(productos))

  }, [productos])

  // Guardar el carrito

  useEffect(() => {

    localStorage.setItem('carritoNexus', JSON.stringify(carrito))

  }, [carrito])

  // Obtener el stock actual desde el catálogo

  function obtenerStockDisponible(producto) {

    const productoActual = productos.find(

      (item) => item.id === producto.id

    )

    if (!productoActual) {

      return 0

    }

    const existente = carrito.find(

      (item) => item.producto.id === producto.id

    )

    const cantidad = existente ? existente.cantidad : 0

    return Math.max(0, productoActual.stock - cantidad)

  }

  // Agregar un producto al carrito

  function agregarCarrito(producto) {

    if (obtenerStockDisponible(producto) <= 0) {

      setMensaje('No hay más stock disponible de ' + producto.nombre)

      return

    }

    const existente = carrito.find(

      (item) => item.producto.id === producto.id

    )

    if (existente) {

      setCarrito(carrito.map((item) => {

        if (item.producto.id === producto.id) {

          return { ...item, cantidad: item.cantidad + 1 }

        }

        return item

      }))

    } else {

      setCarrito([

        ...carrito,

        { producto: producto, cantidad: 1 }

      ])

    }

    setMensaje(producto.nombre + ' agregado al carrito')

  }

  // Aumentar la cantidad

  function aumentarCantidad(id) {

    const item = carrito.find(

      (item) => item.producto.id === id

    )

    if (!item) return

    if (obtenerStockDisponible(item.producto) <= 0) {

      setMensaje('No hay más stock disponible')

      return

    }

    setCarrito(carrito.map((item) => {

      if (item.producto.id === id) {

        return { ...item, cantidad: item.cantidad + 1 }

      }

      return item

    }))

    setMensaje('Cantidad aumentada')

  }

  // Disminuir la cantidad

  function disminuirCantidad(id) {

    setCarrito(

      carrito

        .map((item) => {

          if (item.producto.id === id) {

            return { ...item, cantidad: item.cantidad - 1 }

          }

          return item

        })

        .filter((item) => item.cantidad > 0)

    )

    setMensaje('Cantidad disminuida')

  }

  // Eliminar un producto

  function eliminarProducto(id) {

    setCarrito(carrito.filter(

      (item) => item.producto.id !== id

    ))

    setMensaje('Producto eliminado del carrito')

  }

  // Guardar un nuevo producto

  function guardarProducto(nuevoProducto) {

    // Verificar que el código no esté repetido

    const codigoRepetido = productos.some(

      (producto) =>

        producto.codigo.toUpperCase() ===

        nuevoProducto.codigo.toUpperCase()

    )

    if (codigoRepetido) {

      alert('Ya existe un producto con ese código')

      return false

    }

    // Obtener el siguiente ID disponible

    const nuevoId = productos.reduce(

      (mayor, producto) => Math.max(mayor, producto.id),

      0

    ) + 1

    // Agregar el producto al catálogo

    const productoCreado = {

      id: nuevoId,

      ...nuevoProducto

    }

    setProductos([...productos, productoCreado])

    alert('Producto agregado correctamente')

    return true

  }

  // Editar un producto existente

  function editarProducto(id, productoEditado) {

    // Verificar que el código no esté utilizado por otro producto

    const codigoRepetido = productos.some(

      (producto) =>

        producto.id !== id &&

        producto.codigo.toUpperCase() ===

        productoEditado.codigo.toUpperCase()

    )

    if (codigoRepetido) {

      alert('Ya existe otro producto con ese código')

      return false

    }

    // Actualizar el producto seleccionado

    const productosActualizados = productos.map((producto) => {

      if (producto.id === id) {

        return {

          ...producto,

          ...productoEditado

        }

      }

      return producto

    })

    // Guardar el catálogo actualizado

    setProductos(productosActualizados)

    // Actualizar también los datos del carrito

    const carritoActualizado = carrito.map((item) => {

      if (item.producto.id === id) {

        return {

          ...item,

          producto: {

            ...item.producto,

            ...productoEditado

          }

        }

      }

      return item

    })

    setCarrito(carritoActualizado)

    alert('Producto actualizado correctamente')

    return true

  }

  // Eliminar un producto del catálogo

  function eliminarProductoCatalogo(id) {

    const producto = productos.find(

      (item) => item.id === id

    )

    if (!producto) {

      alert('Producto no encontrado')

      return

    }

    // Verificar si el producto está en el carrito

    const estaEnCarrito = carrito.some(

      (item) => item.producto.id === id

    )

    if (estaEnCarrito) {

      alert('No puedes eliminar un producto que está en el carrito')

      return

    }

    // Solicitar confirmación

    const confirmar = window.confirm(

      '¿Estás seguro de eliminar ' + producto.nombre + '?'

    )

    if (!confirmar) {

      return

    }

    // Eliminar del catálogo

    const productosActualizados = productos.filter(

      (item) => item.id !== id

    )

    setProductos(productosActualizados)

    alert('Producto eliminado correctamente')

  }

  // Contador del carrito

  const cantidadCarrito = carrito.reduce(

    (total, item) => total + item.cantidad,

    0

  )

  function iniciarSesion(usuario) {

    setUsuarioActivo(usuario)

    localStorage.setItem(

      'sesionNexus',

      JSON.stringify(usuario)

    )

    setVista('productos')

    setMensaje(`Bienvenido, ${usuario.nombre}`)

  }


  function actualizarPerfil(datosActualizados) {

    if (!usuarioActivo || usuarioActivo.rol === 'admin') {
      return false
    }

    const usuarios = JSON.parse(
      localStorage.getItem('usuariosNexus') || '[]'
    )

    if (!Array.isArray(usuarios)) {
      return false
    }

    const usuarioExiste = usuarios.some(
      (usuario) => usuario.id === usuarioActivo.id
    )

    if (!usuarioExiste) {
      return false
    }

    const correoNuevo = datosActualizados.correo.trim().toLowerCase()
    const nombreNuevo = datosActualizados.nombre.trim()

    if (nombreNuevo === '' || correoNuevo === '') {
      return false
    }

    const correoExiste = usuarios.some(
      (usuario) =>
        usuario.correo === correoNuevo &&
        usuario.id !== usuarioActivo.id
    )

    if (correoExiste) {
      return false
    }

    const usuariosActualizados = usuarios.map((usuario) => {

      if (usuario.id === usuarioActivo.id) {
        return {
          ...usuario,
          nombre: nombreNuevo,
          correo: correoNuevo
        }
      }

      return usuario
    })

    const usuarioActualizado = {
      ...usuarioActivo,
      nombre: nombreNuevo,
      correo: correoNuevo
    }

    localStorage.setItem(
      'usuariosNexus',
      JSON.stringify(usuariosActualizados)
    )

    localStorage.setItem(
      'sesionNexus',
      JSON.stringify(usuarioActualizado)
    )

    setUsuarioActivo(usuarioActualizado)

    return true
  }


  function cerrarSesion() {

    setUsuarioActivo(null)

    localStorage.removeItem('sesionNexus')

    setVista('productos')

    setMensaje('Sesión cerrada correctamente')

  }

  // Cambiar de pantalla

  function cambiarVista(nuevaVista) {

    setVista(nuevaVista)

    setMensaje('')

  }

  // Ir al formulario de compra

  function irCheckout() {

    if (carrito.length === 0) {

      setMensaje('El carrito está vacío')

      return

    }

    cambiarVista('checkout')

  }

  // Confirmar la compra

  function confirmarCompra(datosCliente) {

    if (carrito.length === 0) {

      setMensajeError('El carrito está vacío.')

      setVista('compraFallida')

      return

    }

    // Copiar los productos para validar antes de descontar

    const productosActualizados = productos.map(

      (producto) => ({ ...producto })

    )

    let total = 0

    for (const item of carrito) {

      const producto = productosActualizados.find(

        (p) => p.id === item.producto.id

      )

      if (!producto) {

        setMensajeError('Uno de los productos ya no está disponible.')

        setVista('compraFallida')

        return

      }

      if (!Number.isInteger(item.cantidad) || item.cantidad <= 0) {

        setMensajeError('La cantidad de un producto no es válida.')

        setVista('compraFallida')

        return

      }

      if (producto.stock < item.cantidad) {

        setMensajeError(

          'No hay stock suficiente de ' + producto.nombre

        )

        setVista('compraFallida')

        return

      }

      // Descontar del inventario copiado

      producto.stock -= item.cantidad

      const descuento = producto.descuento || 0

      const precioFinal = Math.round(

        producto.precio * (1 - descuento / 100)

      )

      total += precioFinal * item.cantidad

    }

    // La compra fue validada correctamente

    // Recuperar historial de compras
    let historial

    try {
      const guardado = JSON.parse(
        localStorage.getItem('pedidosNexus') || '[]'
      )

      historial = Array.isArray(guardado) ? guardado : []
    } catch {
      historial = []
    }

    // Crear registro del pedido
    const nuevoPedido = {
      id: Date.now(),
      fecha: new Date().toLocaleString('es-CL'),
      cliente: datosCliente,
      productos: carrito.map((item) => ({
        codigo: item.producto.codigo,
        nombre: item.producto.nombre,
        cantidad: item.cantidad,
        precio: Math.round(
          item.producto.precio *
          (1 - (item.producto.descuento || 0) / 100)
        )
      })),
      total: total,
      estado: 'Confirmado'
    }

    // Guardar pedido en el historial
    localStorage.setItem(
      'pedidosNexus',
      JSON.stringify([...historial, nuevoPedido])
    )

    // Actualizar inventario y finalizar compra
    setProductos(productosActualizados)
    setDatosCompra(datosCliente)
    setTotalCompra(total)
    setPedidoCompra(nuevoPedido)
    setCarrito([])
    setMensaje('')

    setVista('compraExitosa')

  }

  return (

    <>

      <Menu

        cambiarVista={cambiarVista}

        cantidadCarrito={cantidadCarrito}

        usuarioActivo={usuarioActivo}

        cerrarSesion={cerrarSesion}

      />

      <Container className="mt-4">

        {/* Productos */}

        {vista === 'productos' && (

          <>

            <h1 className="text-center mb-4">

              NEXUS Gaming Shop

            </h1>

            <h2 className="mb-3">Nuestros Productos</h2>

            {mensaje && (

              <Alert variant="info">{mensaje}</Alert>

            )}

            <Row>

              {productos.map((producto) => (

                <Col md={4} className="mb-4" key={producto.id}>

                  <ProductoCard

                    producto={producto}

                    verDetalle={setProductoSeleccionado}

                    agregarCarrito={agregarCarrito}

                    stockDisponible={obtenerStockDisponible(producto)}

                  />
                </Col>
              ))}

            </Row>

          </>

        )}

        {/* Categorías */}

        {vista === 'categorias' && (

          <>

            {mensaje && (

              <Alert variant="info">{mensaje}</Alert>

            )}

            <Categorias

              productos={productos}

              verDetalle={setProductoSeleccionado}

              agregarCarrito={agregarCarrito}

              obtenerStockDisponible={obtenerStockDisponible}

            />

          </>

        )}

        {/* Ofertas */}

        {vista === 'ofertas' && (

          <>

            {mensaje && (

              <Alert variant="info">{mensaje}</Alert>

            )}

            <Ofertas

              productos={productos}

              verDetalle={setProductoSeleccionado}

              agregarCarrito={agregarCarrito}

              obtenerStockDisponible={obtenerStockDisponible}

            />

          </>

        )}


        {/* Perfil de usuario */}
        {vista === 'perfil' && usuarioActivo && (
          <PerfilUsuario
            usuarioActivo={usuarioActivo}
            actualizarPerfil={actualizarPerfil}
          />
        )}

        {/* Acceso al perfil sin iniciar sesión */}
        {vista === 'perfil' && !usuarioActivo && (
          <Alert variant="warning" className="mt-4">
            Debes iniciar sesión para visualizar tu perfil.
          </Alert>
        )}


        {/* Registro de Usuario */}

        {vista === 'registro' && (

          <RegistroUsuario cambiarVista={cambiarVista} />

        )}

        {/* Inicio de Sesión */}

        {vista === 'login' && (

          <InicioSesion

            iniciarSesion={iniciarSesion}

            cambiarVista={cambiarVista}

          />

        )}

        {/* Nosotros */}

        {vista === 'nosotros' && (

          <Nosotros />

        )}

        {/* Contacto */}

        {vista === 'contacto' && (

          <Contacto />

        )}

        {/* Blogs */}

        {vista === 'blogs' && (

          <Blogs />

        )}

        {/* Página de Inicio */}

        {vista === 'inicio' && (

          <Inicio

            cambiarVista={cambiarVista}

            productos={productos}

          />

        )}

        {/* Carrito */}

        {vista === 'carrito' && (

          <>

            {mensaje && (

              <Alert variant="info">{mensaje}</Alert>

            )}

            <Carrito

              carrito={carrito}

              eliminarProducto={eliminarProducto}

              aumentarCantidad={aumentarCantidad}

              disminuirCantidad={disminuirCantidad}

              irCheckout={irCheckout}

              stockDisponible={obtenerStockDisponible}

            />

            <Button

              variant="secondary"

              className="mb-4"

              onClick={() => cambiarVista('productos')}

            >

              Seguir comprando

            </Button>

          </>

        )}

        {/* Checkout */}

        {vista === 'checkout' && (
          <Checkout
            carrito={carrito}
            confirmarCompra={confirmarCompra}
            volverCarrito={() => cambiarVista('carrito')}
            usuarioActivo={usuarioActivo}
          />
        )}

        {/* Compra exitosa */}

        {vista === 'compraExitosa' && datosCompra && pedidoCompra && (

          <CompraExitosa
            datosCliente={datosCompra}
            total={totalCompra}
            pedido={pedidoCompra}
            volverInicio={() => cambiarVista('productos')}
          />

        )}

        {/* Compra fallida */}

        {vista === 'compraFallida' && (

          <CompraFallida

            mensajeError={mensajeError}

            volverCarrito={() => cambiarVista('carrito')}

          />

        )}

        {/* Administración de productos: solo administrador */}
        {vista === 'administracion' && usuarioActivo?.rol === 'admin' && (
          <>
            <AdminDashboard productos={productos} />

            <Button
              variant="outline-primary"
              className="mt-4 mb-3"
              onClick={() => cambiarVista('adminCategorias')}
            >
              Administrar Categorías
            </Button>

            <Button
              variant="outline-success"
              className="mt-4 mb-3 ms-2"
              onClick={() => cambiarVista('adminPedidos')}
            >
              Administrar Pedidos
            </Button>

            <Button
              variant="outline-info"
              className="mt-4 mb-3 ms-2"
              onClick={() => cambiarVista('adminUsuarios')}
            >
              Administrar Usuarios
            </Button>


            <Button
              variant="outline-warning"
              className="mt-4 mb-3 ms-2"
              onClick={() => cambiarVista('adminReportes')}
            >
              Administrar Reportes
            </Button>


            <AdminProductos
              productos={productos}
              guardarProducto={guardarProducto}
              editarProducto={editarProducto}
              eliminarProducto={eliminarProductoCatalogo}
            />
          </>
        )}

        {/* Administración de categorías */}
        {vista === 'adminCategorias' && usuarioActivo?.rol === 'admin' && (
          <>
            <Button
              variant="secondary"
              className="mt-4 mb-3"
              onClick={() => cambiarVista('administracion')}
            >
              Volver a Administración
            </Button>

            <AdminCategorias productos={productos} actualizarCategoriaProductos={actualizarCategoriaProductos} />
          </>
        )}

        {/* Administración de pedidos */}
        {vista === 'adminPedidos' && usuarioActivo?.rol === 'admin' && (
          <>
            <Button
              variant="secondary"
              className="mt-4 mb-3"
              onClick={() => cambiarVista('administracion')}
            >
              Volver a Administración
            </Button>

            <AdminPedidos />
          </>
        )}

        {/* Acceso restringido a pedidos */}
        {vista === 'adminPedidos' && usuarioActivo?.rol !== 'admin' && (
          <Alert variant="danger" className="mt-4">
            Acceso restringido. Esta sección es exclusiva
            para administradores.
          </Alert>
        )}


        {/* Administración de usuarios */}
        {vista === 'adminUsuarios' && usuarioActivo?.rol === 'admin' && (
          <>
            <Button
              variant="secondary"
              className="mt-4 mb-3"
              onClick={() => cambiarVista('administracion')}
            >
              Volver a Administración
            </Button>

            <AdminUsuarios />
          </>
        )}

        {/* Acceso restringido a usuarios */}
        {vista === 'adminUsuarios' && usuarioActivo?.rol !== 'admin' && (
          <Alert variant="danger" className="mt-4">
            Acceso restringido. Esta sección es exclusiva
            para administradores.
          </Alert>
        )}


        {/* Administración de reportes */}
        {vista === 'adminReportes' && usuarioActivo?.rol === 'admin' && (
          <>
            <Button
              variant="secondary"
              className="mt-4 mb-3"
              onClick={() => cambiarVista('administracion')}
            >
              Volver a Administración
            </Button>

            <AdminReportes productos={productos} />
          </>
        )}

        {/* Acceso restringido a reportes */}
        {vista === 'adminReportes' && usuarioActivo?.rol !== 'admin' && (
          <Alert variant="danger" className="mt-4">
            Acceso restringido. Esta sección es exclusiva
            para administradores.
          </Alert>
        )}


        {/* Acceso restringido a categorías */}
        {vista === 'adminCategorias' && usuarioActivo?.rol !== 'admin' && (
          <Alert variant="danger" className="mt-4">
            Acceso restringido. Esta sección es exclusiva para administradores.
          </Alert>
        )}

        {/* Mensaje para usuarios sin permiso */}
        {vista === 'administracion' && usuarioActivo?.rol !== 'admin' && (
          <div className="mt-4">
            <Alert variant="danger">
              Acceso restringido. Debes iniciar sesión como administrador
              para ingresar a esta sección.
            </Alert>
            <Button variant="primary" onClick={() => cambiarVista('login')}>
              Ir a Iniciar Sesión
            </Button>
          </div>
        )}

        {/* Detalles del producto */}

        <Modal

          show={productoSeleccionado !== null}

          onHide={() => setProductoSeleccionado(null)}

          centered

        >

          <Modal.Header closeButton>

            <Modal.Title>Detalle del Producto</Modal.Title>

          </Modal.Header>

          <Modal.Body>

            {productoSeleccionado && (

              <>

                <img

                  src={productoSeleccionado.imagen}

                  alt={productoSeleccionado.nombre}

                  className="img-fluid mb-3"

                />

                <h4>{productoSeleccionado.nombre}</h4>

                <p>{productoSeleccionado.descripcion}</p>

                <p>

                  <strong>Categoría:</strong>{' '}

                  {productoSeleccionado.categoria}

                </p>

                <div className="mb-3">
                  {(productoSeleccionado.descuento || 0) > 0 ? (
                    <>
                      <p className="mb-1">
                        <strong>Precio original:</strong>{' '}
                        <del>${productoSeleccionado.precio.toLocaleString('es-CL')}</del>
                      </p>
                      <p className="text-danger fw-bold">
                        Descuento: {productoSeleccionado.descuento}%
                      </p>
                      <p className="text-success fw-bold">
                        Precio oferta: ${Math.round(
                          productoSeleccionado.precio *
                          (1 - productoSeleccionado.descuento / 100)
                        ).toLocaleString('es-CL')}
                      </p>
                    </>
                  ) : (
                    <p>
                      <strong>Precio:</strong> ${productoSeleccionado.precio.toLocaleString('es-CL')}
                    </p>
                  )}
                </div>

                <p>

                  <strong>Stock:</strong>{' '}

                  {obtenerStockDisponible(productoSeleccionado)}

                </p>

                <Button

                  variant="success"

                  disabled={obtenerStockDisponible(productoSeleccionado) === 0}

                  onClick={() => agregarCarrito(productoSeleccionado)}

                >

                  Añadir al carrito

                </Button>

              </>

            )}

          </Modal.Body>

          <Modal.Footer>

            <Button

              variant="secondary"

              onClick={() => setProductoSeleccionado(null)}

            >

              Cerrar

            </Button>

          </Modal.Footer>

        </Modal>

      </Container>

    </>

  )

}

export default App

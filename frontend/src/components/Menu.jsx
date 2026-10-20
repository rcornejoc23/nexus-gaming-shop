
import { Navbar, Container, Nav, Badge } from 'react-bootstrap'

function Menu({
  cambiarVista,
  cantidadCarrito,
  usuarioActivo,
  cerrarSesion
}) {

  return (
    <Navbar bg="dark" data-bs-theme="dark" expand="lg">

      <Container>

        <Navbar.Brand
          href="#inicio"
          onClick={(e) => {
            e.preventDefault()
            cambiarVista('inicio')
          }}
        >
          NEXUS Gaming Shop
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="menu-nexus" />

        <Navbar.Collapse id="menu-nexus">

          <Nav className="ms-auto">

            <Nav.Link
              href="#inicio"
              onClick={(e) => {
                e.preventDefault()
                cambiarVista('inicio')
              }}
            >
              Inicio
            </Nav.Link>
            
            <Nav.Link
              href="#productos"
              onClick={(e) => {
                e.preventDefault()
                cambiarVista('productos')
              }}
            >
              Productos
            </Nav.Link>

            <Nav.Link
              href="#categorias"
              onClick={(e) => {
                e.preventDefault()
                cambiarVista('categorias')
              }}
            >
              Categorías
            </Nav.Link>

            <Nav.Link
              href="#ofertas"
              onClick={(e) => {
                e.preventDefault()
                cambiarVista('ofertas')
              }}
            >
              Ofertas
            </Nav.Link>

            <Nav.Link
              href="#nosotros"
              onClick={(e) => {
                e.preventDefault()
                cambiarVista('nosotros')
              }}
            >
              Nosotros
            </Nav.Link>

            <Nav.Link
              href="#contacto"
              onClick={(e) => {
                e.preventDefault()
                cambiarVista('contacto')
              }}
            >
              Contacto
            </Nav.Link>

            
            <Nav.Link
              href="#blogs"
              onClick={(e) => {
                e.preventDefault()
                cambiarVista('blogs')
            }}
            >
            Blogs
            </Nav.Link>

            {usuarioActivo ? (
              <>
                <Nav.Link disabled>
                  Hola, {usuarioActivo.nombre}
                </Nav.Link>

                <Nav.Link
                  href="#perfil"
                  onClick={(e) => {
                    e.preventDefault()
                    cambiarVista('perfil')
                }}
                >
                Mi Perfil
                </Nav.Link>

                <Nav.Link
                  href="#cerrar-sesion"
                  onClick={(e) => {
                    e.preventDefault()
                    cerrarSesion()
                  }}
                >
                  Cerrar sesión
                </Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link
                  href="#registro"
                  onClick={(e) => {
                    e.preventDefault()
                    cambiarVista('registro')
                  }}
                >
                  Registrarse
                </Nav.Link>

                <Nav.Link
                  href="#login"
                  onClick={(e) => {
                    e.preventDefault()
                    cambiarVista('login')
                  }}
                >
                  Iniciar sesión
                </Nav.Link>
              </>
            )}

            <Nav.Link
              href="#carrito"
              onClick={(e) => {
                e.preventDefault()
                cambiarVista('carrito')
              }}
            >
              Carrito <Badge bg="danger">{cantidadCarrito}</Badge>
            </Nav.Link>

            {usuarioActivo?.rol === 'admin' && (
            <Nav.Link
                href="#administracion"
                onClick={(e) => {
                e.preventDefault()
                cambiarVista('administracion')
                }}
            >
                Administración
            </Nav.Link>
            )}

          </Nav>

        </Navbar.Collapse>

      </Container>

    </Navbar>
  )
}

export default Menu

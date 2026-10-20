
import React, { useState } from 'react'
import {
  render,
  screen,
  fireEvent,
  cleanup
} from '@testing-library/react'

import Menu from '../src/components/Menu.jsx'
import ProductoCard from '../src/components/ProductoCard.jsx'
import productosBase from '../src/data/catalogo.js'

describe('Pruebas del estado del carrito con useState', () => {

  afterEach(() => {
    cleanup()
  })

  it('debe actualizar el contador al agregar un producto', () => {

    const producto = productosBase[0]

    function PruebaCarrito() {

      const [carrito, setCarrito] = useState([])

      const cantidadCarrito = carrito.reduce(
        (total, item) => total + item.cantidad,
        0
      )

      function agregarCarrito(productoAgregado) {

        setCarrito([
          ...carrito,
          {
            producto: productoAgregado,
            cantidad: 1
          }
        ])

      }

      return (
        <>
          <Menu
            cambiarVista={() => {}}
            cantidadCarrito={cantidadCarrito}
            usuarioActivo={null}
            cerrarSesion={() => {}}
          />

          <ProductoCard
            producto={producto}
            verDetalle={() => {}}
            agregarCarrito={agregarCarrito}
            stockDisponible={producto.stock}
          />
        </>
      )

    }

    render(<PruebaCarrito />)

    const enlaceCarrito = screen.getByText('Carrito').closest('a')

    expect(enlaceCarrito.textContent).toContain('0')

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Añadir al carrito'
      })
    )

    expect(enlaceCarrito.textContent).toContain('1')

  })

})

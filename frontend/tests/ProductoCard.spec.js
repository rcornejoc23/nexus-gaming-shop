
import React from 'react'
import {
  render,
  screen,
  cleanup,
  fireEvent
} from '@testing-library/react'

import ProductoCard from '../src/components/ProductoCard.jsx'
import productosBase from '../src/data/catalogo.js'

describe('Pruebas del componente ProductoCard', () => {

  afterEach(() => {
    cleanup()
  })

  it('debe mostrar el nombre del producto recibido por props', () => {

    const producto = productosBase[0]

    render(
      <ProductoCard
        producto={producto}
        verDetalle={() => {}}
        agregarCarrito={() => {}}
        stockDisponible={producto.stock}
      />
    )

    expect(
      screen.getByText('Teclado Mecánico RGB')
    ).toBeTruthy()

  })

  it('debe ejecutar verDetalle al hacer clic en Ver producto', () => {

    const producto = productosBase[0]
    const verDetalle = jasmine.createSpy('verDetalle')

    render(
      <ProductoCard
        producto={producto}
        verDetalle={verDetalle}
        agregarCarrito={() => {}}
        stockDisponible={producto.stock}
      />
    )

    fireEvent.click(
      screen.getByRole('button', { name: 'Ver producto' })
    )

    expect(verDetalle).toHaveBeenCalledWith(producto)

  })

  it('debe ejecutar agregarCarrito al hacer clic en Añadir al carrito', () => {

    const producto = productosBase[0]
    const agregarCarrito = jasmine.createSpy('agregarCarrito')

    render(
      <ProductoCard
        producto={producto}
        verDetalle={() => {}}
        agregarCarrito={agregarCarrito}
        stockDisponible={producto.stock}
      />
    )

    fireEvent.click(
      screen.getByRole('button', { name: 'Añadir al carrito' })
    )

    expect(agregarCarrito).toHaveBeenCalledWith(producto)

  })

  it('debe deshabilitar Añadir al carrito cuando no hay stock', () => {

    const producto = productosBase[0]
    const agregarCarrito = jasmine.createSpy('agregarCarrito')

    render(
      <ProductoCard
        producto={producto}
        verDetalle={() => {}}
        agregarCarrito={agregarCarrito}
        stockDisponible={0}
      />
    )

    const boton = screen.getByRole('button', {
      name: 'Añadir al carrito'
    })

    expect(boton.disabled).toBeTrue()

    fireEvent.click(boton)

    expect(agregarCarrito).not.toHaveBeenCalled()

  })

})

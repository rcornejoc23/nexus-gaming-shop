
import React from 'react'
import {
    render,
    screen,
    fireEvent,
    cleanup
} from '@testing-library/react'

import Carrito from '../src/components/Carrito.jsx'
import productosBase from '../src/data/catalogo.js'

describe('Pruebas del componente Carrito', () => {

    afterEach(() => {
        cleanup()
    })

    const producto = productosBase[0]

    function mostrarCarrito(funciones = {}) {

        const carrito = [
            {
                producto: producto,
                cantidad: 1
            }
        ]

        return render(
            <Carrito
                carrito={carrito}
                eliminarProducto={funciones.eliminarProducto || (() => { })}
                aumentarCantidad={funciones.aumentarCantidad || (() => { })}
                disminuirCantidad={funciones.disminuirCantidad || (() => { })}
                irCheckout={() => { }}
                stockDisponible={() => 5}
            />
        )

    }

    it('debe mostrar el producto agregado al carrito', () => {

        mostrarCarrito()

        expect(
            screen.getByText(producto.nombre)
        ).toBeTruthy()

    })

    it('debe ejecutar aumentarCantidad al presionar +', () => {

        const aumentarCantidad = jasmine.createSpy('aumentarCantidad')

        mostrarCarrito({ aumentarCantidad })

        fireEvent.click(
            screen.getByRole('button', { name: '+' })
        )

        expect(aumentarCantidad).toHaveBeenCalledWith(producto.id)

    })

    it('debe ejecutar disminuirCantidad al presionar -', () => {

        const disminuirCantidad = jasmine.createSpy('disminuirCantidad')

        mostrarCarrito({ disminuirCantidad })

        fireEvent.click(
            screen.getByRole('button', { name: '-' })
        )

        expect(disminuirCantidad).toHaveBeenCalledWith(producto.id)

    })

    it('debe ejecutar eliminarProducto al presionar Eliminar', () => {

        const eliminarProducto = jasmine.createSpy('eliminarProducto')

        mostrarCarrito({ eliminarProducto })

        fireEvent.click(
            screen.getByRole('button', { name: 'Eliminar' })
        )

        expect(eliminarProducto).toHaveBeenCalledWith(producto.id)

    })

    it('debe mostrar un mensaje cuando el carrito está vacío', () => {

        render(
            <Carrito
                carrito={[]}
                eliminarProducto={() => { }}
                aumentarCantidad={() => { }}
                disminuirCantidad={() => { }}
                irCheckout={() => { }}
                stockDisponible={() => 0}
            />
        )

        expect(
            screen.getByText('Tu carrito está vacío.')
        ).toBeTruthy()

        expect(
            screen.queryByRole('button', { name: 'Proceder al pago' })
        ).toBeNull()

    })


    it('debe calcular correctamente el total con descuento', () => {

        const productoConDescuento = {
            id: 100,
            codigo: 'TEST100',
            nombre: 'Producto de prueba con descuento',
            descripcion: 'Producto para verificar el total',
            precio: 40000,
            descuento: 20,
            stock: 10
        }

        render(
            <Carrito
                carrito={[
                    {
                        producto: productoConDescuento,
                        cantidad: 2
                    }
                ]}
                eliminarProducto={() => { }}
                aumentarCantidad={() => { }}
                disminuirCantidad={() => { }}
                irCheckout={() => { }}
                stockDisponible={() => 8}
            />
        )

        expect(
            screen.getByText('Descuento: 20%')
        ).toBeTruthy()

        expect(
            screen.getByText('Total: $64.000')
        ).toBeTruthy()

    })


    it('debe ejecutar irCheckout al presionar Proceder al pago', () => {

        const irCheckout = jasmine.createSpy('irCheckout')

        render(
            <Carrito
                carrito={[
                    {
                        producto: producto,
                        cantidad: 1
                    }
                ]}
                eliminarProducto={() => { }}
                aumentarCantidad={() => { }}
                disminuirCantidad={() => { }}
                irCheckout={irCheckout}
                stockDisponible={() => 5}
            />
        )

        fireEvent.click(
            screen.getByRole('button', {
                name: 'Proceder al pago'
            })
        )

        expect(irCheckout).toHaveBeenCalledTimes(1)

    })



})

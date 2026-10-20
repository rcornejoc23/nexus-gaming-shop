
import React from 'react'
import {
    render,
    screen,
    fireEvent,
    cleanup
} from '@testing-library/react'

import Checkout from '../src/components/Checkout.jsx'
import productosBase from '../src/data/catalogo.js'

describe('Pruebas del componente Checkout', () => {

    afterEach(() => {
        cleanup()
    })

    it('debe mostrar un error si los campos obligatorios están vacíos', () => {

        const confirmarCompra = jasmine.createSpy('confirmarCompra')

        const carrito = [
            {
                producto: productosBase[0],
                cantidad: 1
            }
        ]

        render(
            <Checkout
                carrito={carrito}
                confirmarCompra={confirmarCompra}
                volverCarrito={() => { }}
            />
        )

        fireEvent.click(
            screen.getByRole('button', {
                name: 'Confirmar compra'
            })
        )

        expect(
            screen.getByText('Debes completar todos los campos obligatorios.')
        ).toBeTruthy()

        expect(confirmarCompra).not.toHaveBeenCalled()

    })


    it('debe confirmar una compra con datos completos', () => {

        const confirmarCompra = jasmine.createSpy('confirmarCompra')

        const carrito = [
            {
                producto: productosBase[0],
                cantidad: 1
            }
        ]

        render(
            <Checkout
                carrito={carrito}
                confirmarCompra={confirmarCompra}
                volverCarrito={() => { }}
            />
        )

        fireEvent.change(
            screen.getByPlaceholderText('Ingresa tu nombre'),
            { target: { value: 'Juan Pérez' } }
        )

        fireEvent.change(
            screen.getByPlaceholderText('Ingresa tu correo'),
            { target: { value: 'juan@ejemplo.cl' } }
        )

        fireEvent.change(
            screen.getByPlaceholderText('Ingresa tu dirección'),
            { target: { value: 'Av. Principal 123' } }
        )

        fireEvent.click(
            screen.getByRole('button', {
                name: 'Confirmar compra'
            })
        )

        expect(confirmarCompra).toHaveBeenCalledWith({
            nombre: 'Juan Pérez',
            correo: 'juan@ejemplo.cl',
            direccion: 'Av. Principal 123',
            tipoEntrega: 'domicilio'
        })

    })


    it('debe permitir retiro en tienda sin ingresar dirección', () => {

        const confirmarCompra = jasmine.createSpy('confirmarCompra')

        const carrito = [
            {
                producto: productosBase[0],
                cantidad: 1
            }
        ]

        render(
            <Checkout
                carrito={carrito}
                confirmarCompra={confirmarCompra}
                volverCarrito={() => { }}
            />
        )

        fireEvent.change(
            screen.getByPlaceholderText('Ingresa tu nombre'),
            { target: { value: 'María González' } }
        )

        fireEvent.change(
            screen.getByPlaceholderText('Ingresa tu correo'),
            { target: { value: 'maria@ejemplo.cl' } }
        )

        fireEvent.click(
            document.querySelector('input[type="radio"][value="retiro"]')
        )

        expect(
            screen.queryByPlaceholderText('Ingresa tu dirección')
        ).toBeNull()

        fireEvent.click(
            screen.getByRole('button', {
                name: 'Confirmar compra'
            })
        )

        expect(confirmarCompra).toHaveBeenCalledWith({
            nombre: 'María González',
            correo: 'maria@ejemplo.cl',
            direccion: 'Retiro en tienda',
            tipoEntrega: 'retiro'
        })

    })


    it('debe ejecutar volverCarrito al presionar el botón', () => {

        const volverCarrito = jasmine.createSpy('volverCarrito')

        const carrito = [
            {
                producto: productosBase[0],
                cantidad: 1
            }
        ]

        render(
            <Checkout
                carrito={carrito}
                confirmarCompra={() => { }}
                volverCarrito={volverCarrito}
            />
        )

        fireEvent.click(
            screen.getByRole('button', {
                name: 'Volver al carrito'
            })
        )

        expect(volverCarrito).toHaveBeenCalledTimes(1)

    })


    it('debe calcular el total aplicando descuento y cantidad', () => {

        const producto = {
            id: 100,
            nombre: 'Producto de prueba',
            precio: 40000,
            descuento: 20
        }

        const carrito = [
            {
                producto: producto,
                cantidad: 2
            }
        ]

        render(
            <Checkout
                carrito={carrito}
                confirmarCompra={() => { }}
                volverCarrito={() => { }}
            />
        )

        expect(
            screen.getByText('Total a pagar: $64.000')
        ).toBeTruthy()

    })

})

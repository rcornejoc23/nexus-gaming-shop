
import productosBase from '../src/data/catalogo.js'

describe('Pruebas del catálogo NEXUS Gaming Shop', () => {

  it('debe tener 6 productos iniciales', () => {
    expect(productosBase.length).toBe(6)
  })

  it('todos los productos deben tener un código', () => {
    productosBase.forEach((producto) => {
      expect(producto.codigo).toBeTruthy()
    })
  })

  it('todos los productos deben tener un precio mayor a cero', () => {
    productosBase.forEach((producto) => {
      expect(producto.precio).toBeGreaterThan(0)
    })
  })

  it('debe identificar productos con stock crítico', () => {
    const productosCriticos = productosBase.filter(
      (producto) => producto.stock <= producto.stockCritico
    )

    expect(productosCriticos.length).toBe(1)
    expect(productosCriticos[0].codigo).toBe('AUD001')
  })

  it('debe calcular el descuento del teclado correctamente', () => {
    const teclado = productosBase.find(
      (producto) => producto.codigo === 'TEC001'
    )

    const precioFinal = Math.round(
      teclado.precio * (1 - teclado.descuento / 100)
    )

    expect(precioFinal).toBe(33992)
  })

  it('debe identificar los productos que tienen ofertas', () => {
    const ofertas = productosBase.filter(
      (producto) => producto.descuento > 0
    )

    expect(ofertas.length).toBe(3)
  })

})

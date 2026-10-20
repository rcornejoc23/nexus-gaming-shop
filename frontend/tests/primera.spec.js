
describe('Pruebas iniciales de NEXUS Gaming Shop', () => {

  it('debe sumar correctamente dos valores', () => {
    const resultado = 10 + 5

    expect(resultado).toBe(15)
  })

  it('debe calcular correctamente un precio con descuento', () => {
    const precio = 39990
    const descuento = 15

    const precioFinal = Math.round(
      precio * (1 - descuento / 100)
    )

    expect(precioFinal).toBe(33992)
  })

  it('debe comprobar que un producto tiene stock disponible', () => {
    const stock = 10

    expect(stock).toBeGreaterThan(0)
  })

})

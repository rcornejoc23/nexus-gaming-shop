export function obtenerPrecioFinal(producto) {
  // El backend ya entrega el precio con descuento
  if (Number.isFinite(producto?.precioFinal)) return producto.precioFinal;
  const precio = Math.max(0, Number(producto?.precio) || 0);
  const descuento = Math.min(100, Math.max(0, Number(producto?.descuento) || 0));
  return Math.round(precio * (1 - descuento / 100));
}

export function tieneDescuento(producto) {
  return Number(producto?.descuento) > 0;
}

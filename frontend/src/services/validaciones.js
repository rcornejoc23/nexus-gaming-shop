export function validarCantidad(cantidad, stock) {
  const valor = Number(cantidad);
  const disponible = Number(stock);

  if (!Number.isInteger(valor) || valor < 1) return { ok: false, message: "La cantidad debe ser un entero mayor que cero." };
  if (!Number.isInteger(disponible) || disponible < 0) return { ok: false, message: "El stock disponible no es válido." };
  if (valor > disponible) return { ok: false, message: `Solo hay ${disponible} unidad(es) disponibles.`, available: disponible, requiresConfirmation: true };
  return { ok: true, value: valor };
}

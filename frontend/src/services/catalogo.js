const STORAGE_KEY = "productosAdmin";

export const productosBase = [
  { id: 1, codigo: "TEC001", nombre: "Teclado Mecánico RGB", descripcion: "Teclado mecánico con iluminación RGB.", precio: 39990, descuento: 15, stock: 15, stockCritico: 5, categoria: "Teclados", imagen: "/img/teclado.jpg" },
  { id: 2, codigo: "MOU001", nombre: "Mouse Gamer Pro", descripcion: "Mouse gamer ergonómico.", precio: 24990, descuento: 10, stock: 8, stockCritico: 3, categoria: "Mouse", imagen: "/img/mouse.jpg" },
  { id: 3, codigo: "AUD001", nombre: "Headset Gaming 7.1", descripcion: "Audífonos gamer con sonido envolvente.", precio: 49990, descuento: 20, stock: 2, stockCritico: 3, categoria: "Audio", imagen: "/img/audifonos.jpg" },
  { id: 4, codigo: "ACC001", nombre: "Mousepad XL", descripcion: "Mousepad grande para teclado y mouse.", precio: 14990, descuento: 0, stock: 20, stockCritico: 5, categoria: "Accesorios", imagen: "/img/mousepad.jpg" },
  { id: 5, codigo: "ACC002", nombre: "Soporte para Audífonos", descripcion: "Soporte de escritorio para audífonos.", precio: 12990, descuento: 0, stock: 12, stockCritico: 4, categoria: "Accesorios", imagen: "/img/soporte.jpg" },
  { id: 6, codigo: "CON001", nombre: "Control Gamer Inalámbrico", descripcion: "Control inalámbrico con diseño ergonómico.", precio: 34990, descuento: 0, stock: 9, stockCritico: 3, categoria: "Controles", imagen: "/img/control.jpg" }
];

function normalizarProducto(producto, indice = 0) {
  const precio = Number(producto.precio);
  const stock = Number(producto.stock);
  const stockCritico = Number(producto.stockCritico);
  const descuento = Number(producto.descuento);

  const imagen = producto.imagen || productosBase[indice % productosBase.length].imagen;

  return {
    ...producto,
    id: Number(producto.id) || indice + 1,
    precio: Number.isFinite(precio) ? Math.max(0, precio) : 0,
    stock: Number.isFinite(stock) ? Math.max(0, Math.floor(stock)) : 0,
    stockCritico: Number.isFinite(stockCritico) ? Math.max(0, Math.floor(stockCritico)) : 0,
    descuento: Number.isFinite(descuento) ? Math.min(100, Math.max(0, Math.floor(descuento))) : 0,
    imagen: imagen.startsWith("/") ? imagen : `/${imagen.replace(/^\.\//, "")}`
  };
}

export function leerProductos() {
  try {
    const guardados = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (Array.isArray(guardados) && guardados.length > 0) return guardados.map(normalizarProducto);
  } catch (error) {
    console.warn("No se pudo leer el catálogo.", error);
  }

  guardarProductos(productosBase);
  return productosBase.map(normalizarProducto);
}

export function guardarProductos(productos) {
  const normalizados = productos.map(normalizarProducto);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizados));
  return normalizados;
}

export function crearProducto(datos) {
  const productos = leerProductos();
  const nuevo = normalizarProducto({ ...datos, id: Date.now(), codigo: datos.codigo || `PRO-${Date.now()}` }, productos.length);
  guardarProductos([...productos, nuevo]);
  return nuevo;
}

export function actualizarProducto(id, cambios) {
  const productos = leerProductos();
  const actualizados = productos.map((producto) => producto.id === Number(id) ? normalizarProducto({ ...producto, ...cambios }) : producto);
  guardarProductos(actualizados);
  return actualizados.find((producto) => producto.id === Number(id));
}

export function eliminarProducto(id) {
  const productos = leerProductos().filter((producto) => producto.id !== Number(id));
  guardarProductos(productos);
  return productos;
}

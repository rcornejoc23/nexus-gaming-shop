
const productosBase = [
  {
    id: 1,
    codigo: "TEC001",
    nombre: "Teclado Mecánico RGB",
    descripcion: "Teclado mecánico con iluminación RGB.",
    precio: 39990,
    stock: 15,
    stockCritico: 5,
    categoria: "Teclados",
    imagen: "/img/teclado.jpg",
    descuento: 15
  },
  {
    id: 2,
    codigo: "MOU001",
    nombre: "Mouse Gamer Pro",
    descripcion: "Mouse gamer ergonómico.",
    precio: 24990,
    stock: 8,
    stockCritico: 3,
    categoria: "Mouse",
    imagen: "/img/mouse.jpg",
    descuento: 10
  },
  {
    id: 3,
    codigo: "AUD001",
    nombre: "Headset Gaming 7.1",
    descripcion: "Audífonos gamer con sonido envolvente.",
    precio: 49990,
    stock: 2,
    stockCritico: 3,
    categoria: "Audio",
    imagen: "/img/audifonos.jpg",
    descuento: 20
  },
  {
    id: 4,
    codigo: "ACC001",
    nombre: "Mousepad XL",
    descripcion: "Mousepad grande para teclado y mouse.",
    precio: 14990,
    stock: 20,
    stockCritico: 5,
    categoria: "Accesorios",
    imagen: "/img/mousepad.jpg",
    descuento: 0
  },
  {
    id: 5,
    codigo: "ACC002",
    nombre: "Soporte para Audífonos",
    descripcion: "Soporte de escritorio para audífonos.",
    precio: 12990,
    stock: 12,
    stockCritico: 4,
    categoria: "Accesorios",
    imagen: "/img/soporte.jpg",
    descuento: 0
  },
  {
    id: 6,
    codigo: "CON001",
    nombre: "Control Gamer Inalámbrico",
    descripcion: "Control inalámbrico con diseño ergonómico.",
    precio: 34990,
    stock: 9,
    stockCritico: 3,
    categoria: "Controles",
    imagen: "/img/control.jpg",
    descuento: 0
  }
];

// Exportamos los productos para utilizarlos en React.
export default productosBase

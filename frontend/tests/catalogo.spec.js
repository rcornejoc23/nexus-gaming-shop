import { crearProducto, eliminarProducto, guardarProductos, leerProductos } from "../src/services/catalogo.js";
import { validarCantidad } from "../src/services/validaciones.js";
import { getSession, login, logout } from "../src/services/auth.js";
import { crearUsuario, eliminarUsuario, leerUsuarios, validarRun } from "../src/services/usuarios.js";
import { actualizarEstadoPedido, crearPedido, leerPedidos, obtenerUltimoPedido } from "../src/services/pedidos.js";
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, MemoryRouter } from "react-router-dom";
import ProductCard from "../src/components/ProductCard.jsx";
import Products from "../src/pages/Products.jsx";
import PurchaseSuccess from "../src/pages/PurchaseSuccess.jsx";
import PurchaseFailure from "../src/pages/PurchaseFailure.jsx";
import Login from "../src/pages/Login.jsx";
import { AuthProvider, StoreProvider, useStore } from "../src/App.jsx";
import { obtenerPrecioFinal } from "../src/services/precios.js";
import { guardarCategorias, leerCategorias } from "../src/services/categorias.js";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

function renderReact(element) {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);
  act(() => root.render(element));
  return {
    container,
    cleanup: () => act(() => root.unmount())
  };
}

function productoDePrueba(overrides = {}) {
  return {
    id: 900,
    nombre: "Producto de prueba",
    descripcion: "Descripción del producto de prueba",
    precio: 1000,
    stock: 3,
    stockCritico: 1,
    categoria: "Mouse",
    imagen: "/img/mouse.jpg",
    ...overrides
  };
}

function StoreProbe({ product, onPurchase }) {
  const store = useStore();
  return React.createElement("div", null,
    React.createElement("button", { id: "add-product", onClick: () => store.addToCart(product, 2) }, "Agregar prueba"),
    React.createElement("button", { id: "complete-purchase", onClick: () => onPurchase(store.completePurchase({ customer: { nombre: "Cliente de prueba", correo: "cliente@gmail.com" } })) }, "Completar prueba")
  );
}

describe("Catálogo y validación de stock", () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  afterEach(() => logout());

  it("normaliza stock negativo a cero", () => {
    const [producto] = guardarProductos([{ id: 20, nombre: "Prueba", precio: 100, stock: -5, stockCritico: -2, categoria: "Mouse" }]);
    expect(producto.stock).toBe(0);
    expect(producto.stockCritico).toBe(0);
  });

  it("calcula el precio final de una oferta y limita el descuento", () => {
    expect(obtenerPrecioFinal({ precio: 10000, descuento: 15 })).toBe(8500);
    const [producto] = guardarProductos([{ id: 21, nombre: "Oferta", precio: 10000, descuento: 150, stock: 1, categoria: "Mouse" }]);
    expect(producto.descuento).toBe(100);
    expect(obtenerPrecioFinal(producto)).toBe(0);
  });

  it("mantiene categorías guardadas y las combina con las del catálogo", () => {
    guardarCategorias(["Mouse", "Audio"]);
    expect(leerCategorias([{ categoria: "Teclados" }, { categoria: "Mouse" }])).toEqual(["Audio", "Mouse", "Teclados"]);
  });

  it("rechaza cantidades negativas, cero y decimales", () => {
    expect(validarCantidad(-1, 10).ok).toBeFalse();
    expect(validarCantidad(0, 10).ok).toBeFalse();
    expect(validarCantidad(1.5, 10).ok).toBeFalse();
    expect(validarCantidad(2, 10).ok).toBeTrue();
  });

  it("indica cuando la cantidad supera el stock disponible", () => {
    const result = validarCantidad(11, 10);
    expect(result.ok).toBeFalse();
    expect(result.requiresConfirmation).toBeTrue();
    expect(result.available).toBe(10);
  });

  it("permite crear y eliminar productos en el mismo catálogo", () => {
    const product = crearProducto({ codigo: "TEST01", nombre: "Producto de prueba", descripcion: "Descripción", precio: 1000, stock: 4, stockCritico: 1, categoria: "Mouse" });
    expect(leerProductos().some((item) => item.id === product.id)).toBeTrue();
    eliminarProducto(product.id);
    expect(leerProductos().some((item) => item.id === product.id)).toBeFalse();
  });

  it("inicia sesión con el rol administrador sin exponer la contraseña", () => {
    const session = login("admin@duoc.cl", "Admin123");
    expect(session.tipo).toBe("Administrador");
    expect(session.password).toBeUndefined();
    expect(getSession().correo).toBe("admin@duoc.cl");
  });

  it("rechaza credenciales incorrectas", () => {
    expect(login("admin@duoc.cl", "incorrecta")).toBeNull();
    expect(getSession()).toBeNull();
  });

  it("valida el RUN y permite administrar usuarios", () => {
    expect(validarRun("190110222")).toBeTrue();
    expect(validarRun("19.011.022-2")).toBeTrue();
    expect(crearUsuario({ run: "19.011.022-2", nombre: "Duplicado", apellidos: "Admin", correo: "otro@gmail.com", password: "Cliente123" }).ok).toBeFalse();
    const result = crearUsuario({ run: "123456785", nombre: "Nuevo", apellidos: "Cliente", correo: "nuevo@gmail.com", password: "Cliente123", tipo: "Cliente", region: "Región Metropolitana", comuna: "Santiago", direccion: "Calle 1" });
    expect(result.ok).toBeTrue();
    expect(leerUsuarios().some((user) => user.run === "123456785")).toBeTrue();
    eliminarUsuario("123456785");
    expect(leerUsuarios().some((user) => user.run === "123456785")).toBeFalse();
  });

  it("guarda un pedido con su comprobante y productos", () => {
    const order = crearPedido({ orderNumber: "NXS-TEST01", customer: { nombre: "Cliente de prueba", correo: "cliente@gmail.com" }, items: [{ nombre: "Mouse", quantity: 2, precio: 1000 }], subtotal: 2000, total: 2000 });
    expect(leerPedidos()[0].orderNumber).toBe("NXS-TEST01");
    expect(leerPedidos()[0].items[0].quantity).toBe(2);
    expect(obtenerUltimoPedido().orderNumber).toBe("NXS-TEST01");
    expect(order.estado).toBe("Pendiente");
  });

  it("permite actualizar el estado de un pedido", () => {
    crearPedido({ orderNumber: "NXS-TEST02", customer: { nombre: "Cliente" }, items: [], total: 0 });
    const updated = actualizarEstadoPedido("NXS-TEST02", "Enviado");
    expect(updated.estado).toBe("Enviado");
    expect(leerPedidos()[0].estado).toBe("Enviado");
  });

  it("descuenta stock y guarda el precio rebajado al completar una compra", () => {
    const product = productoDePrueba({ precio: 1000, descuento: 10, stock: 3 });
    guardarProductos([product]);
    let result;
    const view = renderReact(React.createElement(
      BrowserRouter,
      null,
      React.createElement(StoreProvider, null, React.createElement(StoreProbe, { product, onPurchase: (value) => { result = value; } }))
    ));

    act(() => view.container.querySelector("#add-product").click());
    act(() => view.container.querySelector("#complete-purchase").click());
    expect(result.ok).toBeTrue();
    expect(leerProductos()[0].stock).toBe(1);
    expect(leerPedidos()[0].items[0].precio).toBe(900);
    expect(leerPedidos()[0].total).toBe(1800);
    view.cleanup();
  });
});

describe("Componentes React", () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  afterEach(() => {
    document.body.innerHTML = "";
    logout();
  });

  it("renderiza los datos principales de una tarjeta de producto", () => {
    const view = renderReact(React.createElement(
      BrowserRouter,
      null,
      React.createElement(StoreProvider, null,
        React.createElement(ProductCard, { product: productoDePrueba() })
      )
    ));

    expect(view.container.textContent).toContain("Producto de prueba");
    expect(view.container.textContent).toContain("3 unidad(es) disponibles");
    expect(view.container.querySelector("button").textContent).toContain("Agregar");
    view.cleanup();
  });

  it("responde al evento de agregar y actualiza el carrito persistido", () => {
    guardarProductos([productoDePrueba()]);
    const view = renderReact(React.createElement(
      BrowserRouter,
      null,
      React.createElement(StoreProvider, null,
        React.createElement(ProductCard, { product: productoDePrueba() })
      )
    ));

    act(() => view.container.querySelector("button").click());
    expect(JSON.parse(localStorage.getItem("carritoReact"))).toEqual([{ productId: 900, quantity: 1 }]);
    view.cleanup();
  });

  it("actualiza el estado del filtro y muestra el mensaje cuando no hay coincidencias", () => {
    const view = renderReact(React.createElement(
      MemoryRouter,
      null,
      React.createElement(StoreProvider, null,
        React.createElement(Products)
      )
    ));

    const searchInput = view.container.querySelector('input[placeholder="Buscar producto"]');
    act(() => {
      const valueSetter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set;
      valueSetter.call(searchInput, "producto inexistente");
      searchInput.dispatchEvent(new Event("input", { bubbles: true }));
    });

    expect(view.container.textContent).toContain("No encontramos productos con esos filtros.");
    view.cleanup();
  });

  it("renderiza el comprobante de compra con los datos del cliente y el total", () => {
    const receipt = {
      orderNumber: "NXS-12345678",
      createdAt: "16/10/2026, 12:00",
      customer: {
        nombre: "Cliente de prueba",
        correo: "cliente@gmail.com",
        telefono: "+56912345678",
        direccion: "Calle 1",
        departamento: "Casa 2",
        comuna: "Santiago",
        region: "Región Metropolitana",
        codigoPostal: "8320000"
      },
      delivery: "Envío estándar",
      payment: "Transferencia bancaria",
      items: [{ nombre: "Mouse de prueba", quantity: 2, precio: 1000 }],
      subtotal: 2000,
      shipping: 0,
      total: 2000
    };
    const view = renderReact(React.createElement(
      MemoryRouter,
      { initialEntries: [{ pathname: "/compra-exitosa", state: { receipt } }] },
      React.createElement(PurchaseSuccess)
    ));

    expect(view.container.textContent).toContain("NXS-12345678");
    expect(view.container.textContent).toContain("Cliente de prueba");
    expect(view.container.textContent).toContain("Mouse de prueba");
    expect(view.container.textContent).toContain("Total pagado");
    view.cleanup();
  });

  it("recupera el comprobante si se recarga la vista de compra exitosa", () => {
    crearPedido({ orderNumber: "NXS-PERSIST01", customer: { nombre: "Cliente persistente" }, items: [{ nombre: "Teclado", quantity: 1, precio: 2000 }], subtotal: 2000, total: 2000 });
    const view = renderReact(React.createElement(
      MemoryRouter,
      { initialEntries: ["/compra-exitosa"] },
      React.createElement(PurchaseSuccess)
    ));

    expect(view.container.textContent).toContain("NXS-PERSIST01");
    expect(view.container.textContent).toContain("Cliente persistente");
    view.cleanup();
  });

  it("renderiza el mensaje de compra fallida recibido por la ruta", () => {
    const view = renderReact(React.createElement(
      MemoryRouter,
      { initialEntries: [{ pathname: "/compra-fallida", state: { message: "El stock cambió." } }] },
      React.createElement(PurchaseFailure)
    ));

    expect(view.container.textContent).toContain("No se pudo completar la compra");
    expect(view.container.textContent).toContain("El stock cambió.");
    view.cleanup();
  });

  it("renderiza el acceso y el enlace de registro", () => {
    const view = renderReact(React.createElement(
      MemoryRouter,
      null,
      React.createElement(AuthProvider, null, React.createElement(Login))
    ));

    expect(view.container.textContent).toContain("Iniciar sesión");
    expect(view.container.textContent).toContain("Crear una cuenta");
    view.cleanup();
  });
});

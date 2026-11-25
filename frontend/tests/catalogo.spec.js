import { validarCantidad } from "../src/services/validaciones.js";
import { login, logout, recuperarSesion } from "../src/services/auth.js";
import { escucharSesion, get, guardarSesion } from "../src/services/api.js";
import { validarRun } from "../src/services/usuarios.js";
import { crearProducto, leerProductos } from "../src/services/catalogo.js";
import { estadosPosibles, leerPedidos } from "../src/services/pedidos.js";
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import ProductCard from "../src/components/ProductCard.jsx";
import ProtectedRoute from "../src/components/ProtectedRoute.jsx";
import Layout from "../src/components/Layout.jsx";
import Products from "../src/pages/Products.jsx";
import PurchaseSuccess from "../src/pages/PurchaseSuccess.jsx";
import PurchaseFailure from "../src/pages/PurchaseFailure.jsx";
import Login from "../src/pages/Login.jsx";
import { AuthProvider, StoreProvider, useStore } from "../src/App.jsx";
import { obtenerPrecioFinal } from "../src/services/precios.js";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;
const h = React.createElement;

const ADMIN = { id: 1, run: "190110222", nombre: "Usuario", apellidos: "Administrador", correo: "admin@duoc.cl", rol: "ADMIN" };
const CLIENTE = { id: 2, run: "201234565", nombre: "Cliente", apellidos: "Ejemplo", correo: "cliente@gmail.com", rol: "CLIENTE" };
const PRODUCTO = { id: 900, codigo: "P1", nombre: "Producto de prueba", descripcion: "Descripción", precio: 1000, descuento: 10, precioFinal: 900, stock: 3, stockCritico: 1, categoria: { id: 5, nombre: "Mouse" }, imagen: "/img/mouse.jpg" };
const PEDIDO = { id: 7, numero: "NXS-1", fecha: "2026-11-24T10:00:00", estado: "PENDIENTE", usuario: CLIENTE, nombreContacto: "Cliente", correo: "cliente@gmail.com", entrega: "express", pago: "tarjeta", subtotal: 1800, costoEnvio: 4990, total: 6790, detalles: [{ nombreProducto: "Producto de prueba", precioUnitario: 900, cantidad: 2 }] };

let llamadas;

// Reemplaza fetch: cada ruta entrega [status, body] o una función que lo calcula
function simularApi(rutas = {}) {
  llamadas = [];
  const todas = { "POST /api/auth/refresh": [401, { error: "Sin sesión" }], "GET /api/productos": [200, [PRODUCTO]], "GET /api/categorias": [200, [PRODUCTO.categoria]], "GET /api/usuarios": [200, [ADMIN, CLIENTE]], ...rutas };
  spyOn(window, "fetch").and.callFake(async (url, opciones = {}) => {
    const clave = `${opciones.method || "GET"} ${new URL(url).pathname}`;
    llamadas.push({ clave, ...opciones });
    const ruta = todas[clave];
    if (!ruta) throw new Error(`Ruta no simulada: ${clave}`);
    const [status, body] = typeof ruta === "function" ? ruta(opciones) : ruta;
    return new Response(status === 204 ? null : JSON.stringify(body), { status });
  });
}

const cantidad = (clave) => llamadas.filter((llamada) => llamada.clave === clave).length;
const sesionDe = (usuario, accessToken = "token") => [200, { accessToken, usuario }];

async function renderReact(element) {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);
  act(() => root.render(element));
  await esperar(() => {});
  return { container, cleanup: () => act(() => root.unmount()) };
}

const esperar = (accion) => act(async () => { accion(); await new Promise((listo) => setTimeout(listo, 20)); });
const conTienda = (hijo) => h(MemoryRouter, null, h(AuthProvider, null, h(StoreProvider, null, hijo)));

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
  escucharSesion(() => {});
  guardarSesion(null);
});

afterEach(() => { document.body.innerHTML = ""; });

describe("Validaciones", () => {
  it("calcula el precio final y usa el que entrega el servidor", () => {
    expect(obtenerPrecioFinal({ precio: 10000, descuento: 15 })).toBe(8500);
    expect(obtenerPrecioFinal({ precio: 10000, descuento: 15, precioFinal: 8400 })).toBe(8400);
  });

  it("rechaza cantidades negativas, cero y decimales", () => {
    expect(validarCantidad(-1, 10).ok).toBeFalse();
    expect(validarCantidad(0, 10).ok).toBeFalse();
    expect(validarCantidad(1.5, 10).ok).toBeFalse();
    expect(validarCantidad(2, 10).ok).toBeTrue();
  });

  it("indica cuando la cantidad supera el stock disponible", () => {
    const result = validarCantidad(11, 10);
    expect(result.requiresConfirmation).toBeTrue();
    expect(result.available).toBe(10);
  });

  it("valida el RUN", () => {
    expect(validarRun("19.011.022-2")).toBeTrue();
    expect(validarRun("19.011.022-3")).toBeFalse();
  });

  it("solo ofrece estados de pedido permitidos", () => {
    expect(estadosPosibles("Preparando")).toEqual(["Preparando", "Enviado", "Entregado", "Cancelado"]);
    expect(estadosPosibles("Enviado")).toEqual(["Enviado", "Entregado"]);
    expect(estadosPosibles("Cancelado")).toEqual(["Cancelado"]);
  });
});

describe("Comunicación con la API", () => {
  it("convierte productos y pedidos al formato de las pantallas", async () => {
    simularApi({ "GET /api/pedidos": [200, [PEDIDO]] });
    expect((await leerProductos())[0].categoria).toBe("Mouse");
    const [pedido] = await leerPedidos();
    expect(pedido.estado).toBe("Pendiente");
    expect(pedido.items[0]).toEqual({ nombre: "Producto de prueba", quantity: 2, precio: 900 });
  });

  it("envía el token y muestra los errores de validación del servidor", async () => {
    simularApi({ "POST /api/auth/login": sesionDe(ADMIN), "POST /api/productos": [400, { error: "Datos invalidos", campos: { nombre: "El nombre es obligatorio" } }] });
    await login("admin@duoc.cl", "Admin123");
    await expectAsync(crearProducto({ categoriaId: 5 })).toBeRejectedWithError("El nombre es obligatorio");
    expect(llamadas.at(-1).headers.Authorization).toBe("Bearer token");
  });

  it("avisa cuando el backend no responde", async () => {
    spyOn(window, "fetch").and.rejectWith(new TypeError("Failed to fetch"));
    await expectAsync(leerProductos()).toBeRejectedWithError(/No se pudo conectar/);
  });
});

describe("Sesión", () => {
  it("no guarda tokens ni contraseñas en el navegador", async () => {
    simularApi({ "POST /api/auth/login": sesionDe(ADMIN, "token-secreto") });
    await login("admin@duoc.cl", "Admin123");
    expect(JSON.stringify({ ...localStorage, ...sessionStorage })).not.toContain("token-secreto");
    expect(document.cookie).not.toContain("token-secreto");
  });

  it("recupera la sesión desde la cookie al recargar", async () => {
    let usuario = null;
    escucharSesion((valor) => { usuario = valor; });
    simularApi({ "POST /api/auth/refresh": sesionDe(CLIENTE) });
    await recuperarSesion();
    expect(usuario.correo).toBe("cliente@gmail.com");
    expect(llamadas[0].credentials).toBe("include");
  });

  it("renueva una sola vez el token vencido y repite las peticiones", async () => {
    guardarSesion({ accessToken: "viejo", usuario: CLIENTE });
    simularApi({
      "GET /api/pedidos/mios": (o) => o.headers.Authorization === "Bearer nuevo" ? [200, []] : [401, {}],
      "POST /api/auth/refresh": sesionDe(CLIENTE, "nuevo")
    });
    await Promise.all([get("/api/pedidos/mios"), get("/api/pedidos/mios")]);
    expect(cantidad("POST /api/auth/refresh")).toBe(1);
    expect(cantidad("GET /api/pedidos/mios")).toBe(4);
  });

  it("cierra la sesión si la renovación es rechazada", async () => {
    let usuario = CLIENTE;
    guardarSesion({ accessToken: "viejo", usuario: CLIENTE });
    escucharSesion((valor) => { usuario = valor; });
    simularApi({ "GET /api/pedidos/mios": [401, {}] });
    await expectAsync(get("/api/pedidos/mios")).toBeRejected();
    expect(usuario).toBeNull();
  });

  it("no repite la acción si la cookie pertenece a otro usuario", async () => {
    guardarSesion({ accessToken: "viejo", usuario: CLIENTE });
    simularApi({ "GET /api/pedidos/mios": [401, {}], "POST /api/auth/refresh": sesionDe(ADMIN, "nuevo") });
    await expectAsync(get("/api/pedidos/mios")).toBeRejected();
    expect(cantidad("GET /api/pedidos/mios")).toBe(1);
  });

  it("no finge el cierre de sesión si el servidor falla", async () => {
    let avisos = 0;
    guardarSesion({ accessToken: "token", usuario: CLIENTE });
    escucharSesion(() => { avisos += 1; });
    simularApi({ "POST /api/auth/logout": [500, {}] });
    await expectAsync(logout()).toBeRejected();
    expect(avisos).toBe(0);
  });
});

describe("Restricciones por rol", () => {
  const rutas = () => h(MemoryRouter, { initialEntries: ["/admin"] }, h(AuthProvider, null, h(StoreProvider, null, h(Layout, null, h(Routes, null,
    h(Route, { path: "/admin", element: h(ProtectedRoute, { role: "Administrador" }, h("p", null, "Contenido privado")) }),
    h(Route, { path: "/login", element: h(Login) }))))));

  it("envía al login a quien no tiene sesión", async () => {
    simularApi();
    const view = await renderReact(rutas());
    expect(view.container.textContent).toContain("Iniciar sesión");
    expect(view.container.textContent).not.toContain("Contenido privado");
    view.cleanup();
  });

  it("niega el acceso a un cliente y oculta el menú de administración", async () => {
    simularApi({ "POST /api/auth/refresh": sesionDe(CLIENTE) });
    const view = await renderReact(rutas());
    expect(view.container.textContent).toContain("Acceso denegado");
    expect(view.container.textContent).not.toContain("Contenido privado");
    expect(view.container.querySelector('nav a[href="/admin"]')).toBeNull();
    expect(cantidad("GET /api/usuarios")).toBe(0);
    view.cleanup();
  });

  it("permite el acceso a un administrador", async () => {
    simularApi({ "POST /api/auth/refresh": sesionDe(ADMIN) });
    const view = await renderReact(rutas());
    expect(view.container.textContent).toContain("Contenido privado");
    expect(view.container.querySelector('nav a[href="/admin"]')).not.toBeNull();
    view.cleanup();
  });
});

function StoreProbe({ onPurchase }) {
  const store = useStore();
  return h("div", null,
    h("button", { id: "add", onClick: () => store.addToCart(store.products[0], 2) }, "Agregar"),
    h("button", { id: "buy", onClick: () => store.completePurchase({ entrega: "estandar" }).then(onPurchase) }, "Comprar"));
}

describe("Compra", () => {
  async function comprar(respuesta) {
    let result;
    simularApi({ "POST /api/pedidos": respuesta });
    const view = await renderReact(conTienda(h(StoreProbe, { onPurchase: (valor) => { result = valor; } })));
    await esperar(() => view.container.querySelector("#add").click());
    await esperar(() => view.container.querySelector("#buy").click());
    view.cleanup();
    return result;
  }

  it("envía ids y cantidades, sin totales, y vacía el carrito", async () => {
    const result = await comprar([201, PEDIDO]);
    expect(result.pedido.total).toBe(6790);
    const body = JSON.parse(llamadas.find((llamada) => llamada.clave === "POST /api/pedidos").body);
    expect(body.items).toEqual([{ productoId: 900, cantidad: 2 }]);
    expect(body.total).toBeUndefined();
    expect(JSON.parse(localStorage.getItem("carritoReact"))).toEqual([]);
  });

  it("conserva el carrito si el servidor informa falta de stock", async () => {
    const result = await comprar([409, { error: "Stock insuficiente" }]);
    expect(result).toEqual({ ok: false, message: "Stock insuficiente" });
    expect(JSON.parse(localStorage.getItem("carritoReact"))).toEqual([{ productId: 900, quantity: 2 }]);
  });
});

describe("Carrito con productos eliminados", () => {
  it("los quita y lo avisa", async () => {
    localStorage.setItem("carritoReact", JSON.stringify([{ productId: 900, quantity: 1 }, { productId: 999, quantity: 1 }]));
    simularApi();
    const view = await renderReact(conTienda(h(Layout)));
    expect(view.container.textContent).toContain("ya no está disponible");
    expect(view.container.textContent).toContain("Carrito (1)");
    expect(JSON.parse(localStorage.getItem("carritoReact"))).toEqual([{ productId: 900, quantity: 1 }]);
    view.cleanup();
  });
});

describe("Componentes React", () => {
  const producto = { ...PRODUCTO, categoria: "Mouse" };

  it("renderiza la tarjeta y agrega al carrito persistido", async () => {
    simularApi();
    const view = await renderReact(conTienda(h(ProductCard, { product: producto })));
    expect(view.container.textContent).toContain("3 unidad(es) disponibles");
    await esperar(() => view.container.querySelector("button").click());
    expect(JSON.parse(localStorage.getItem("carritoReact"))).toEqual([{ productId: 900, quantity: 1 }]);
    view.cleanup();
  });

  it("filtra el catálogo y avisa cuando no hay coincidencias", async () => {
    simularApi();
    const view = await renderReact(conTienda(h(Products)));
    expect(view.container.textContent).toContain("Producto de prueba");
    const input = view.container.querySelector('input[placeholder="Buscar producto"]');
    await esperar(() => {
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set.call(input, "producto inexistente");
      input.dispatchEvent(new Event("input", { bubbles: true }));
    });
    expect(view.container.textContent).toContain("No encontramos productos con esos filtros.");
    view.cleanup();
  });

  it("muestra el comprobante con el pedido del servidor", async () => {
    simularApi({ "GET /api/pedidos": [200, [PEDIDO]] });
    const [receipt] = await leerPedidos();
    const view = await renderReact(h(MemoryRouter, { initialEntries: [{ pathname: "/compra-exitosa", state: { receipt } }] }, h(PurchaseSuccess)));
    expect(view.container.textContent).toContain("NXS-1");
    expect(view.container.textContent).toContain("Total pagado");
    view.cleanup();
  });

  it("muestra el motivo de una compra fallida", async () => {
    const view = await renderReact(h(MemoryRouter, { initialEntries: [{ pathname: "/compra-fallida", state: { message: "El stock cambió." } }] }, h(PurchaseFailure)));
    expect(view.container.textContent).toContain("El stock cambió.");
    view.cleanup();
  });

  it("renderiza el acceso y el enlace de registro", async () => {
    simularApi();
    const view = await renderReact(conTienda(h(Login)));
    expect(view.container.textContent).toContain("Crear una cuenta");
    view.cleanup();
  });
});

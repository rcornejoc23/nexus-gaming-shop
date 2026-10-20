import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { crearProducto, actualizarProducto, eliminarProducto, guardarProductos, leerProductos } from "./services/catalogo";
import { validarCantidad } from "./services/validaciones";
import { crearPedido } from "./services/pedidos";
import { obtenerPrecioFinal } from "./services/precios";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Categories from "./pages/Categories";
import Offers from "./pages/Offers";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import PurchaseSuccess from "./pages/PurchaseSuccess";
import PurchaseFailure from "./pages/PurchaseFailure";
import AdminDashboard from "./pages/AdminDashboard";
import AdminProducts from "./pages/AdminProducts";
import AdminProductForm from "./pages/AdminProductForm";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import { getSession, login, logout } from "./services/auth";
import { actualizarUsuario, crearUsuario, eliminarUsuario, leerUsuarios } from "./services/usuarios";
import AdminUsers from "./pages/AdminUsers";
import AdminUserForm from "./pages/AdminUserForm";
import AdminOrders from "./pages/AdminOrders";
import AdminOrderDetail from "./pages/AdminOrderDetail";
import AdminCategories from "./pages/AdminCategories";
import AdminReports from "./pages/AdminReports";
import AdminUserHistory from "./pages/AdminUserHistory";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import PurchaseHistory from "./pages/PurchaseHistory";
import About from "./pages/About";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";

const CART_KEY = "carritoReact";
const StoreContext = createContext(null);
const AuthContext = createContext(null);

function readCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(CART_KEY));
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

export function StoreProvider({ children }) {
  const [products, setProducts] = useState(() => leerProductos());
  const [cart, setCart] = useState(() => readCart());

  useEffect(() => localStorage.setItem(CART_KEY, JSON.stringify(cart)), [cart]);

  useEffect(() => {
    const syncProducts = (event) => {
      if (event.key === "productosAdmin") setProducts(leerProductos());
    };
    window.addEventListener("storage", syncProducts);
    return () => window.removeEventListener("storage", syncProducts);
  }, []);

  const refreshProducts = () => setProducts(leerProductos());

  const createProduct = (data) => {
    const product = crearProducto(data);
    refreshProducts();
    return product;
  };

  const updateProduct = (id, data) => {
    const product = actualizarProducto(id, data);
    refreshProducts();
    return product;
  };

  const deleteProduct = (id) => {
    const nextProducts = eliminarProducto(id);
    setProducts(nextProducts);
    return nextProducts;
  };

  const addToCart = (product, quantity = 1) => {
    const current = products.find((item) => item.id === product.id);
    if (!current || current.stock <= 0) return { ok: false, message: "Este producto no tiene stock disponible." };

    const existing = cart.find((item) => item.productId === current.id);
    const currentQuantity = existing?.quantity || 0;
    const available = Math.max(0, current.stock - currentQuantity);
    const validation = validarCantidad(quantity, available);
    if (!validation.ok) return { ok: false, requiresConfirmation: validation.requiresConfirmation, available, requested: Number(quantity), message: validation.message };
    const requested = validation.value;

    setCart((items) => existing
      ? items.map((item) => item.productId === current.id ? { ...item, quantity: item.quantity + requested } : item)
      : [...items, { productId: current.id, quantity: requested }]);
    return { ok: true };
  };

  const setCartQuantity = (productId, quantity) => {
    const current = products.find((item) => item.id === productId);
    if (!current) return { ok: false, message: "El producto ya no está disponible." };
    const validation = validarCantidad(quantity, current.stock);
    if (!validation.ok) return { ok: false, message: validation.message, available: current.stock };
    const requested = validation.value;
    setCart((items) => items.map((item) => item.productId === productId ? { ...item, quantity: requested } : item).filter((item) => item.quantity > 0));
    return { ok: true };
  };

  const removeFromCart = (productId) => setCart((items) => items.filter((item) => item.productId !== productId));

  const completePurchase = (orderData = {}) => {
    if (cart.length === 0) return { ok: false, message: "El carrito está vacío." };
    const nextProducts = products.map((product) => ({ ...product }));
    const purchaseItems = cart.map((item) => ({
      ...item,
      product: products.find((product) => product.id === item.productId)
    }));

    for (const item of purchaseItems) {
      if (!item.product) return { ok: false, message: "Uno de los productos ya no está disponible." };
      const product = nextProducts.find((current) => current.id === item.productId);
      if (!product || product.stock < item.quantity) return { ok: false, message: "El stock cambió. Revisa tu carrito e inténtalo nuevamente." };
    }

    purchaseItems.forEach((item) => {
      const product = nextProducts.find((current) => current.id === item.productId);
      product.stock -= item.quantity;
    });

    setProducts(guardarProductos(nextProducts));
    setCart([]);
    const subtotal = purchaseItems.reduce((sum, item) => sum + obtenerPrecioFinal(item.product) * item.quantity, 0);
    const pedido = crearPedido({
      ...orderData,
      items: orderData.items || purchaseItems.map(({ product, quantity }) => ({ nombre: product.nombre, quantity, precio: obtenerPrecioFinal(product) })),
      subtotal: orderData.subtotal ?? subtotal,
      shipping: orderData.shipping ?? 0,
      total: orderData.total ?? subtotal
    });
    return { ok: true, pedido };
  };

  const cartItems = useMemo(() => cart.map((item) => ({
    ...item,
    product: products.find((product) => product.id === item.productId)
  })).filter((item) => item.product), [cart, products]);

  const updateCategory = (previousCategory, nextCategory) => {
    const normalized = String(nextCategory || "").trim();
    const nextProducts = products.map((product) => product.categoria === previousCategory ? { ...product, categoria: normalized } : product);
    setProducts(guardarProductos(nextProducts));
    return nextProducts;
  };

  return <StoreContext.Provider value={{ products, cart: cartItems, cartCount: cart.reduce((total, item) => total + item.quantity, 0), addToCart, setCartQuantity, removeFromCart, completePurchase, refreshProducts, createProduct, updateProduct, updateCategory, deleteProduct }}>{children}</StoreContext.Provider>;
}

export function useStore() {
  return useContext(StoreContext);
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => getSession());
  const [users, setUsers] = useState(() => leerUsuarios());
  const signIn = (correo, password) => {
    const nextSession = login(correo, password);
    if (nextSession) setSession(nextSession);
    return nextSession;
  };
  const signOut = () => {
    logout();
    setSession(null);
  };
  const refreshUsers = () => setUsers(leerUsuarios());
  const createUser = (data) => {
    const result = crearUsuario(data);
    if (result.ok) refreshUsers();
    return result;
  };
  const updateUser = (run, data) => {
    const user = actualizarUsuario(run, data);
    refreshUsers();
    if (user && session?.run === String(run).toUpperCase()) {
      const { password, ...safeUser } = user;
      sessionStorage.setItem("usuarioActual", JSON.stringify(safeUser));
      setSession(safeUser);
    }
    return user;
  };
  const deleteUser = (run) => {
    const nextUsers = eliminarUsuario(run);
    refreshUsers();
    return nextUsers;
  };
  return <AuthContext.Provider value={{ session, users, signIn, signOut, createUser, updateUser, deleteUser }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

export default function App() {
  return <BrowserRouter><AuthProvider><StoreProvider><Layout><Routes>
    <Route path="/" element={<Home />} />
    <Route path="/productos" element={<Products />} />
    <Route path="/productos/:id" element={<ProductDetail />} />
    <Route path="/categorias" element={<Categories />} />
    <Route path="/ofertas" element={<Offers />} />
    <Route path="/nosotros" element={<About />} />
    <Route path="/blog" element={<Blog />} />
    <Route path="/contacto" element={<Contact />} />
    <Route path="/carrito" element={<Cart />} />
    <Route path="/checkout" element={<Checkout />} />
    <Route path="/compra-exitosa" element={<PurchaseSuccess />} />
    <Route path="/compra-fallida" element={<PurchaseFailure />} />
    <Route path="/login" element={<Login />} />
    <Route path="/registro" element={<Register />} />
    <Route path="/perfil" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
    <Route path="/historial-compras" element={<ProtectedRoute><PurchaseHistory /></ProtectedRoute>} />
    <Route path="/admin" element={<ProtectedRoute role="Administrador"><AdminDashboard /></ProtectedRoute>} />
    <Route path="/admin/productos" element={<ProtectedRoute role="Administrador"><AdminProducts /></ProtectedRoute>} />
    <Route path="/admin/productos/nuevo" element={<ProtectedRoute role="Administrador"><AdminProductForm /></ProtectedRoute>} />
    <Route path="/admin/productos/:id/editar" element={<ProtectedRoute role="Administrador"><AdminProductForm /></ProtectedRoute>} />
    <Route path="/admin/usuarios" element={<ProtectedRoute role="Administrador"><AdminUsers /></ProtectedRoute>} />
    <Route path="/admin/usuarios/nuevo" element={<ProtectedRoute role="Administrador"><AdminUserForm /></ProtectedRoute>} />
    <Route path="/admin/usuarios/:run/editar" element={<ProtectedRoute role="Administrador"><AdminUserForm /></ProtectedRoute>} />
    <Route path="/admin/usuarios/:run/historial" element={<ProtectedRoute role="Administrador"><AdminUserHistory /></ProtectedRoute>} />
    <Route path="/admin/categorias" element={<ProtectedRoute role="Administrador"><AdminCategories /></ProtectedRoute>} />
    <Route path="/admin/reportes" element={<ProtectedRoute role="Administrador"><AdminReports /></ProtectedRoute>} />
    <Route path="/admin/pedidos" element={<ProtectedRoute role="Administrador"><AdminOrders /></ProtectedRoute>} />
    <Route path="/admin/pedidos/:id" element={<ProtectedRoute role="Administrador"><AdminOrderDetail /></ProtectedRoute>} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes></Layout></StoreProvider></AuthProvider></BrowserRouter>;
}

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { crearProducto, actualizarProducto, eliminarProducto, leerProductos } from "./services/catalogo";
import { actualizarCategoria, crearCategoria, eliminarCategoria, leerCategorias } from "./services/categorias";
import { escucharSesion } from "./services/api";
import { validarCantidad } from "./services/validaciones";
import { crearPedido } from "./services/pedidos";
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
import { login, logout, recuperarSesion } from "./services/auth";
import { actualizarPerfil, actualizarUsuario, crearUsuario, desdeApi, eliminarUsuario, leerUsuarios, registrarUsuario } from "./services/usuarios";
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
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cargandoCatalogo, setCargandoCatalogo] = useState(true);
  const [errorCatalogo, setErrorCatalogo] = useState("");
  const [cart, setCart] = useState(() => readCart());
  const [avisoCarrito, setAvisoCarrito] = useState("");

  useEffect(() => localStorage.setItem(CART_KEY, JSON.stringify(cart)), [cart]);

  // Si falla se informa en pantalla; no lanza el error para no ocultar una acción que sí se guardó
  const ultimaLectura = useRef(0);
  const refreshProducts = useCallback(async () => {
    const lectura = ++ultimaLectura.current;
    try {
      const [nextProducts, nextCategories] = await Promise.all([leerProductos(), leerCategorias()]);
      // Si se pidió una lectura más nueva, esta respuesta ya no sirve
      if (lectura !== ultimaLectura.current) return;
      setProducts(nextProducts);
      setCategories(nextCategories);
      setErrorCatalogo("");
    } catch (error) {
      if (lectura === ultimaLectura.current) setErrorCatalogo(error.message);
    } finally {
      if (lectura === ultimaLectura.current) setCargandoCatalogo(false);
    }
  }, []);

  useEffect(() => { refreshProducts(); }, [refreshProducts]);

  // Ejecuta un cambio en la API y luego vuelve a leer el catálogo
  const conRecarga = (accion) => async (...args) => {
    const resultado = await accion(...args);
    await refreshProducts();
    return resultado;
  };

  const createProduct = conRecarga(crearProducto);
  const updateProduct = conRecarga(actualizarProducto);
  const deleteProduct = conRecarga(eliminarProducto);
  const createCategory = conRecarga(crearCategoria);
  const updateCategory = conRecarga(actualizarCategoria);
  const deleteCategory = conRecarga(eliminarCategoria);

  const addToCart = (product, quantity = 1) => {
    const current = products.find((item) => item.id === product.id);
    if (!current || current.stock <= 0) return { ok: false, message: "Este producto no tiene stock disponible." };

    const existing = cart.find((item) => item.productId === current.id);
    const currentQuantity = existing?.quantity || 0;
    const available = Math.max(0, current.stock - currentQuantity);
    const validation = validarCantidad(quantity, available);
    if (!validation.ok) return { ok: false, requiresConfirmation: validation.requiresConfirmation, available, requested: Number(quantity), message: validation.message };
    const requested = validation.value;

    setCart((items) => items.some((item) => item.productId === current.id)
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

  const cartItems = useMemo(() => cart.map((item) => ({
    ...item,
    product: products.find((product) => product.id === item.productId)
  })).filter((item) => item.product), [cart, products]);

  // Quita del carrito los productos eliminados del catálogo y lo avisa
  useEffect(() => {
    if (cargandoCatalogo || errorCatalogo || cartItems.length === cart.length) return;
    setCart(cartItems.map(({ productId, quantity }) => ({ productId, quantity })));
    setAvisoCarrito("Quitamos de tu carrito un producto que ya no está disponible.");
  }, [cargandoCatalogo, errorCatalogo, cart, cartItems]);

  // El servidor valida el stock y calcula el total; aquí solo se envían ids y cantidades
  const completePurchase = async (orderData) => {
    if (cartItems.length !== cart.length) return { ok: false, message: "Un producto de tu carrito ya no está disponible. Revisa tu compra." };
    if (cartItems.length === 0) return { ok: false, message: "El carrito está vacío." };
    try {
      const items = cartItems.map((item) => ({ productoId: item.productId, cantidad: item.quantity }));
      const pedido = await crearPedido({ ...orderData, items });
      setCart([]);
      await refreshProducts();
      return { ok: true, pedido };
    } catch (error) {
      await refreshProducts();
      return { ok: false, message: error.message };
    }
  };

  const value = {
    products, categories, cargandoCatalogo, errorCatalogo, refreshProducts,
    cart: cartItems, cartCount: cartItems.reduce((total, item) => total + item.quantity, 0),
    avisoCarrito, cerrarAviso: () => setAvisoCarrito(""), addToCart, setCartQuantity, removeFromCart, completePurchase,
    createProduct, updateProduct, deleteProduct, createCategory, updateCategory, deleteCategory
  };
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  return useContext(StoreContext);
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [cargandoSesion, setCargandoSesion] = useState(true);
  const [users, setUsers] = useState([]);
  const [errorUsuarios, setErrorUsuarios] = useState("");
  const esAdmin = session?.tipo === "Administrador";

  // api.js avisa cuando la sesión se inicia, se renueva o expira
  useEffect(() => {
    escucharSesion((usuario) => setSession(desdeApi(usuario)));
    recuperarSesion().finally(() => setCargandoSesion(false));
    return () => escucharSesion(() => {});
  }, []);

  const ultimaLectura = useRef(0);
  const refreshUsers = useCallback(async () => {
    const lectura = ++ultimaLectura.current;
    try {
      const nextUsers = await leerUsuarios();
      if (lectura !== ultimaLectura.current) return;
      setUsers(nextUsers);
      setErrorUsuarios("");
    } catch (error) {
      if (lectura === ultimaLectura.current) setErrorUsuarios(`No se pudo actualizar la lista de usuarios. ${error.message}`);
    }
  }, []);

  // La lista de usuarios solo se pide si quien entró es administrador
  useEffect(() => {
    if (esAdmin) refreshUsers();
    else {
      ultimaLectura.current += 1; // descarta una lectura pendiente al cerrar sesión
      setUsers([]);
    }
  }, [esAdmin, refreshUsers]);

  const signIn = async (correo, password) => desdeApi(await login(correo, password));

  const signOut = async () => {
    try {
      await logout();
    } catch (error) {
      window.alert(`No se pudo cerrar la sesión. ${error.message}`);
    }
  };

  const createUser = async (data) => {
    const user = await crearUsuario(data);
    await refreshUsers();
    return user;
  };
  const updateUser = async (id, data) => {
    const user = await actualizarUsuario(id, data);
    if (id === session?.id) setSession(user);
    await refreshUsers();
    return user;
  };
  const updateProfile = async (data) => {
    const user = await actualizarPerfil(data);
    setSession(user);
    return user;
  };
  const deleteUser = async (id) => {
    await eliminarUsuario(id);
    await refreshUsers();
  };
  return <AuthContext.Provider value={{ session, cargandoSesion, users, errorUsuarios, signIn, signOut, register: registrarUsuario, createUser, updateUser, updateProfile, deleteUser }}>{children}</AuthContext.Provider>;
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
    <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
    <Route path="/compra-exitosa" element={<ProtectedRoute><PurchaseSuccess /></ProtectedRoute>} />
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

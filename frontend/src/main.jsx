import React from "react";
import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./styles/app.css";
import App from "./App";

// Borra los datos que la versión anterior guardaba en el navegador (incluía contraseñas)
["usuariosAdmin", "productosAdmin", "pedidosNexus", "ultimoPedidoNexus", "categoriasNexus"].forEach((clave) => localStorage.removeItem(clave));
sessionStorage.removeItem("usuarioActual");

ReactDOM.createRoot(document.getElementById("root")).render(<React.StrictMode><App /></React.StrictMode>);

# NEXUS Gaming

Tienda online de productos gaming. Evaluación Parcial 3 de Desarrollo Fullstack II.

## Ejecutar
Requisitos: Node.js 20 o superior y el backend `nexus-gaming-backend` corriendo en `http://localhost:8080`.

```bash
npm install
npm run dev
```

Abrir `http://localhost:5173`. El puerto es fijo porque el CORS del backend solo acepta ese origen.
Para usar otra URL de API, copiar `.env.example` a `.env`.

## Usuarios de demostración
| Rol | Correo | Contraseña |
|---|---|---|
| Administrador | `admin@duoc.cl` | `Admin123` |
| Cliente | `cliente@gmail.com` | `Cliente123` |

## Sesión y permisos
- Access token en memoria y refresh token en cookie `HttpOnly`; la sesión se mantiene al recargar.
- `ProtectedRoute` restringe las pantallas según sesión y rol. El backend valida cada petición.
- `localStorage` solo guarda el carrito y los mensajes de contacto.

## Pruebas
```bash
npm test
```

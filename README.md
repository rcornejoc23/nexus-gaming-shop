# NEXUS Gaming

Tienda online de productos gaming desarrollada con HTML, CSS y JavaScript para la Evaluación Parcial 1 de Desarrollo Fullstack II.

## Funcionalidades

- Catálogo de productos con detalle por identificador.
- Carrito persistente usando `localStorage`.
- Registro y login de usuarios para la demo.
- Panel administrativo protegido para gestionar productos y usuarios.
- Validaciones personalizadas para formularios.
- Diseño responsive con hojas de estilo externas.

## Ejecutar el proyecto

El proyecto no necesita instalación de dependencias. Puede abrirse con un servidor local, por ejemplo:

```bash
python3 -m http.server 8000
```

Luego visita `http://localhost:8000`.

## Usuario administrador de demostración

- Correo: `admin@duoc.cl`
- Contraseña: `Admin123`

Los usuarios y productos se guardan localmente en el navegador mediante `localStorage`. Esta implementación es apropiada para una demostración frontend, pero no reemplaza una autenticación ni una base de datos de producción.

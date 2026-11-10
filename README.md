# FitZone Gym

Sitio web de FitZone Gym con información del gimnasio, planes, clases, horarios e inscripción. Incluye también un portal de usuario con perfil, rutinas, calendario y seguimiento del progreso.

## Tecnologías

- **Frontend:** React 18, Vite, Tailwind CSS y React Router.
- **Backend:** Node.js, Express y TypeScript.
- **Base de datos:** PostgreSQL.

## Requisitos

- Node.js y npm.
- PostgreSQL para usar las funciones de planes, inscripción y contacto.

## Instalación

Instala las dependencias del frontend desde la raíz del proyecto:

```bash
npm install
```

Instala las dependencias del backend:

```bash
cd backend
npm install
```

## Configuración de la base de datos

Crea `backend/.env` con las credenciales de tu instancia PostgreSQL:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=tu_contraseña
DB_NAME=fitzone
```

La base debe contener las tablas que consulta la API:

- `planes`: `id`, `nombre`, `descripcion`, `precio`, `duracion_dias` y `estado`.
- `usuarios`: `id`, `nombre`, `apellido`, `correo`, `telefono`, `plan` y `fecha_registro`.
- `contactos`: `id`, `nombre`, `correo`, `telefono`, `mensaje` y `fecha_envio`.

La consulta de planes devuelve únicamente los registros con `estado = TRUE`. Este repositorio no incluye un script de creación o carga de estas tablas.

## Ejecución en desarrollo

Abre dos terminales desde la raíz del proyecto.

En la primera, inicia el backend:

```bash
cd backend
npm run dev
```

La API estará disponible en `http://localhost:3000`.

En la segunda, inicia el frontend:

```bash
npm run dev
```

Vite mostrará en la terminal la dirección local del sitio, normalmente `http://localhost:5173`.

## API disponible

| Método | Ruta | Descripción |
| --- | --- | --- |
| `GET` | `/api` | Comprueba que el servidor está activo. |
| `GET` | `/api/planes` | Devuelve los planes activos. |
| `POST` | `/api/usuarios` | Registra una inscripción. |
| `POST` | `/api/contactos` | Registra un mensaje de contacto. |

## Compilación del frontend

Desde la raíz del proyecto:

```bash
npm run build
```

Para servir localmente la compilación:

```bash
npm run preview
```

## Nota sobre el portal

El inicio de sesión y el registro del portal son de demostración: el perfil se almacena en `localStorage` y la sesión en `sessionStorage` del navegador. No representan autenticación segura ni usan la API del backend.
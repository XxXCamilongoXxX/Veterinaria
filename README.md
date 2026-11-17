# 🐾 Veterinaria San Marcos

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![Vitest](https://img.shields.io/badge/Vitest-FCC72B?style=for-the-badge&logo=vitest&logoColor=1E1E20)
![Bootstrap](https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white)

Aplicación web moderna para una clínica veterinaria en Rancagua. Permite a los clientes explorar servicios, crear cuentas, solicitar atenciones para mascotas y ofrece paneles de administración exclusivos protegidos por inicio de sesión.

---

## ✨ Funcionalidades Principales

- **🛍️ Catálogo interactivo:** Servicios con filtros por tipo de mascota y página de detalle.
- **🔐 Autenticación:** Registro, inicio de sesión y perfil de cliente protegidos.
- **🛒 Carrito de solicitudes:** Gestión de reservas con fecha específica para cada servicio.
- **⚙️ Panel de Administración (CRUD):** Interfaz protegida para agregar nuevos servicios al sistema en memoria.
- **🩺 Bandeja Veterinaria:** Gestión de solicitudes entrantes para marcarlas como atendidas.
- **📱 Diseño Responsivo:** Navegación 100% adaptable a dispositivos móviles gracias a Bootstrap.

## 🚀 Instalación y ejecución

Para levantar el frontend en modo desarrollo, asegúrate de tener **Node.js** y **npm** instalados. Ejecuta los siguientes comandos en tu terminal:

```bash
# 0. Entrar a la carpeta del frontend
cd front

# 1. Instalar todas las dependencias
npm install

# 2. Levantar el servidor de desarrollo
npm run dev
```

El frontend ahora consume la API de Spring Boot. Para levantar todo el entorno (web, API y MySQL) con Docker, copia `.env.example` a `.env`, cambia las claves y ejecuta:

```bash
docker compose up --build
```

La web estará en `http://localhost:8080`, la API en `http://localhost:8081` y su documentación OpenAPI en `http://localhost:8081/swagger-ui.html`. Swagger agrupa las rutas por recurso; usa el botón **Authorize** para pegar el JWT que entrega `/api/v1/auth/login` cuando pruebes rutas protegidas. Flyway crea el esquema y carga el catálogo inicial automáticamente. MySQL persiste datos en el volumen `veterinaria-mysql`.

Para desarrollo separado, inicia el backend con Java 21 y Maven desde `back/` (`mvn spring-boot:run`) y el frontend desde `front/` con `npm run dev`; Vite reenvía `/api` a `localhost:8080`. También se puede definir `VITE_API_URL` para apuntar a otra URL de API.

> Vite mostrará en la terminal una URL local (ej. `http://localhost:5173`) para abrir la aplicación en tu navegador.

## 🔑 Accesos de Demostración (Login)

El proyecto incluye cuentas estáticas preconfiguradas para evaluar las rutas protegidas. Utiliza las siguientes credenciales en la vista de Login para acceder a los paneles de administración:

| Rol | Correo | Contraseña |
| :--- | :--- | :--- |
| 👑 **Administrador** | `admin@vetsanmarcos.cl` | `Admin123` (configurable con `DEMO_ADMIN_PASSWORD`) |
| 🩺 **Veterinario** | `veterinario@vetsanmarcos.cl` | `Vet2026` (configurable con `DEMO_VET_PASSWORD`) |

*(Cuentas de demostración; cambia sus claves antes de desplegar el sistema.)*

## 📁 Estructura del proyecto

```
Veterinaria/
├── front/   → Frontend React + Vite (npm install / npm run dev)
├── back/    → Backend Spring Boot (mvn spring-boot:run)
└── docker-compose.yml
```

## 🐶 CRUD de Mascotas (Guía 3.2.2)

Conexión del backend Spring Boot con el frontend React usando **Axios** y **react-router-dom**.

- **Backend (`back/`)**: entidad `Mascota` (`nombre`, `especie`, `dueno`), `MascotaRepository`, `MascotaService`, `MascotaController` en `/api/mascotas`, migración Flyway `V3__create_mascotas.sql`, `CorsConfig` (Paso 7) y prueba `MascotaServiceTest`. La ruta `/api/mascotas/**` es pública, como en la guía.
- **Frontend (`front/`)**: `src/services/MascotaService.js`, `src/components/MascotaList.jsx` y `src/components/MascotaForm.jsx`, con las rutas `/mascotas`, `/mascotas/nueva` y `/mascotas/editar/:id` (enlace **Mascotas** en el menú).

| Método y ruta | Función |
| --- | --- |
| `GET /api/mascotas` | Listar mascotas |
| `GET /api/mascotas/{id}` | Obtener una mascota |
| `POST /api/mascotas` | Registrar mascota |
| `PUT /api/mascotas/{id}` | Actualizar mascota |
| `DELETE /api/mascotas/{id}` | Eliminar mascota |

Para probarlo: inicia el backend en `back/` (puerto 8080), luego en `front/` ejecuta `npm install` y `npm run dev`, y abre `http://localhost:5173/mascotas`.

## 🧩 Backend

La API está en `back/` y usa Spring Boot, Spring Security, JWT, JPA, Flyway y MySQL. Incluye registro e inicio de sesión, catálogo de servicios y solicitudes de atención para la aplicación; además, incorpora CRUD independiente para Producto, Cliente y Venta. Estas tres entidades de la pauta no tienen relaciones JPA entre sí: Venta conserva `clienteId` y `productoId` como identificadores escalares. Las contraseñas se guardan con BCrypt; los roles `admin` y `veterinario` se crean como cuentas de demostración al iniciar por primera vez.

| Método y ruta | Acceso | Función |
| --- | --- | --- |
| `POST /api/v1/auth/registro` | Público | Crear cuenta cliente |
| `POST /api/v1/auth/login` | Público | Iniciar sesión y recibir JWT |
| `GET /api/v1/servicios` | Público | Listar servicios activos |
| `POST/PUT/DELETE /api/v1/servicios` | Admin | Administrar catálogo |
| `GET/POST /api/v1/solicitudes` | Sesión | Consultar o crear solicitudes |
| `PATCH /api/v1/solicitudes/{id}/estado` | Veterinario/Admin | Cambiar estado |
| `GET/POST /api/v1/productos` | Sesión | Listar o crear productos |
| `GET/PUT/DELETE /api/v1/productos/{id}` | Sesión | Consultar, actualizar o eliminar productos |
| `GET/POST /api/v1/clientes` | Sesión | Listar o crear clientes |
| `GET/PUT/DELETE /api/v1/clientes/{id}` | Sesión | Consultar, actualizar o eliminar clientes |
| `GET/POST /api/v1/ventas` | Sesión | Listar o registrar ventas |
| `GET/PUT/DELETE /api/v1/ventas/{id}` | Sesión | Consultar, actualizar o eliminar ventas |

Las pruebas unitarias de los tres servicios usan JUnit, Mockito y DataFaker. Ejecútalas desde `back/` con `mvn test`.

Las claves locales por defecto son solo para desarrollo. Configura `JWT_SECRET`, `DB_PASSWORD`, `MYSQL_ROOT_PASSWORD` y las claves demo usando `.env` antes de publicar el sistema. El JSON OpenAPI también está disponible en `http://localhost:8081/v3/api-docs`.

## 🧪 Pruebas Unitarias (Vitest)

El proyecto cuenta con una suite de **20 pruebas unitarias** que validan el comportamiento de los componentes utilizando el patrón AAA. 

```bash
# Ejecutar las pruebas unitarias
npm run test
```

## 📁 Estructura del Proyecto (Atomic Design)

```text
src/
├── components/   # Componentes modulares (Atoms, Molecules, Organisms)
├── context/      # Estados globales (TiendaContext, Sesión, Carrito)
├── data/         # Datos iniciales de respaldo del catálogo
├── pages/        # Vistas completas y rutas de react-router-dom
└── styles/       # Estilos globales y paleta de colores
public/img/       # Recursos estáticos y fotografías
```

## 📚 Documentación Adjunta

- 📄 [Especificación de Requisitos de Software (ERS)](ERS.md)
- 🎯 [Plan de pruebas (Vitest)](plan_de_pruebas.md)
- 📊 [Presentación del Proyecto](entregables/Veterinaria_San_Marcos_ERS_presentacion.pptx)

---
*El catálogo, las cuentas y las solicitudes se persisten en MySQL. El carrito y los favoritos son estado temporal del frontend.*

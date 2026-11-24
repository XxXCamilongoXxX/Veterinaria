# 🐾 Veterinaria San Marcos

Aplicación Full Stack para una clínica veterinaria de Rancagua.

- **Backend:** Spring Boot 3.5 (Java 21) · Spring Security + JWT · JPA · Flyway · MySQL 8 · Swagger/OpenAPI
- **Frontend:** React 19 + Vite · Axios · React Router · React Bootstrap

| Entregable | Enlace |
| --- | --- |
| Repositorio GitHub | https://github.com/XxXCamilongoXxX/Veterinaria |
| Tablero Trello | _(pegar enlace aquí)_ |
| Presentación | _(pegar enlace o ruta del PPT)_ |

---

## 🔑 Cuentas de prueba

Se crean automáticamente al iniciar el backend por primera vez (las contraseñas quedan cifradas con BCrypt).

| Rol | Correo | Contraseña |
| --- | --- | --- |
| **ADMIN** | `admin@vetsanmarcos.cl` | `Admin123` |
| **USER** | `usuario@vetsanmarcos.cl` | `User2026` |
| VETERINARIO (rol extra) | `veterinario@vetsanmarcos.cl` | `Vet2026` |

Cualquier persona que se registre desde la web queda con rol **USER**.

---

## ▶️ Ejecución separada (IntelliJ + VSCode)

### 1. Base de datos (MySQL)
Con MySQL 8 corriendo en el puerto 3306, ejecuta en MySQL Workbench o en la consola:

```sql
SOURCE database/crear_bd_vacia.sql;
```

Esto crea la base `veterinaria` vacía y el usuario `veterinaria` / `veterinaria_local`.
Las tablas y los datos los crea **Flyway** al iniciar el backend.

> Alternativa: `database/script_completo.sql` crea la base, las tablas y los datos de prueba de una sola vez (mismo contenido que las migraciones V1–V5).

### 2. Backend (IntelliJ)
1. Abrir la carpeta `back/` como proyecto Maven.
2. En *Run → Edit Configurations → Environment variables* agregar:
   ```
   SPRING_DATASOURCE_USERNAME=veterinaria;SPRING_DATASOURCE_PASSWORD=veterinaria_local
   ```
   (o usa tu usuario `root` y su contraseña).
3. Ejecutar `VeterinariaApiApplication`.
4. API: `http://localhost:8080` · Swagger: **http://localhost:8080/swagger-ui.html**

### 3. Frontend (VSCode)
```bash
cd front
npm install
npm run dev
```
Abrir **http://localhost:5173**. Vite reenvía las peticiones `/api` al backend en el puerto 8080.

---

## 🐳 Ejecución con Docker (opcional)

```bash
cp .env.example .env      # en Windows: copy .env.example .env
docker compose up --build
```

| Servicio | URL |
| --- | --- |
| Web | http://localhost:3000 |
| API | http://localhost:8081 |
| Swagger | http://localhost:8081/swagger-ui.html |

> Se ejecuta desde la carpeta raíz con `docker compose`, no con `docker build .`.
> Detén el backend de IntelliJ antes si usa el mismo puerto.

---

## 🔐 Autenticación y roles

1. `POST /api/v1/auth/login` valida correo y contraseña (BCrypt) y devuelve un **JWT** firmado con HS256.
2. El token lleva el correo (`sub`), el rol (`roles`) y la fecha de expiración (12 h).
3. React lo guarda en `localStorage` (la sesión persiste al recargar) y un **interceptor de Axios** (`front/src/api.js`) lo envía en el header `Authorization: Bearer <token>`.
4. **Cerrar sesión** borra el token. Si el backend responde 401 (token vencido), la sesión se cierra sola.
5. Las reglas de acceso están centralizadas en `SecurityConfig.java`:

| Recurso | GET | POST / PUT / DELETE |
| --- | --- | --- |
| `/api/v1/auth/**` | Público | Público |
| `/api/v1/servicios` | Público | **ADMIN** |
| `/api/v1/productos` | Logueado (USER/ADMIN) | **ADMIN** |
| `/api/v1/mascotas` | Logueado (USER/ADMIN) | **ADMIN** |
| `/api/v1/clientes` | **ADMIN** | **ADMIN** |
| `/api/v1/ventas` | **ADMIN** | **ADMIN** |
| `/api/v1/solicitudes` | Logueado (USER ve solo las suyas) | Crear: logueado · Cambiar estado (PATCH): VETERINARIO/ADMIN |

Sin token → **401 Unauthorized**. Con token pero sin el rol → **403 Forbidden**.

### Probar en Swagger
1. Ejecutar `POST /api/v1/auth/login` con `{"correo":"admin@vetsanmarcos.cl","clave":"Admin123"}`.
2. Copiar el `token` de la respuesta → botón **Authorize** → pegarlo (sin la palabra Bearer).
3. Ejecutar cualquier endpoint. Para ver el 403, repetir con la cuenta USER e intentar un DELETE.

---

## 🖥️ CRUD desde React

| Pantalla | Ruta | Operaciones |
| --- | --- | --- |
| Panel ADMIN – Servicios | `/admin` | Crear, listar, editar, eliminar |
| Productos (ADMIN) | `/admin/productos` | Crear, listar, editar, eliminar |
| Mascotas | `/mascotas` | USER: listar · ADMIN: crear, editar, eliminar |
| Carrito / Solicitudes | `/carrito`, `/veterinario` | Crear solicitud, cambiar estado |

Todas las peticiones pasan por los servicios de `front/src/services/` (Axios) y se guardan en MySQL.

---

## 🗄️ Base de datos

- Migraciones Flyway: `back/src/main/resources/db/migration` (V1 esquema, V2 productos/clientes/ventas, V3 mascotas, V4 roles, V5 datos de prueba).
- Scripts independientes: carpeta `database/`.
- `spring.jpa.hibernate.ddl-auto=validate`: Hibernate no crea tablas, solo verifica que coincidan con las entidades.

## 🧪 Pruebas

```bash
cd back && mvn test        # JUnit + Mockito (servicios)
cd front && npm run test   # Vitest + Testing Library (Axios simulado)
```

## 📁 Estructura

```text
Veterinaria/
├── back/       Spring Boot (config, controller, model, repository, service)
├── front/      React (components, context, pages, services, api.js)
├── database/   Scripts SQL para crear y poblar la base
└── docker-compose.yml
```

## 📚 Documentación
- [Especificación de Requisitos (ERS)](ERS.md)
- [Plan de pruebas](plan_de_pruebas.md)

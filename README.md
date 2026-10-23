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

Para levantar este proyecto en tu entorno local, asegúrate de tener **Node.js** y **npm** instalados. Ejecuta los siguientes comandos en tu terminal:

```bash
# 1. Instalar todas las dependencias
npm install

# 2. Levantar el servidor de desarrollo
npm run dev
```

> Vite mostrará en la terminal una URL local (ej. `http://localhost:5173`) para abrir la aplicación en tu navegador.

## 🔑 Accesos de Demostración (Login)

El proyecto incluye cuentas estáticas preconfiguradas para evaluar las rutas protegidas. Utiliza las siguientes credenciales en la vista de Login para acceder a los paneles de administración:

| Rol | Correo | Contraseña |
| :--- | :--- | :--- |
| 👑 **Administrador** | `admin@vetsanmarcos.cl` | `Admin123` |
| 🩺 **Veterinario** | `veterinario@vetsanmarcos.cl` | `Vet2026` |

*(Nota: Estos datos son exclusivamente para la demostración del prototipo frontend).*

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
├── data/         # Mock data y datos iniciales de servicios
├── pages/        # Vistas completas y rutas de react-router-dom
└── styles/       # Estilos globales y paleta de colores
public/img/       # Recursos estáticos y fotografías
```

## 📚 Documentación Adjunta

- 📄 [Especificación de Requisitos de Software (ERS)](ERS.md)
- 🎯 [Plan de pruebas (Vitest)](plan_de_pruebas.md)
- 📊 [Presentación del Proyecto](entregables/Veterinaria_San_Marcos_ERS_presentacion.pptx)

---
*Desarrollado como entrega final para la asignatura de Desarrollo Frontend. La persistencia temporal se maneja mediante `localStorage` y el estado de React.*

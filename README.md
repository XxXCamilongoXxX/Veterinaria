# Veterinaria San Marcos

Aplicación web de una clínica veterinaria en Rancagua. Permite explorar servicios, crear una cuenta, solicitar atenciones para mascotas y revisar las solicitudes desde una bandeja veterinaria.

## Funcionalidades

- Catálogo de servicios con filtros por tipo de mascota y página de detalle.
- Registro, inicio de sesión y perfil de cliente.
- Carrito de solicitudes con fecha para cada servicio.
- Panel de administración para agregar servicios.
- Bandeja veterinaria para revisar solicitudes y marcarlas como atendidas.
- Navegación adaptable a pantallas pequeñas.

## Requisitos

- Node.js y npm instalados.

## Instalación y ejecución

Desde la carpeta del proyecto, instala las dependencias y levanta el servidor de desarrollo:

```bash
npm install
npm run dev
```

Vite mostrará en la terminal la dirección local para abrir la aplicación en el navegador.

## Comandos disponibles

```bash
npm run dev      # Servidor de desarrollo
npm run build    # Genera la versión de producción en dist/
npm run preview  # Previsualiza la versión compilada
npm run lint     # Revisa el código con ESLint
npm test         # Ejecuta las pruebas unitarias con Vitest
```

## Acceso de demostración

El proyecto contiene accesos estáticos para mostrar las vistas de administrador y veterinario. Son solo para demostración; no uses el prototipo para almacenar datos reales.

## Estructura del proyecto

```text
src/
  components/   Componentes reutilizables de interfaz
  context/      Estado compartido de la tienda y sesión
  data/         Datos iniciales de servicios
  pages/        Vistas y rutas de la aplicación
  styles/       Estilos globales y de la aplicación React
public/img/     Recursos estáticos
ERS.md          Especificación de Requisitos de Software
plan_de_pruebas.md  Escenarios de pruebas documentados
```

## Documentación

- [Especificación de Requisitos de Software](ERS.md)
- [Plan de pruebas](plan_de_pruebas.md)

## Alcance y limitaciones

La aplicación es un prototipo frontend hecho con React y Vite. No cuenta con servidor ni base de datos. Las solicitudes confirmadas se guardan en `localStorage` del navegador actual, y el carrito, favoritos y servicios agregados pueden reiniciarse al recargar. La confirmación no procesa pagos ni envía datos a un sistema externo. Consulta [ERS.md](ERS.md) para el detalle de los requisitos y límites.

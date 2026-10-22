# Plan de pruebas unitarias

Las pruebas usan Vitest, React Testing Library y el patrón AAA (Arrange, Act, Assert). Ejecutar con `npm test`.

| ID | Componente | Escenario | Preparación (Arrange) | Acción (Act) | Resultado esperado (Assert) |
|---|---|---|---|---|---|
| PU-001 | TarjetaServicio | Renderiza el servicio | Servicio de vacunación y proveedores | Renderizar tarjeta | Se muestra su nombre |
| PU-002 | TarjetaServicio | Muestra el precio | Servicio con precio $12.000 | Renderizar tarjeta | Precio visible con formato CLP |
| PU-003 | TarjetaServicio | Agregar a carrito | Renderizar tarjeta | Clic en Agregar | Contador del carrito aumenta |
| PU-004 | TarjetaServicio | Guardar favorito | Renderizar tarjeta | Clic en favorito | El control indica que se puede quitar |
| PU-005 | FormularioAcceso | Correo vacío | Renderizar login | Enviar vacío | Se muestra validación obligatoria |
| PU-006 | FormularioAcceso | Correo inválido | Ingresar correo mal formado | Enviar formulario | Se informa el formato incorrecto |
| PU-007 | FormularioAcceso | Nombre de mascota requerido | Renderizar registro | Enviar sin mascota | Se informa el campo requerido |
| PU-008 | FormularioAcceso | Confirmación de clave | Ingresar claves distintas | Enviar registro | Se informa que no coinciden |
| PU-009 | FormularioAcceso | Guardar mascota | Completar registro válido con persona adulta | Enviar formulario | Se persiste el nombre de mascota |
| PU-010 | Servicios | Catálogo inicial | Renderizar servicios | Consultar página | Se ven consulta y vacunación |
| PU-011 | Servicios | Filtro por especie | Renderizar catálogo | Elegir perros y gatos | Se ocultan servicios no coincidentes |
| PU-012 | FormularioAcceso | Fecha máxima del calendario | Renderizar registro | Consultar límite `max` de nacimiento | No se puede elegir una fecha posterior a cumplir 18 |
| PU-013 | FormularioAcceso | Bloquear registro de menor | Ingresar nacimiento de una persona de 17 años | Enviar registro | Se informa que debe tener al menos 18 años |
| PU-014 | Carrito | Exigir fechas de cita | Agregar dos servicios sin fechas | Confirmar solicitud | Se muestra el aviso y no se confirma |
| PU-015 | Carrito | Confirmar con todas las fechas | Agregar servicios e indicar cada fecha | Confirmar solicitud | Se muestra el mensaje de confirmación |
| PU-016 | Carrito | Exigir inicio de sesión | Agregar servicios y sus fechas sin sesión | Confirmar solicitud | Se solicita iniciar sesión y no se guarda la solicitud |
| PU-017 | Login | Acceso de veterinario | Ingresar credenciales estáticas del veterinario | Enviar login | Se guarda el rol `veterinario` en `localStorage` |
| PU-018 | Panel de Control | Ruta privada | Abrir `/admin` sin sesión | Cargar la ruta | Se redirige a Login |
| PU-019 | Carrito y bandeja veterinaria | Guardar consulta | Iniciar sesión y confirmar servicios con fecha | Confirmar solicitud | La solicitud y datos del cliente quedan guardados en `localStorage` |
| PU-020 | Bandeja veterinaria | Mostrar consulta recibida | Iniciar sesión como veterinario y cargar solicitud almacenada | Abrir `/veterinario` | Se muestran cliente, mascota, servicio y fecha |

## Requisitos y alcance actual (ERS actualizado)

- La aplicación presenta información de la Veterinaria San Marcos en Rancagua, sus servicios, imágenes y video del sitio original.
- El catálogo permite filtrar por tipo de mascota, ver el detalle de cada servicio y agregar servicios al carrito.
- Las personas de 18 años o más pueden crear una cuenta con datos de contacto y contexto de su mascota (especie y nombre); la cuenta se conserva en `localStorage`.
- El inicio de sesión admite una cuenta registrada, una cuenta administrativa estática (`admin@vetsanmarcos.cl` / `Admin123`) y una cuenta de veterinario (`veterinario@vetsanmarcos.cl` / `Vet2026`).
- El panel de administración está restringido a la sesión administrativa y permite agregar servicios temporalmente en memoria, usando una imagen genérica.
- La ruta privada del veterinario permite revisar las solicitudes enviadas y marcarlas como atendidas.
- Las rutas incluyen inicio, catálogo de servicios/productos, detalle, login, registro, panel, bandeja veterinaria, carrito, perfil y página 404.
- El carrito y favoritos se gestionan con estado React en memoria. Las solicitudes confirmadas quedan en `localStorage` del mismo navegador; no se procesan pagos ni existe backend.
- Las vistas se adaptan a pantallas pequeñas con estilos responsivos conservando los colores, estructura y recursos originales.

# Especificación de Requisitos de Software — Veterinaria San Marcos

## Propósito

Aplicación web para presentar los servicios de Veterinaria San Marcos en Rancagua y permitir a los clientes consultar y solicitar horas para sus mascotas.

## Requisitos funcionales

1. La página de inicio debe mostrar la presentación, las imágenes y el video del sitio original.
2. El catálogo debe listar los servicios, permitir filtrar por tipo de mascota y abrir el detalle de cada servicio.
3. El detalle debe permitir seleccionar mascota y fecha. La solicitud requiere una sesión iniciada y se agrega al carrito.
4. El carrito debe mostrar servicios solicitados, su valor y el total, permitir quitar servicios y exigir una fecha para cada cita antes de confirmar la solicitud. El cliente debe iniciar sesión para enviar la solicitud y esta queda guardada en `localStorage` para que el veterinario la revise.
5. El formulario de registro debe validar los campos requeridos, el formato del correo, el largo de la contraseña y su confirmación. La fecha de nacimiento debe corresponder a una persona de 18 años o más. Debe solicitar teléfono y datos de contexto de la mascota (especie y nombre).
6. El login debe validar una cuenta registrada o las credenciales estáticas de administrador (`admin@vetsanmarcos.cl` / `Admin123`) y veterinario (`veterinario@vetsanmarcos.cl` / `Vet2026`). La sesión se conserva mediante `localStorage`.
7. El perfil requiere sesión iniciada y muestra los datos disponibles del usuario y su mascota.
8. El panel de control requiere sesión de administrador y permite agregar servicios al catálogo en memoria, asignando una imagen genérica.
9. La ruta privada del veterinario muestra las consultas guardadas, los datos de contacto, la mascota, las fechas y los servicios solicitados; permite marcar una solicitud como atendida.
10. Las rutas deben cubrir inicio, productos/servicios, detalle de producto, login, registro, panel, bandeja veterinaria, carrito, perfil y página 404.

## Requisitos no funcionales

- Mantener la estructura visual, los colores, las imágenes y el video de la entrega original.
- Adaptar la navegación, los formularios, las tarjetas y las secciones principales a pantallas móviles.
- Organizar la interfaz en átomos, moléculas, organismos y páginas React.
- Validar los comportamientos principales mediante al menos 10 pruebas unitarias con Vitest y el patrón AAA.

## Límites actuales

La aplicación no tiene servidor ni base de datos. Los servicios nuevos, carrito y favoritos viven en memoria y se reinician al recargar. Las solicitudes confirmadas se guardan en `localStorage` del navegador actual; no se envían a un servidor ni a otros dispositivos. La confirmación es una simulación y no procesa pagos.

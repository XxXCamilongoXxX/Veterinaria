import Button from 'react-bootstrap/Button'

export default function TarjetaSolicitud({ solicitud, onMarcarAtendida }) {
  const total = solicitud.servicios.reduce((suma, servicio) => suma + servicio.precio, 0)
  const cliente = solicitud.cliente
  return <article className="tarjeta-solicitud">
    <header className="encabezado-solicitud"><h2>Solicitud {solicitud.id}</h2><span className={`estado-solicitud ${solicitud.estado === 'Atendida' ? 'estado-atendida' : ''}`}>{solicitud.estado}</span></header>
    <p><strong>Recibida:</strong> {new Date(solicitud.creada).toLocaleString('es-CL')}</p>
    <p><strong>Cliente:</strong> {cliente.nombre} {cliente.apellido}</p>
    <p><strong>Correo:</strong> <a href={`mailto:${cliente.correo}`}>{cliente.correo}</a></p>
    {cliente.telefono && <p><strong>Teléfono:</strong> {cliente.telefono}</p>}
    <p><strong>Mascota:</strong> {cliente.mascota || 'No indicada'}{cliente.especie ? ` (${cliente.especie})` : ''}</p>
    <h3>Servicios y citas</h3>
    <ul>{solicitud.servicios.map((servicio, indice) => <li key={`${servicio.id}-${indice}`}>{servicio.nombre} — {servicio.fecha} — ${servicio.precio.toLocaleString('es-CL')}</li>)}</ul>
    <p className="total-solicitud"><strong>Total:</strong> ${total.toLocaleString('es-CL')}</p>
    {solicitud.estado !== 'Atendida' && <Button type="button" className="boton-verde" onClick={() => onMarcarAtendida(solicitud.id)}>Marcar como atendida</Button>}
  </article>
}

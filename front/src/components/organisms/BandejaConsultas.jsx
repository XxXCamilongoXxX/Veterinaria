import TarjetaSolicitud from '../molecules/TarjetaSolicitud'

export default function BandejaConsultas({ solicitudes, onMarcarAtendida }) {
  if (solicitudes.length === 0) return <p className="sin-solicitudes">Todavía no han llegado consultas.</p>
  return <div className="lista-solicitudes">{solicitudes.map((solicitud) => <TarjetaSolicitud key={solicitud.id} solicitud={solicitud} onMarcarAtendida={onMarcarAtendida} />)}</div>
}

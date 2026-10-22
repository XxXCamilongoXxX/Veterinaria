import { useTienda } from '../context/TiendaContext'
import BandejaConsultas from '../components/organisms/BandejaConsultas'

export default function Veterinario() {
  const { solicitudes, actualizarEstadoSolicitud } = useTienda()
  return <section className="pagina-veterinario">
    <div className="encabezado-veterinario"><h1 className="titulo-azul">Consultas recibidas</h1><p>Revisa las solicitudes de atención, los datos de contacto y las fechas elegidas para cada cita.</p></div>
    <BandejaConsultas solicitudes={solicitudes} onMarcarAtendida={(id) => actualizarEstadoSolicitud(id, 'Atendida')} />
  </section>
}

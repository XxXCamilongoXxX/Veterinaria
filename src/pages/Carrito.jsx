import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTienda } from '../context/TiendaContext'
import Boton from '../components/atoms/Boton'
export default function Carrito() {
  const { carrito, quitarCarrito, actualizarFechaCarrito, crearSolicitud, usuario } = useTienda()
  const [confirmado, setConfirmado] = useState(false)
  const [mensaje, setMensaje] = useState('')
  const [requiereLogin, setRequiereLogin] = useState(false)
  const total = carrito.reduce((s, item) => s + item.precio, 0)

  const confirmarSolicitud = () => {
    if (carrito.some((item) => !item.fecha)) {
      setConfirmado(false)
      setRequiereLogin(false)
      setMensaje('Debes colocar la fecha de cada cita antes de confirmar la solicitud.')
      return
    }
    if (!usuario) {
      setConfirmado(false)
      setRequiereLogin(true)
      setMensaje('Inicia sesión para enviar tus consultas a la veterinaria.')
      return
    }
    crearSolicitud()
    setMensaje('')
    setRequiereLogin(false)
    setConfirmado(true)
  }

  const cambiarFecha = (indice, fecha) => {
    actualizarFechaCarrito(indice, fecha)
    setConfirmado(false)
    setMensaje('')
    setRequiereLogin(false)
  }

  const quitarServicio = (indice) => {
    quitarCarrito(indice)
    setConfirmado(false)
    setMensaje('')
    setRequiereLogin(false)
  }

  return <section className="contenedor-formulario carrito">
    <h1 className="titulo-azul">Carrito de servicios</h1>
    {confirmado && <p className="exito" role="status">¡Solicitud de servicios confirmada! La veterinaria se pondrá en contacto contigo.</p>}
    {mensaje && <p className="fallo" role="alert">{mensaje} {requiereLogin && <Link to="/login">Iniciar sesión</Link>}</p>}
    {carrito.length ? <>
      <ul className="lista-carrito">{carrito.map((item, indice) => <li key={`${item.id}-${indice}`}>
        <div className="detalle-carrito"><strong>{item.nombre}</strong><span>${item.precio.toLocaleString('es-CL')}</span>
          <div className="fecha-carrito"><label htmlFor={`fecha-cita-${indice}`}>Fecha de la cita:</label><input id={`fecha-cita-${indice}`} type="date" required value={item.fecha || ''} onChange={(e) => cambiarFecha(indice, e.target.value)} /></div>
        </div>
        <button type="button" onClick={() => quitarServicio(indice)}>Quitar</button>
      </li>)}</ul>
      <p className="total-detalle">Total: <strong>${total.toLocaleString('es-CL')}</strong></p>
      <Boton type="button" onClick={confirmarSolicitud}>Confirmar solicitud</Boton>
    </> : <><p>Aún no agregas servicios.</p><Link to="/servicios" className="boton-verde">Ver servicios</Link></>}
  </section>
}

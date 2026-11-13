import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { serviciosIniciales } from '../data/servicios'
import { api } from '../api'

const TiendaContext = createContext(null)
export function TiendaProvider({ children }) {
  const [servicios, setServicios] = useState(serviciosIniciales)
  const [errorApi, setErrorApi] = useState('')
  const [carrito, setCarrito] = useState([])
  const [favoritos, setFavoritos] = useState([])
  const [solicitudes, setSolicitudes] = useState([])
  const [usuario, setUsuario] = useState(() => {
    try { return localStorage.getItem('vetToken') && localStorage.getItem('sesionUsuario') ? JSON.parse(localStorage.getItem('sesionUsuario')) : null } catch { return null }
  })
  useEffect(() => { api('/servicios').then(setServicios).catch((e) => setErrorApi(e.message)) }, [])
  useEffect(() => { if (usuario) api('/solicitudes').then(setSolicitudes).catch((e) => setErrorApi(e.message)); else setSolicitudes([]) }, [usuario])
  const agregarCarrito = (servicio) => setCarrito((items) => [...items, servicio])
  const quitarCarrito = (indice) => setCarrito((items) => items.filter((_, i) => i !== indice))
  const actualizarFechaCarrito = (indice, fecha) => setCarrito((items) => items.map((item, i) => i === indice ? { ...item, fecha } : item))
  const crearSolicitud = async () => {
    if (!usuario || carrito.length === 0 || carrito.some((item) => !item.fecha)) return null
    const solicitud = await api('/solicitudes', { method: 'POST', body: JSON.stringify({ servicios: carrito.map(({ id, fecha }) => ({ servicioId: id, fecha })) }) })
    setSolicitudes((items) => [solicitud, ...items])
    setCarrito([])
    return solicitud
  }
  const actualizarEstadoSolicitud = async (id, estado) => { const actualizada = await api(`/solicitudes/${String(id).replace('SOL-', '')}/estado`, { method: 'PATCH', body: JSON.stringify({ estado }) }); setSolicitudes((items) => items.map((s) => s.id === actualizada.id ? actualizada : s)) }
  const toggleFavorito = (id) => setFavoritos((items) => items.includes(id) ? items.filter((item) => item !== id) : [...items, id])
  const iniciarSesion = (token, cuenta) => { localStorage.setItem('vetToken', token); localStorage.setItem('sesionUsuario', JSON.stringify(cuenta)); setUsuario(cuenta); setErrorApi('') }
  const cerrarSesion = () => { localStorage.removeItem('vetToken'); localStorage.removeItem('sesionUsuario'); setUsuario(null) }
  const agregarServicio = async (servicio) => { const creado = await api('/servicios', { method: 'POST', body: JSON.stringify({ ...servicio, imagen: '/img/perro en clinica.jpg' }) }); setServicios((items) => [...items, creado]) }
  const value = useMemo(() => ({ servicios, carrito, favoritos, solicitudes, usuario, errorApi, agregarCarrito, quitarCarrito, actualizarFechaCarrito, crearSolicitud, actualizarEstadoSolicitud, toggleFavorito, iniciarSesion, cerrarSesion, agregarServicio }), [servicios, carrito, favoritos, solicitudes, usuario, errorApi])
  return <TiendaContext.Provider value={value}>{children}</TiendaContext.Provider>
}
export const useTienda = () => useContext(TiendaContext)

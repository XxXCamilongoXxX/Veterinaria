import { createContext, useContext, useMemo, useState } from 'react'
import { serviciosIniciales } from '../data/servicios'

const TiendaContext = createContext(null)
export function TiendaProvider({ children }) {
  const [servicios, setServicios] = useState(serviciosIniciales)
  const [carrito, setCarrito] = useState([])
  const [favoritos, setFavoritos] = useState([])
  const [solicitudes, setSolicitudes] = useState(() => {
    try { return JSON.parse(localStorage.getItem('solicitudesVetSanMarcos') || '[]') } catch { return [] }
  })
  const [usuario, setUsuario] = useState(() => {
    try { return localStorage.getItem('sesionActiva') === 'true' && (localStorage.getItem('sesionUsuario') || localStorage.getItem('usuarioVetSanMarcos')) ? JSON.parse(localStorage.getItem('sesionUsuario') || localStorage.getItem('usuarioVetSanMarcos')) : null } catch { return null }
  })
  const agregarCarrito = (servicio) => setCarrito((items) => [...items, servicio])
  const quitarCarrito = (indice) => setCarrito((items) => items.filter((_, i) => i !== indice))
  const actualizarFechaCarrito = (indice, fecha) => setCarrito((items) => items.map((item, i) => i === indice ? { ...item, fecha } : item))
  const crearSolicitud = () => {
    if (!usuario || carrito.length === 0 || carrito.some((item) => !item.fecha)) return null
    const solicitud = {
      id: `SOL-${Date.now()}`,
      creada: new Date().toISOString(),
      estado: 'Pendiente',
      cliente: { nombre: usuario.nombre, apellido: usuario.apellido || '', correo: usuario.correo, telefono: usuario.telefono || '', mascota: usuario.mascota || '', especie: usuario.especie || '' },
      servicios: carrito.map(({ id, nombre, precio, fecha }) => ({ id, nombre, precio, fecha })),
    }
    setSolicitudes((items) => {
      const actualizadas = [solicitud, ...items]
      localStorage.setItem('solicitudesVetSanMarcos', JSON.stringify(actualizadas))
      return actualizadas
    })
    setCarrito([])
    return solicitud
  }
  const actualizarEstadoSolicitud = (id, estado) => setSolicitudes((items) => {
    const actualizadas = items.map((solicitud) => solicitud.id === id ? { ...solicitud, estado } : solicitud)
    localStorage.setItem('solicitudesVetSanMarcos', JSON.stringify(actualizadas))
    return actualizadas
  })
  const toggleFavorito = (id) => setFavoritos((items) => items.includes(id) ? items.filter((item) => item !== id) : [...items, id])
  const iniciarSesion = (cuenta) => { localStorage.setItem('sesionActiva', 'true'); localStorage.setItem('sesionUsuario', JSON.stringify(cuenta)); if (!cuenta.rol) localStorage.setItem('usuarioVetSanMarcos', JSON.stringify(cuenta)); setUsuario(cuenta) }
  const cerrarSesion = () => { localStorage.removeItem('sesionActiva'); localStorage.removeItem('sesionUsuario'); setUsuario(null) }
  const agregarServicio = (servicio) => setServicios((items) => [...items, { ...servicio, id: Date.now(), imagen: '/img/perro en clinica.jpg' }])
  const value = useMemo(() => ({ servicios, carrito, favoritos, solicitudes, usuario, agregarCarrito, quitarCarrito, actualizarFechaCarrito, crearSolicitud, actualizarEstadoSolicitud, toggleFavorito, iniciarSesion, cerrarSesion, agregarServicio }), [servicios, carrito, favoritos, solicitudes, usuario])
  return <TiendaContext.Provider value={value}>{children}</TiendaContext.Provider>
}
export const useTienda = () => useContext(TiendaContext)

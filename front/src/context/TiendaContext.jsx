import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { serviciosIniciales } from '../data/servicios'
import http from '../api'
import ServicioService from '../services/ServicioService'

const TiendaContext = createContext(null)

/** Lee la sesión guardada en localStorage (persiste aunque se recargue la página). */
function leerSesionGuardada() {
  try {
    const token = localStorage.getItem('vetToken')
    const usuario = localStorage.getItem('sesionUsuario')
    return token && usuario ? JSON.parse(usuario) : null
  } catch {
    return null
  }
}

export function TiendaProvider({ children }) {
  const [servicios, setServicios] = useState(serviciosIniciales)
  const [errorApi, setErrorApi] = useState('')
  const [carrito, setCarrito] = useState([])
  const [favoritos, setFavoritos] = useState([])
  const [solicitudes, setSolicitudes] = useState([])
  const [usuario, setUsuario] = useState(leerSesionGuardada)

  // Catálogo de servicios desde la API (MySQL)
  useEffect(() => {
    ServicioService.getAllServicios()
      .then((res) => setServicios(res.data))
      .catch((e) => setErrorApi(e.message))
  }, [])

  // Solicitudes del usuario logueado
  useEffect(() => {
    if (!usuario) {
      setSolicitudes([])
      return
    }
    http.get('/solicitudes')
      .then((res) => setSolicitudes(res.data))
      .catch((e) => setErrorApi(e.message))
  }, [usuario])

  // Si el interceptor de Axios detecta un token vencido, se cierra la sesión
  useEffect(() => {
    const alExpirar = () => setUsuario(null)
    window.addEventListener('sesion-expirada', alExpirar)
    return () => window.removeEventListener('sesion-expirada', alExpirar)
  }, [])

  // ---------- Sesión ----------
  const iniciarSesion = (token, cuenta) => {
    localStorage.setItem('vetToken', token)
    localStorage.setItem('sesionUsuario', JSON.stringify(cuenta))
    setUsuario(cuenta)
    setErrorApi('')
  }

  const cerrarSesion = () => {
    localStorage.removeItem('vetToken')
    localStorage.removeItem('sesionUsuario')
    setUsuario(null)
  }

  // ---------- Carrito y solicitudes ----------
  const agregarCarrito = (servicio) => setCarrito((items) => [...items, servicio])
  const quitarCarrito = (indice) => setCarrito((items) => items.filter((_, i) => i !== indice))
  const actualizarFechaCarrito = (indice, fecha) =>
    setCarrito((items) => items.map((item, i) => (i === indice ? { ...item, fecha } : item)))

  const crearSolicitud = async () => {
    if (!usuario || carrito.length === 0 || carrito.some((item) => !item.fecha)) return null
    const cuerpo = { servicios: carrito.map(({ id, fecha }) => ({ servicioId: id, fecha })) }
    const { data } = await http.post('/solicitudes', cuerpo)
    setSolicitudes((items) => [data, ...items])
    setCarrito([])
    return data
  }

  const actualizarEstadoSolicitud = async (id, estado) => {
    const idNumerico = String(id).replace('SOL-', '')
    const { data } = await http.patch(`/solicitudes/${idNumerico}/estado`, { estado })
    setSolicitudes((items) => items.map((s) => (s.id === data.id ? data : s)))
  }

  const toggleFavorito = (id) =>
    setFavoritos((items) => (items.includes(id) ? items.filter((item) => item !== id) : [...items, id]))

  // ---------- CRUD de servicios (solo ADMIN) ----------
  const agregarServicio = async (servicio) => {
    const { data } = await ServicioService.createServicio(servicio)
    setServicios((items) => [...items, data])
  }

  const editarServicio = async (id, servicio) => {
    const { data } = await ServicioService.updateServicio(id, servicio)
    setServicios((items) => items.map((s) => (s.id === id ? data : s)))
  }

  const eliminarServicio = async (id) => {
    await ServicioService.deleteServicio(id)
    setServicios((items) => items.filter((s) => s.id !== id))
  }

  const esAdmin = usuario?.rol === 'ADMIN'

  const value = useMemo(
    () => ({
      servicios, carrito, favoritos, solicitudes, usuario, esAdmin, errorApi,
      agregarCarrito, quitarCarrito, actualizarFechaCarrito, crearSolicitud, actualizarEstadoSolicitud,
      toggleFavorito, iniciarSesion, cerrarSesion, agregarServicio, editarServicio, eliminarServicio,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [servicios, carrito, favoritos, solicitudes, usuario, errorApi],
  )

  return <TiendaContext.Provider value={value}>{children}</TiendaContext.Provider>
}

export const useTienda = () => useContext(TiendaContext)

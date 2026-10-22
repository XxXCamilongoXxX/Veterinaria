import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useTienda } from '../../context/TiendaContext'
export default function Encabezado() {
  const { usuario, cerrarSesion, carrito } = useTienda(); const navigate = useNavigate()
  return <header className="header-vet"><div className="nav-bar"><Link to="/" className="logo">Vet San Marcos</Link><nav aria-label="Navegación principal"><ul className="menu"><li><NavLink to="/">Inicio</NavLink></li><li><NavLink to="/servicios">Servicios</NavLink></li><li><NavLink to="/carrito">Carrito ({carrito.length})</NavLink></li>{usuario ? <><li><NavLink to="/perfil">Hola, {usuario.nombre}</NavLink></li>{usuario.rol === 'admin' && <li><NavLink to="/admin">Panel</NavLink></li>}{usuario.rol === 'veterinario' && <li><NavLink to="/veterinario">Consultas</NavLink></li>}<li><button id="cerrar-sesion" onClick={() => { cerrarSesion(); navigate('/') }}>Cerrar sesión</button></li></> : <><li><NavLink to="/login">Ingresar</NavLink></li><li><NavLink to="/registro">Registro</NavLink></li></>}</ul></nav></div></header>
}

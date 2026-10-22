import { Navigate, Route, Routes } from 'react-router-dom'
import { TiendaProvider, useTienda } from './context/TiendaContext'
import DisenoBase from './components/organisms/DisenoBase'
import Inicio from './pages/Inicio'
import Servicios from './pages/Servicios'
import DetalleServicio from './pages/DetalleServicio'
import Login from './pages/Login'
import Registro from './pages/Registro'
import Admin from './pages/Admin'
import Carrito from './pages/Carrito'
import Perfil from './pages/Perfil'
import NoEncontrado from './pages/NoEncontrado'
import Veterinario from './pages/Veterinario'

function Protegida({ children, roles }) { const { usuario } = useTienda(); if (!usuario) return <Navigate to="/login" replace />; if (roles && !roles.includes(usuario.rol)) return <Navigate to="/" replace />; return children }
function Rutas() { return <DisenoBase><Routes><Route path="/" element={<Inicio />} /><Route path="/servicios" element={<Servicios />} /><Route path="/productos" element={<Navigate to="/servicios" replace />} /><Route path="/producto" element={<DetalleServicio />} /><Route path="/producto/:id" element={<DetalleServicio />} /><Route path="/login" element={<Login />} /><Route path="/registro" element={<Registro />} /><Route path="/admin" element={<Protegida roles={['admin']}><Admin /></Protegida>} /><Route path="/veterinario" element={<Protegida roles={['veterinario']}><Veterinario /></Protegida>} /><Route path="/carrito" element={<Carrito />} /><Route path="/perfil" element={<Protegida><Perfil /></Protegida>} /><Route path="*" element={<NoEncontrado />} /></Routes></DisenoBase> }
export default function App() { return <TiendaProvider><Rutas /></TiendaProvider> }

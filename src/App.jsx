import { Navigate, Route, Routes } from 'react-router-dom'
import DisenoBase from './components/organisms/DisenoBase'
import { TiendaProvider, useTienda } from './context/TiendaContext'
import Admin from './pages/Admin'
import Carrito from './pages/Carrito'
import DetalleServicio from './pages/DetalleServicio'
import Inicio from './pages/Inicio'
import Login from './pages/Login'
import NoEncontrado from './pages/NoEncontrado'
import Perfil from './pages/Perfil'
import Registro from './pages/Registro'
import Servicios from './pages/Servicios'
import Veterinario from './pages/Veterinario'

function RutaProtegida({ children, roles }) {
  const { usuario } = useTienda()

  if (!usuario) {
    return <Navigate to="/login" replace />
  }

  if (roles && !roles.includes(usuario.rol)) {
    return <Navigate to="/" replace />
  }

  return children
}

function RutasAplicacion() {
  return (
    <DisenoBase>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/servicios" element={<Servicios />} />
        <Route path="/productos" element={<Navigate to="/servicios" replace />} />
        <Route path="/producto" element={<DetalleServicio />} />
        <Route path="/producto/:id" element={<DetalleServicio />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route
          path="/admin"
          element={
            <RutaProtegida roles={['admin']}>
              <Admin />
            </RutaProtegida>
          }
        />
        <Route
          path="/veterinario"
          element={
            <RutaProtegida roles={['veterinario']}>
              <Veterinario />
            </RutaProtegida>
          }
        />
        <Route path="/carrito" element={<Carrito />} />
        <Route
          path="/perfil"
          element={
            <RutaProtegida>
              <Perfil />
            </RutaProtegida>
          }
        />
        <Route path="*" element={<NoEncontrado />} />
      </Routes>
    </DisenoBase>
  )
}

export default function App() {
  return (
    <TiendaProvider>
      <RutasAplicacion />
    </TiendaProvider>
  )
}

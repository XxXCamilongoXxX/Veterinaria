import { Navigate, Route, Routes } from 'react-router-dom'
import MascotaForm from './components/MascotaForm'
import MascotaList from './components/MascotaList'
import ProductoForm from './components/ProductoForm'
import ProductoList from './components/ProductoList'
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
            <RutaProtegida roles={['ADMIN']}>
              <Admin />
            </RutaProtegida>
          }
        />
        <Route
          path="/veterinario"
          element={
            <RutaProtegida roles={['VETERINARIO']}>
              <Veterinario />
            </RutaProtegida>
          }
        />
        {/* Mascotas: cualquier usuario logueado ve el listado; solo ADMIN crea/edita */}
        <Route path="/mascotas" element={<RutaProtegida><MascotaList /></RutaProtegida>} />
        <Route path="/mascotas/nueva" element={<RutaProtegida roles={['ADMIN']}><MascotaForm /></RutaProtegida>} />
        <Route path="/mascotas/editar/:id" element={<RutaProtegida roles={['ADMIN']}><MascotaForm /></RutaProtegida>} />
        {/* Productos: solo ADMIN */}
        <Route path="/admin/productos" element={<RutaProtegida roles={['ADMIN']}><ProductoList /></RutaProtegida>} />
        <Route path="/admin/productos/nuevo" element={<RutaProtegida roles={['ADMIN']}><ProductoForm /></RutaProtegida>} />
        <Route path="/admin/productos/editar/:id" element={<RutaProtegida roles={['ADMIN']}><ProductoForm /></RutaProtegida>} />
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

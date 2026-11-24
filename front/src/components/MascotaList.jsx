import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import MascotaService from '../services/MascotaService'
import { useTienda } from '../context/TiendaContext'

const MascotaList = () => {
  const { esAdmin } = useTienda()
  const [mascotas, setMascotas] = useState([])
  const [error, setError] = useState('')

  const cargarMascotas = () => {
    MascotaService.getAllMascotas()
      .then((response) => setMascotas(response.data))
      .catch((e) => setError(e.message))
  }

  useEffect(() => {
    cargarMascotas()
  }, [])

  const eliminarMascota = (id) => {
    if (!window.confirm('¿Eliminar esta mascota?')) return
    MascotaService.deleteMascota(id)
      .then(() => cargarMascotas())
      .catch((e) => setError(e.message))
  }

  return (
    <section className="contenedor-formulario">
      <h1 className="titulo-azul">Mascotas registradas</h1>
      {/* Solo ADMIN puede crear, editar y eliminar (el backend también lo valida) */}
      {esAdmin && <Link to="/mascotas/nueva" className="btn boton-verde mb-3">Registrar mascota</Link>}
      {error && <p className="fallo" role="alert">{error}</p>}
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Especie</th>
            <th>Dueño</th>
            {esAdmin && <th>Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {mascotas.map((mascota) => (
            <tr key={mascota.id}>
              <td>{mascota.nombre}</td>
              <td>{mascota.especie}</td>
              <td>{mascota.dueno}</td>
              {esAdmin && (
                <td>
                  <Link to={`/mascotas/editar/${mascota.id}`} className="btn btn-sm btn-outline-primary me-2">Editar</Link>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => eliminarMascota(mascota.id)}>Eliminar</button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}

export default MascotaList

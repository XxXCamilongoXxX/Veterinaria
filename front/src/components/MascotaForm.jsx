import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import MascotaService from '../services/MascotaService'

const MascotaForm = () => {
  const [nombre, setNombre] = useState('')
  const [especie, setEspecie] = useState('Perro')
  const [dueno, setDueno] = useState('')
  const [error, setError] = useState('')
  const { id } = useParams()
  const navigate = useNavigate()

  // Si hay id en la URL, estamos editando: se cargan los datos actuales
  useEffect(() => {
    if (id) {
      MascotaService.getMascotaById(id)
        .then((response) => {
          setNombre(response.data.nombre)
          setEspecie(response.data.especie)
          setDueno(response.data.dueno)
        })
        .catch((e) => setError(e.message))
    }
  }, [id])

  const guardarMascota = (e) => {
    e.preventDefault()
    const mascota = { nombre, especie, dueno }
    const peticion = id ? MascotaService.updateMascota(id, mascota) : MascotaService.createMascota(mascota)
    peticion
      .then(() => navigate('/mascotas'))
      .catch((err) => setError(err.message))
  }

  return (
    <section className="contenedor-formulario">
      <h1 className="titulo-azul">{id ? 'Editar mascota' : 'Registrar mascota'}</h1>
      <form className="formulario" onSubmit={guardarMascota}>
        <div className="grupo-form">
          <label htmlFor="mascota-nombre">Nombre:</label>
          <input id="mascota-nombre" type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
        </div>
        <div className="grupo-form">
          <label htmlFor="mascota-especie">Especie:</label>
          <select id="mascota-especie" value={especie} onChange={(e) => setEspecie(e.target.value)}>
            <option>Perro</option>
            <option>Gato</option>
            <option>Conejo</option>
            <option>Ave</option>
          </select>
        </div>
        <div className="grupo-form">
          <label htmlFor="mascota-dueno">Dueño:</label>
          <input id="mascota-dueno" type="text" value={dueno} onChange={(e) => setDueno(e.target.value)} required />
        </div>
        <button className="btn boton-verde" type="submit">{id ? 'Actualizar' : 'Guardar'}</button>
        {error && <p className="fallo" role="alert">{error}</p>}
      </form>
      <Link to="/mascotas">Volver al listado</Link>
    </section>
  )
}

export default MascotaForm

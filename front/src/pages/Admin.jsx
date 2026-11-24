import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import { useTienda } from '../context/TiendaContext'
import Campo from '../components/atoms/Campo'

const formularioVacio = { nombre: '', descripcion: '', precio: '', especie: 'Todas' }

/** Panel ADMIN: CRUD de servicios + accesos a productos y mascotas. */
export default function Admin() {
  const { servicios, agregarServicio, editarServicio, eliminarServicio } = useTienda()
  const [form, setForm] = useState(formularioVacio)
  const [editandoId, setEditandoId] = useState(null)
  const [mensaje, setMensaje] = useState('')

  const cambiar = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const limpiar = () => {
    setForm(formularioVacio)
    setEditandoId(null)
  }

  const enviar = (e) => {
    e.preventDefault()
    if (!form.nombre.trim() || !form.descripcion.trim() || Number(form.precio) <= 0) {
      setMensaje('Completa todos los campos con un precio válido.')
      return
    }
    const datos = { ...form, precio: Number(form.precio) }
    const peticion = editandoId ? editarServicio(editandoId, datos) : agregarServicio(datos)
    peticion
      .then(() => {
        setMensaje(editandoId ? 'Servicio actualizado.' : 'Servicio agregado al catálogo.')
        limpiar()
      })
      .catch((err) => setMensaje(err.message))
  }

  const editar = (servicio) => {
    setEditandoId(servicio.id)
    setForm({ nombre: servicio.nombre, descripcion: servicio.descripcion, precio: servicio.precio, especie: servicio.especie })
    setMensaje('')
  }

  const eliminar = (servicio) => {
    if (!window.confirm(`¿Eliminar el servicio "${servicio.nombre}"?`)) return
    eliminarServicio(servicio.id)
      .then(() => setMensaje('Servicio eliminado.'))
      .catch((err) => setMensaje(err.message))
  }

  return (
    <section className="contenedor-formulario admin">
      <h1 className="titulo-azul">Panel de Control</h1>
      <p>
        <Link to="/admin/productos" className="btn boton-verde me-2">Gestionar productos</Link>
        <Link to="/mascotas" className="btn boton-verde">Gestionar mascotas</Link>
      </p>

      <h2>{editandoId ? 'Editar servicio' : 'Registrar servicio'}</h2>
      <Form className="formulario" onSubmit={enviar}>
        <Campo id="nombre-servicio" name="nombre" label="Nombre del servicio:" value={form.nombre} onChange={cambiar} />
        <Campo id="descripcion-servicio" name="descripcion" label="Descripción:" value={form.descripcion} onChange={cambiar} />
        <Campo id="precio-servicio" name="precio" type="number" min="1" label="Precio (CLP):" value={form.precio} onChange={cambiar} />
        <div className="grupo-form">
          <label htmlFor="especie-servicio">Mascota:</label>
          <select id="especie-servicio" name="especie" value={form.especie} onChange={cambiar}>
            <option>Todas</option>
            <option>Perros y gatos</option>
            <option>Perro</option>
            <option>Gato</option>
            <option>Conejo</option>
            <option>Ave</option>
          </select>
        </div>
        <Button className="boton-verde" type="submit">{editandoId ? 'Guardar cambios' : 'Agregar servicio'}</Button>
        {editandoId && <Button variant="secondary" type="button" onClick={limpiar}>Cancelar</Button>}
        {mensaje && <p role="status">{mensaje}</p>}
      </Form>

      <h2>Catálogo actual ({servicios.length})</h2>
      <table className="table table-striped">
        <thead>
          <tr><th>Nombre</th><th>Precio</th><th>Mascota</th><th>Acciones</th></tr>
        </thead>
        <tbody>
          {servicios.map((s) => (
            <tr key={s.id}>
              <td>{s.nombre}</td>
              <td>${s.precio.toLocaleString('es-CL')}</td>
              <td>{s.especie}</td>
              <td>
                <button className="btn btn-sm btn-outline-primary me-2" onClick={() => editar(s)}>Editar</button>
                <button className="btn btn-sm btn-outline-danger" onClick={() => eliminar(s)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}

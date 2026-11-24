import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import ProductoService from '../services/ProductoService'

const productoVacio = { nombre: '', descripcion: '', precio: '', stock: '' }

const ProductoForm = () => {
  const [producto, setProducto] = useState(productoVacio)
  const [error, setError] = useState('')
  const { id } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    if (id) {
      ProductoService.getProductoById(id)
        .then((response) => setProducto(response.data))
        .catch((e) => setError(e.message))
    }
  }, [id])

  const cambiar = (e) => setProducto({ ...producto, [e.target.name]: e.target.value })

  const guardarProducto = (e) => {
    e.preventDefault()
    const datos = {
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: Number(producto.precio),
      stock: Number(producto.stock),
    }
    const peticion = id ? ProductoService.updateProducto(id, datos) : ProductoService.createProducto(datos)
    peticion
      .then(() => navigate('/admin/productos'))
      .catch((err) => setError(err.message))
  }

  return (
    <section className="contenedor-formulario">
      <h1 className="titulo-azul">{id ? 'Editar producto' : 'Registrar producto'}</h1>
      <form className="formulario" onSubmit={guardarProducto}>
        <div className="grupo-form">
          <label htmlFor="producto-nombre">Nombre:</label>
          <input id="producto-nombre" name="nombre" type="text" value={producto.nombre} onChange={cambiar} required />
        </div>
        <div className="grupo-form">
          <label htmlFor="producto-descripcion">Descripción:</label>
          <input id="producto-descripcion" name="descripcion" type="text" value={producto.descripcion} onChange={cambiar} required />
        </div>
        <div className="grupo-form">
          <label htmlFor="producto-precio">Precio (CLP):</label>
          <input id="producto-precio" name="precio" type="number" min="0" value={producto.precio} onChange={cambiar} required />
        </div>
        <div className="grupo-form">
          <label htmlFor="producto-stock">Stock:</label>
          <input id="producto-stock" name="stock" type="number" min="0" value={producto.stock} onChange={cambiar} required />
        </div>
        <button className="btn boton-verde" type="submit">{id ? 'Actualizar' : 'Guardar'}</button>
        {error && <p className="fallo" role="alert">{error}</p>}
      </form>
      <Link to="/admin/productos">Volver al listado</Link>
    </section>
  )
}

export default ProductoForm

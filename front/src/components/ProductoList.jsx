import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import ProductoService from '../services/ProductoService'

/** CRUD de productos (ruta protegida: solo ADMIN). */
const ProductoList = () => {
  const [productos, setProductos] = useState([])
  const [error, setError] = useState('')

  const cargarProductos = () => {
    ProductoService.getAllProductos()
      .then((response) => setProductos(response.data))
      .catch((e) => setError(e.message))
  }

  useEffect(() => {
    cargarProductos()
  }, [])

  const eliminarProducto = (id) => {
    if (!window.confirm('¿Eliminar este producto?')) return
    ProductoService.deleteProducto(id)
      .then(() => cargarProductos())
      .catch((e) => setError(e.message))
  }

  return (
    <section className="contenedor-formulario">
      <h1 className="titulo-azul">Productos</h1>
      <Link to="/admin/productos/nuevo" className="btn boton-verde mb-3">Registrar producto</Link>
      {error && <p className="fallo" role="alert">{error}</p>}
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((producto) => (
            <tr key={producto.id}>
              <td>{producto.nombre}</td>
              <td>{producto.descripcion}</td>
              <td>${producto.precio.toLocaleString('es-CL')}</td>
              <td>{producto.stock}</td>
              <td>
                <Link to={`/admin/productos/editar/${producto.id}`} className="btn btn-sm btn-outline-primary me-2">Editar</Link>
                <button className="btn btn-sm btn-outline-danger" onClick={() => eliminarProducto(producto.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Link to="/admin">Volver al panel</Link>
    </section>
  )
}

export default ProductoList

import { Link } from 'react-router-dom'
import Boton from '../atoms/Boton'
import { useTienda } from '../../context/TiendaContext'
export default function TarjetaServicio({ servicio }) {
  const { favoritos, toggleFavorito, agregarCarrito } = useTienda()
  const guardado = favoritos.includes(servicio.id)
  return <article className="tarjeta-servicio"><img src={servicio.imagen} alt={servicio.nombre} /><h3>{servicio.nombre}</h3><p>{servicio.descripcion}</p><p><strong>${servicio.precio.toLocaleString('es-CL')}</strong> · {servicio.especie}</p><div className="acciones-tarjeta"><Link className="boton-verde" to={`/producto/${servicio.id}`}>Ver detalle</Link><Boton type="button" onClick={() => agregarCarrito(servicio)}>Agregar al carrito</Boton><button className="boton-favorito" type="button" aria-label={guardado ? 'Quitar de favoritos' : 'Agregar a favoritos'} onClick={() => toggleFavorito(servicio.id)}>{guardado ? '♥' : '♡'}</button></div></article>
}

import { Link } from 'react-router-dom'
export default function NoEncontrado() { return <section className="contenedor-formulario"><h1 className="titulo-azul">404 — Página no encontrada</h1><p>La página que buscas no existe.</p><Link className="boton-verde" to="/">Volver al inicio</Link></section> }

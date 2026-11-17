import { Link } from 'react-router-dom'
import FormularioAcceso from '../components/molecules/FormularioAcceso'
export default function Registro() { return <section className="contenedor-formulario"><h1 className="titulo-azul">Crear cuenta nueva</h1><p>Únete para pedir horas sin tener que llamar a la clínica.</p><FormularioAcceso registro /><div className="enlaces-form"><p>¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link></p><p><Link to="/">Volver a la página principal</Link></p></div></section> }

import { Link, useNavigate } from 'react-router-dom'
import FormularioAcceso from '../components/molecules/FormularioAcceso'
import { useTienda } from '../context/TiendaContext'
import { api } from '../api'
export default function Login() { const { iniciarSesion } = useTienda(); const navigate = useNavigate(); return <section className="contenedor-formulario"><h1 className="titulo-azul">Iniciar Sesión</h1><p>Ingresa para ver las fichas de tus animales en línea.</p><FormularioAcceso onSuccess={(correo, clave, setMensaje) => {
 api('/auth/login', { method: 'POST', body: JSON.stringify({ correo, clave }) }).then(({ token, usuario }) => { iniciarSesion(token, usuario); navigate(usuario.rol === 'admin' ? '/admin' : usuario.rol === 'veterinario' ? '/veterinario' : '/perfil') }).catch((e) => setMensaje(e.message))
 }} /><div className="enlaces-form"><p>¿No tienes cuenta? <Link to="/registro">Regístrate aquí</Link></p><p><Link to="/">Volver a la página principal</Link></p></div></section> }

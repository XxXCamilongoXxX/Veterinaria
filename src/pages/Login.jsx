import { Link, useNavigate } from 'react-router-dom'
import FormularioAcceso from '../components/molecules/FormularioAcceso'
import { useTienda } from '../context/TiendaContext'
export default function Login() { const { iniciarSesion } = useTienda(); const navigate = useNavigate(); return <section className="contenedor-formulario"><h1 className="titulo-azul">Iniciar Sesión</h1><p>Ingresa para ver las fichas de tus animales en línea.</p><FormularioAcceso onSuccess={(correo, clave, setMensaje) => {
 const cuenta = (() => { try { return JSON.parse(localStorage.getItem('usuarioVetSanMarcos')) } catch { return null } })()
 if (correo === 'admin@vetsanmarcos.cl' && clave === 'Admin123') { iniciarSesion({ nombre: 'Administrador', correo, rol: 'admin' }); navigate('/admin'); return }
 if (correo === 'veterinario@vetsanmarcos.cl' && clave === 'Vet2026') { iniciarSesion({ nombre: 'Veterinario', correo, rol: 'veterinario' }); navigate('/veterinario'); return }
 if (cuenta && correo === cuenta.correo && clave === cuenta.clave) { iniciarSesion(cuenta); navigate('/perfil'); return }
 setMensaje(cuenta ? 'Correo o contraseña incorrectos.' : 'No hay cuentas registradas.')
 }} /><div className="enlaces-form"><p>¿No tienes cuenta? <Link to="/registro">Regístrate aquí</Link></p><p><Link to="/">Volver a la página principal</Link></p></div></section> }

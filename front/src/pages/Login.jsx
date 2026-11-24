import { Link, useNavigate } from 'react-router-dom'
import FormularioAcceso from '../components/molecules/FormularioAcceso'
import { useTienda } from '../context/TiendaContext'
import http from '../api'

/** Página según el rol que viene en la respuesta del login. */
const paginaPorRol = { ADMIN: '/admin', VETERINARIO: '/veterinario', USER: '/perfil' }

export default function Login() {
  const { iniciarSesion } = useTienda()
  const navigate = useNavigate()

  const entrar = (correo, clave, setMensaje) => {
    http.post('/auth/login', { correo, clave })
      .then(({ data }) => {
        iniciarSesion(data.token, data.usuario)
        navigate(paginaPorRol[data.usuario.rol] || '/')
      })
      .catch((e) => setMensaje(e.message))
  }

  return (
    <section className="contenedor-formulario">
      <h1 className="titulo-azul">Iniciar Sesión</h1>
      <p>Ingresa para ver las fichas de tus animales en línea.</p>
      <FormularioAcceso onSuccess={entrar} />
      <div className="enlaces-form">
        <p>¿No tienes cuenta? <Link to="/registro">Regístrate aquí</Link></p>
        <p><Link to="/">Volver a la página principal</Link></p>
      </div>
    </section>
  )
}

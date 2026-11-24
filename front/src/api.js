import axios from 'axios'

/**
 * Cliente HTTP único de la aplicación (Axios).
 * - baseURL: en desarrollo Vite reenvía /api al backend (ver vite.config.js);
 *   en Docker lo hace nginx (ver nginx.conf).
 * - Interceptor de petición: agrega el token JWT a TODAS las solicitudes.
 * - Interceptor de respuesta: convierte los errores del backend en mensajes legibles
 *   y cierra la sesión si el token expiró (401).
 */
const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
  headers: { 'Content-Type': 'application/json' },
})

http.interceptors.request.use((config) => {
  const token = localStorage.getItem('vetToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      return Promise.reject(new Error('No se pudo conectar con la veterinaria. Comprueba que el servidor esté disponible.'))
    }

    const { status, data } = error.response
    const esLogin = error.config?.url?.includes('/auth/')

    // Token vencido o inválido: se cierra la sesión automáticamente
    if (status === 401 && !esLogin && localStorage.getItem('vetToken')) {
      localStorage.removeItem('vetToken')
      localStorage.removeItem('sesionUsuario')
      window.dispatchEvent(new Event('sesion-expirada'))
      return Promise.reject(new Error('Tu sesión expiró. Vuelve a iniciar sesión.'))
    }

    if (status === 403) {
      return Promise.reject(new Error('No tienes permisos para realizar esta acción.'))
    }

    const mensaje = data?.message || data?.detail || 'Ocurrió un error. Intenta nuevamente.'
    return Promise.reject(new Error(mensaje))
  },
)

export default http

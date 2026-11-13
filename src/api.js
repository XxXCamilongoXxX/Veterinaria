const API = import.meta.env.VITE_API_URL || '/api/v1'
export function tokenActual() { return localStorage.getItem('vetToken') }
export async function api(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...options.headers }
  const token = tokenActual()
  if (token) headers.Authorization = `Bearer ${token}`
  let response
  try { response = await fetch(`${API}${path}`, { ...options, headers }) } catch { throw new Error('No se pudo conectar con la veterinaria. Comprueba que el servidor esté disponible.') }
  if (!response.ok) {
    let message = 'Ocurrió un error. Intenta nuevamente.'
    try { const body = await response.json(); message = body.detail || body.message || body.title || message } catch {}
    throw new Error(message)
  }
  if (response.status === 204) return null
  return response.json()
}

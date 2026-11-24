import '@testing-library/jest-dom/vitest'
import { afterEach, beforeEach, vi } from 'vitest'
import http from './api'
import { serviciosIniciales } from './data/servicios'

// En los tests no hay backend: se reemplaza el cliente Axios por funciones simuladas.
vi.mock('./api', () => ({
  default: { get: vi.fn(), post: vi.fn(), put: vi.fn(), patch: vi.fn(), delete: vi.fn() },
}))

beforeEach(() => {
  // Respuestas por defecto: el catálogo inicial para /servicios y listas vacías para el resto
  http.get.mockImplementation((url) => Promise.resolve({ data: url === '/servicios' ? serviciosIniciales : [] }))
  http.post.mockResolvedValue({ data: {} })
})

afterEach(() => {
  vi.clearAllMocks()
  localStorage.clear()
})

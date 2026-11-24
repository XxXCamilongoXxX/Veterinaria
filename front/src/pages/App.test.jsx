import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import http from '../api'
import App from '../App'

const solicitud = { id: 'SOL-1', creada: '2026-10-22T12:00:00.000Z', estado: 'Pendiente', cliente: { nombre: 'Ana', apellido: 'Pérez', correo: 'ana@correo.cl', telefono: '987654321', mascota: 'Luna', especie: 'Perro' }, servicios: [{ id: 1, nombre: 'Consulta General', precio: 18000, fecha: '2026-11-01' }] }

function iniciarSesionComo(rol) {
  localStorage.setItem('vetToken', 'token-de-prueba')
  localStorage.setItem('sesionUsuario', JSON.stringify({ nombre: 'Prueba', correo: 'prueba@vetsanmarcos.cl', rol }))
}

describe('Rutas privadas', () => {
  it('redirige al login cuando se intenta abrir el panel sin sesión', () => { // Arrange
    render(<MemoryRouter initialEntries={['/admin']}><App /></MemoryRouter>) // Act
    expect(screen.getByRole('heading', { name: 'Iniciar Sesión' })).toBeInTheDocument() // Assert
  })

  it('un USER no puede entrar al panel de administración', () => { // Arrange
    iniciarSesionComo('USER')
    render(<MemoryRouter initialEntries={['/admin']}><App /></MemoryRouter>) // Act
    expect(screen.queryByRole('heading', { name: 'Panel de Control' })).not.toBeInTheDocument() // Assert
  })

  it('un ADMIN entra al panel de administración', () => { // Arrange
    iniciarSesionComo('ADMIN')
    render(<MemoryRouter initialEntries={['/admin']}><App /></MemoryRouter>) // Act
    expect(screen.getByRole('heading', { name: 'Panel de Control' })).toBeInTheDocument() // Assert
  })

  it('muestra al veterinario las consultas que entrega la API', async () => { // Arrange
    iniciarSesionComo('VETERINARIO')
    http.get.mockImplementation((url) => Promise.resolve({ data: url === '/solicitudes' ? [solicitud] : [] }))
    render(<MemoryRouter initialEntries={['/veterinario']}><App /></MemoryRouter>) // Act
    expect(screen.getByRole('heading', { name: 'Consultas recibidas' })).toBeInTheDocument() // Assert
    expect(await screen.findByText('ana@correo.cl')).toBeInTheDocument()
    expect(screen.getByText(/Consulta General/)).toBeInTheDocument()
  })
})

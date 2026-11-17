import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import App from '../App'

describe('Rutas privadas', () => {
  beforeEach(() => localStorage.clear())

  it('redirige al login cuando se intenta abrir el panel sin sesión', () => { // Arrange
    render(<MemoryRouter initialEntries={['/admin']}><App /></MemoryRouter>) // Act
    expect(screen.getByRole('heading', { name: 'Iniciar Sesión' })).toBeInTheDocument() // Assert
  })

  it('muestra al veterinario las consultas guardadas', () => { // Arrange
    localStorage.setItem('sesionActiva', 'true')
    localStorage.setItem('sesionUsuario', JSON.stringify({ nombre: 'Veterinario', correo: 'veterinario@vetsanmarcos.cl', rol: 'veterinario' }))
    localStorage.setItem('solicitudesVetSanMarcos', JSON.stringify([{ id: 'SOL-1', creada: '2026-10-22T12:00:00.000Z', estado: 'Pendiente', cliente: { nombre: 'Ana', apellido: 'Pérez', correo: 'ana@correo.cl', telefono: '987654321', mascota: 'Luna', especie: 'Perro' }, servicios: [{ id: 1, nombre: 'Consulta General', precio: 18000, fecha: '2026-11-01' }] }]))
    render(<MemoryRouter initialEntries={['/veterinario']}><App /></MemoryRouter>) // Act
    expect(screen.getByRole('heading', { name: 'Consultas recibidas' })).toBeInTheDocument() // Assert
    expect(screen.getByText('ana@correo.cl')).toBeInTheDocument()
    expect(screen.getByText(/Consulta General/)).toBeInTheDocument()
  })
})

import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { TiendaProvider } from '../context/TiendaContext'
import Servicios from './Servicios'

describe('Servicios', () => {
  it('muestra el catálogo inicial de atención veterinaria', () => { // Arrange
    render(<MemoryRouter><TiendaProvider><Servicios /></TiendaProvider></MemoryRouter>) // Act
    expect(screen.getByRole('heading', { name: 'Vacunación' })).toBeInTheDocument() // Assert
    expect(screen.getByRole('heading', { name: 'Consulta General' })).toBeInTheDocument()
  })
  it('filtra dinámicamente por especie', () => { // Arrange
    render(<MemoryRouter><TiendaProvider><Servicios /></TiendaProvider></MemoryRouter>)
    fireEvent.change(screen.getByLabelText('Filtrar por mascota:'), { target: { value: 'Perros y gatos' } }) // Act
    expect(screen.getByRole('heading', { name: 'Vacunación' })).toBeInTheDocument() // Assert
    expect(screen.queryByRole('heading', { name: 'Cirugía Menor' })).not.toBeInTheDocument()
  })
})

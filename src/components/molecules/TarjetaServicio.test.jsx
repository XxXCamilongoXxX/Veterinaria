import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { TiendaProvider } from '../../context/TiendaContext'
import TarjetaServicio from './TarjetaServicio'
import Encabezado from '../organisms/Encabezado'

const servicio = { id: 1, nombre: 'Vacunación', descripcion: 'Vacunas al día.', precio: 12000, imagen: '/img/gato vacuna.jpg', especie: 'Perros y gatos' }
function renderTarjeta() { return render(<MemoryRouter><TiendaProvider><Encabezado /><TarjetaServicio servicio={servicio} /></TiendaProvider></MemoryRouter>) }
describe('TarjetaServicio', () => {
  it('muestra el nombre del servicio', () => { // Arrange
    renderTarjeta() // Act
    expect(screen.getByRole('heading', { name: 'Vacunación' })).toBeInTheDocument() // Assert
  })
  it('muestra el precio formateado en pesos chilenos', () => { // Arrange
    renderTarjeta() // Act
    expect(screen.getByText(/12\.000/)).toBeInTheDocument() // Assert
  })
  it('permite agregar el servicio al carrito con el botón', () => { // Arrange
    renderTarjeta() // Act
    fireEvent.click(screen.getByRole('button', { name: 'Agregar al carrito' })) // Assert
    expect(screen.getByRole('link', { name: 'Carrito (1)' })).toBeInTheDocument()
  })
  it('permite guardar un servicio en favoritos', () => { // Arrange
    renderTarjeta() // Act
    fireEvent.click(screen.getByRole('button', { name: 'Agregar a favoritos' })) // Assert
    expect(screen.getByRole('button', { name: 'Quitar de favoritos' })).toBeInTheDocument()
  })
})

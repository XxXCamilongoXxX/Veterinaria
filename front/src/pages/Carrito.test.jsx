import { useEffect, useRef } from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import http from '../api'
import { TiendaProvider, useTienda } from '../context/TiendaContext'
import Carrito from './Carrito'

function CarritoConDosServicios() {
  const { agregarCarrito } = useTienda()
  const inicializado = useRef(false)
  useEffect(() => {
    if (inicializado.current) return
    inicializado.current = true
    agregarCarrito({ id: 1, nombre: 'Consulta General', precio: 18000 })
    agregarCarrito({ id: 2, nombre: 'Vacunación', precio: 12000 })
  }, [agregarCarrito])
  return <Carrito />
}

function renderCarrito() {
  return render(<MemoryRouter><TiendaProvider><CarritoConDosServicios /></TiendaProvider></MemoryRouter>)
}

describe('Carrito', () => {
  it('avisa y no confirma si falta la fecha de una cita', () => { // Arrange
    renderCarrito() // Act
    fireEvent.click(screen.getByRole('button', { name: 'Confirmar solicitud' }))
    expect(screen.getByRole('alert')).toHaveTextContent('Debes colocar la fecha de cada cita') // Assert
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('confirma la solicitud después de poner fecha en cada servicio', async () => { // Arrange
    localStorage.setItem('vetToken', 'token-de-prueba')
    localStorage.setItem('sesionUsuario', JSON.stringify({ nombre: 'Ana', apellido: 'Pérez', correo: 'ana@correo.cl', rol: 'USER' }))
    http.post.mockResolvedValue({ data: { id: 'SOL-1', estado: 'Pendiente', servicios: [] } })
    renderCarrito()
    fireEvent.change(screen.getByLabelText('Fecha de la cita:', { selector: '#fecha-cita-0' }), { target: { value: '2026-11-01' } })
    fireEvent.change(screen.getByLabelText('Fecha de la cita:', { selector: '#fecha-cita-1' }), { target: { value: '2026-11-02' } }) // Act
    fireEvent.click(screen.getByRole('button', { name: 'Confirmar solicitud' }))
    expect(await screen.findByRole('status')).toHaveTextContent('Solicitud de servicios confirmada') // Assert
    expect(http.post).toHaveBeenCalledWith('/solicitudes', { servicios: [{ servicioId: 1, fecha: '2026-11-01' }, { servicioId: 2, fecha: '2026-11-02' }] })
    expect(screen.getByText('Aún no agregas servicios.')).toBeInTheDocument()
  })

  it('requiere una sesión para enviar la solicitud a la veterinaria', () => { // Arrange
    renderCarrito()
    fireEvent.change(screen.getByLabelText('Fecha de la cita:', { selector: '#fecha-cita-0' }), { target: { value: '2026-11-01' } })
    fireEvent.change(screen.getByLabelText('Fecha de la cita:', { selector: '#fecha-cita-1' }), { target: { value: '2026-11-02' } }) // Act
    fireEvent.click(screen.getByRole('button', { name: 'Confirmar solicitud' }))
    expect(screen.getByRole('alert')).toHaveTextContent('Inicia sesión para enviar tus consultas') // Assert
    expect(screen.getByRole('link', { name: 'Iniciar sesión' })).toHaveAttribute('href', '/login')
  })
})

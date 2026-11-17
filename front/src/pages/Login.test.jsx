import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { TiendaProvider } from '../context/TiendaContext'
import Login from './Login'

describe('Login de personal', () => {
  beforeEach(() => localStorage.clear())

  it('inicia la sesión estática de veterinario y guarda el rol en localStorage', () => { // Arrange
    render(<MemoryRouter><TiendaProvider><Login /></TiendaProvider></MemoryRouter>)
    fireEvent.change(screen.getByLabelText('Correo:'), { target: { value: 'veterinario@vetsanmarcos.cl' } })
    fireEvent.change(screen.getByLabelText('Contraseña:'), { target: { value: 'Vet2026' } }) // Act
    fireEvent.click(screen.getByRole('button', { name: 'Entrar a mi cuenta' }))
    expect(JSON.parse(localStorage.getItem('sesionUsuario')).rol).toBe('veterinario') // Assert
    expect(localStorage.getItem('sesionActiva')).toBe('true')
  })
})

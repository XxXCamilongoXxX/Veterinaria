import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import http from '../api'
import { TiendaProvider } from '../context/TiendaContext'
import Login from './Login'

describe('Login', () => {
  it('envía las credenciales con Axios y guarda el token JWT y el rol', async () => { // Arrange
    http.post.mockResolvedValue({ data: { token: 'jwt-de-prueba', usuario: { nombre: 'Veterinario', correo: 'veterinario@vetsanmarcos.cl', rol: 'VETERINARIO' } } })
    render(<MemoryRouter><TiendaProvider><Login /></TiendaProvider></MemoryRouter>)
    fireEvent.change(screen.getByLabelText('Correo:'), { target: { value: 'veterinario@vetsanmarcos.cl' } })
    fireEvent.change(screen.getByLabelText('Contraseña:'), { target: { value: 'Vet2026' } }) // Act
    fireEvent.click(screen.getByRole('button', { name: 'Entrar a mi cuenta' }))
    await waitFor(() => expect(localStorage.getItem('vetToken')).toBe('jwt-de-prueba')) // Assert
    expect(http.post).toHaveBeenCalledWith('/auth/login', { correo: 'veterinario@vetsanmarcos.cl', clave: 'Vet2026' })
    expect(JSON.parse(localStorage.getItem('sesionUsuario')).rol).toBe('VETERINARIO')
  })

  it('muestra el mensaje del backend si las credenciales son incorrectas', async () => { // Arrange
    http.post.mockRejectedValue(new Error('Correo o contraseña incorrectos.'))
    render(<MemoryRouter><TiendaProvider><Login /></TiendaProvider></MemoryRouter>)
    fireEvent.change(screen.getByLabelText('Correo:'), { target: { value: 'otro@correo.cl' } })
    fireEvent.change(screen.getByLabelText('Contraseña:'), { target: { value: 'mala' } }) // Act
    fireEvent.click(screen.getByRole('button', { name: 'Entrar a mi cuenta' }))
    expect(await screen.findByText('Correo o contraseña incorrectos.')).toBeInTheDocument() // Assert
    expect(localStorage.getItem('vetToken')).toBeNull()
  })
})

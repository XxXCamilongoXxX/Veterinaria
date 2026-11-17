import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import FormularioAcceso, { esMayorDeEdad, fechaLimiteMayorEdad } from './FormularioAcceso'

describe('FormularioAcceso', () => {
  it('muestra el error si falta el correo', () => { // Arrange
    render(<FormularioAcceso onSuccess={() => {}} />) // Act
    fireEvent.click(screen.getByRole('button', { name: 'Entrar a mi cuenta' })) // Assert
    expect(screen.getByText('Ingresa tu correo electrónico.')).toBeInTheDocument()
  })
  it('valida el formato del correo', () => { // Arrange
    render(<FormularioAcceso onSuccess={() => {}} />) // Act
    fireEvent.change(screen.getByLabelText('Correo:'), { target: { value: 'correo-invalido' } })
    fireEvent.click(screen.getByRole('button', { name: 'Entrar a mi cuenta' })) // Assert
    expect(screen.getByText('El formato del correo no es válido.')).toBeInTheDocument()
  })
  it('exige mascota al crear cuenta', () => { // Arrange
    render(<FormularioAcceso registro />) // Act
    fireEvent.click(screen.getByRole('button', { name: 'Registrarme' })) // Assert
    expect(screen.getByText('Ingresa el nombre de tu mascota.')).toBeInTheDocument()
  })
  it('valida que las contraseñas coincidan', () => { // Arrange
    render(<FormularioAcceso registro />) // Act
    fireEvent.change(screen.getByLabelText('Contraseña:'), { target: { value: 'Clave123' } })
    fireEvent.change(screen.getByLabelText('Repetir contraseña:'), { target: { value: 'OtraClave' } })
    fireEvent.click(screen.getByRole('button', { name: 'Registrarme' })) // Assert
    expect(screen.getByText('No coinciden.')).toBeInTheDocument()
  })
  it('no permite seleccionar una fecha de nacimiento que no cumpla los 18 años', () => { // Arrange
    render(<FormularioAcceso registro />) // Act
    const fecha = screen.getByLabelText('Fecha de nacimiento:') // Assert
    expect(fecha).toHaveAttribute('max', fechaLimiteMayorEdad())
  })
  it('rechaza una fecha de nacimiento de una persona menor de 18', () => { // Arrange
    render(<FormularioAcceso registro />)
    const hoy = new Date()
    const fechaMenor = new Date(hoy.getFullYear() - 17, hoy.getMonth(), hoy.getDate())
    const valor = `${fechaMenor.getFullYear()}-${String(fechaMenor.getMonth() + 1).padStart(2, '0')}-${String(fechaMenor.getDate()).padStart(2, '0')}`
    fireEvent.change(screen.getByLabelText('Fecha de nacimiento:'), { target: { value: valor } }) // Act
    fireEvent.click(screen.getByRole('button', { name: 'Registrarme' }))
    expect(screen.getByText('Debes tener al menos 18 años para crear una cuenta.')).toBeInTheDocument() // Assert
    expect(esMayorDeEdad(valor)).toBe(false)
  })
  it('acepta la fecha límite correspondiente a cumplir 18 años', () => { // Arrange
    const limite = fechaLimiteMayorEdad() // Act
    expect(esMayorDeEdad(limite)).toBe(true) // Assert
  })
  it('registra los datos de mascota en localStorage', () => { // Arrange
    localStorage.clear(); render(<FormularioAcceso registro />)
    fireEvent.change(screen.getByLabelText('Nombre:'), { target: { value: 'Ana' } })
    fireEvent.change(screen.getByLabelText('Apellido:'), { target: { value: 'Pérez' } })
    fireEvent.change(screen.getByLabelText('Correo:'), { target: { value: 'ana@correo.cl' } })
    fireEvent.change(screen.getByLabelText('Contraseña:'), { target: { value: 'Clave123' } })
    fireEvent.change(screen.getByLabelText('Repetir contraseña:'), { target: { value: 'Clave123' } })
    fireEvent.change(screen.getByLabelText('Fecha de nacimiento:'), { target: { value: '2000-01-01' } })
    fireEvent.change(screen.getByLabelText('Teléfono:'), { target: { value: '987654321' } })
    fireEvent.change(screen.getByLabelText('Especie de tu mascota:'), { target: { value: 'Perro' } })
    fireEvent.change(screen.getByLabelText('Nombre de tu mascota:'), { target: { value: 'Luna' } })
    fireEvent.click(screen.getByRole('button', { name: 'Registrarme' })) // Act
    expect(JSON.parse(localStorage.getItem('usuarioVetSanMarcos')).mascota).toBe('Luna') // Assert
  })
})

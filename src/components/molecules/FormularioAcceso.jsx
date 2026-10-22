import { useState } from 'react'
import { Form, Button } from 'react-bootstrap'
import Campo from '../atoms/Campo'
const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
export function fechaLimiteMayorEdad(hoy = new Date()) {
  const limite = new Date(hoy.getFullYear() - 18, hoy.getMonth(), hoy.getDate())
  return `${limite.getFullYear()}-${String(limite.getMonth() + 1).padStart(2, '0')}-${String(limite.getDate()).padStart(2, '0')}`
}

export function esMayorDeEdad(fecha, hoy = new Date()) {
  return Boolean(fecha) && fecha <= fechaLimiteMayorEdad(hoy)
}

export default function FormularioAcceso({ registro = false, onSuccess }) {
  const [valores, setValores] = useState({ nombre: '', apellido: '', correo: '', clave: '', confirmar: '', telefono: '', nacimiento: '', especie: '', mascota: '' })
  const [errores, setErrores] = useState({})
  const [mensaje, setMensaje] = useState('')
  const cambiar = (e) => setValores({ ...valores, [e.target.name]: e.target.value })
  const enviar = (e) => {
    e.preventDefault(); const next = {}
    if (!valores.correo.trim()) next.correo = 'Ingresa tu correo electrónico.'
    else if (!correoValido.test(valores.correo.trim())) next.correo = 'El formato del correo no es válido.'
    if (!valores.clave) next.clave = 'Ingresa tu contraseña.'
    if (registro) {
      if (!valores.nombre.trim()) next.nombre = 'Obligatorio.'
      else if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(valores.nombre.trim())) next.nombre = 'Solo letras.'
      if (!valores.apellido.trim()) next.apellido = 'Obligatorio.'
      if (valores.clave.length < 8) next.clave = 'Mínimo 8 caracteres.'
      if (valores.confirmar !== valores.clave) next.confirmar = 'No coinciden.'
      if (!valores.nacimiento) next.nacimiento = 'Ingresa tu fecha de nacimiento.'
      else if (!esMayorDeEdad(valores.nacimiento)) next.nacimiento = 'Debes tener al menos 18 años para crear una cuenta.'
      if (!valores.telefono.trim()) next.telefono = 'Ingresa un teléfono de contacto.'
      if (!valores.especie) next.especie = 'Selecciona la especie de tu mascota.'
      if (!valores.mascota.trim()) next.mascota = 'Ingresa el nombre de tu mascota.'
    }
    setErrores(next); setMensaje('')
    if (Object.keys(next).length) return
    if (registro) {
      const cuenta = { nombre: valores.nombre.trim(), apellido: valores.apellido.trim(), correo: valores.correo.trim(), clave: valores.clave, telefono: valores.telefono, especie: valores.especie, mascota: valores.mascota, nacimiento: valores.nacimiento }
      localStorage.setItem('usuarioVetSanMarcos', JSON.stringify(cuenta)); setMensaje('¡Cuenta creada! Ve a Iniciar Sesión.')
    } else onSuccess(valores.correo.trim(), valores.clave, setMensaje)
  }
  return <Form className="formulario" onSubmit={enviar} noValidate>
    {registro && <><Campo id="nombre" name="nombre" label="Nombre:" placeholder="Ej: Juan" value={valores.nombre} onChange={cambiar} error={errores.nombre} /><Campo id="apellido" name="apellido" label="Apellido:" placeholder="Ej: Pérez" value={valores.apellido} onChange={cambiar} error={errores.apellido} /></>}
    <Campo id="correo" name="correo" type="email" label="Correo:" placeholder="tu@correo.com" value={valores.correo} onChange={cambiar} error={errores.correo} />
    <Campo id="clave" name="clave" type="password" label="Contraseña:" placeholder={registro ? 'Mínimo 8 caracteres' : 'tu clave'} value={valores.clave} onChange={cambiar} error={errores.clave} />
    {registro && <><Campo id="confirmar" name="confirmar" type="password" label="Repetir contraseña:" value={valores.confirmar} onChange={cambiar} error={errores.confirmar} /><Campo id="nacimiento" name="nacimiento" type="date" label="Fecha de nacimiento:" max={fechaLimiteMayorEdad()} required value={valores.nacimiento} onChange={cambiar} error={errores.nacimiento} /><Campo id="telefono" name="telefono" type="tel" label="Teléfono:" placeholder="Ej: 987654321" value={valores.telefono} onChange={cambiar} error={errores.telefono} /><div className="grupo-form"><label htmlFor="especie">Especie de tu mascota:</label><select id="especie" name="especie" value={valores.especie} onChange={cambiar}><option value="">Selecciona una opción...</option><option>Perro</option><option>Gato</option><option>Conejo</option><option>Ave</option><option>Otra</option></select>{errores.especie && <span className="msj-error">{errores.especie}</span>}</div><Campo id="mascota" name="mascota" label="Nombre de tu mascota:" placeholder="Ej: Luna" value={valores.mascota} onChange={cambiar} error={errores.mascota} /></>}
    <Button type="submit" className="boton-verde">{registro ? 'Registrarme' : 'Entrar a mi cuenta'}</Button>
    {mensaje && <p role="status" className={mensaje.includes('incorrect') || mensaje.includes('No hay') ? 'fallo' : 'exito'}>{mensaje}</p>}
  </Form>
}

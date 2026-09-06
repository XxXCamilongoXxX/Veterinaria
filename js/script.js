/* =========================================================
   Veterinaria San Marcos - script.js
   Contiene: año dinámico del footer, interacción de la página
   de detalle de servicio y validaciones de los formularios
   de login y registro. Cada bloque comprueba si sus elementos
   existen antes de ejecutarse, así el mismo archivo sirve
   para las 5 páginas.
   ========================================================= */

document.addEventListener('DOMContentLoaded', function () {

  /* ---- Año automático en el pie de página (todas las páginas) ---- */
  var elAnio = document.getElementById('anio-actual');
  if (elAnio) {
    elAnio.textContent = new Date().getFullYear();
  }

  /* =====================================================
     PÁGINA DE DETALLE DE SERVICIO (producto.html)
     Interacción JS: selector de cantidad que calcula el
     total en vivo y botón de agendamiento que muestra
     un mensaje de confirmación.
     ===================================================== */
  var inputCantidad = document.getElementById('cantidad');
  if (inputCantidad) {
    var precioUnitario = parseFloat(inputCantidad.dataset.precio || '0');
    var elTotal = document.getElementById('total-calculado');
    var btnMenos = document.getElementById('restar-cantidad');
    var btnMas = document.getElementById('sumar-cantidad');
    var btnAgregar = document.getElementById('agregar-carrito');
    var mensajeCarrito = document.getElementById('mensaje-carrito');

    function formatearCLP(valor) {
      return '$' + Math.round(valor).toLocaleString('es-CL');
    }

    function actualizarTotal() {
      var cantidad = parseInt(inputCantidad.value, 10);
      if (isNaN(cantidad) || cantidad < 1) {
        cantidad = 1;
      }
      var max = parseInt(inputCantidad.max, 10) || 20;
      if (cantidad > max) {
        cantidad = max;
      }
      inputCantidad.value = cantidad;
      if (elTotal) {
        elTotal.textContent = formatearCLP(precioUnitario * cantidad);
      }
    }

    if (btnMenos) {
      btnMenos.addEventListener('click', function () {
        inputCantidad.value = Math.max(1, parseInt(inputCantidad.value, 10) - 1);
        actualizarTotal();
      });
    }

    if (btnMas) {
      btnMas.addEventListener('click', function () {
        var max = parseInt(inputCantidad.max, 10) || 20;
        inputCantidad.value = Math.min(max, parseInt(inputCantidad.value, 10) + 1);
        actualizarTotal();
      });
    }

    inputCantidad.addEventListener('input', actualizarTotal);
    actualizarTotal();

    if (btnAgregar && mensajeCarrito) {
      btnAgregar.addEventListener('click', function () {
        var cantidad = parseInt(inputCantidad.value, 10);
        var nombreProducto = document.querySelector('.detalle-info h1');
        var nombre = nombreProducto ? nombreProducto.textContent : 'servicio';
        mensajeCarrito.textContent = 'Agregaste ' + cantidad + ' x ' + nombre +
          ' al agendamiento. Total: ' + formatearCLP(precioUnitario * cantidad) + '.';
        mensajeCarrito.classList.add('mostrar');
      });
    }
  }

  /* =====================================================
     VALIDACIONES COMUNES
     ===================================================== */
  var RE_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  var RE_SOLO_LETRAS = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;

  function mostrarError(input, mensaje) {
    input.classList.add('invalido');
    var contenedorError = document.getElementById(input.id + '-error');
    if (contenedorError) {
      contenedorError.textContent = mensaje;
    }
  }

  function limpiarError(input) {
    input.classList.remove('invalido');
    var contenedorError = document.getElementById(input.id + '-error');
    if (contenedorError) {
      contenedorError.textContent = '';
    }
  }

  /* =====================================================
     PÁGINA DE LOGIN (login.html)
     ===================================================== */
  var formLogin = document.getElementById('form-login');
  if (formLogin) {
    var correoLogin = document.getElementById('correo-login');
    var claveLogin = document.getElementById('clave-login');
    var mensajeLogin = document.getElementById('mensaje-formulario');

    formLogin.addEventListener('submit', function (evento) {
      evento.preventDefault();
      var esValido = true;

      limpiarError(correoLogin);
      limpiarError(claveLogin);

      if (correoLogin.value.trim() === '') {
        mostrarError(correoLogin, 'Ingresa tu correo electrónico.');
        esValido = false;
      } else if (!RE_CORREO.test(correoLogin.value.trim())) {
        mostrarError(correoLogin, 'El formato del correo no es válido.');
        esValido = false;
      }

      if (claveLogin.value === '') {
        mostrarError(claveLogin, 'Ingresa tu contraseña.');
        esValido = false;
      } else if (claveLogin.value.length < 8) {
        mostrarError(claveLogin, 'La contraseña debe tener al menos 8 caracteres.');
        esValido = false;
      }

      mensajeLogin.classList.remove('exito', 'fallo');
      if (esValido) {
        mensajeLogin.textContent = 'Inicio de sesión simulado correctamente. ¡Bienvenido/a de vuelta!';
        mensajeLogin.classList.add('exito');
        formLogin.reset();
      } else {
        mensajeLogin.textContent = 'Revisa los campos marcados en rojo antes de continuar.';
        mensajeLogin.classList.add('fallo');
      }
    });

    [correoLogin, claveLogin].forEach(function (campo) {
      campo.addEventListener('input', function () { limpiarError(campo); });
    });
  }

  /* =====================================================
     PÁGINA DE REGISTRO (registro.html)
     ===================================================== */
  var formRegistro = document.getElementById('form-registro');
  if (formRegistro) {
    var nombre = document.getElementById('nombre');
    var apellido = document.getElementById('apellido');
    var correo = document.getElementById('correo-registro');
    var clave = document.getElementById('clave-registro');
    var claveConfirmar = document.getElementById('clave-confirmar');
    var fechaNacimiento = document.getElementById('fecha-nacimiento');
    var telefono = document.getElementById('telefono');
    var mensajeRegistro = document.getElementById('mensaje-formulario');

    var camposTexto = [nombre, apellido, correo, clave, claveConfirmar, fechaNacimiento, telefono];

    function edadDesde(fechaStr) {
      var hoy = new Date();
      var nacimiento = new Date(fechaStr);
      var edad = hoy.getFullYear() - nacimiento.getFullYear();
      var mes = hoy.getMonth() - nacimiento.getMonth();
      if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
        edad--;
      }
      return edad;
    }

    formRegistro.addEventListener('submit', function (evento) {
      evento.preventDefault();
      var esValido = true;
      camposTexto.forEach(limpiarError);

      if (nombre.value.trim() === '') {
        mostrarError(nombre, 'El nombre es obligatorio.');
        esValido = false;
      } else if (!RE_SOLO_LETRAS.test(nombre.value.trim())) {
        mostrarError(nombre, 'El nombre solo puede contener letras.');
        esValido = false;
      }

      if (apellido.value.trim() === '') {
        mostrarError(apellido, 'El apellido es obligatorio.');
        esValido = false;
      } else if (!RE_SOLO_LETRAS.test(apellido.value.trim())) {
        mostrarError(apellido, 'El apellido solo puede contener letras.');
        esValido = false;
      }

      if (correo.value.trim() === '') {
        mostrarError(correo, 'El correo electrónico es obligatorio.');
        esValido = false;
      } else if (!RE_CORREO.test(correo.value.trim())) {
        mostrarError(correo, 'Ingresa un correo con formato válido (ej: nombre@dominio.com).');
        esValido = false;
      }

      if (clave.value === '') {
        mostrarError(clave, 'La contraseña es obligatoria.');
        esValido = false;
      } else if (clave.value.length < 8 || !/[0-9]/.test(clave.value) || !/[A-Za-z]/.test(clave.value)) {
        mostrarError(clave, 'Mínimo 8 caracteres, combinando letras y números.');
        esValido = false;
      }

      if (claveConfirmar.value === '') {
        mostrarError(claveConfirmar, 'Confirma tu contraseña.');
        esValido = false;
      } else if (claveConfirmar.value !== clave.value) {
        mostrarError(claveConfirmar, 'Las contraseñas no coinciden.');
        esValido = false;
      }

      if (fechaNacimiento.value === '') {
        mostrarError(fechaNacimiento, 'La fecha de nacimiento es obligatoria.');
        esValido = false;
      } else if (edadDesde(fechaNacimiento.value) < 13) {
        mostrarError(fechaNacimiento, 'Debes tener al menos 13 años para registrarte.');
        esValido = false;
      }

      if (telefono.value.trim() !== '' && !/^[0-9+\s]{7,15}$/.test(telefono.value.trim())) {
        mostrarError(telefono, 'Ingresa solo números (7 a 15 dígitos).');
        esValido = false;
      }

      mensajeRegistro.classList.remove('exito', 'fallo');
      if (esValido) {
        mensajeRegistro.textContent = 'Cuenta creada correctamente. ¡Gracias por unirte a Veterinaria San Marcos!';
        mensajeRegistro.classList.add('exito');
        formRegistro.reset();
      } else {
        mensajeRegistro.textContent = 'Hay campos por corregir. Revisa los mensajes en rojo.';
        mensajeRegistro.classList.add('fallo');
      }
    });

    camposTexto.forEach(function (campo) {
      campo.addEventListener('input', function () { limpiarError(campo); });
    });
  }

});

document.addEventListener('DOMContentLoaded', function () {

  var menuNav = document.querySelector('.menu');
  var sesionActiva = localStorage.getItem('sesionActiva');
  var datosGuardados = localStorage.getItem('usuarioVetSanMarcos');

  if (sesionActiva === 'true' && datosGuardados && menuNav) {
    var usuario = JSON.parse(datosGuardados);
    var inicial = usuario.nombre.charAt(0).toUpperCase();

    menuNav.innerHTML = `
      <li><a href="index.html">Inicio</a></li>
      <li><a href="servicios.html">Servicios</a></li>
      <li class="perfil-usuario">
        <div class="foto-perfil">${inicial}</div>
        <span>Hola, ${usuario.nombre}</span>
      </li>
      <li><a href="#" id="cerrar-sesion">Cerrar sesión</a></li>
    `;

    document.getElementById('cerrar-sesion').addEventListener('click', function(evento) {
      evento.preventDefault();
      localStorage.removeItem('sesionActiva');
      window.location.href = 'index.html';
    });
  }

  var elAnio = document.getElementById('anio-actual');
  if (elAnio) {
    elAnio.textContent = new Date().getFullYear();
  }

  var selectMascota = document.getElementById('tipo-animal');
  var precioFinal = document.getElementById('precio-final');
  var btnAgendar = document.getElementById('btn-agendar');
  var fechaReserva = document.getElementById('fecha-reserva');
  var mensajeReserva = document.getElementById('mensaje-reserva');

  if (selectMascota && precioFinal) {
    selectMascota.addEventListener('change', function() {
      var valor = parseInt(this.value, 10);
      if (valor > 0) {
        precioFinal.textContent = '$' + valor.toLocaleString('es-CL');
      } else {
        precioFinal.textContent = '$0';
      }
    });
  }

  if (btnAgendar && selectMascota && fechaReserva && mensajeReserva) {
    btnAgendar.addEventListener('click', function() {
      
      if (selectMascota.value === "0") {
        mensajeReserva.style.color = "red";
        mensajeReserva.textContent = "Por favor, selecciona el tipo de mascota.";
        return;
      }
      
      if (fechaReserva.value === "") {
        mensajeReserva.style.color = "red";
        mensajeReserva.textContent = "Por favor, selecciona una fecha para la cita.";
        return;
      }

      if (sesionActiva !== 'true' || !datosGuardados) {
        mensajeReserva.style.color = "red";
        mensajeReserva.innerHTML = "Debes <a href='login.html' style='color: #2e86c1; text-decoration: underline;'>iniciar sesión</a> para agendar.";
        return;
      }

      var datosUsuario = JSON.parse(datosGuardados);
      var correo = datosUsuario.correo;
      var fechaInvertida = fechaReserva.value.split('-').reverse().join('-');

      mensajeReserva.style.color = "green";
      mensajeReserva.innerHTML = "¡Hora reservada con éxito para el <strong>" + fechaInvertida + "</strong>! <br><br> Hemos enviado una copia del comprobante a tu correo: <strong>" + correo + "</strong>";
      
      selectMascota.value = "0";
      fechaReserva.value = "";
      precioFinal.textContent = "$0";
    });
  }

  var RE_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  var RE_SOLO_LETRAS = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;

  function mostrarError(input, mensaje) {
    input.classList.add('invalido');
    var contenedorError = document.getElementById(input.id + '-error');
    if (contenedorError) { contenedorError.textContent = mensaje; }
  }

  function limpiarError(input) {
    input.classList.remove('invalido');
    var contenedorError = document.getElementById(input.id + '-error');
    if (contenedorError) { contenedorError.textContent = ''; }
  }

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
      }

      mensajeLogin.classList.remove('exito', 'fallo');
      if (esValido) {
        var usuarioGuardado = localStorage.getItem('usuarioVetSanMarcos');
        if (usuarioGuardado) {
          var datos = JSON.parse(usuarioGuardado);
          if (correoLogin.value.trim() === datos.correo && claveLogin.value === datos.clave) {
            localStorage.setItem('sesionActiva', 'true');
            window.location.href = 'index.html';
          } else {
            mostrarError(correoLogin, 'Datos incorrectos.');
            mostrarError(claveLogin, 'Datos incorrectos.');
            mensajeLogin.textContent = 'Correo o contraseña incorrectos.';
            mensajeLogin.classList.add('fallo');
          }
        } else {
          mensajeLogin.textContent = 'No hay cuentas registradas.';
          mensajeLogin.classList.add('fallo');
        }
      }
    });

    [correoLogin, claveLogin].forEach(function (campo) {
      campo.addEventListener('input', function () { limpiarError(campo); });
    });
  }

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

    formRegistro.addEventListener('submit', function (evento) {
      evento.preventDefault();
      var esValido = true;
      camposTexto.forEach(limpiarError);

      if (nombre.value.trim() === '') {
        mostrarError(nombre, 'Obligatorio.');
        esValido = false;
      } else if (!RE_SOLO_LETRAS.test(nombre.value.trim())) {
        mostrarError(nombre, 'Solo letras.');
        esValido = false;
      }

      if (correo.value.trim() === '') {
        mostrarError(correo, 'Obligatorio.');
        esValido = false;
      } else if (!RE_CORREO.test(correo.value.trim())) {
        mostrarError(correo, 'Correo inválido.');
        esValido = false;
      }

      if (clave.value === '') {
        mostrarError(clave, 'Obligatorio.');
        esValido = false;
      } else if (clave.value.length < 8) {
        mostrarError(clave, 'Mínimo 8 caracteres.');
        esValido = false;
      }

      if (claveConfirmar.value !== clave.value) {
        mostrarError(claveConfirmar, 'No coinciden.');
        esValido = false;
      }

      mensajeRegistro.classList.remove('exito', 'fallo');
      if (esValido) {
        var datosUsuario = {
          nombre: nombre.value.trim(),
          correo: correo.value.trim(),
          clave: clave.value
        };
        localStorage.setItem('usuarioVetSanMarcos', JSON.stringify(datosUsuario));
        mensajeRegistro.textContent = '¡Cuenta creada! Ve a Iniciar Sesión.';
        mensajeRegistro.classList.add('exito');
        formRegistro.reset();
      } else {
        mensajeRegistro.textContent = 'Revisa los campos en rojo.';
        mensajeRegistro.classList.add('fallo');
      }
    });

    camposTexto.forEach(function (campo) {
      campo.addEventListener('input', function () { limpiarError(campo); });
    });
  }

});
-- =====================================================================
-- Veterinaria San Marcos - Script completo de base de datos (MySQL 8)
-- Crea la base de datos, las tablas y carga los datos de prueba.
--
-- Es el mismo contenido que las migraciones Flyway V1..V5 de
-- back/src/main/resources/db/migration. NO es obligatorio ejecutarlo:
-- si la base está vacía, Flyway crea todo solo al iniciar el backend.
--
-- Los usuarios de demostración (ADMIN, VETERINARIO, USER) los crea el
-- backend al arrancar (BootstrapData), porque sus claves van cifradas con BCrypt.
--
-- Uso:  mysql -u root -p < database/script_completo.sql
-- =====================================================================

CREATE DATABASE IF NOT EXISTS veterinaria CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE veterinaria;

-- ---------- V1__init.sql ----------
CREATE TABLE usuarios (
 id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY, nombre VARCHAR(80) NOT NULL, apellido VARCHAR(80) NOT NULL,
 correo VARCHAR(180) NOT NULL UNIQUE, clave VARCHAR(100) NOT NULL, rol VARCHAR(30) NOT NULL,
 telefono VARCHAR(30), especie VARCHAR(30), mascota VARCHAR(80), nacimiento VARCHAR(10)
);
CREATE TABLE servicios (
 id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY, nombre VARCHAR(120) NOT NULL, descripcion VARCHAR(1000) NOT NULL,
 precio INT NOT NULL, especie VARCHAR(50) NOT NULL, imagen VARCHAR(300), activo BOOLEAN NOT NULL DEFAULT TRUE
);
CREATE TABLE solicitudes (
 id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY, usuario_id BIGINT NOT NULL, estado VARCHAR(30) NOT NULL,
 creada TIMESTAMP(6) NOT NULL, CONSTRAINT fk_solicitud_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);
CREATE TABLE solicitud_detalles (
 id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY, solicitud_id BIGINT NOT NULL, servicio_id BIGINT NOT NULL,
 nombre VARCHAR(120) NOT NULL, precio INT NOT NULL, fecha VARCHAR(10) NOT NULL,
 CONSTRAINT fk_detalle_solicitud FOREIGN KEY (solicitud_id) REFERENCES solicitudes(id)
);
INSERT INTO servicios(nombre,descripcion,precio,especie,imagen,activo) VALUES
('Consulta General','Para saber cómo está tu animalito.',18000,'Todas','/img/perro en clinica.jpg',TRUE),
('Vacunación','Las vacunas al día para que no se enferme.',12000,'Perros y gatos','/img/gato vacuna.jpg',TRUE),
('Cirugía Menor','Procedimientos rápidos y seguros para tu mascota.',35000,'Todas','/img/wonejo.jpg',TRUE);

-- ---------- V2__create_productos_clientes_ventas.sql ----------
CREATE TABLE productos (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(120) NOT NULL,
    descripcion VARCHAR(1000) NOT NULL,
    precio INT NOT NULL,
    stock INT NOT NULL
);

CREATE TABLE clientes (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(80) NOT NULL,
    correo VARCHAR(180) NOT NULL UNIQUE,
    telefono VARCHAR(30) NOT NULL
);

CREATE TABLE ventas (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    cliente_id BIGINT NOT NULL,
    producto_id BIGINT NOT NULL,
    cantidad INT NOT NULL,
    total INT NOT NULL,
    fecha DATE NOT NULL
);

-- ---------- V3__create_mascotas.sql ----------
CREATE TABLE mascotas (
    id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(80) NOT NULL,
    especie VARCHAR(30) NOT NULL,
    dueno VARCHAR(120) NOT NULL
);

-- ---------- V4__roles_user_admin.sql ----------
-- Normaliza los roles a los nombres exigidos: USER y ADMIN (+ VETERINARIO como rol adicional).
UPDATE usuarios SET rol = 'ADMIN'       WHERE rol = 'admin';
UPDATE usuarios SET rol = 'VETERINARIO' WHERE rol = 'veterinario';
UPDATE usuarios SET rol = 'USER'        WHERE rol = 'cliente';

-- ---------- V5__datos_de_prueba.sql ----------
-- Datos de ejemplo para la demostración.
INSERT INTO productos (nombre, descripcion, precio, stock) VALUES
('Alimento Perro Adulto 15kg', 'Alimento seco balanceado para perros adultos.', 32990, 20),
('Alimento Gato 3kg', 'Alimento seco para gatos adultos esterilizados.', 14990, 15),
('Antipulgas Pipeta', 'Pipeta antipulgas y garrapatas, dura 30 días.', 8990, 40),
('Collar Isabelino', 'Collar protector post operatorio, talla M.', 5990, 12);

INSERT INTO clientes (nombre, correo, telefono) VALUES
('Juan Soto', 'juan.soto@correo.cl', '987654321'),
('María González', 'maria.gonzalez@correo.cl', '912345678'),
('Pedro Rojas', 'pedro.rojas@correo.cl', '956781234');

INSERT INTO mascotas (nombre, especie, dueno) VALUES
('Firulais', 'Perro', 'Juan Soto'),
('Michi', 'Gato', 'María González'),
('Copito', 'Conejo', 'Pedro Rojas');

INSERT INTO ventas (cliente_id, producto_id, cantidad, total, fecha) VALUES
(1, 1, 1, 32990, '2026-11-20'),
(2, 2, 2, 29980, '2026-11-21'),
(3, 3, 3, 26970, '2026-11-22');


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

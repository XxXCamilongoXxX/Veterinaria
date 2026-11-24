-- Opción recomendada para ejecutar con IntelliJ:
-- crea solo la base de datos vacía y un usuario propio.
-- Al iniciar Spring Boot, Flyway crea las tablas y carga los datos.
CREATE DATABASE IF NOT EXISTS veterinaria CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'veterinaria'@'localhost' IDENTIFIED BY 'veterinaria_local';
GRANT ALL PRIVILEGES ON veterinaria.* TO 'veterinaria'@'localhost';
FLUSH PRIVILEGES;

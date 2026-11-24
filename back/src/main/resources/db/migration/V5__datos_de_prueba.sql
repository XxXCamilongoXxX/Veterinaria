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

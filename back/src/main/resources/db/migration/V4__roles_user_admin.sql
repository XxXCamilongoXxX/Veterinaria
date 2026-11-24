-- Normaliza los roles a los nombres exigidos: USER y ADMIN (+ VETERINARIO como rol adicional).
UPDATE usuarios SET rol = 'ADMIN'       WHERE rol = 'admin';
UPDATE usuarios SET rol = 'VETERINARIO' WHERE rol = 'veterinario';
UPDATE usuarios SET rol = 'USER'        WHERE rol = 'cliente';

package cl.vetsanmarcos.api.service;

import cl.vetsanmarcos.api.config.SecurityConfig;
import cl.vetsanmarcos.api.model.Usuario;
import cl.vetsanmarcos.api.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Al arrancar, crea las cuentas de demostración si no existen.
 * Se hace aquí (y no en un script SQL) porque las contraseñas deben guardarse cifradas con BCrypt.
 */
@Component
public class BootstrapData implements CommandLineRunner {
    private final UsuarioRepository usuarios;
    private final PasswordEncoder encoder;

    @Value("${DEMO_ADMIN_PASSWORD:Admin123}") private String adminPassword;
    @Value("${DEMO_VET_PASSWORD:Vet2026}") private String vetPassword;
    @Value("${DEMO_USER_PASSWORD:User2026}") private String userPassword;

    public BootstrapData(UsuarioRepository usuarios, PasswordEncoder encoder) {
        this.usuarios = usuarios;
        this.encoder = encoder;
    }

    @Override
    public void run(String... args) {
        crearSiNoExiste("Administrador", "San Marcos", "admin@vetsanmarcos.cl", adminPassword, SecurityConfig.ADMIN, null, null, null);
        crearSiNoExiste("Veterinario", "San Marcos", "veterinario@vetsanmarcos.cl", vetPassword, SecurityConfig.VETERINARIO, null, null, null);
        crearSiNoExiste("Ana", "Pérez", "usuario@vetsanmarcos.cl", userPassword, SecurityConfig.USER, "987654321", "Perro", "Luna");
    }

    private void crearSiNoExiste(String nombre, String apellido, String correo, String clave, String rol,
                                 String telefono, String especie, String mascota) {
        if (!usuarios.existsByCorreoIgnoreCase(correo)) {
            usuarios.save(new Usuario(nombre, apellido, correo, encoder.encode(clave), rol, telefono, especie, mascota, null));
        }
    }
}

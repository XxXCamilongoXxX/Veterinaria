package cl.vetsanmarcos.api.controller;

import cl.vetsanmarcos.api.config.SecurityConfig;
import cl.vetsanmarcos.api.model.Usuario;
import cl.vetsanmarcos.api.repository.UsuarioRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.time.Instant;
import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.time.temporal.ChronoUnit;
import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/v1/auth")
@Tag(name = "Autenticación", description = "Registro de clientes e inicio de sesión. Ambos endpoints son públicos.")
public class AuthController {

    // ---------- DTOs (lo que entra y sale de la API) ----------

    public record Registro(
            @NotBlank @Size(max = 80) String nombre,
            @NotBlank @Size(max = 80) String apellido,
            @Email @NotBlank String correo,
            @NotBlank @Size(min = 8) String clave,
            @NotBlank String telefono,
            @NotBlank String especie,
            @NotBlank String mascota,
            @NotBlank @Pattern(regexp = "\\d{4}-\\d{2}-\\d{2}") String nacimiento) {}

    public record Acceso(@Email @NotBlank String correo, @NotBlank String clave) {}

    public record Perfil(Long id, String nombre, String apellido, String correo, String rol,
                         String telefono, String especie, String mascota, String nacimiento) {}

    public record AuthResponse(String token, Perfil usuario) {}

    // ---------- Dependencias ----------

    private final UsuarioRepository usuarios;
    private final PasswordEncoder passwords;
    private final JwtEncoder encoder;
    private final long horasValidez;

    public AuthController(UsuarioRepository usuarios, PasswordEncoder passwords, JwtEncoder encoder,
                          @Value("${app.jwt.ttl-hours}") long horasValidez) {
        this.usuarios = usuarios;
        this.passwords = passwords;
        this.encoder = encoder;
        this.horasValidez = horasValidez;
    }

    // ---------- Endpoints ----------

    @PostMapping("/registro")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Registrar cliente", description = "Crea una cuenta con rol USER y devuelve un JWT. Requiere mayoría de edad y contraseña de al menos 8 caracteres.")
    @ApiResponse(responseCode = "201", description = "Cuenta creada; incluye el token JWT y el perfil del usuario.")
    @ApiResponse(responseCode = "400", description = "Datos inválidos o el cliente no cumple la edad mínima.")
    @ApiResponse(responseCode = "409", description = "Ya existe una cuenta con ese correo.")
    public AuthResponse registrar(@Valid @RequestBody Registro r) {
        validarMayorDeEdad(r.nacimiento());

        if (usuarios.existsByCorreoIgnoreCase(r.correo())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Ya existe una cuenta con ese correo.");
        }

        Usuario nuevo = new Usuario(
                r.nombre().trim(),
                r.apellido().trim(),
                r.correo().trim().toLowerCase(),
                passwords.encode(r.clave()),      // la clave se guarda cifrada con BCrypt
                SecurityConfig.USER,              // todo registro público es rol USER
                r.telefono(), r.especie(), r.mascota(), r.nacimiento());

        return generarRespuesta(usuarios.save(nuevo));
    }

    @PostMapping("/login")
    @Operation(summary = "Iniciar sesión", description = "Valida correo y contraseña. Devuelve un JWT para usar en el botón Authorize de Swagger o en el header Authorization.")
    @ApiResponse(responseCode = "200", description = "Inicio de sesión correcto; incluye token JWT y perfil.")
    @ApiResponse(responseCode = "401", description = "Correo o contraseña incorrectos.")
    public AuthResponse login(@Valid @RequestBody Acceso a) {
        Usuario usuario = usuarios.findByCorreoIgnoreCase(a.correo())
                .filter(u -> passwords.matches(a.clave(), u.getClave()))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Correo o contraseña incorrectos."));

        return generarRespuesta(usuario);
    }

    // ---------- Métodos de apoyo ----------

    /** Crea el JWT firmado. El rol va en el claim "roles" y el correo en "sub". */
    private AuthResponse generarRespuesta(Usuario u) {
        Instant ahora = Instant.now();

        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer("veterinaria-san-marcos")
                .issuedAt(ahora)
                .expiresAt(ahora.plus(horasValidez, ChronoUnit.HOURS))
                .subject(u.getCorreo())
                .claim("uid", u.getId())
                .claim("roles", List.of(u.getRol()))
                .build();

        JwsHeader header = JwsHeader.with(MacAlgorithm.HS256).build();
        String token = encoder.encode(JwtEncoderParameters.from(header, claims)).getTokenValue();

        return new AuthResponse(token, perfil(u));
    }

    private void validarMayorDeEdad(String nacimiento) {
        LocalDate fecha;
        try {
            fecha = LocalDate.parse(nacimiento);
        } catch (DateTimeParseException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Fecha de nacimiento inválida.");
        }
        if (fecha.isAfter(LocalDate.now().minusYears(18))) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Debes tener al menos 18 años para crear una cuenta.");
        }
    }

    public static Perfil perfil(Usuario u) {
        return new Perfil(u.getId(), u.getNombre(), u.getApellido(), u.getCorreo(), u.getRol(),
                u.getTelefono(), u.getEspecie(), u.getMascota(), u.getNacimiento());
    }
}

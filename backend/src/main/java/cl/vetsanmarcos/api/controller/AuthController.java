package cl.vetsanmarcos.api.controller;

import cl.vetsanmarcos.api.model.Usuario;
import cl.vetsanmarcos.api.repository.UsuarioRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Pattern;
import java.time.LocalDate;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController @RequestMapping("/api/v1/auth")
public class AuthController {
    public record Registro(@NotBlank @Size(max=80) String nombre,@NotBlank @Size(max=80) String apellido,@Email @NotBlank String correo,@NotBlank @Size(min=8) String clave,@NotBlank String telefono,@NotBlank String especie,@NotBlank String mascota,@NotBlank @Pattern(regexp="\\d{4}-\\d{2}-\\d{2}") String nacimiento) {}
    public record Acceso(@Email @NotBlank String correo,@NotBlank String clave) {}
    public record Perfil(Long id,String nombre,String apellido,String correo,String rol,String telefono,String especie,String mascota,String nacimiento) {}
    private final UsuarioRepository usuarios; private final PasswordEncoder passwords; private final JwtEncoder encoder; private final long ttl;
    AuthController(UsuarioRepository usuarios,PasswordEncoder passwords,JwtEncoder encoder,@Value("${app.jwt.ttl-hours}") long ttl){this.usuarios=usuarios;this.passwords=passwords;this.encoder=encoder;this.ttl=ttl;}
    @PostMapping("/registro") @ResponseStatus(HttpStatus.CREATED)
    public Map<String,Object> registrar(@Valid @RequestBody Registro r){
        try { if(LocalDate.parse(r.nacimiento()).isAfter(LocalDate.now().minusYears(18))) throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Debes tener al menos 18 años para crear una cuenta."); } catch(java.time.format.DateTimeParseException e) { throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Fecha de nacimiento inválida."); }
        if(usuarios.existsByCorreoIgnoreCase(r.correo())) throw new ResponseStatusException(HttpStatus.CONFLICT,"Ya existe una cuenta con ese correo.");
        var u=usuarios.save(new Usuario(r.nombre().trim(),r.apellido().trim(),r.correo().trim().toLowerCase(),passwords.encode(r.clave()),"cliente",r.telefono(),r.especie(),r.mascota(),r.nacimiento()));
        return token(u);
    }
    @PostMapping("/login") public Map<String,Object> login(@Valid @RequestBody Acceso a){
        var u=usuarios.findByCorreoIgnoreCase(a.correo()).filter(x->passwords.matches(a.clave(),x.getClave())).orElseThrow(()->new ResponseStatusException(HttpStatus.UNAUTHORIZED,"Correo o contraseña incorrectos."));
        return token(u);
    }
    private Map<String,Object> token(Usuario u){Instant now=Instant.now();var claims=JwtClaimsSet.builder().issuer("veterinaria-san-marcos").issuedAt(now).expiresAt(now.plus(ttl,ChronoUnit.HOURS)).subject(u.getCorreo()).claim("uid",u.getId()).claim("roles",List.of(u.getRol())).build();var jwt=encoder.encode(JwtEncoderParameters.from(org.springframework.security.oauth2.jwt.JwsHeader.with(MacAlgorithm.HS256).build(),claims));return Map.of("token",jwt.getTokenValue(),"usuario",perfil(u));}
    public static Perfil perfil(Usuario u){return new Perfil(u.getId(),u.getNombre(),u.getApellido(),u.getCorreo(),u.getRol(),u.getTelefono(),u.getEspecie(),u.getMascota(),u.getNacimiento());}
}

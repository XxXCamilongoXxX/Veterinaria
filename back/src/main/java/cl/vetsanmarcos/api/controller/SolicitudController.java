package cl.vetsanmarcos.api.controller;

import cl.vetsanmarcos.api.config.SecurityConfig;
import cl.vetsanmarcos.api.model.DetalleSolicitud;
import cl.vetsanmarcos.api.model.Servicio;
import cl.vetsanmarcos.api.model.Solicitud;
import cl.vetsanmarcos.api.model.Usuario;
import cl.vetsanmarcos.api.repository.DetalleSolicitudRepository;
import cl.vetsanmarcos.api.repository.ServicioRepository;
import cl.vetsanmarcos.api.repository.SolicitudRepository;
import cl.vetsanmarcos.api.repository.UsuarioRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/v1/solicitudes")
@Tag(name = "Solicitudes de atención", description = "Creación y seguimiento de las solicitudes de servicios veterinarios.")
@SecurityRequirement(name = "bearerAuth")
public class SolicitudController {

    // ---------- DTOs ----------
    public record Linea(@NotNull Long servicioId, @NotNull @Pattern(regexp = "\\d{4}-\\d{2}-\\d{2}") String fecha) {}
    public record Crear(@NotEmpty List<@Valid Linea> servicios) {}
    public record Estado(String estado) {}
    public record ClienteView(String nombre, String apellido, String correo, String telefono, String mascota, String especie) {}
    public record ServicioItem(Long id, String nombre, Integer precio, String fecha) {}
    public record SolicitudView(String id, String creada, String estado, ClienteView cliente, List<ServicioItem> servicios) {}

    private static final List<String> ESTADOS = List.of("Pendiente", "Atendida", "Cancelada");

    private final SolicitudRepository solicitudes;
    private final DetalleSolicitudRepository detalles;
    private final ServicioRepository servicios;
    private final UsuarioRepository usuarios;

    public SolicitudController(SolicitudRepository solicitudes, DetalleSolicitudRepository detalles,
                               ServicioRepository servicios, UsuarioRepository usuarios) {
        this.solicitudes = solicitudes;
        this.detalles = detalles;
        this.servicios = servicios;
        this.usuarios = usuarios;
    }

    @GetMapping
    @Transactional(readOnly = true)
    @Operation(summary = "Listar solicitudes", description = "USER ve solo sus solicitudes. VETERINARIO y ADMIN ven todas.")
    public List<SolicitudView> listar(@Parameter(hidden = true) JwtAuthenticationToken auth) {
        Usuario usuario = usuarioActual(auth);
        boolean veTodas = usuario.getRol().equals(SecurityConfig.ADMIN) || usuario.getRol().equals(SecurityConfig.VETERINARIO);

        List<Solicitud> lista = veTodas
                ? solicitudes.findAllByOrderByCreadaDesc()
                : solicitudes.findByUsuarioIdOrderByCreadaDesc(usuario.getId());

        return lista.stream().map(this::vista).toList();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Transactional
    @Operation(summary = "Crear solicitud", description = "Crea una solicitud con uno o más servicios y la fecha de cada atención.")
    public SolicitudView crear(@Valid @RequestBody Crear input, @Parameter(hidden = true) JwtAuthenticationToken auth) {
        Solicitud solicitud = solicitudes.save(new Solicitud(usuarioActual(auth)));

        for (Linea linea : input.servicios()) {
            Servicio servicio = servicios.findById(linea.servicioId())
                    .filter(Servicio::isActivo)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Servicio no disponible: " + linea.servicioId()));
            detalles.save(new DetalleSolicitud(solicitud, servicio.getId(), servicio.getNombre(), servicio.getPrecio(), linea.fecha()));
        }
        return vista(solicitud);
    }

    @PatchMapping("/{id}/estado")
    @Transactional
    @Operation(summary = "Actualizar estado (VETERINARIO o ADMIN)", description = "Cambia el estado a Pendiente, Atendida o Cancelada.")
    public SolicitudView cambiarEstado(@Parameter(description = "ID numérico de la solicitud", example = "1") @PathVariable Long id,
                                       @RequestBody Estado input) {
        if (input.estado() == null || !ESTADOS.contains(input.estado())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Estado inválido.");
        }
        Solicitud solicitud = solicitudes.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Solicitud no encontrada."));
        solicitud.setEstado(input.estado());
        return vista(solicitudes.save(solicitud));
    }

    // ---------- Apoyo ----------

    /** El "subject" del JWT es el correo del usuario logueado. */
    private Usuario usuarioActual(JwtAuthenticationToken auth) {
        return usuarios.findByCorreoIgnoreCase(auth.getName())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));
    }

    private SolicitudView vista(Solicitud s) {
        Usuario u = s.getUsuario();
        ClienteView cliente = new ClienteView(u.getNombre(), u.getApellido(), u.getCorreo(), u.getTelefono(), u.getMascota(), u.getEspecie());
        List<ServicioItem> items = detalles.findBySolicitudId(s.getId()).stream()
                .map(d -> new ServicioItem(d.getServicioId(), d.getNombre(), d.getPrecio(), d.getFecha()))
                .toList();
        return new SolicitudView("SOL-" + s.getId(), s.getCreada().toString(), s.getEstado(), cliente, items);
    }
}

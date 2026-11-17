package cl.vetsanmarcos.api.controller;

import cl.vetsanmarcos.api.model.*;
import cl.vetsanmarcos.api.repository.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import java.time.Instant;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;

@RestController
@RequestMapping("/api/v1/solicitudes")
@Tag(name = "Solicitudes de atención", description = "Creación y seguimiento de las solicitudes de servicios veterinarios.")
@SecurityRequirement(name = "bearerAuth")
public class SolicitudController {
    public record Linea(@NotNull Long servicioId,@NotNull @Pattern(regexp="\\d{4}-\\d{2}-\\d{2}") String fecha) {}
    public record Crear(@NotEmpty List<@Valid Linea> servicios) {}
    public record Cliente(String nombre,String apellido,String correo,String telefono,String mascota,String especie) {}
    public record ServicioItem(Long id,String nombre,Integer precio,String fecha) {}
    public record SolicitudView(String id,String creada,String estado,Cliente cliente,List<ServicioItem> servicios) {}
    private final SolicitudRepository solicitudes; private final DetalleSolicitudRepository detalles; private final ServicioRepository servicios; private final UsuarioRepository usuarios;
    SolicitudController(SolicitudRepository so,DetalleSolicitudRepository de,ServicioRepository se,UsuarioRepository us){solicitudes=so;detalles=de;servicios=se;usuarios=us;}
    @GetMapping @Transactional(readOnly=true)
    @Operation(summary = "Listar solicitudes", description = "Clientes ven sus propias solicitudes. Los roles veterinario y administrador pueden consultar todas.")
    @ApiResponse(responseCode = "200", description = "Solicitudes obtenidas correctamente.")
    @ApiResponse(responseCode = "401", description = "Falta un token JWT válido.")
    public List<SolicitudView> listar(@Parameter(hidden = true) JwtAuthenticationToken auth){var user=usuario(auth);var rows=user.getRol().equals("veterinario")||user.getRol().equals("admin")?solicitudes.findAllByOrderByCreadaDesc():solicitudes.findByUsuarioIdOrderByCreadaDesc(user.getId());return rows.stream().map(this::vista).toList();}

    @PostMapping @ResponseStatus(HttpStatus.CREATED) @Transactional
    @Operation(summary = "Crear solicitud", description = "Crea una solicitud con uno o más servicios y la fecha elegida para cada atención.")
    @ApiResponse(responseCode = "201", description = "Solicitud creada correctamente.")
    @ApiResponse(responseCode = "400", description = "La solicitud no tiene servicios válidos o alguno ya no está disponible.")
    @ApiResponse(responseCode = "401", description = "Falta un token JWT válido.")
    public SolicitudView crear(@Valid @RequestBody Crear input,@Parameter(hidden = true) JwtAuthenticationToken auth){var s=solicitudes.save(new Solicitud(usuario(auth)));for(var l:input.servicios()){var servicio=servicios.findById(l.servicioId()).filter(Servicio::isActivo).orElseThrow(()->new ResponseStatusException(HttpStatus.BAD_REQUEST,"Servicio no disponible: "+l.servicioId()));detalles.save(new DetalleSolicitud(s,servicio.getId(),servicio.getNombre(),servicio.getPrecio(),l.fecha()));}return vista(s);}

    @PatchMapping("/{id}/estado") @Transactional @PreAuthorize("hasAnyRole('veterinario','admin')")
    @Operation(summary = "Actualizar estado de solicitud", description = "Cambia el estado a Pendiente, Atendida o Cancelada. Disponible para veterinarios y administradores.")
    @ApiResponse(responseCode = "200", description = "Estado actualizado correctamente.")
    @ApiResponse(responseCode = "400", description = "El estado indicado no es válido.")
    @ApiResponse(responseCode = "403", description = "Se requiere rol veterinario o administrador.")
    @ApiResponse(responseCode = "404", description = "Solicitud no encontrada.")
    public SolicitudView estado(@Parameter(description = "ID numérico de la solicitud", example = "1") @PathVariable Long id,@Valid @RequestBody Estado input){if(input.estado()==null||!List.of("Pendiente","Atendida","Cancelada").contains(input.estado()))throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Estado inválido.");var s=solicitudes.findById(id).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND,"Solicitud no encontrada."));s.setEstado(input.estado());return vista(s);}
    public record Estado(String estado) {}
    private Usuario usuario(JwtAuthenticationToken auth){return usuarios.findByCorreoIgnoreCase(auth.getName()).orElseThrow(()->new ResponseStatusException(HttpStatus.UNAUTHORIZED));}
    private SolicitudView vista(Solicitud s){var u=s.getUsuario();var c=new Cliente(u.getNombre(),u.getApellido(),u.getCorreo(),u.getTelefono(),u.getMascota(),u.getEspecie());var items=detalles.findBySolicitudId(s.getId()).stream().map(d->new ServicioItem(d.getServicioId(),d.getNombre(),d.getPrecio(),d.getFecha())).toList();return new SolicitudView("SOL-"+s.getId(),s.getCreada().toString(),s.getEstado(),c,items);}
}

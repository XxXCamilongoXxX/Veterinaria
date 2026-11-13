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

@RestController @RequestMapping("/api/v1/solicitudes")
public class SolicitudController {
    public record Linea(@NotNull Long servicioId,@NotNull @Pattern(regexp="\\d{4}-\\d{2}-\\d{2}") String fecha) {}
    public record Crear(@NotEmpty List<@Valid Linea> servicios) {}
    public record Cliente(String nombre,String apellido,String correo,String telefono,String mascota,String especie) {}
    public record ServicioItem(Long id,String nombre,Integer precio,String fecha) {}
    public record SolicitudView(String id,String creada,String estado,Cliente cliente,List<ServicioItem> servicios) {}
    private final SolicitudRepository solicitudes; private final DetalleSolicitudRepository detalles; private final ServicioRepository servicios; private final UsuarioRepository usuarios;
    SolicitudController(SolicitudRepository so,DetalleSolicitudRepository de,ServicioRepository se,UsuarioRepository us){solicitudes=so;detalles=de;servicios=se;usuarios=us;}
    @GetMapping @Transactional(readOnly=true) public List<SolicitudView> listar(JwtAuthenticationToken auth){var user=usuario(auth);var rows=user.getRol().equals("veterinario")||user.getRol().equals("admin")?solicitudes.findAllByOrderByCreadaDesc():solicitudes.findByUsuarioIdOrderByCreadaDesc(user.getId());return rows.stream().map(this::vista).toList();}
    @PostMapping @ResponseStatus(HttpStatus.CREATED) @Transactional public SolicitudView crear(@Valid @RequestBody Crear input,JwtAuthenticationToken auth){var s=solicitudes.save(new Solicitud(usuario(auth)));for(var l:input.servicios()){var servicio=servicios.findById(l.servicioId()).filter(Servicio::isActivo).orElseThrow(()->new ResponseStatusException(HttpStatus.BAD_REQUEST,"Servicio no disponible: "+l.servicioId()));detalles.save(new DetalleSolicitud(s,servicio.getId(),servicio.getNombre(),servicio.getPrecio(),l.fecha()));}return vista(s);}
    @PatchMapping("/{id}/estado") @Transactional @PreAuthorize("hasAnyRole('veterinario','admin')") public SolicitudView estado(@PathVariable Long id,@RequestBody Estado input){if(!List.of("Pendiente","Atendida","Cancelada").contains(input.estado()))throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Estado inválido.");var s=solicitudes.findById(id).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND,"Solicitud no encontrada."));s.setEstado(input.estado());return vista(s);}
    public record Estado(String estado) {}
    private Usuario usuario(JwtAuthenticationToken auth){return usuarios.findByCorreoIgnoreCase(auth.getName()).orElseThrow(()->new ResponseStatusException(HttpStatus.UNAUTHORIZED));}
    private SolicitudView vista(Solicitud s){var u=s.getUsuario();var c=new Cliente(u.getNombre(),u.getApellido(),u.getCorreo(),u.getTelefono(),u.getMascota(),u.getEspecie());var items=detalles.findBySolicitudId(s.getId()).stream().map(d->new ServicioItem(d.getServicioId(),d.getNombre(),d.getPrecio(),d.getFecha())).toList();return new SolicitudView("SOL-"+s.getId(),s.getCreada().toString(),s.getEstado(),c,items);}
}

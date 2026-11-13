package cl.vetsanmarcos.api.controller;

import cl.vetsanmarcos.api.model.Servicio;
import cl.vetsanmarcos.api.repository.ServicioRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController @RequestMapping("/api/v1/servicios")
public class ServicioController {
    public record ServicioInput(@NotBlank @Size(max=120) String nombre,@NotBlank @Size(max=1000) String descripcion,@NotNull @Min(1) Integer precio,@NotBlank String especie,String imagen) {}
    private final ServicioRepository repository; ServicioController(ServicioRepository repository){this.repository=repository;}
    @GetMapping public List<Servicio> listar(){return repository.findAllByActivoTrueOrderByIdAsc();}
    @PostMapping @ResponseStatus(HttpStatus.CREATED) @PreAuthorize("hasRole('admin')") public Servicio crear(@Valid @RequestBody ServicioInput in){return repository.save(new Servicio(in.nombre().trim(),in.descripcion().trim(),in.precio(),in.especie(),in.imagen()));}
    @PutMapping("/{id}") @PreAuthorize("hasRole('admin')") public Servicio editar(@PathVariable Long id,@Valid @RequestBody ServicioInput in){var s=buscar(id);s.actualizar(in.nombre().trim(),in.descripcion().trim(),in.precio(),in.especie(),in.imagen());return repository.save(s);}
    @DeleteMapping("/{id}") @ResponseStatus(HttpStatus.NO_CONTENT) @PreAuthorize("hasRole('admin')") public void eliminar(@PathVariable Long id){buscar(id).desactivar();}
    private Servicio buscar(Long id){return repository.findById(id).filter(Servicio::isActivo).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND,"Servicio no encontrado."));}
}

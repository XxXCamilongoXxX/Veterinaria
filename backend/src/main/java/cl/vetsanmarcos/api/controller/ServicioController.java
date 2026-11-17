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
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;

@RestController
@RequestMapping("/api/v1/servicios")
@Tag(name = "Servicios veterinarios", description = "Consulta pública y administración del catálogo de atenciones de la clínica.")
public class ServicioController {
    public record ServicioInput(@NotBlank @Size(max=120) String nombre,@NotBlank @Size(max=1000) String descripcion,@NotNull @Min(1) Integer precio,@NotBlank String especie,String imagen) {}
    private final ServicioRepository repository; ServicioController(ServicioRepository repository){this.repository=repository;}
    @GetMapping
    @Operation(summary = "Listar servicios", description = "Devuelve el catálogo público de servicios activos de la veterinaria. No requiere autenticación.")
    @ApiResponse(responseCode = "200", description = "Catálogo obtenido correctamente.")
    public List<Servicio> listar(){return repository.findAllByActivoTrueOrderByIdAsc();}

    @PostMapping @ResponseStatus(HttpStatus.CREATED) @PreAuthorize("hasRole('admin')")
    @Operation(summary = "Crear servicio", description = "Agrega un servicio al catálogo. Disponible solo para administradores.", security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponse(responseCode = "201", description = "Servicio creado correctamente.")
    @ApiResponse(responseCode = "400", description = "Los datos enviados no cumplen las validaciones.")
    @ApiResponse(responseCode = "403", description = "Se requiere el rol administrador.")
    public Servicio crear(@Valid @RequestBody ServicioInput in){return repository.save(new Servicio(in.nombre().trim(),in.descripcion().trim(),in.precio(),in.especie(),in.imagen()));}

    @PutMapping("/{id}") @PreAuthorize("hasRole('admin')")
    @Operation(summary = "Actualizar servicio", description = "Actualiza un servicio existente. Disponible solo para administradores.", security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponse(responseCode = "200", description = "Servicio actualizado correctamente.")
    @ApiResponse(responseCode = "400", description = "Los datos enviados no cumplen las validaciones.")
    @ApiResponse(responseCode = "403", description = "Se requiere el rol administrador.")
    @ApiResponse(responseCode = "404", description = "Servicio no encontrado.")
    public Servicio editar(@Parameter(description = "ID del servicio", example = "1") @PathVariable Long id,@Valid @RequestBody ServicioInput in){var s=buscar(id);s.actualizar(in.nombre().trim(),in.descripcion().trim(),in.precio(),in.especie(),in.imagen());return repository.save(s);}

    @DeleteMapping("/{id}") @ResponseStatus(HttpStatus.NO_CONTENT) @PreAuthorize("hasRole('admin')")
    @Operation(summary = "Desactivar servicio", description = "Quita el servicio del catálogo público sin borrar su registro histórico. Disponible solo para administradores.", security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponse(responseCode = "204", description = "Servicio desactivado correctamente.")
    @ApiResponse(responseCode = "403", description = "Se requiere el rol administrador.")
    @ApiResponse(responseCode = "404", description = "Servicio no encontrado.")
    public void eliminar(@Parameter(description = "ID del servicio", example = "1") @PathVariable Long id){buscar(id).desactivar();}
    private Servicio buscar(Long id){return repository.findById(id).filter(Servicio::isActivo).orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND,"Servicio no encontrado."));}
}

package cl.vetsanmarcos.api.controller;

import cl.vetsanmarcos.api.model.Servicio;
import cl.vetsanmarcos.api.repository.ServicioRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

/** GET es público. POST, PUT y DELETE solo ADMIN (regla definida en SecurityConfig). */
@RestController
@RequestMapping("/api/v1/servicios")
@Tag(name = "Servicios veterinarios", description = "Consulta pública y administración (ADMIN) del catálogo de atenciones.")
public class ServicioController {

    public record ServicioInput(
            @NotBlank @Size(max = 120) String nombre,
            @NotBlank @Size(max = 1000) String descripcion,
            @NotNull @Min(1) Integer precio,
            @NotBlank String especie,
            String imagen) {}

    private final ServicioRepository repository;

    public ServicioController(ServicioRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    @Operation(summary = "Listar servicios", description = "Devuelve el catálogo de servicios activos. No requiere autenticación.")
    public List<Servicio> listar() {
        return repository.findAllByActivoTrueOrderByIdAsc();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar servicio por ID")
    @ApiResponse(responseCode = "404", description = "No existe un servicio activo con ese ID.")
    public Servicio buscarPorId(@Parameter(description = "ID del servicio", example = "1") @PathVariable Long id) {
        return buscar(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Crear servicio (ADMIN)", security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponse(responseCode = "403", description = "El usuario no tiene rol ADMIN.")
    public Servicio crear(@Valid @RequestBody ServicioInput in) {
        String imagen = in.imagen() == null || in.imagen().isBlank() ? "/img/perro en clinica.jpg" : in.imagen();
        return repository.save(new Servicio(in.nombre().trim(), in.descripcion().trim(), in.precio(), in.especie(), imagen));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar servicio (ADMIN)", security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponse(responseCode = "403", description = "El usuario no tiene rol ADMIN.")
    public Servicio actualizar(@Parameter(description = "ID del servicio", example = "1") @PathVariable Long id,
                               @Valid @RequestBody ServicioInput in) {
        Servicio servicio = buscar(id);
        String imagen = in.imagen() == null || in.imagen().isBlank() ? servicio.getImagen() : in.imagen();
        servicio.actualizar(in.nombre().trim(), in.descripcion().trim(), in.precio(), in.especie(), imagen);
        return repository.save(servicio);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Eliminar servicio (ADMIN)",
            description = "Borrado lógico: marca activo = false para no perder el historial de solicitudes.",
            security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponse(responseCode = "403", description = "El usuario no tiene rol ADMIN.")
    public void eliminar(@Parameter(description = "ID del servicio", example = "1") @PathVariable Long id) {
        Servicio servicio = buscar(id);
        servicio.desactivar();
        repository.save(servicio); // sin este save el cambio no llegaba a MySQL
    }

    private Servicio buscar(Long id) {
        return repository.findById(id)
                .filter(Servicio::isActivo)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Servicio no encontrado."));
    }
}

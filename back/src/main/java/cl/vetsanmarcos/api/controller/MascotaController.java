package cl.vetsanmarcos.api.controller;

import cl.vetsanmarcos.api.model.Mascota;
import cl.vetsanmarcos.api.service.MascotaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

/** GET: cualquier usuario logueado. POST, PUT y DELETE: solo ADMIN (ver SecurityConfig). */
@RestController
@RequestMapping("/api/v1/mascotas")
@Tag(name = "Mascotas", description = "CRUD de mascotas. Lectura para usuarios logueados; escritura solo ADMIN.")
@SecurityRequirement(name = "bearerAuth")
public class MascotaController {
    private final MascotaService service;

    public MascotaController(MascotaService service) {
        this.service = service;
    }

    @GetMapping
    @Operation(summary = "Listar mascotas")
    public List<Mascota> obtenerTodas() {
        return service.obtenerTodas();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar mascota por ID")
    @ApiResponse(responseCode = "404", description = "No existe una mascota con ese ID.")
    public Mascota buscarPorId(@Parameter(description = "ID de la mascota", example = "1") @PathVariable Long id) {
        return service.buscarPorId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Registrar mascota (ADMIN)")
    @ApiResponse(responseCode = "400", description = "Datos inválidos.")
    @ApiResponse(responseCode = "403", description = "El usuario no tiene rol ADMIN.")
    public Mascota crear(@Valid @RequestBody Mascota mascota) {
        return service.crear(mascota);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar mascota (ADMIN)")
    @ApiResponse(responseCode = "403", description = "El usuario no tiene rol ADMIN.")
    @ApiResponse(responseCode = "404", description = "No existe una mascota con ese ID.")
    public Mascota actualizar(@Parameter(description = "ID de la mascota", example = "1") @PathVariable Long id,
                              @Valid @RequestBody Mascota mascota) {
        return service.actualizar(id, mascota);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Eliminar mascota (ADMIN)")
    @ApiResponse(responseCode = "403", description = "El usuario no tiene rol ADMIN.")
    @ApiResponse(responseCode = "404", description = "No existe una mascota con ese ID.")
    public void eliminar(@Parameter(description = "ID de la mascota", example = "1") @PathVariable Long id) {
        service.eliminar(id);
    }
}

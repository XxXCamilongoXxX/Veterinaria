package cl.vetsanmarcos.api.controller;

import cl.vetsanmarcos.api.model.Venta;
import cl.vetsanmarcos.api.service.VentaService;
import jakarta.validation.Valid;
import java.util.List;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/ventas")
@Tag(name = "Ventas", description = "Registro y consulta de ventas. Las referencias a cliente y producto se guardan como IDs independientes.")
@SecurityRequirement(name = "bearerAuth")
public class VentaController {
    private final VentaService service;
    public VentaController(VentaService service) { this.service = service; }
    @GetMapping
    @Operation(summary = "Listar ventas", description = "Devuelve todas las ventas registradas con sus IDs de cliente y producto, cantidad, total y fecha.")
    @ApiResponse(responseCode = "200", description = "Lista de ventas obtenida correctamente.")
    public List<Venta> obtenerTodos() { return service.obtenerTodos(); }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar venta por ID", description = "Busca una venta por su identificador único.")
    @ApiResponse(responseCode = "200", description = "Venta encontrada.")
    @ApiResponse(responseCode = "404", description = "No existe una venta con ese ID.")
    public Venta buscarPorId(@Parameter(description = "ID de la venta", example = "1") @PathVariable Long id) { return service.buscarPorId(id); }

    @PostMapping @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Registrar venta", description = "Registra una venta usando los IDs de cliente y producto. No crea relaciones entre entidades.")
    @ApiResponse(responseCode = "201", description = "Venta registrada correctamente.")
    @ApiResponse(responseCode = "400", description = "Los datos enviados no cumplen las validaciones.")
    public Venta crear(@Valid @RequestBody Venta venta) { return service.crear(venta); }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar venta", description = "Actualiza los datos de la venta indicada.")
    @ApiResponse(responseCode = "200", description = "Venta actualizada correctamente.")
    @ApiResponse(responseCode = "400", description = "Los datos enviados no cumplen las validaciones.")
    @ApiResponse(responseCode = "404", description = "No existe una venta con ese ID.")
    public Venta actualizar(@Parameter(description = "ID de la venta", example = "1") @PathVariable Long id, @Valid @RequestBody Venta venta) { return service.actualizar(id, venta); }

    @DeleteMapping("/{id}") @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Eliminar venta", description = "Elimina la venta indicada por su ID.")
    @ApiResponse(responseCode = "204", description = "Venta eliminada correctamente.")
    @ApiResponse(responseCode = "404", description = "No existe una venta con ese ID.")
    public void eliminar(@Parameter(description = "ID de la venta", example = "1") @PathVariable Long id) { service.eliminar(id); }
}

package cl.vetsanmarcos.api.controller;

import cl.vetsanmarcos.api.model.Cliente;
import cl.vetsanmarcos.api.service.ClienteService;
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
@RequestMapping("/api/v1/clientes")
@Tag(name = "Clientes", description = "Gestión de la información de contacto de los clientes.")
@SecurityRequirement(name = "bearerAuth")
public class ClienteController {
    private final ClienteService service;
    public ClienteController(ClienteService service) { this.service = service; }
    @GetMapping
    @Operation(summary = "Listar clientes", description = "Devuelve todos los clientes registrados.")
    @ApiResponse(responseCode = "200", description = "Lista de clientes obtenida correctamente.")
    public List<Cliente> obtenerTodos() { return service.obtenerTodos(); }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar cliente por ID", description = "Busca un cliente por su identificador único.")
    @ApiResponse(responseCode = "200", description = "Cliente encontrado.")
    @ApiResponse(responseCode = "404", description = "No existe un cliente con ese ID.")
    public Cliente buscarPorId(@Parameter(description = "ID del cliente", example = "1") @PathVariable Long id) { return service.buscarPorId(id); }

    @PostMapping @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Crear cliente", description = "Registra un cliente con nombre, correo y teléfono. El ID se asigna automáticamente.")
    @ApiResponse(responseCode = "201", description = "Cliente creado correctamente.")
    @ApiResponse(responseCode = "400", description = "Los datos enviados no cumplen las validaciones.")
    public Cliente crear(@Valid @RequestBody Cliente cliente) { return service.crear(cliente); }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar cliente", description = "Actualiza nombre, correo y teléfono del cliente indicado.")
    @ApiResponse(responseCode = "200", description = "Cliente actualizado correctamente.")
    @ApiResponse(responseCode = "400", description = "Los datos enviados no cumplen las validaciones.")
    @ApiResponse(responseCode = "404", description = "No existe un cliente con ese ID.")
    public Cliente actualizar(@Parameter(description = "ID del cliente", example = "1") @PathVariable Long id, @Valid @RequestBody Cliente cliente) { return service.actualizar(id, cliente); }

    @DeleteMapping("/{id}") @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Eliminar cliente", description = "Elimina el cliente indicado por su ID.")
    @ApiResponse(responseCode = "204", description = "Cliente eliminado correctamente.")
    @ApiResponse(responseCode = "404", description = "No existe un cliente con ese ID.")
    public void eliminar(@Parameter(description = "ID del cliente", example = "1") @PathVariable Long id) { service.eliminar(id); }
}

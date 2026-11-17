package cl.vetsanmarcos.api.controller;

import cl.vetsanmarcos.api.model.Producto;
import cl.vetsanmarcos.api.service.ProductoService;
import jakarta.validation.Valid;
import java.util.List;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/productos")
@Tag(name = "Productos", description = "Administración del catálogo de productos veterinarios.")
@SecurityRequirement(name = "bearerAuth")
public class ProductoController {
    private final ProductoService service;
    public ProductoController(ProductoService service) { this.service = service; }
    @GetMapping
    @Operation(summary = "Listar productos", description = "Devuelve todos los productos registrados, incluyendo nombre, descripción, precio y stock.")
    @ApiResponse(responseCode = "200", description = "Lista de productos obtenida correctamente.")
    public List<Producto> obtenerTodos() { return service.obtenerTodos(); }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar producto por ID", description = "Busca un producto por su identificador único.")
    @ApiResponse(responseCode = "200", description = "Producto encontrado.")
    @ApiResponse(responseCode = "404", description = "No existe un producto con ese ID.")
    public Producto buscarPorId(@io.swagger.v3.oas.annotations.Parameter(description = "ID del producto", example = "1") @PathVariable Long id) { return service.buscarPorId(id); }

    @PostMapping @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Crear producto", description = "Registra un nuevo producto. El ID se asigna automáticamente.")
    @ApiResponse(responseCode = "201", description = "Producto creado correctamente.")
    @ApiResponse(responseCode = "400", description = "Los datos enviados no cumplen las validaciones.")
    public Producto crear(@Valid @RequestBody Producto producto) { return service.crear(producto); }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar producto", description = "Reemplaza los datos editables del producto indicado.")
    @ApiResponse(responseCode = "200", description = "Producto actualizado correctamente.")
    @ApiResponse(responseCode = "400", description = "Los datos enviados no cumplen las validaciones.")
    @ApiResponse(responseCode = "404", description = "No existe un producto con ese ID.")
    public Producto actualizar(@io.swagger.v3.oas.annotations.Parameter(description = "ID del producto", example = "1") @PathVariable Long id, @Valid @RequestBody Producto producto) { return service.actualizar(id, producto); }

    @DeleteMapping("/{id}") @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Eliminar producto", description = "Elimina el producto indicado por su ID.")
    @ApiResponse(responseCode = "204", description = "Producto eliminado correctamente.")
    @ApiResponse(responseCode = "404", description = "No existe un producto con ese ID.")
    public void eliminar(@io.swagger.v3.oas.annotations.Parameter(description = "ID del producto", example = "1") @PathVariable Long id) { service.eliminar(id); }
}

package cl.vetsanmarcos.api.controller;

import cl.vetsanmarcos.api.model.Producto;
import cl.vetsanmarcos.api.service.ProductoService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/productos")
public class ProductoController {
    private final ProductoService service;
    public ProductoController(ProductoService service) { this.service = service; }
    @GetMapping public List<Producto> obtenerTodos() { return service.obtenerTodos(); }
    @GetMapping("/{id}") public Producto buscarPorId(@PathVariable Long id) { return service.buscarPorId(id); }
    @PostMapping @ResponseStatus(HttpStatus.CREATED) public Producto crear(@Valid @RequestBody Producto producto) { return service.crear(producto); }
    @PutMapping("/{id}") public Producto actualizar(@PathVariable Long id, @Valid @RequestBody Producto producto) { return service.actualizar(id, producto); }
    @DeleteMapping("/{id}") @ResponseStatus(HttpStatus.NO_CONTENT) public void eliminar(@PathVariable Long id) { service.eliminar(id); }
}

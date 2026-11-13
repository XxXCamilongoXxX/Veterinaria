package cl.vetsanmarcos.api.controller;

import cl.vetsanmarcos.api.model.Venta;
import cl.vetsanmarcos.api.service.VentaService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/ventas")
public class VentaController {
    private final VentaService service;
    public VentaController(VentaService service) { this.service = service; }
    @GetMapping public List<Venta> obtenerTodos() { return service.obtenerTodos(); }
    @GetMapping("/{id}") public Venta buscarPorId(@PathVariable Long id) { return service.buscarPorId(id); }
    @PostMapping @ResponseStatus(HttpStatus.CREATED) public Venta crear(@Valid @RequestBody Venta venta) { return service.crear(venta); }
    @PutMapping("/{id}") public Venta actualizar(@PathVariable Long id, @Valid @RequestBody Venta venta) { return service.actualizar(id, venta); }
    @DeleteMapping("/{id}") @ResponseStatus(HttpStatus.NO_CONTENT) public void eliminar(@PathVariable Long id) { service.eliminar(id); }
}

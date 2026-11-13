package cl.vetsanmarcos.api.controller;

import cl.vetsanmarcos.api.model.Cliente;
import cl.vetsanmarcos.api.service.ClienteService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/clientes")
public class ClienteController {
    private final ClienteService service;
    public ClienteController(ClienteService service) { this.service = service; }
    @GetMapping public List<Cliente> obtenerTodos() { return service.obtenerTodos(); }
    @GetMapping("/{id}") public Cliente buscarPorId(@PathVariable Long id) { return service.buscarPorId(id); }
    @PostMapping @ResponseStatus(HttpStatus.CREATED) public Cliente crear(@Valid @RequestBody Cliente cliente) { return service.crear(cliente); }
    @PutMapping("/{id}") public Cliente actualizar(@PathVariable Long id, @Valid @RequestBody Cliente cliente) { return service.actualizar(id, cliente); }
    @DeleteMapping("/{id}") @ResponseStatus(HttpStatus.NO_CONTENT) public void eliminar(@PathVariable Long id) { service.eliminar(id); }
}

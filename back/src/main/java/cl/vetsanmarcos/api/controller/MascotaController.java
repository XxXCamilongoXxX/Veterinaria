package cl.vetsanmarcos.api.controller;

import cl.vetsanmarcos.api.model.Mascota;
import cl.vetsanmarcos.api.service.MascotaService;
import java.util.List;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/mascotas")
public class MascotaController {
    private final MascotaService service;

    public MascotaController(MascotaService service) {
        this.service = service;
    }

    @GetMapping
    public List<Mascota> obtenerTodas() {
        return service.obtenerTodas();
    }

    @GetMapping("/{id}")
    public Mascota buscarPorId(@PathVariable Long id) {
        return service.buscarPorId(id);
    }

    @PostMapping
    public Mascota crear(@RequestBody Mascota mascota) {
        return service.crear(mascota);
    }

    @PutMapping("/{id}")
    public Mascota actualizar(@PathVariable Long id, @RequestBody Mascota mascota) {
        return service.actualizar(id, mascota);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        service.eliminar(id);
    }
}

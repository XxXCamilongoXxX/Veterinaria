package cl.vetsanmarcos.api.service;

import cl.vetsanmarcos.api.model.Venta;
import cl.vetsanmarcos.api.repository.VentaRepository;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class VentaService {
    private final VentaRepository repository;
    public VentaService(VentaRepository repository) { this.repository = repository; }
    public List<Venta> obtenerTodos() { return repository.findAll(); }
    public Venta buscarPorId(Long id) { return repository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Venta no encontrada.")); }
    public Venta crear(Venta venta) { return repository.save(venta); }
    public Venta actualizar(Long id, Venta datos) {
        Venta actual = buscarPorId(id); actual.setClienteId(datos.getClienteId()); actual.setProductoId(datos.getProductoId()); actual.setCantidad(datos.getCantidad()); actual.setTotal(datos.getTotal()); actual.setFecha(datos.getFecha()); return repository.save(actual);
    }
    public void eliminar(Long id) { if (!repository.existsById(id)) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Venta no encontrada."); repository.deleteById(id); }
}

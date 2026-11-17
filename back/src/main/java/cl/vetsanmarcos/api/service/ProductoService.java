package cl.vetsanmarcos.api.service;

import cl.vetsanmarcos.api.model.Producto;
import cl.vetsanmarcos.api.repository.ProductoRepository;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ProductoService {
    private final ProductoRepository repository;
    public ProductoService(ProductoRepository repository) { this.repository = repository; }
    public List<Producto> obtenerTodos() { return repository.findAll(); }
    public Producto buscarPorId(Long id) { return repository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Producto no encontrado.")); }
    public Producto crear(Producto producto) { producto.setNombre(producto.getNombre().trim()); return repository.save(producto); }
    public Producto actualizar(Long id, Producto datos) {
        Producto actual = buscarPorId(id); actual.setNombre(datos.getNombre().trim()); actual.setDescripcion(datos.getDescripcion()); actual.setPrecio(datos.getPrecio()); actual.setStock(datos.getStock()); return repository.save(actual);
    }
    public void eliminar(Long id) { if (!repository.existsById(id)) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Producto no encontrado."); repository.deleteById(id); }
}

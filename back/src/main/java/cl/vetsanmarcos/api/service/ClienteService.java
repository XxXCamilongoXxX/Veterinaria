package cl.vetsanmarcos.api.service;

import cl.vetsanmarcos.api.model.Cliente;
import cl.vetsanmarcos.api.repository.ClienteRepository;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ClienteService {
    private final ClienteRepository repository;
    public ClienteService(ClienteRepository repository) { this.repository = repository; }
    public List<Cliente> obtenerTodos() { return repository.findAll(); }
    public Cliente buscarPorId(Long id) { return repository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cliente no encontrado.")); }
    public Cliente crear(Cliente cliente) { cliente.setNombre(cliente.getNombre().trim()); cliente.setCorreo(cliente.getCorreo().trim().toLowerCase()); return repository.save(cliente); }
    public Cliente actualizar(Long id, Cliente datos) {
        Cliente actual = buscarPorId(id); actual.setNombre(datos.getNombre().trim()); actual.setCorreo(datos.getCorreo().trim().toLowerCase()); actual.setTelefono(datos.getTelefono()); return repository.save(actual);
    }
    public void eliminar(Long id) { if (!repository.existsById(id)) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Cliente no encontrado."); repository.deleteById(id); }
}

package cl.vetsanmarcos.api.service;

import cl.vetsanmarcos.api.model.Mascota;
import cl.vetsanmarcos.api.repository.MascotaRepository;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class MascotaService {
    private final MascotaRepository repository;

    public MascotaService(MascotaRepository repository) {
        this.repository = repository;
    }

    public List<Mascota> obtenerTodas() {
        return repository.findAll();
    }

    public Mascota buscarPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Mascota no encontrada."));
    }

    public Mascota crear(Mascota mascota) {
        mascota.setNombre(mascota.getNombre().trim());
        return repository.save(mascota);
    }

    public Mascota actualizar(Long id, Mascota datos) {
        Mascota actual = buscarPorId(id);
        actual.setNombre(datos.getNombre().trim());
        actual.setEspecie(datos.getEspecie());
        actual.setDueno(datos.getDueno());
        return repository.save(actual);
    }

    public void eliminar(Long id) {
        if (!repository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Mascota no encontrada.");
        }
        repository.deleteById(id);
    }
}

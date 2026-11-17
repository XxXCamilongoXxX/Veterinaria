package cl.vetsanmarcos.api.service;

import cl.vetsanmarcos.api.model.Mascota;
import cl.vetsanmarcos.api.repository.MascotaRepository;
import java.util.List;
import org.springframework.stereotype.Service;

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
        return repository.findById(id).orElse(null);
    }

    public Mascota crear(Mascota mascota) {
        return repository.save(mascota);
    }

    public Mascota actualizar(Long id, Mascota datos) {
        Mascota actual = buscarPorId(id);
        actual.setNombre(datos.getNombre());
        actual.setEspecie(datos.getEspecie());
        actual.setDueno(datos.getDueno());
        return repository.save(actual);
    }

    public void eliminar(Long id) {
        repository.deleteById(id);
    }
}

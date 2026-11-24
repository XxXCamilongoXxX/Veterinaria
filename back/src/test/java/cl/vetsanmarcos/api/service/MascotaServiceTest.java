package cl.vetsanmarcos.api.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

import cl.vetsanmarcos.api.model.Mascota;
import cl.vetsanmarcos.api.repository.MascotaRepository;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class MascotaServiceTest {
    @Mock MascotaRepository repository;
    @InjectMocks MascotaService service;

    @Test void ejecutaOperacionesCrud() {
        Mascota mascota = new Mascota("Firulais", "Perro", "Juan Soto");
        when(repository.findAll()).thenReturn(List.of(mascota));
        when(repository.findById(1L)).thenReturn(Optional.of(mascota));
        when(repository.existsById(1L)).thenReturn(true);
        when(repository.save(any(Mascota.class))).thenAnswer(invocation -> invocation.getArgument(0));

        assertEquals(1, service.obtenerTodas().size());
        assertEquals(mascota, service.buscarPorId(1L));
        assertEquals(mascota, service.crear(mascota));
        Mascota cambios = new Mascota("Michi", "Gato", "Ana Pérez");
        assertEquals("Gato", service.actualizar(1L, cambios).getEspecie());
        service.eliminar(1L);

        verify(repository).deleteById(1L);
    }
}

package cl.vetsanmarcos.api.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

import cl.vetsanmarcos.api.model.Venta;
import cl.vetsanmarcos.api.repository.VentaRepository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import net.datafaker.Faker;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class VentaServiceTest {
    private final Faker faker = new Faker();
    @Mock VentaRepository repository;
    @InjectMocks VentaService service;

    @Test void ejecutaOperacionesCrud() {
        Venta venta = new Venta(faker.number().numberBetween(1L, 1000L), faker.number().numberBetween(1L, 1000L), 2, 30000, LocalDate.now());
        when(repository.findAll()).thenReturn(List.of(venta));
        when(repository.findById(1L)).thenReturn(Optional.of(venta));
        when(repository.existsById(1L)).thenReturn(true);
        when(repository.save(any(Venta.class))).thenAnswer(invocation -> invocation.getArgument(0));

        assertEquals(1, service.obtenerTodos().size());
        assertEquals(venta, service.buscarPorId(1L));
        assertEquals(venta, service.crear(venta));
        Venta cambios = new Venta(5L, 9L, 3, 45000, LocalDate.now().minusDays(1));
        assertEquals(5L, service.actualizar(1L, cambios).getClienteId());
        service.eliminar(1L);

        verify(repository).deleteById(1L);
        verify(repository, times(2)).save(any(Venta.class));
    }
}

package cl.vetsanmarcos.api.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

import cl.vetsanmarcos.api.model.Cliente;
import cl.vetsanmarcos.api.repository.ClienteRepository;
import java.util.List;
import java.util.Optional;
import net.datafaker.Faker;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ClienteServiceTest {
    private final Faker faker = new Faker();
    @Mock ClienteRepository repository;
    @InjectMocks ClienteService service;

    @Test void ejecutaOperacionesCrud() {
        Cliente cliente = new Cliente(faker.name().fullName(), faker.internet().emailAddress(), faker.phoneNumber().cellPhone());
        when(repository.findAll()).thenReturn(List.of(cliente));
        when(repository.findById(1L)).thenReturn(Optional.of(cliente));
        when(repository.existsById(1L)).thenReturn(true);
        when(repository.save(any(Cliente.class))).thenAnswer(invocation -> invocation.getArgument(0));

        assertEquals(1, service.obtenerTodos().size());
        assertEquals(cliente, service.buscarPorId(1L));
        assertEquals(cliente, service.crear(cliente));
        Cliente cambios = new Cliente(faker.name().fullName(), faker.internet().emailAddress(), faker.phoneNumber().cellPhone());
        assertEquals(cambios.getCorreo().toLowerCase(), service.actualizar(1L, cambios).getCorreo());
        service.eliminar(1L);

        verify(repository).deleteById(1L);
        verify(repository, times(2)).save(any(Cliente.class));
    }
}

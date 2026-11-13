package cl.vetsanmarcos.api.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

import cl.vetsanmarcos.api.model.Producto;
import cl.vetsanmarcos.api.repository.ProductoRepository;
import java.util.List;
import java.util.Optional;
import net.datafaker.Faker;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ProductoServiceTest {
    private final Faker faker = new Faker();
    @Mock ProductoRepository repository;
    @InjectMocks ProductoService service;

    @Test void ejecutaOperacionesCrud() {
        String nombre = faker.commerce().productName();
        Producto producto = new Producto(nombre, faker.lorem().sentence(), 15000, 8);
        when(repository.findAll()).thenReturn(List.of(producto));
        when(repository.findById(1L)).thenReturn(Optional.of(producto));
        when(repository.existsById(1L)).thenReturn(true);
        when(repository.save(any(Producto.class))).thenAnswer(invocation -> invocation.getArgument(0));

        assertEquals(1, service.obtenerTodos().size());
        assertEquals(producto, service.buscarPorId(1L));
        assertEquals(producto, service.crear(producto));
        Producto cambios = new Producto(nombre, faker.lorem().sentence(), 20000, 4);
        assertEquals(20000, service.actualizar(1L, cambios).getPrecio());
        service.eliminar(1L);

        verify(repository).deleteById(1L);
        verify(repository, times(2)).save(any(Producto.class));
    }
}

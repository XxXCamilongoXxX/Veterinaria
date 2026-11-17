package cl.vetsanmarcos.api.repository;

import cl.vetsanmarcos.api.model.Venta;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VentaRepository extends JpaRepository<Venta, Long> {}

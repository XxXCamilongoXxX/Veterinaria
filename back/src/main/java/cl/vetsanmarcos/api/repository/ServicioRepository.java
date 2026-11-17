package cl.vetsanmarcos.api.repository;
import cl.vetsanmarcos.api.model.Servicio;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
public interface ServicioRepository extends JpaRepository<Servicio,Long> { List<Servicio> findAllByActivoTrueOrderByIdAsc(); }

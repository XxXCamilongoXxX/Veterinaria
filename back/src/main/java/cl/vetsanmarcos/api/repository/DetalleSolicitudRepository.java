package cl.vetsanmarcos.api.repository;
import cl.vetsanmarcos.api.model.DetalleSolicitud;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
public interface DetalleSolicitudRepository extends JpaRepository<DetalleSolicitud,Long> { List<DetalleSolicitud> findBySolicitudId(Long solicitudId); }

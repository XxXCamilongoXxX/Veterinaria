package cl.vetsanmarcos.api.repository;
import cl.vetsanmarcos.api.model.Solicitud;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
public interface SolicitudRepository extends JpaRepository<Solicitud,Long> { List<Solicitud> findAllByOrderByCreadaDesc(); List<Solicitud> findByUsuarioIdOrderByCreadaDesc(Long usuarioId); }

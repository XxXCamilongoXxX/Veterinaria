package cl.vetsanmarcos.api.model;

import jakarta.persistence.*;

@Entity @Table(name="solicitud_detalles")
public class DetalleSolicitud {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @ManyToOne(optional=false,fetch=FetchType.LAZY) @JoinColumn(name="solicitud_id",nullable=false) private Solicitud solicitud;
    @Column(name="servicio_id",nullable=false) private Long servicioId;
    @Column(nullable=false,length=120) private String nombre;
    @Column(nullable=false) private Integer precio;
    @Column(nullable=false,length=10) private String fecha;
    protected DetalleSolicitud() {}
    public DetalleSolicitud(Solicitud solicitud,Long servicioId,String nombre,Integer precio,String fecha){this.solicitud=solicitud;this.servicioId=servicioId;this.nombre=nombre;this.precio=precio;this.fecha=fecha;}
    public Long getId(){return id;} public Long getServicioId(){return servicioId;} public String getNombre(){return nombre;} public Integer getPrecio(){return precio;} public String getFecha(){return fecha;}
}

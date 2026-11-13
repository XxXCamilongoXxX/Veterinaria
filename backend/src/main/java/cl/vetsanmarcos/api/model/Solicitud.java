package cl.vetsanmarcos.api.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity @Table(name="solicitudes")
public class Solicitud {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @ManyToOne(optional=false,fetch=FetchType.LAZY) @JoinColumn(name="usuario_id",nullable=false) private Usuario usuario;
    @Column(nullable=false,length=30) private String estado="Pendiente";
    @Column(nullable=false) private Instant creada=Instant.now();
    protected Solicitud() {}
    public Solicitud(Usuario usuario){this.usuario=usuario;}
    public Long getId(){return id;} public Usuario getUsuario(){return usuario;} public String getEstado(){return estado;} public Instant getCreada(){return creada;} public void setEstado(String estado){this.estado=estado;}
}

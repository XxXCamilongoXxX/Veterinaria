package cl.vetsanmarcos.api.model;

import jakarta.persistence.*;

@Entity @Table(name="servicios")
public class Servicio {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @Column(nullable=false,length=120) private String nombre;
    @Column(nullable=false,length=1000) private String descripcion;
    @Column(nullable=false) private Integer precio;
    @Column(nullable=false,length=50) private String especie;
    @Column(length=300) private String imagen;
    @Column(nullable=false) private boolean activo=true;
    protected Servicio() {}
    public Servicio(String nombre,String descripcion,Integer precio,String especie,String imagen){this.nombre=nombre;this.descripcion=descripcion;this.precio=precio;this.especie=especie;this.imagen=imagen;}
    public Long getId(){return id;} public String getNombre(){return nombre;} public String getDescripcion(){return descripcion;} public Integer getPrecio(){return precio;} public String getEspecie(){return especie;} public String getImagen(){return imagen;} public boolean isActivo(){return activo;}
    public void actualizar(String nombre,String descripcion,Integer precio,String especie,String imagen){this.nombre=nombre;this.descripcion=descripcion;this.precio=precio;this.especie=especie;this.imagen=imagen;}
    public void desactivar(){this.activo=false;}
}

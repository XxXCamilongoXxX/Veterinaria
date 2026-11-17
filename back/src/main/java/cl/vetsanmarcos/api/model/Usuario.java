package cl.vetsanmarcos.api.model;

import jakarta.persistence.*;

@Entity @Table(name="usuarios")
public class Usuario {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @Column(nullable=false,length=80) private String nombre;
    @Column(nullable=false,length=80) private String apellido;
    @Column(nullable=false,unique=true,length=180) private String correo;
    @Column(nullable=false) private String clave;
    @Column(nullable=false,length=30) private String rol;
    @Column(length=30) private String telefono;
    @Column(length=30) private String especie;
    @Column(length=80) private String mascota;
    @Column(length=10) private String nacimiento;
    protected Usuario() {}
    public Usuario(String nombre,String apellido,String correo,String clave,String rol,String telefono,String especie,String mascota,String nacimiento) { this.nombre=nombre;this.apellido=apellido;this.correo=correo;this.clave=clave;this.rol=rol;this.telefono=telefono;this.especie=especie;this.mascota=mascota;this.nacimiento=nacimiento; }
    public Long getId(){return id;} public String getNombre(){return nombre;} public String getApellido(){return apellido;} public String getCorreo(){return correo;} public String getClave(){return clave;} public String getRol(){return rol;} public String getTelefono(){return telefono;} public String getEspecie(){return especie;} public String getMascota(){return mascota;} public String getNacimiento(){return nacimiento;}
}

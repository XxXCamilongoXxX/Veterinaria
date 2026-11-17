package cl.vetsanmarcos.api.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "clientes")
public class Cliente {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank @Size(max = 80) @Column(nullable = false, length = 80)
    private String nombre;

    @NotBlank @Email @Size(max = 180) @Column(nullable = false, unique = true, length = 180)
    private String correo;

    @NotBlank @Size(max = 30) @Column(nullable = false, length = 30)
    private String telefono;

    protected Cliente() {}

    public Cliente(String nombre, String correo, String telefono) {
        this.nombre = nombre; this.correo = correo; this.telefono = telefono;
    }

    public Long getId() { return id; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getCorreo() { return correo; }
    public void setCorreo(String correo) { this.correo = correo; }
    public String getTelefono() { return telefono; }
    public void setTelefono(String telefono) { this.telefono = telefono; }
}

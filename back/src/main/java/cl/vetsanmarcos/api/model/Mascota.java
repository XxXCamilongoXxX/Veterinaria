package cl.vetsanmarcos.api.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "mascotas")
public class Mascota {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank @Size(max = 80)
    @Column(nullable = false, length = 80)
    private String nombre;

    @NotBlank @Size(max = 30)
    @Column(nullable = false, length = 30)
    private String especie;

    @NotBlank @Size(max = 120)
    @Column(nullable = false, length = 120)
    private String dueno;

    public Mascota() {}

    public Mascota(String nombre, String especie, String dueno) {
        this.nombre = nombre;
        this.especie = especie;
        this.dueno = dueno;
    }

    public Long getId() { return id; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getEspecie() { return especie; }
    public void setEspecie(String especie) { this.especie = especie; }
    public String getDueno() { return dueno; }
    public void setDueno(String dueno) { this.dueno = dueno; }
}

package cl.vetsanmarcos.api.model;

import jakarta.persistence.*;

@Entity
@Table(name = "mascotas")
public class Mascota {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;
    private String especie;
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

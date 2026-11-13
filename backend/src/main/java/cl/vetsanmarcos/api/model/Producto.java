package cl.vetsanmarcos.api.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "productos")
public class Producto {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank @Size(max = 120) @Column(nullable = false, length = 120)
    private String nombre;

    @NotBlank @Size(max = 1000) @Column(nullable = false, length = 1000)
    private String descripcion;

    @NotNull @Min(0) @Column(nullable = false)
    private Integer precio;

    @NotNull @Min(0) @Column(nullable = false)
    private Integer stock;

    protected Producto() {}

    public Producto(String nombre, String descripcion, Integer precio, Integer stock) {
        this.nombre = nombre; this.descripcion = descripcion; this.precio = precio; this.stock = stock;
    }

    public Long getId() { return id; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    public Integer getPrecio() { return precio; }
    public void setPrecio(Integer precio) { this.precio = precio; }
    public Integer getStock() { return stock; }
    public void setStock(Integer stock) { this.stock = stock; }
}

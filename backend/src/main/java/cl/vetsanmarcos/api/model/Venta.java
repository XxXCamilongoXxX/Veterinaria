package cl.vetsanmarcos.api.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

@Entity
@Table(name = "ventas")
public class Venta {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Identificadores escalares: deliberadamente no son relaciones JPA.
    @NotNull @Column(name = "cliente_id", nullable = false)
    private Long clienteId;

    @NotNull @Column(name = "producto_id", nullable = false)
    private Long productoId;

    @NotNull @Min(1) @Column(nullable = false)
    private Integer cantidad;

    @NotNull @Min(0) @Column(nullable = false)
    private Integer total;

    @NotNull @Column(nullable = false)
    private LocalDate fecha;

    protected Venta() {}

    public Venta(Long clienteId, Long productoId, Integer cantidad, Integer total, LocalDate fecha) {
        this.clienteId = clienteId; this.productoId = productoId; this.cantidad = cantidad; this.total = total; this.fecha = fecha;
    }

    public Long getId() { return id; }
    public Long getClienteId() { return clienteId; }
    public void setClienteId(Long clienteId) { this.clienteId = clienteId; }
    public Long getProductoId() { return productoId; }
    public void setProductoId(Long productoId) { this.productoId = productoId; }
    public Integer getCantidad() { return cantidad; }
    public void setCantidad(Integer cantidad) { this.cantidad = cantidad; }
    public Integer getTotal() { return total; }
    public void setTotal(Integer total) { this.total = total; }
    public LocalDate getFecha() { return fecha; }
    public void setFecha(LocalDate fecha) { this.fecha = fecha; }
}

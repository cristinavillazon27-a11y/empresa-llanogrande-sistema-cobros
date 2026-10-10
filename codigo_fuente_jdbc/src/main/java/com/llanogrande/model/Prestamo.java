package com.llanogrande.model;

import java.math.BigDecimal;
import java.sql.Date;
import java.sql.Timestamp;

public class Prestamo {
    private int id;
    private int clienteId;
    private String clienteNombre;
    private int usuarioCreadorId;
    private BigDecimal montoPrestado;
    private BigDecimal porcentajeInteres;
    private BigDecimal totalPagar;
    private int numeroCuotas;
    private BigDecimal valorCuota;
    private BigDecimal saldoPendiente;
    private Date fechaPrestamo;
    private Date fechaVencimiento;
    private String estado; // 'ACTIVO', 'EN_MORA', 'CANCELADO'
    private Timestamp creadoEn;

    public Prestamo() {}

    public Prestamo(int id, int clienteId, int usuarioCreadorId, BigDecimal montoPrestado,
                    BigDecimal porcentajeInteres, BigDecimal totalPagar, int numeroCuotas,
                    BigDecimal valorCuota, BigDecimal saldoPendiente, Date fechaPrestamo,
                    Date fechaVencimiento, String estado) {
        this.id = id;
        this.clienteId = clienteId;
        this.usuarioCreadorId = usuarioCreadorId;
        this.montoPrestado = montoPrestado;
        this.porcentajeInteres = porcentajeInteres;
        this.totalPagar = totalPagar;
        this.numeroCuotas = numeroCuotas;
        this.valorCuota = valorCuota;
        this.saldoPendiente = saldoPendiente;
        this.fechaPrestamo = fechaPrestamo;
        this.fechaVencimiento = fechaVencimiento;
        this.estado = estado;
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public int getClienteId() { return clienteId; }
    public void setClienteId(int clienteId) { this.clienteId = clienteId; }

    public String getClienteNombre() { return clienteNombre; }
    public void setClienteNombre(String clienteNombre) { this.clienteNombre = clienteNombre; }

    public int getUsuarioCreadorId() { return usuarioCreadorId; }
    public void setUsuarioCreadorId(int usuarioCreadorId) { this.usuarioCreadorId = usuarioCreadorId; }

    public BigDecimal getMontoPrestado() { return montoPrestado; }
    public void setMontoPrestado(BigDecimal montoPrestado) { this.montoPrestado = montoPrestado; }

    public BigDecimal getPorcentajeInteres() { return porcentajeInteres; }
    public void setPorcentajeInteres(BigDecimal porcentajeInteres) { this.porcentajeInteres = porcentajeInteres; }

    public BigDecimal getTotalPagar() { return totalPagar; }
    public void setTotalPagar(BigDecimal totalPagar) { this.totalPagar = totalPagar; }

    public int getNumeroCuotas() { return numeroCuotas; }
    public void setNumeroCuotas(int numeroCuotas) { this.numeroCuotas = numeroCuotas; }

    public BigDecimal getValorCuota() { return valorCuota; }
    public void setValorCuota(BigDecimal valorCuota) { this.valorCuota = valorCuota; }

    public BigDecimal getSaldoPendiente() { return saldoPendiente; }
    public void setSaldoPendiente(BigDecimal saldoPendiente) { this.saldoPendiente = saldoPendiente; }

    public Date getFechaPrestamo() { return fechaPrestamo; }
    public void setFechaPrestamo(Date fechaPrestamo) { this.fechaPrestamo = fechaPrestamo; }

    public Date getFechaVencimiento() { return fechaVencimiento; }
    public void setFechaVencimiento(Date fechaVencimiento) { this.fechaVencimiento = fechaVencimiento; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }

    public Timestamp getCreadoEn() { return creadoEn; }
    public void setCreadoEn(Timestamp creadoEn) { this.creadoEn = creadoEn; }

    @Override
    public String toString() {
        return String.format("Prestamo #%d | Monto: $%s | Cuotas: %d x $%s | Saldo: $%s | Estado: %s",
                id, montoPrestado, numeroCuotas, valorCuota, saldoPendiente, estado);
    }
}

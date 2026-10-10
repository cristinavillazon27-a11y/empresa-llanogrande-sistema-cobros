package com.llanogrande.model;

import java.math.BigDecimal;
import java.sql.Timestamp;

public class CuotaPago {
    private int id;
    private int prestamoId;
    private int usuarioCobradorId;
    private String cobradorNombre;
    private int numeroCuota;
    private BigDecimal valorPagado;
    private Timestamp fechaPago;
    private BigDecimal saldoRestante;
    private String observaciones;

    public CuotaPago() {}

    public CuotaPago(int id, int prestamoId, int usuarioCobradorId, int numeroCuota,
                     BigDecimal valorPagado, Timestamp fechaPago, BigDecimal saldoRestante, String observaciones) {
        this.id = id;
        this.prestamoId = prestamoId;
        this.usuarioCobradorId = usuarioCobradorId;
        this.numeroCuota = numeroCuota;
        this.valorPagado = valorPagado;
        this.fechaPago = fechaPago;
        this.saldoRestante = saldoRestante;
        this.observaciones = observaciones;
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public int getPrestamoId() { return prestamoId; }
    public void setPrestamoId(int prestamoId) { this.prestamoId = prestamoId; }

    public int getUsuarioCobradorId() { return usuarioCobradorId; }
    public void setUsuarioCobradorId(int usuarioCobradorId) { this.usuarioCobradorId = usuarioCobradorId; }

    public String getCobradorNombre() { return cobradorNombre; }
    public void setCobradorNombre(String cobradorNombre) { this.cobradorNombre = cobradorNombre; }

    public int getNumeroCuota() { return numeroCuota; }
    public void setNumeroCuota(int numeroCuota) { this.numeroCuota = numeroCuota; }

    public BigDecimal getValorPagado() { return valorPagado; }
    public void setValorPagado(BigDecimal valorPagado) { this.valorPagado = valorPagado; }

    public Timestamp getFechaPago() { return fechaPago; }
    public void setFechaPago(Timestamp fechaPago) { this.fechaPago = fechaPago; }

    public BigDecimal getSaldoRestante() { return saldoRestante; }
    public void setSaldoRestante(BigDecimal saldoRestante) { this.saldoRestante = saldoRestante; }

    public String getObservaciones() { return observaciones; }
    public void setObservaciones(String observaciones) { this.observaciones = observaciones; }

    @Override
    public String toString() {
        return String.format("Pago #%d | Prestamo: #%d | Cuota: #%d | Recaudado: $%s | Saldo Restante: $%s",
                id, prestamoId, numeroCuota, valorPagado, saldoRestante);
    }
}

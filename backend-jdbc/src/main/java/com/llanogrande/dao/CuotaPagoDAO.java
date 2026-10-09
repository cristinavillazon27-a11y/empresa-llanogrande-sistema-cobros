package com.llanogrande.dao;

import com.llanogrande.config.ConexionBD;
import com.llanogrande.model.CuotaPago;

import java.math.BigDecimal;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Data Access Object para Recaudos Diarios / Cobros de Cuotas.
 */
public class CuotaPagoDAO {

    public boolean registrarPago(CuotaPago pago) throws SQLException {
        String sql = "INSERT INTO cuotas_pagos (prestamo_id, usuario_cobrador_id, numero_cuota, valor_pagado, " +
                     "saldo_restante, observaciones) VALUES (?, ?, ?, ?, ?, ?)";

        try (Connection con = ConexionBD.obtenerConexion();
             PreparedStatement ps = con.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {

            ps.setInt(1, pago.getPrestamoId());
            ps.setInt(2, pago.getUsuarioCobradorId());
            ps.setInt(3, pago.getNumeroCuota());
            ps.setBigDecimal(4, pago.getValorPagado());
            ps.setBigDecimal(5, pago.getSaldoRestante());
            ps.setString(6, pago.getObservaciones());

            int filas = ps.executeUpdate();
            if (filas > 0) {
                try (ResultSet rs = ps.getGeneratedKeys()) {
                    if (rs.next()) {
                        pago.setId(rs.getInt(1));
                    }
                }
                return true;
            }
            return false;
        }
    }

    public List<CuotaPago> listarPagosPorPrestamo(int prestamoId) throws SQLException {
        List<CuotaPago> lista = new ArrayList<>();
        String sql = "SELECT cp.*, u.nombre AS cobrador_nombre " +
                     "FROM cuotas_pagos cp " +
                     "JOIN usuarios u ON cp.usuario_cobrador_id = u.id " +
                     "WHERE cp.prestamo_id = ? " +
                     "ORDER BY cp.numero_cuota ASC";

        try (Connection con = ConexionBD.obtenerConexion();
             PreparedStatement ps = con.prepareStatement(sql)) {

            ps.setInt(1, prestamoId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    CuotaPago pago = new CuotaPago(
                            rs.getInt("id"),
                            rs.getInt("prestamo_id"),
                            rs.getInt("usuario_cobrador_id"),
                            rs.getInt("numero_cuota"),
                            rs.getBigDecimal("valor_pagado"),
                            rs.getTimestamp("fecha_pago"),
                            rs.getBigDecimal("saldo_restante"),
                            rs.getString("observaciones")
                    );
                    pago.setCobradorNombre(rs.getString("cobrador_nombre"));
                    lista.add(pago);
                }
            }
        }
        return lista;
    }

    public BigDecimal totalRecaudadoHoy() throws SQLException {
        String sql = "SELECT COALESCE(SUM(valor_pagado), 0) AS total_hoy " +
                     "FROM cuotas_pagos " +
                     "WHERE DATE(fecha_pago) = CURDATE()";

        try (Connection con = ConexionBD.obtenerConexion();
             PreparedStatement ps = con.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            if (rs.next()) {
                return rs.getBigDecimal("total_hoy");
            }
        }
        return BigDecimal.ZERO;
    }
}

package com.llanogrande.dao;

import com.llanogrande.config.ConexionBD;
import com.llanogrande.model.Prestamo;

import java.math.BigDecimal;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Data Access Object para Préstamos Diarios en Empresa Llano Grande.
 */
public class PrestamoDAO {

    public boolean crearPrestamo(Prestamo prestamo) throws SQLException {
        String sql = "INSERT INTO prestamos (cliente_id, usuario_creador_id, monto_prestado, porcentaje_interes, " +
                     "total_pagar, numero_cuotas, valor_cuota, saldo_pendiente, fecha_prestamo, fecha_vencimiento, estado) " +
                     "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        try (Connection con = ConexionBD.obtenerConexion();
             PreparedStatement ps = con.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {

            ps.setInt(1, prestamo.getClienteId());
            ps.setInt(2, prestamo.getUsuarioCreadorId());
            ps.setBigDecimal(3, prestamo.getMontoPrestado());
            ps.setBigDecimal(4, prestamo.getPorcentajeInteres());
            ps.setBigDecimal(5, prestamo.getTotalPagar());
            ps.setInt(6, prestamo.getNumeroCuotas());
            ps.setBigDecimal(7, prestamo.getValorCuota());
            ps.setBigDecimal(8, prestamo.getSaldoPendiente());
            ps.setDate(9, prestamo.getFechaPrestamo());
            ps.setDate(10, prestamo.getFechaVencimiento());
            ps.setString(11, prestamo.getEstado());

            int filas = ps.executeUpdate();
            if (filas > 0) {
                try (ResultSet rs = ps.getGeneratedKeys()) {
                    if (rs.next()) {
                        prestamo.setId(rs.getInt(1));
                    }
                }
                return true;
            }
            return false;
        }
    }

    public List<Prestamo> listarActivos() throws SQLException {
        List<Prestamo> lista = new ArrayList<>();
        String sql = "SELECT p.*, CONCAT(c.nombres, ' ', c.apellidos) AS cliente_nombre " +
                     "FROM prestamos p " +
                     "JOIN clientes c ON p.cliente_id = c.id " +
                     "WHERE p.estado IN ('ACTIVO', 'EN_MORA') " +
                     "ORDER BY p.id DESC";

        try (Connection con = ConexionBD.obtenerConexion();
             PreparedStatement ps = con.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            while (rs.next()) {
                Prestamo p = mapearPrestamo(rs);
                p.setClienteNombre(rs.getString("cliente_nombre"));
                lista.add(p);
            }
        }
        return lista;
    }

    public Prestamo buscarPorId(int id) throws SQLException {
        String sql = "SELECT p.*, CONCAT(c.nombres, ' ', c.apellidos) AS cliente_nombre " +
                     "FROM prestamos p " +
                     "JOIN clientes c ON p.cliente_id = c.id " +
                     "WHERE p.id = ?";

        try (Connection con = ConexionBD.obtenerConexion();
             PreparedStatement ps = con.prepareStatement(sql)) {

            ps.setInt(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    Prestamo p = mapearPrestamo(rs);
                    p.setClienteNombre(rs.getString("cliente_nombre"));
                    return p;
                }
            }
        }
        return null;
    }

    public boolean actualizarSaldoYEstado(int prestamoId, BigDecimal nuevoSaldo, String nuevoEstado) throws SQLException {
        String sql = "UPDATE prestamos SET saldo_pendiente = ?, estado = ? WHERE id = ?";

        try (Connection con = ConexionBD.obtenerConexion();
             PreparedStatement ps = con.prepareStatement(sql)) {

            ps.setBigDecimal(1, nuevoSaldo);
            ps.setString(2, nuevoEstado);
            ps.setInt(3, prestamoId);

            return ps.executeUpdate() > 0;
        }
    }

    private Prestamo mapearPrestamo(ResultSet rs) throws SQLException {
        Prestamo p = new Prestamo(
                rs.getInt("id"),
                rs.getInt("cliente_id"),
                rs.getInt("usuario_creador_id"),
                rs.getBigDecimal("monto_prestado"),
                rs.getBigDecimal("porcentaje_interes"),
                rs.getBigDecimal("total_pagar"),
                rs.getInt("numero_cuotas"),
                rs.getBigDecimal("valor_cuota"),
                rs.getBigDecimal("saldo_pendiente"),
                rs.getDate("fecha_prestamo"),
                rs.getDate("fecha_vencimiento"),
                rs.getString("estado")
        );
        p.setCreadoEn(rs.getTimestamp("creado_en"));
        return p;
    }
}

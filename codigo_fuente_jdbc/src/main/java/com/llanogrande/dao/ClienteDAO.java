package com.llanogrande.dao;

import com.llanogrande.config.ConexionBD;
import com.llanogrande.model.Cliente;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Data Access Object (DAO) para la entidad Cliente.
 * Implementa las operaciones CRUD completas con PreparedStatement (OWASP / Prevención SQL Injection).
 */
public class ClienteDAO {

    public boolean insertar(Cliente cliente) throws SQLException {
        String sql = "INSERT INTO clientes (cedula, nombres, apellidos, telefono, direccion, barrio_sector, activo) " +
                     "VALUES (?, ?, ?, ?, ?, ?, 1)";

        try (Connection con = ConexionBD.obtenerConexion();
             PreparedStatement ps = con.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {

            ps.setString(1, cliente.getCedula());
            ps.setString(2, cliente.getNombres());
            ps.setString(3, cliente.getApellidos());
            ps.setString(4, cliente.getTelefono());
            ps.setString(5, cliente.getDireccion());
            ps.setString(6, cliente.getBarrioSector());

            int filas = ps.executeUpdate();
            if (filas > 0) {
                try (ResultSet rs = ps.getGeneratedKeys()) {
                    if (rs.next()) {
                        cliente.setId(rs.getInt(1));
                    }
                }
                return true;
            }
            return false;
        }
    }

    public List<Cliente> listarActivos() throws SQLException {
        List<Cliente> lista = new ArrayList<>();
        String sql = "SELECT id, cedula, nombres, apellidos, telefono, direccion, barrio_sector, activo, creado_en " +
                     "FROM clientes WHERE activo = 1 ORDER BY nombres ASC";

        try (Connection con = ConexionBD.obtenerConexion();
             PreparedStatement ps = con.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            while (rs.next()) {
                Cliente c = new Cliente(
                        rs.getInt("id"),
                        rs.getString("cedula"),
                        rs.getString("nombres"),
                        rs.getString("apellidos"),
                        rs.getString("telefono"),
                        rs.getString("direccion"),
                        rs.getString("barrio_sector"),
                        rs.getBoolean("activo")
                );
                c.setCreadoEn(rs.getTimestamp("creado_en"));
                lista.add(c);
            }
        }
        return lista;
    }

    public Cliente buscarPorCedula(String cedula) throws SQLException {
        String sql = "SELECT id, cedula, nombres, apellidos, telefono, direccion, barrio_sector, activo, creado_en " +
                     "FROM clientes WHERE cedula = ?";

        try (Connection con = ConexionBD.obtenerConexion();
             PreparedStatement ps = con.prepareStatement(sql)) {

            ps.setString(1, cedula);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    Cliente c = new Cliente(
                            rs.getInt("id"),
                            rs.getString("cedula"),
                            rs.getString("nombres"),
                            rs.getString("apellidos"),
                            rs.getString("telefono"),
                            rs.getString("direccion"),
                            rs.getString("barrio_sector"),
                            rs.getBoolean("activo")
                    );
                    c.setCreadoEn(rs.getTimestamp("creado_en"));
                    return c;
                }
            }
        }
        return null;
    }

    public Cliente buscarPorId(int id) throws SQLException {
        String sql = "SELECT id, cedula, nombres, apellidos, telefono, direccion, barrio_sector, activo, creado_en " +
                     "FROM clientes WHERE id = ?";

        try (Connection con = ConexionBD.obtenerConexion();
             PreparedStatement ps = con.prepareStatement(sql)) {

            ps.setInt(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    Cliente c = new Cliente(
                            rs.getInt("id"),
                            rs.getString("cedula"),
                            rs.getString("nombres"),
                            rs.getString("apellidos"),
                            rs.getString("telefono"),
                            rs.getString("direccion"),
                            rs.getString("barrio_sector"),
                            rs.getBoolean("activo")
                    );
                    c.setCreadoEn(rs.getTimestamp("creado_en"));
                    return c;
                }
            }
        }
        return null;
    }

    public boolean actualizar(Cliente cliente) throws SQLException {
        String sql = "UPDATE clientes SET nombres = ?, apellidos = ?, telefono = ?, direccion = ?, barrio_sector = ? " +
                     "WHERE id = ?";

        try (Connection con = ConexionBD.obtenerConexion();
             PreparedStatement ps = con.prepareStatement(sql)) {

            ps.setString(1, cliente.getNombres());
            ps.setString(2, cliente.getApellidos());
            ps.setString(3, cliente.getTelefono());
            ps.setString(4, cliente.getDireccion());
            ps.setString(5, cliente.getBarrioSector());
            ps.setInt(6, cliente.getId());

            return ps.executeUpdate() > 0;
        }
    }

    public boolean eliminarLogico(int id) throws SQLException {
        String sql = "UPDATE clientes SET activo = 0 WHERE id = ?";

        try (Connection con = ConexionBD.obtenerConexion();
             PreparedStatement ps = con.prepareStatement(sql)) {

            ps.setInt(1, id);
            return ps.executeUpdate() > 0;
        }
    }
}

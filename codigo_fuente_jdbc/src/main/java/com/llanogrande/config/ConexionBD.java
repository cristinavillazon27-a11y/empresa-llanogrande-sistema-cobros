package com.llanogrande.config;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

/**
 * Gestor de conexión a la base de datos MySQL para Empresa Llano Grande.
 * Implementa un diseño seguro que permite configurar los parámetros vía variables de entorno.
 */
public class ConexionBD {

    private static final String DEFAULT_HOST = "localhost";
    private static final String DEFAULT_PORT = "3306";
    private static final String DEFAULT_DB   = "llanogrande_db";
    private static final String DEFAULT_USER = "root";
    private static final String DEFAULT_PASS = "";

    private static String getEnvOrDefault(String envVar, String defaultValue) {
        String val = System.getenv(envVar);
        return (val != null && !val.trim().isEmpty()) ? val : defaultValue;
    }

    public static Connection obtenerConexion() throws SQLException {
        String host = getEnvOrDefault("DB_HOST", DEFAULT_HOST);
        String port = getEnvOrDefault("DB_PORT", DEFAULT_PORT);
        String db   = getEnvOrDefault("DB_NAME", DEFAULT_DB);
        String user = getEnvOrDefault("DB_USER", DEFAULT_USER);
        String pass = getEnvOrDefault("DB_PASS", DEFAULT_PASS);

        String url = String.format("jdbc:mysql://%s:%s/%s?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true",
                host, port, db);

        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
        } catch (ClassNotFoundException e) {
            throw new SQLException("Error: Driver de MySQL no encontrado en el classpath.", e);
        }

        return DriverManager.getConnection(url, user, pass);
    }
}

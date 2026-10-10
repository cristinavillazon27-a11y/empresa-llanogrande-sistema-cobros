package com.llanogrande.app;

import com.llanogrande.config.ConexionBD;
import com.llanogrande.dao.ClienteDAO;
import com.llanogrande.dao.CuotaPagoDAO;
import com.llanogrande.dao.PrestamoDAO;
import com.llanogrande.model.Cliente;
import com.llanogrande.model.CuotaPago;
import com.llanogrande.model.Prestamo;

import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.Date;
import java.sql.SQLException;
import java.time.LocalDate;
import java.util.List;
import java.util.Scanner;

/**
 * Aplicación de consola para demostración y verificación de la Evidencia SENA GA7-220501096-AA2-EV01.
 * Sistema de Gestión de Préstamos y Cobros Diarios - Empresa Llano Grande.
 */
public class MainApp {

    private static final ClienteDAO clienteDAO = new ClienteDAO();
    private static final PrestamoDAO prestamoDAO = new PrestamoDAO();
    private static final CuotaPagoDAO pagoDAO = new CuotaPagoDAO();
    private static final Scanner scanner = new Scanner(System.in);

    public static void main(String[] args) {
        System.out.println("====================================================================");
        System.out.println("   SISTEMA DE GESTIÓN DE PRÉSTAMOS Y COBROS - EMPRESA LLANO GRANDE   ");
        System.out.println("           EVIDENCIA TÉCNICA SENA: GA7-220501096-AA2-EV01           ");
        System.out.println("====================================================================");

        // Prueba inicial de conectividad
        try (Connection conn = ConexionBD.obtenerConexion()) {
            System.out.println("✔ CONEXIÓN EXITOSA A MYSQL: " + conn.getMetaData().getDatabaseProductName());
        } catch (SQLException e) {
            System.err.println("⚠ AVISO DE CONEXIÓN: No se pudo conectar a MySQL (" + e.getMessage() + ").");
            System.err.println("  Asegúrese de tener MySQL activo y ejecutar el script 'database/01_schema_llanogrande.sql'.");
        }

        boolean salir = false;
        while (!salir) {
            mostrarMenu();
            String opcion = scanner.nextLine().trim();

            switch (opcion) {
                case "1":
                    registrarNuevoCliente();
                    break;
                case "2":
                    listarClientes();
                    break;
                case "3":
                    buscarClientePorCedula();
                    break;
                case "4":
                    modificarCliente();
                    break;
                case "5":
                    desactivarCliente();
                    break;
                case "6":
                    crearNuevoPrestamo();
                    break;
                case "7":
                    listarPrestamosActivos();
                    break;
                case "8":
                    registrarCobroDiario();
                    break;
                case "9":
                    verReporteRecaudoHoy();
                    break;
                case "0":
                    salir = true;
                    System.out.println("Gracias por usar el sistema de Empresa Llano Grande.");
                    break;
                default:
                    System.out.println("Opción no válida. Intente nuevamente.");
            }
        }
    }

    private static void mostrarMenu() {
        System.out.println("\n----------------- MENÚ PRINCIPAL -----------------");
        System.out.println("1. Registrar nuevo cliente (INSERT)");
        System.out.println("2. Listar clientes activos (SELECT)");
        System.out.println("3. Buscar cliente por cédula (SELECT WHERE)");
        System.out.println("4. Actualizar datos de cliente (UPDATE)");
        System.out.println("5. Desactivar cliente (DELETE LÓGICO)");
        System.out.println("6. Crear nuevo préstamo diario");
        System.out.println("7. Listar préstamos activos");
        System.out.println("8. Registrar cobro de cuota diaria (Recaudo)");
        System.out.println("9. Ver reporte de recaudo de hoy");
        System.out.println("0. Salir");
        System.out.print("Seleccione una opción: ");
    }

    private static void registrarNuevoCliente() {
        System.out.println("\n--- REGISTRO DE CLIENTE ---");
        System.out.print("Cédula: ");
        String cedula = scanner.nextLine().trim();
        System.out.print("Nombres: ");
        String nombres = scanner.nextLine().trim();
        System.out.print("Apellidos: ");
        String apellidos = scanner.nextLine().trim();
        System.out.print("Teléfono: ");
        String telefono = scanner.nextLine().trim();
        System.out.print("Dirección de cobro: ");
        String direccion = scanner.nextLine().trim();
        System.out.print("Barrio / Sector: ");
        String barrio = scanner.nextLine().trim();

        Cliente nuevo = new Cliente(cedula, nombres, apellidos, telefono, direccion, barrio);
        try {
            if (clienteDAO.insertar(nuevo)) {
                System.out.println("✔ Cliente registrado exitosamente con ID: " + nuevo.getId());
            } else {
                System.out.println("❌ No se pudo registrar el cliente.");
            }
        } catch (SQLException e) {
            System.err.println("Error al insertar: " + e.getMessage());
        }
    }

    private static void listarClientes() {
        System.out.println("\n--- LISTADO DE CLIENTES ACTIVOS ---");
        try {
            List<Cliente> clientes = clienteDAO.listarActivos();
            if (clientes.isEmpty()) {
                System.out.println("No hay clientes activos registrados.");
            } else {
                for (Cliente c : clientes) {
                    System.out.println(c);
                }
            }
        } catch (SQLException e) {
            System.err.println("Error al consultar clientes: " + e.getMessage());
        }
    }

    private static void buscarClientePorCedula() {
        System.out.print("\nIngrese la cédula a buscar: ");
        String cedula = scanner.nextLine().trim();
        try {
            Cliente c = clienteDAO.buscarPorCedula(cedula);
            if (c != null) {
                System.out.println("✔ Cliente encontrado: " + c);
            } else {
                System.out.println("❌ No existe ningún cliente con la cédula " + cedula);
            }
        } catch (SQLException e) {
            System.err.println("Error al buscar cliente: " + e.getMessage());
        }
    }

    private static void modificarCliente() {
        System.out.print("\nIngrese la cédula del cliente a modificar: ");
        String cedula = scanner.nextLine().trim();
        try {
            Cliente c = clienteDAO.buscarPorCedula(cedula);
            if (c == null) {
                System.out.println("❌ Cliente no encontrado.");
                return;
            }
            System.out.println("Cliente actual: " + c.getNombreCompleto());
            System.out.print("Nuevo teléfono (Enter para mantener [" + c.getTelefono() + "]): ");
            String tel = scanner.nextLine().trim();
            if (!tel.isEmpty()) c.setTelefono(tel);

            System.out.print("Nueva dirección (Enter para mantener [" + c.getDireccion() + "]): ");
            String dir = scanner.nextLine().trim();
            if (!dir.isEmpty()) c.setDireccion(dir);

            if (clienteDAO.actualizar(c)) {
                System.out.println("✔ Información del cliente actualizada exitosamente.");
            } else {
                System.out.println("❌ No se pudo actualizar.");
            }
        } catch (SQLException e) {
            System.err.println("Error al actualizar: " + e.getMessage());
        }
    }

    private static void desactivarCliente() {
        System.out.print("\nIngrese la cédula del cliente a desactivar: ");
        String cedula = scanner.nextLine().trim();
        try {
            Cliente c = clienteDAO.buscarPorCedula(cedula);
            if (c == null) {
                System.out.println("❌ Cliente no encontrado.");
                return;
            }
            System.out.print("¿Seguro que desea desactivar a " + c.getNombreCompleto() + "? (s/n): ");
            String confirm = scanner.nextLine().trim().toLowerCase();
            if (confirm.equals("s")) {
                if (clienteDAO.eliminarLogico(c.getId())) {
                    System.out.println("✔ Cliente desactivado correctamente (borrado lógico para preservar historial).");
                }
            } else {
                System.out.println("Operación cancelada.");
            }
        } catch (SQLException e) {
            System.err.println("Error al desactivar: " + e.getMessage());
        }
    }

    private static void crearNuevoPrestamo() {
        System.out.println("\n--- NUEVO PRÉSTAMO DIARIO ---");
        System.out.print("Cédula del cliente solicitante: ");
        String cedula = scanner.nextLine().trim();
        try {
            Cliente c = clienteDAO.buscarPorCedula(cedula);
            if (c == null) {
                System.out.println("❌ Debe registrar al cliente antes de otorgar un préstamo.");
                return;
            }

            System.out.print("Valor prestado en efectivo (ej. 500000): ");
            BigDecimal monto = new BigDecimal(scanner.nextLine().trim());
            System.out.print("Porcentaje de interés (por defecto 20%): ");
            String strInteres = scanner.nextLine().trim();
            BigDecimal interes = strInteres.isEmpty() ? new BigDecimal("20.00") : new BigDecimal(strInteres);

            System.out.print("Número de cuotas diarias (días de cobro, ej. 24): ");
            int cuotas = Integer.parseInt(scanner.nextLine().trim());

            BigDecimal factor = BigDecimal.ONE.add(interes.divide(new BigDecimal("100"), 4, java.math.RoundingMode.HALF_UP));
            BigDecimal totalPagar = monto.multiply(factor);
            BigDecimal valorCuota = totalPagar.divide(new BigDecimal(cuotas), 2, java.math.RoundingMode.HALF_UP);

            LocalDate hoy = LocalDate.now();
            LocalDate vencimiento = hoy.plusDays(cuotas);

            Prestamo prestamo = new Prestamo(
                    0, c.getId(), 1, monto, interes, totalPagar, cuotas, valorCuota,
                    totalPagar, Date.valueOf(hoy), Date.valueOf(vencimiento), "ACTIVO"
            );

            if (prestamoDAO.crearPrestamo(prestamo)) {
                System.out.println("✔ PRÉSTAMO REGISTRADO CON ÉXITO");
                System.out.println("  ID Préstamo: #" + prestamo.getId());
                System.out.println("  Total a Pagar: $" + totalPagar);
                System.out.println("  Cuota Diaria: $" + valorCuota + " x " + cuotas + " días");
                System.out.println("  Fecha Vencimiento: " + vencimiento);
            }
        } catch (Exception e) {
            System.err.println("Error al registrar préstamo: " + e.getMessage());
        }
    }

    private static void listarPrestamosActivos() {
        System.out.println("\n--- PRÉSTAMOS ACTIVOS EN CALLE ---");
        try {
            List<Prestamo> prestamos = prestamoDAO.listarActivos();
            if (prestamos.isEmpty()) {
                System.out.println("No hay préstamos activos.");
            } else {
                for (Prestamo p : prestamos) {
                    System.out.println(String.format("ID #%d | Cliente: %s | Total: $%s | Saldo: $%s | Cuota: $%s | Estado: %s",
                            p.getId(), p.getClienteNombre(), p.getTotalPagar(), p.getSaldoPendiente(), p.getValorCuota(), p.getEstado()));
                }
            }
        } catch (SQLException e) {
            System.err.println("Error al listar préstamos: " + e.getMessage());
        }
    }

    private static void registrarCobroDiario() {
        System.out.println("\n--- REGISTRAR COBRO / RECAUDO DIARIO ---");
        System.out.print("ID del Préstamo: ");
        int prestamoId = Integer.parseInt(scanner.nextLine().trim());
        try {
            Prestamo p = prestamoDAO.buscarPorId(prestamoId);
            if (p == null) {
                System.out.println("❌ Préstamo no encontrado.");
                return;
            }

            System.out.println("Cliente: " + p.getClienteNombre());
            System.out.println("Saldo Pendiente Actual: $" + p.getSaldoPendiente());
            System.out.println("Valor de la Cuota Pactada: $" + p.getValorCuota());

            System.out.print("Valor recaudado hoy en efectivo: ");
            BigDecimal valorCobrado = new BigDecimal(scanner.nextLine().trim());

            BigDecimal nuevoSaldo = p.getSaldoPendiente().subtract(valorCobrado);
            if (nuevoSaldo.compareTo(BigDecimal.ZERO) < 0) {
                nuevoSaldo = BigDecimal.ZERO;
            }

            String nuevoEstado = (nuevoSaldo.compareTo(BigDecimal.ZERO) == 0) ? "CANCELADO" : "ACTIVO";

            CuotaPago pago = new CuotaPago(
                    0, p.getId(), 2, 1, valorCobrado, null, nuevoSaldo, "Cobro diario normal"
            );

            if (pagoDAO.registrarPago(pago)) {
                prestamoDAO.actualizarSaldoYEstado(p.getId(), nuevoSaldo, nuevoEstado);
                System.out.println("✔ COBRO ASENTADO CON ÉXITO");
                System.out.println("  Recaudado: $" + valorCobrado);
                System.out.println("  Nuevo Saldo Pendiente: $" + nuevoSaldo);
                System.out.println("  Estado del Préstamo: " + nuevoEstado);
            }
        } catch (Exception e) {
            System.err.println("Error al registrar cobro: " + e.getMessage());
        }
    }

    private static void verReporteRecaudoHoy() {
        System.out.println("\n--- REPORTE DE CIERRE DE CAJA DE HOY ---");
        try {
            BigDecimal total = pagoDAO.totalRecaudadoHoy();
            System.out.println("💰 TOTAL RECAUDADO EN EL DÍA: $" + total);
        } catch (SQLException e) {
            System.err.println("Error al calcular recaudo: " + e.getMessage());
        }
    }
}

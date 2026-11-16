# Modulo Stand-Alone JDBC (Empresa Llano Grande)

## 1. Proposito y alcance
El modulo `backend-jdbc` provee la aplicacion de escritorio y consola stand-alone para la gestion de carterizacion, colocacion de microcreditos y registro transaccional en lote para Empresa Llano Grande. Su responsabilidad se concentra en la persistencia directa en motor relacional MySQL mediante JDBC puro, implementando el patron Data Access Object (DAO) para encapsular las sentencias SQL y mantener la integridad referencial.

## 2. Contratos y API
El modulo opera mediante clases DAO Java que exponen contratos de acceso a datos fuertemente tipados:

| Clase DAO | Metodo Publico | Firma | Responsabilidad |
| :--- | :--- | :--- | :--- |
| `ClienteDAO` | `crear` | `boolean crear(Cliente c)` | Inserta un titular validando documento unico |
| `ClienteDAO` | `listarTodos` | `List<Cliente> listarTodos()` | Obtiene la coleccion activa de clientes |
| `ClienteDAO` | `buscarPorId` | `Cliente buscarPorId(int id)` | Consulta puntual de titular por ID primario |
| `PrestamoDAO` | `registrar` | `boolean registrar(Prestamo p)` | Inserta colocacion de credito comercial al 20% |
| `PrestamoDAO` | `listarActivos`| `List<Prestamo> listarActivos()`| Filtra cartera vigente y en mora |
| `CuotaPagoDAO`| `registrarPago`| `boolean registrarPago(CuotaPago cp)`| Asienta cuota y descuenta saldo en transaccion |

## 3. Dependencias
- **Java:** JDK 17 o superior.
- **Gestor de construccion:** Apache Maven 3.8+.
- **Driver JDBC:** `com.mysql:mysql-connector-j:8.1.0`.

## 4. Mapa de archivos
- `pom.xml`: Configuracion del proyecto Maven, versiones de dependencias y plugins de ejecucion.
- `src/main/java/com/llanogrande/config/ConexionBD.java`: Singleton de conexion JDBC con soporte para variables de entorno.
- `src/main/java/com/llanogrande/model/`: Entidades de dominio (`Usuario`, `Cliente`, `Prestamo`, `CuotaPago`).
- `src/main/java/com/llanogrande/dao/`: Clases de acceso a datos (`ClienteDAO`, `PrestamoDAO`, `CuotaPagoDAO`).
- `src/main/java/com/llanogrande/app/MainApp.java`: Punto de entrada de la consola interactiva CLI.

## 5. Logica y flujo
1. `ConexionBD` inicializa el `Connection` a traves de `DriverManager` leyendo host, puerto, usuario y contrasena de variables de entorno o valores por defecto (`localhost:3306/llanogrande_db`).
2. `MainApp` presenta el menu por terminal para crear clientes, registrar prestamos y procesar abonos de cuotas.
3. Las operaciones de recaudo invocan transacciones JDBC con `setAutoCommit(false)` para garantizar consistencia entre el registro de pago y la reduccion de saldo del prestamo.

## 6. Decisiones de diseno y gotchas
- **Uso de PreparedStatements:** Todas las consultas SQL estan parametrizadas para neutralizar vectores de inyeccion SQL.
- **Gotcha de Conexion:** Requiere que el servicio MySQL este activo y el esquema cargado antes de la ejecucion. Si la base de datos no esta disponible, el modulo captura `SQLException` y emite un mensaje de diagnostico claro.

## 7. Estado y ultimos cambios
- Documentacion tecnica inicial y estandarizacion de contratos JDBC.
- Total compatibilidad con el esquema relacional `database/01_schema_llanogrande.sql`.

## 8. Como verificar
1. Compilar el modulo con Maven:
   ```bash
   cd backend-jdbc
   mvn clean compile
   ```
2. Ejecutar la aplicacion stand-alone:
   ```bash
   mvn exec:java
   ```


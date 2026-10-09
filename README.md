# Sistema de Gestión de Préstamos y Cobros Diarios - Empresa Llano Grande

Proyecto de software integrador desarrollado en el marco del programa **Tecnología en Análisis y Desarrollo de Software (ADSO) - SENA** (Ficha: 228118, Fase de Ejecución AP7).

---

## 📋 Descripción del Sistema
Solución de software diseñada para la **Empresa Llano Grande**, especializada en la colocación de microcréditos y gestión de rutas de recaudo diario ("paga diario"). Permite el control riguroso de:
* **Fichero de Clientes:** Registro con cédula única, georreferenciación domiciliaria y teléfonos de contacto.
* **Préstamos Diarios:** Desembolsos con cálculo automático de intereses, cuotas fijas diarias y vencimientos.
* **Ruta de Recaudo:** Asentamiento de cobros diarios en tiempo real por parte de los cobradores.
* **Cierre de Caja y Morosidad:** Liquidación de cartera activa y detección de clientes en mora.

---

## 🛠️ Tecnologías y Arquitectura
* **Lenguaje:** Java SE (Versión 17+)
* **Acceso a Datos:** JDBC (Java Database Connectivity) con sentencias preparadas (`PreparedStatement`)
* **Gestor de Dependencias:** Apache Maven
* **Motor de Base de Datos:** MySQL Server 8.x / MariaDB (Motor transaccional InnoDB)
* **Arquitectura:** Por capas (Model / DTO - DAO - Service - Controller / App)

---

## 🗄️ Estructura del Repositorio
```text
finalsena/
├── database/
│   ├── 01_schema_llanogrande.sql       # Script DDL: Creación de tablas, FKs e índices
│   └── 02_datos_prueba.sql             # Script DML: Datos iniciales de prueba
└── backend-jdbc/
    ├── pom.xml                         # Configuración de dependencias Maven
    └── src/main/java/com/llanogrande/
        ├── config/                     # Conexión JDBC (ConexionBD.java)
        ├── model/                      # Entidades POJO (Usuario, Cliente, Prestamo, CuotaPago)
        ├── dao/                        # Clases CRUD con JDBC (ClienteDAO, PrestamoDAO...)
        └── app/                        # Menú interactivo de prueba y consola (MainApp.java)
```

---

## 🚀 Puesta en Marcha

### 1. Configurar la Base de Datos
Ejecutar los scripts SQL en el servidor MySQL:
```bash
mysql -u root -p < database/01_schema_llanogrande.sql
mysql -u root -p < database/02_datos_prueba.sql
```

### 2. Variables de Entorno (Opcional)
Por defecto el sistema conecta a `localhost:3306`, base de datos `llanogrande_db`, usuario `root` sin contraseña. Puede personalizar estos valores configurando:
```bash
export DB_HOST=localhost
export DB_PORT=3306
export DB_NAME=llanogrande_db
export DB_USER=root
export DB_PASS=su_password
```

### 3. Compilación y Ejecución
Desde la carpeta `backend-jdbc`:
```bash
mvn clean compile
mvn exec:java
```

---

## 📌 Evidencias de Aprendizaje SENA Relacionadas
* **GA7-220501096-AA1-EV01 & EV02:** Plan de trabajo y estándares de codificación.
* **GA7-220501096-AA2-EV01:** Codificación de módulos del software mediante JDBC.
* *Nota:* La documentación formal en PDF se encuentra gestionada de forma externa en la carpeta de documentación del proyecto.

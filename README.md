# Sistema de Gestión de Préstamos y Cobros Diarios - Empresa Llano Grande

Proyecto de software integrador desarrollado en el marco del programa **Tecnología en Análisis y Desarrollo de Software (ADSO) - SENA** (Ficha: 3186677, Fase de Ejecución AP7).

**Aprendiz:** Adriana Cristina Villazón Soto  
**Instructor:** Edwin Andrés Flórez Orejuela  

---

## 📋 Descripción del Sistema
Solución de software diseñada para la **Empresa Llano Grande**, especializada en la colocación de microcréditos y gestión de rutas de recaudo diario ("paga diario"). Permite el control riguroso de:
* **Fichero de Clientes:** Registro con cédula única, georreferenciación domiciliaria y teléfonos de contacto.
* **Préstamos Diarios:** Desembolsos con cálculo automático de intereses, cuotas fijas diarias y vencimientos.
* **Ruta de Recaudo:** Asentamiento de cobros diarios en tiempo real por parte de los cobradores.
* **Cierre de Caja y Morosidad:** Liquidación de cartera activa y detección de clientes en mora.
* **Tarjetón Digital Interactivo:** Control visual de las 24 cuotas con sello verde y firmas digitales.
* **Integración WhatsApp:** Notificación y envío inmediato de recibos térmicos a los clientes en ruta.

---

## 🛠️ Tecnologías y Arquitectura
* **Capa Backend Stand-alone:** Java SE (Versión 17+) con especificación JDBC y Maven.
* **Capa Servidor Web / API:** Node.js con arquitectura RESTful y persistencia transaccional.
* **Capa Frontend Web & Móvil:** HTML5 Semántico, CSS3 Vanilla profesional (diseño responsive mobile-first y tarjetón contable) y JavaScript ES6+.
* **Motor de Base de Datos:** MySQL Server 8.x / MariaDB (Motor transaccional InnoDB en 3FN).
* **Control de Versiones:** Git y GitHub con metodología Conventional Commits.

---

## 🗄️ Estructura del Repositorio
```text
finalsena/
├── database/
│   ├── 01_schema_llanogrande.sql       # Script DDL: Creación de tablas, FKs e índices
│   └── 02_datos_prueba.sql             # Script DML: Datos iniciales de prueba
├── backend-jdbc/
│   ├── pom.xml                         # Configuración de dependencias Maven
│   └── src/main/java/com/llanogrande/
│       ├── config/                     # Conexión JDBC (ConexionBD.java)
│       ├── model/                      # Entidades POJO (Usuario, Cliente, Prestamo, CuotaPago)
│       ├── dao/                        # Clases CRUD con JDBC (ClienteDAO, PrestamoDAO...)
│       └── app/                        # Menú interactivo de prueba y consola (MainApp.java)
└── web/
    ├── package.json                    # Metadatos del módulo y scripts npm
    ├── server.js                       # Servidor HTTP API RESTful y despacho estático
    ├── data/
    │   └── store.json                  # Persistencia transaccional de estados
    └── public/
        ├── index.html                  # Interfaz principal (Dashboard, Ruta, Tarjetón, Cierre)
        ├── styles.css                  # Sistema de diseño responsive y estilos contables
        └── app.js                      # Lógica reactiva SPA, cálculos de cuotas y WhatsApp
```

---

## 🚀 Puesta en Marcha

### A. Módulo Web y Móvil (Recomendado para operación en ruta)
```bash
cd web
npm start
# O alternativamente:
# node server.js
```
Acceder en el navegador a: `http://localhost:3000` (compatible con smartphones y tablets en campo).

### B. Módulo Stand-Alone JDBC (Consola de Administración)

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

## 📌 Evidencias de Aprendizaje SENA Relacionadas (AP7)
* **GA7-220501096-AA1-EV01:** Plan de trabajo para construcción de software y control de versionamiento.
* **GA7-220501096-AA2-EV01:** Codificación de módulos del software mediante JDBC y MySQL.
* **GA7-220501096-AA2-EV02:** Módulos de software codificados y probados (Capa Web).
* **GA7-220501096-AA3-EV01:** Codificación de módulos del software stand-alone, web y móvil aplicando frameworks.
* **GA7-220501096-AA3-EV02:** Módulos de software codificados y probados (Pruebas de Historias de Usuario, Tarjetón e Integración).
* *Nota:* Los informes técnicos formales en formato PDF y los comprimidos oficiales (.zip) de cada evidencia se encuentran estructurados en la carpeta de documentación oficial de evidencias del SENA.

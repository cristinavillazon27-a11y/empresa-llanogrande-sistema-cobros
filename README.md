# Sistema de Gestión de Préstamos y Cobros Diarios - Empresa Llano Grande

Proyecto de software integrador desarrollado en el marco del programa **Tecnología en Análisis y Desarrollo de Software (ADSO) - SENA** (Ficha: 3186677, Fase de Ejecución AP7).

**Aprendiz:** Adriana Cristina Villazón Soto  
**Instructor:** Edwin Andrés Flórez Orejuela  
**Institución:** Servicio Nacional de Aprendizaje - SENA (2026)  

---

## 📋 Descripción del Sistema
Solución de software integral diseñada para la **Empresa Llano Grande**, especializada en la colocación de microcréditos comerciales y administración de rutas de cobro diario ("paga diario"). El sistema automatiza:
* **Fichero Maestro de Clientes:** Registro con validación de cédula única, teléfonos de contacto y georreferenciación por barrios.
* **Liquidación y Desembolso:** Colocación de créditos con amortización fija (20, 24 o 30 días), cálculo de interés comercial (20%), cuota diaria y emisión de hoja de liquidación contable.
* **Planilla de Cobranza en Calle (Mobile-First):** Interfaz táctil adaptativa para cobradores en ruta con registro de abonos en un clic e integración directa con WhatsApp para envío de recibos térmicos.
* **Tarjetón Digital de Cuotas:** Réplica oficial de la tradicional cartulina comercial con cuadrícula de 24 casillas interactivas, sellos verdes de fecha de pago y control de firmas.
* **Arqueo y Cierre Diario de Caja:** Cuadre de efectivo de la jornada desglosado por cobrador de ruta y conciliación financiera en sede central.

---

## 🛠️ Tecnologías y Arquitectura
* **Capa Stand-Alone (Persistencia y Consola):** Java SE 17+, especificación JDBC con `PreparedStatement`, patrón DAO y Apache Maven.
* **Capa Servidor Web / API REST:** Node.js con arquitectura RESTful asíncrona, middleware de seguridad CORS y persistencia transaccional tolerante a fallos.
* **Capa Frontend Web & Móvil (SPA):** JavaScript ES6+ Vanilla, HTML5 Semántico y CSS3 modular (diseño responsive mobile-first para smartphones de cobradores en calle).
* **Motor de Base de Datos:** MySQL Server 8.x / MariaDB (Motor transaccional InnoDB en Tercera Forma Normal - 3FN).
* **Control de Versiones:** Git y GitHub bajo metodología Conventional Commits.

---

## 🗄️ Estructura del Repositorio
```text
empresa-llanogrande-sistema-cobros/
├── .gitignore                          # Exclusiones de dependencias y temporales
├── README.md                           # Documentación técnica general del proyecto
├── codigo_fuente_jdbc/                 # Módulo Stand-Alone (Java SE 17+ / Maven / JDBC)
│   ├── pom.xml                         # Configuración del proyecto Maven y dependencias
│   ├── database/
│   │   ├── 01_schema_llanogrande.sql   # Script DDL: Esquema relacional, FKs e índices (3FN)
│   │   └── 02_datos_prueba.sql         # Script DML: Inserción de datos iniciales
│   └── src/main/java/com/llanogrande/
│       ├── config/                     # Conexión Singleton JDBC parametrizada (ConexionBD.java)
│       ├── model/                      # Entidades POJO (Usuario, Cliente, Prestamo, CuotaPago)
│       ├── dao/                        # Clases CRUD con JDBC (ClienteDAO, PrestamoDAO...)
│       └── app/                        # Menú interactivo y consola de pruebas (MainApp.java)
├── modulos_probados_web/               # Módulo Web y Móvil (Node.js / SPA / Mobile-First)
│   ├── package.json                    # Scripts npm y metadatos del módulo web
│   ├── server.js                       # Servidor HTTP API RESTful y despacho estático (JSDoc)
│   ├── data/
│   │   └── store.json                  # Persistencia transaccional de estados en disco
│   └── public/
│       ├── index.html                  # Vistas SPA (Dashboard, Ruta Móvil, Tarjetón, Cierre)
│       ├── styles.css                  # Sistema de diseño responsive y estilos contables
│       └── app.js                      # Lógica reactiva de cliente, calculadora y WhatsApp
└── docs/                               # Documentación formal de evidencias SENA
    ├── GA7-220501096-AA3-EV01_CODIFICACION_MODULOS_FRAMEWORK.md
    └── GA7-220501096-AA3-EV01_CODIFICACION_MODULOS_FRAMEWORK.pdf
```

---

## 🚀 Puesta en Marcha

### 1. Módulo Web y Móvil (Recomendado para operación en ruta)
```bash
cd modulos_probados_web
npm start
# O alternativamente:
# node server.js
```
Acceder en el navegador a: `http://localhost:3000` (compatible con cualquier navegador web de escritorio o smartphone en calle).

### 2. Base de Datos Relacional (MySQL)
Para sincronizar el esquema relacional en un servidor MySQL:
```bash
mysql -u root -p < codigo_fuente_jdbc/database/01_schema_llanogrande.sql
mysql -u root -p < codigo_fuente_jdbc/database/02_datos_prueba.sql
```

### 3. Módulo Stand-Alone JDBC (Consola de Administración)
Desde el directorio `codigo_fuente_jdbc`:
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

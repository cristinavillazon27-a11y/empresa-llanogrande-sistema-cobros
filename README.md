# Sistema de Gestion de Cobros y Microcreditos

Sistema integral para la administracion de microcreditos comerciales y control de operaciones de recaudo en ruta ("paga diario"). Disenado para optimizar el flujo de trabajo entre la administracion central y los cobradores en campo.

---

## Caracteristicas Principales

- **Gestion de Clientes:** Registro centralizado con validacion de documento de identidad, telefonos de contacto y georreferenciacion por zonas de cobertura.
- **Colocacion y Liquidacion:** Configuracion de prestamos a plazos fijos (20, 24 y 30 dias) con tasa comercial del 20% y calculo automatizado de cuotas diarias.
- **Operacion en Ruta (Mobile-First):** Interfaz adaptada a dispositivos moviles que permite registrar abonos en tiempo real y emitir recibos termicos via WhatsApp.
- **Tarjeton Digital:** Control visual de amortizacion mediante matriz interactiva de cuotas con sellos de estado de pago.
- **Cuadre y Arqueo de Caja:** Consolidacion diaria de recaudos por cobrador, balance de cartera activa y control de morosidad.

---

## Arquitectura y Tecnologias

| Componente | Tecnologia | Descripcion |
| :--- | :--- | :--- |
| **Frontend Web y Movil** | HTML5 Semantico, CSS3 Modular, JavaScript (ES6+) | Single Page Application (SPA) responsiva con diseno adaptativo mobile-first |
| **Servidor Web y API** | Node.js, Express | Arquitectura RESTful asincrona para despacho de vistas y persistencia transaccional |
| **Modulo Stand-Alone** | Java 17+, JDBC, Apache Maven | Aplicacion de consola y gestion por lotes implementando patron DAO |
| **Base de Datos** | MySQL 8.x / MariaDB | Modelo relacional en Tercera Forma Normal (3FN) con motor InnoDB |
| **Control de Versiones** | Git / GitHub | Gestion de codigo fuente bajo metodologia Conventional Commits |

---

## Estructura del Proyecto

```text
finalsena/
|-- .gitignore
|-- README.md
|-- database/                           # Scripts SQL de base de datos
|   |-- 01_schema_llanogrande.sql       # DDL: Definicion de tablas, llaves e indices
|   `-- 02_datos_prueba.sql             # DML: Datos iniciales de prueba
|-- backend-jdbc/                       # Modulo Stand-Alone (Java 17 / Maven / JDBC)
|   |-- pom.xml                         # Configuracion Maven y dependencias
|   `-- src/main/java/com/llanogrande/
|       |-- config/                     # Conexion Singleton JDBC parametrizada
|       |-- model/                      # Entidades del dominio (Usuario, Cliente, Prestamo...)
|       |-- dao/                        # Clases CRUD de persistencia relacional
|       `-- app/                        # Menu interactivo y consola de administracion
`-- web/                                # Modulo Web y Movil (Node.js / Express / SPA)
    |-- package.json                    # Manifiesto y scripts npm
    |-- server.js                       # Servidor HTTP API RESTful y despacho estatico
    |-- data/
    |   `-- store.json                  # Persistencia transaccional de estados en disco
    `-- public/
        |-- index.html                  # Vistas SPA (Dashboard, Ruta, Tarjeton, Arqueo)
        |-- styles.css                  # Sistema de diseno y estilos contables
        `-- app.js                      # Logica reactiva, calculos y enlaces WhatsApp
```

---

## Requisitos Previos

- **Node.js:** Version 16.0 o superior (compatible con Node.js 20+ LTS).
- **Java Development Kit (JDK):** Version 17 o superior.
- **Apache Maven:** Version 3.8 o superior.
- **MySQL Server:** Version 8.0 o compatible (MariaDB 10.4+).

---

## Puesta en Marcha

### 1. Inicializacion de la Base de Datos
Cargar el esquema relacional y los datos iniciales en el servidor MySQL:
```bash
mysql -u root -p < database/01_schema_llanogrande.sql
mysql -u root -p < database/02_datos_prueba.sql
```

### 2. Modulo Web y Movil (Operacion en Ruta)
Ingresar al directorio del modulo, instalar dependencias y levantar el servidor:
```bash
cd web
npm install
npm start
```
Acceso en el navegador: `http://localhost:3000`

### 3. Modulo Stand-Alone JDBC (Consola de Administracion)
Desde el directorio del modulo Java, compilar y ejecutar:
```bash
cd backend-jdbc
mvn clean compile
mvn exec:java
```

---

## Configuracion de Variables de Entorno

Por defecto, la aplicacion conecta a `localhost:3306`, base de datos `llanogrande_db`, usuario `root` sin contrasena. Puede personalizar estos parametros mediante variables de entorno:

| Variable | Descripcion | Valor Predeterminado |
| :--- | :--- | :--- |
| `DB_HOST` | Host del servidor MySQL | `localhost` |
| `DB_PORT` | Puerto de conexion | `3306` |
| `DB_NAME` | Nombre de la base de datos | `llanogrande_db` |
| `DB_USER` | Usuario de base de datos | `root` |
| `DB_PASS` | Contrasena de acceso | *(vacio)* |

---

## Informacion del Proyecto

- **Organizacion:** Empresa Llano Grande
- **Contexto Formativo:** Servicio Nacional de Aprendizaje (SENA)
- **Programa:** Tecnologia en Analisis y Desarrollo de Software (ADSO) - Ficha 3186677
- **Aprendiz:** Adriana Cristina Villazon Soto
- **Instructor:** Edwin Andres Florez Orejuela

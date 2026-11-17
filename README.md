# Sistema de Gestion de Microcreditos y Rutas de Cobro Diario - Empresa Llano Grande S.A.S.

Sistema integral de nivel empresarial para la administracion de microcreditos comerciales, control de cartera y gestion operativa de recaudos diarios en ruta ("paga diario"). Disenado para digitalizar y optimizar el flujo de trabajo financiero y operativo entre la administracion central y los cobradores en campo.

---

## 1. Proposito y Alcance del Software

El software resuelve la problematica operativa, contable y de trazabilidad en los procesos de credito y cobranza diaria en calle para la **Empresa Llano Grande S.A.S.** en la ciudad de Valledupar (Cesar).

El sistema sustituye los libros manuales y las libretas de papel por una plataforma digital centralizada que garantiza:
- **Colocacion controlada de creditos**: Formula prestamos con tasa de interes fija comercial (20%), plazos fijos de 15, 20 y 24 dias comerciales, calculo automatico de cuota diaria y amortizacion lineal.
- **Gestion operativa en calle (Mobile-First)**: Los cobradores disponen de planillas de cobranza por circuito territorial, tarjetones digitales interactivos y generacion de recibos termicos enviados directamente al cliente por WhatsApp.
- **Auditoria satelital en tiempo real**: Registro obligatorio de coordenadas GPS (latitud, longitud y precision) en cada recaudo para verificar la presencia fisica del cobrador en la direccion del cliente.
- **Sincronizacion instantanea WebSocket**: Notificaciones inmediatas en la pantalla del administrador en el instante exacto en que un cobrador asienta un pago en calle.
- **Seguridad basada en roles (RBAC) y JWT**: Restriccion estricta de privilegios donde solo los administradores pueden autorizar desembolsos y realizar arqueos de caja, mientras que los cobradores unicamente asientan pagos de su ruta.
- **Arqueo y cuadre de caja automatico**: Conciliacion de efectivo al cierre de la jornada con reporte imprimible a una sola hoja bajo estandares contables.

---

## 2. Caracteristicas Principales

### 2.1 Gestion Comercial y Clientes
- Registro y validacion de clientes con control de cedula unica (prevencion de duplicados con codigo HTTP 409 Conflict).
- Direccionamiento por sectores urbanos y asignacion a circuitos territoriales (Ruta 01 Centro / Mercado, Ruta 02 Sur / Primavera).
- Historial crediticio individual con estado de cartera (Al Dia, En Mora, Sin Deuda).

### 2.2 Motor de Liquidacion y Colocacion
- Tasa comercial fija del 20% con calculo automatico de interes y monto total a pagar.
- Modalidades estandarizadas:
  - **Plan Expres 15 Dias**: Rotacion rapida de capital a 15 cuotas diarias.
  - **Microcredito 20 Dias**: 3 semanas comerciales a 20 cuotas diarias.
  - **Plan Clasico 24 Dias**: Mes comercial habil a 24 cuotas diarias.
- Botones de seleccion rapida de montos frecuentes ($200.000, $300.000, $500.000, $1.000.000, $2.000.000).

### 2.3 Operacion en Ruta y Tarjeton Digital
- Planilla interactiva con filtrado en tiempo real por circuito territorial y estado (Todos, Pendientes, Cobrados Hoy).
- Tarjeton digital contable con matriz interactiva de cuotas (numeradas con sellos de estado de pago).
- Enlace directo a WhatsApp con mensaje preconfigurado y recibo detallado para el titular.

### 2.4 Auditoria Satelital GPS
- Captura de coordenadas geograficas (`latitud`, `longitud`, `precisionGPS`) al asentar cada recaudo mediante la API de Geolocalizacion.
- Generacion de hipervinculos auditables directos a Google Maps (`https://www.google.com/maps?q={lat},{lng}`) en el libro diario de transacciones.

### 2.5 Sincronizacion en Tiempo Real (WebSockets RFC 6455)
- Servidor WebSocket nativo integrado en `/ws`.
- Notificaciones flotantes tipo toast en tiempo real con indicador acustico mediante Web Audio API sintetizado.
- Monitoreo en vivo de cobradores conectados y sincronizacion reactiva del tablero de mando sin recarga de pagina.

### 2.6 Seguridad Criptografica JWT y Control de Acceso RBAC
- Autenticacion formal mediante tokens firmados criptograficamente con algoritmo HMAC-SHA256.
- Jerarquia de roles:
  - **ADMIN**: Control total (colocacion, auditoria, arqueo, configuracion de sistema y cambio de sesion).
  - **COBRADOR**: Operacion restringida a consulta de planilla y asentamiento de recaudos en su ruta asignada. Intentos de colocacion devuelven HTTP 403 Forbidden.

### 2.7 Arqueo de Caja y Cierre Contable
- Consolidacion de efectivo recaudado frente a la meta diaria proyectada.
- Conciliacion por cobrador con estado de cuadre (Cuadrada / Sin Faltante).
- Emision de Acta Oficial de Cierre Diario con estilos de impresion `@media print` normalizados a 1 hoja.

---

## 3. Arquitectura del Sistema

```
+-------------------------------------------------------------------------+
|                              CLIENTES (UI)                              |
|   Navegador Web / Movil Cobrador        Consola Web Administrador       |
|   (HTML5 Semantico, CSS3 Modular, JavaScript Vanilla ES6+ Reactivo)     |
+------------------------------------+------------------------------------+
                                     | HTTP REST / WebSocket (/ws)
+------------------------------------+------------------------------------+
|                      CAPA DE APLICACION (BACKEND)                       |
|                                                                         |
|  [ Servidor HTTP Nativo ]                     [ Servidor WebSocket ]    |
|  - Despacho de API RESTful                     - RFC 6455 Nativo        |
|  - Middleware CORS y Static Files              - Protocolo Handshake    |
|  - Validador JWT HMAC-SHA256                   - Difusion broadcastWS   |
|  - Control RBAC (ADMIN/COBRADOR)                                        |
|                                                                         |
|  [ Logica de Dominio y Servicios ]                                      |
|  - Calculadora de Liquidacion (20% comercial)                           |
|  - Gestor de Pagos y Amortizacion                                       |
|  - Auditoria Satelital GPS                                              |
|  - Consolidacion de Caja y Arqueo                                       |
+------------------------------------+------------------------------------+
                                     |
+------------------------------------+------------------------------------+
|                         CAPA DE PERSISTENCIA                            |
|                                                                         |
|  [ Modulo Web - JSON Transaccional ]    [ Modulo Stand-Alone - JDBC ]   |
|  - Persistencia atomica en disco        - Java 17 / Apache Maven        |
|  - Archivo `web/data/store.json`        - Patron DAO (Cliente, Prestamo)|
|  - Cero dependencias externas npm       - Motor MySQL 8.0 (InnoDB, 3FN) |
+-------------------------------------------------------------------------+
```

---

## 4. Mapa de Modulos

| Modulo | Ruta | Responsabilidad | Documentacion Local |
| :--- | :--- | :--- | :--- |
| **Modulo Web y Movil** | `web/` | Servidor HTTP RESTful, WebSockets nativos RFC 6455, autenticacion JWT/RBAC, auditoria GPS y SPA reactiva estilo Spark Pixel | [README web](file:///home/omicron/Documentos/finalsena/web/README.md) |
| **Modulo Stand-Alone** | `backend-jdbc/` | Aplicacion Java 17 y Apache Maven con persistencia relacional pura JDBC y patron DAO para gestion por consola | [README backend-jdbc](file:///home/omicron/Documentos/finalsena/backend-jdbc/README.md) |
| **Base de Datos** | `database/` | Scripts de definicion DDL y datos de prueba DML para motor relacional MySQL 8.0 en Tercera Forma Normal (3FN) | [01_schema_llanogrande.sql](file:///home/omicron/Documentos/finalsena/database/01_schema_llanogrande.sql) |
| **Pruebas y Postman** | `web/postman/` | Coleccion y entorno oficial Postman para verificacion de contratos de API (Evidencia GA7-AA5-EV04) | [README postman](file:///home/omicron/Documentos/finalsena/web/postman/README.md) |
| **Especificaciones y Arquitectura** | `docs/` | Documento formal de arquitectura de software en PDF (12 paginas), diagramas SVG y especificaciones tecnicas | [ESPECIFICACIONES_TECNICAS_Y_ARQUITECTURA.pdf](file:///home/omicron/Documentos/finalsena/docs/ESPECIFICACIONES_TECNICAS_Y_ARQUITECTURA.pdf) |
| **Sustentación y Presentación** | `docs/` | Presentacion web interactiva de 12 diapositivas, PDF exportable y guion de defensa con banco de preguntas tecnicas | [PRESENTACION_SUSTENTACION_LLANOGRANDE.html](file:///home/omicron/Documentos/finalsena/docs/PRESENTACION_SUSTENTACION_LLANOGRANDE.html) |
| **Evidencias Visuales** | `docs/screenshots/` | Capturas de pantalla de verificacion visual de cada vista y modal del sistema en resolucion 1440x900 | [Directorio screenshots](file:///home/omicron/Documentos/finalsena/docs/screenshots/) |

---

## 5. Catalogo de Endpoints y Contratos REST

| Metodo | Endpoint | Descripcion Funcional | Autenticacion / Rol | Codigos HTTP |
| :---: | :--- | :--- | :---: | :---: |
| `GET` | `/api/health` | Diagnostico de operatividad, modulos activos y clientes WebSocket | Publico | `200` |
| `GET` | `/api/endpoints` | Catalogo de contratos y especificaciones REST del sistema | Publico | `200` |
| `POST` | `/api/auth/login` | Inicio de sesion y generacion de token JWT firmado (HMAC-SHA256) | Publico | `200`, `401` |
| `GET` | `/api/auth/me` | Validacion de identidad de sesion a partir del token Bearer | Token Bearer | `200`, `401` |
| `GET` | `/api/clientes` | Consulta de la coleccion maestra de clientes registrados | Publico | `200` |
| `GET` | `/api/clientes/:id` | Detalle de un cliente especifico por su identificador primario | Publico | `200`, `404` |
| `POST` | `/api/clientes` | Registro de nuevo cliente validando documento de identidad unico | Publico / ADMIN | `201`, `400`, `409` |
| `GET` | `/api/prestamos` | Listado de microcreditos con soporte de filtrado por estado | Publico | `200` |
| `POST` | `/api/prestamos` | Colocacion y liquidacion comercial de nuevo microcredito | Token / ADMIN | `201`, `400`, `403` |
| `GET` | `/api/pagos` | Libro diario de recaudos con datos de cuota y coordenadas GPS | Publico | `200` |
| `POST` | `/api/pagos` | Asentamiento de pago, amortizacion y auditoria satelital GPS | Publico / COBRADOR | `201`, `400`, `404` |
| `GET` | `/api/caja/resumen` | Consolidado financiero de arqueo diario y balance de cartera | Publico / ADMIN | `200` |
| `GET` | `/api/rutas` | Catalogo de circuitos territoriales de cobranza | Publico | `200` |
| `WS` | `/ws` | Canal bidireccional WebSocket para sincronizacion en vivo | Publico | `101 Switching Protocols` |

---

## 6. Estructura del Repositorio

```text
finalsena/
|-- .gitignore                                    # Exclusiones de Git (node_modules, logs, temporales)
|-- README.md                                     # Documentacion tecnica principal de arquitectura
|-- vercel.json                                   # Configuracion de rutas y reescrituras para despliegue en Vercel
|-- docs/                                         # Documentacion tecnica formal y especificaciones
|   |-- ESPECIFICACIONES_TECNICAS_Y_ARQUITECTURA.pdf # Documento oficial de arquitectura (12 paginas)
|   |-- ESPECIFICACIONES_TECNICAS_Y_ARQUITECTURA.html # Fuente HTML para compilacion tipografica
|   |-- PRESENTACION_SUSTENTACION_LLANOGRANDE.html # Diapositivas web interactivas para sustentacion (16:9)
|   |-- PRESENTACION_SUSTENTACION_LLANOGRANDE.pdf  # Version PDF de 12 laminas para proyeccion o impresion
|   |-- GUION_DE_SUSTENTACION_Y_DEFENSA.md        # Guion minuto a minuto y banco de 10 preguntas tecnicas
|   |-- presentation_previews/                    # Previsualizaciones en imagen de las 12 diapositivas
|   |-- GUION_TECNICO_VIDEO_GA7_AA5_EV04.md       # Guion formal de sustentacion y video técnico
|   |-- GUION_TECNICO_VIDEO_GA7_AA5_EV04.pdf      # Version PDF del guion tecnico
|   |-- diagrams/                                 # Diagramas de arquitectura en formato vectorial SVG
|   |-- pdf_previews/                             # Evidencias en imagen de las paginas del documento
|   |-- print_reports/                            # Reportes contables normalizados a 1 hoja
|   `-- screenshots/                              # Capturas de pantalla de verificacion visual (1440x900)
|-- database/                                     # Scripts de persistencia relacional MySQL 8.0
|   |-- 01_schema_llanogrande.sql                 # DDL: Creacion de base de datos, tablas e indices
|   `-- 02_datos_prueba.sql                       # DML: Datos iniciales de prueba y carterizacion
|-- backend-jdbc/                                 # Modulo Stand-Alone Java / Maven / JDBC
|   |-- README.md                                 # Documentacion local del modulo Java
|   |-- pom.xml                                   # Configuracion de compilacion Maven y driver JDBC
|   `-- src/main/java/com/llanogrande/
|       |-- config/ConexionBD.java                # Singleton de conexion JDBC con variables de entorno
|       |-- model/                                # Entidades del modelo relacional
|       |-- dao/                                  # Implementacion del patron DAO con JDBC puro
|       `-- app/AppConsola.java                   # Interfaz de consola y menu de administracion
`-- web/                                          # Modulo Web y Movil (Node.js / SPA Vanilla)
    |-- README.md                                 # Documentacion local del modulo Web
    |-- package.json                              # Manifiesto npm y scripts de ejecucion y pruebas
    |-- vercel.json                               # Configuracion Vercel serverless del subdirectorio web
    |-- server.js                                 # Servidor HTTP y WebSocket nativo (sin dependencias npm)
    |-- api/                                      # Punto de entrada para funciones serverless en Vercel
    |   `-- index.js                              # Adaptador serverless Vercel Fluid Compute
    |-- test-api.js                               # Suite de 14 pruebas automatizadas de integracion
    |-- inspect_all_tabs.sh                       # Script para generacion automatizada de capturas
    |-- data/
    |   `-- store.json                            # Almacenamiento transaccional de datos en disco
    |-- postman/                                  # Artefactos para pruebas de API con Postman
    |   |-- README.md                             # Guia de ejecucion en Postman
    |   |-- SENA_ADSO_LlanoGrande_API.postman_collection.json
    |   `-- SENA_ADSO_LlanoGrande_Local.postman_environment.json
    `-- public/                                   # Frontend Single Page Application (SPA)
        |-- index.html                            # Estructura semantica HTML5 de las 14 vistas y modales
        |-- styles.css                            # Sistema de diseno contemporaneo Spark Pixel
        |-- app.js                                # Controlador reactivo, WebSockets y GPS
        `-- assets/                               # Isotipo e imagotipo vectorial SVG
```

---

## 7. Requisitos del Sistema

- **Node.js**: Version 16.0 o superior (compatible con Node.js 18, 20 y 22 LTS).
- **Java Development Kit (JDK)**: Version 17 o superior (para compilacion del modulo stand-alone).
- **Apache Maven**: Version 3.8 o superior.
- **MySQL Server**: Version 8.0 o MariaDB 10.4+ (para persistencia relacional con JDBC).
- **Navegador Web Moderno**: Chrome, Chromium, Firefox, Edge o Safari con soporte para WebSockets y Geolocation API.

---

## 8. Guia de Instalacion y Puesta en Marcha

### 8.1 Clonacion del Repositorio
```bash
git clone <URL_DEL_REPOSITORIO>
cd finalsena
```

### 8.2 Puesta en Marcha del Modulo Web (Servidor Principal)
El modulo web esta construido con modulos nativos de Node.js (`http`, `fs`, `crypto`, `path`), lo que garantiza cero dependencias de terceros en produccion:
```bash
cd web
npm start
```
El servidor quedara activo en:
- Interfaz Web: `http://localhost:3000`
- API RESTful: `http://localhost:3000/api`
- Servidor WebSocket: `ws://localhost:3000/ws`

### 8.3 Puesta en Marcha del Modulo Stand-Alone JDBC (Java 17)
1. Cargar el esquema relacional en MySQL:
   ```bash
   mysql -u root -p < database/01_schema_llanogrande.sql
   mysql -u root -p < database/02_datos_prueba.sql
   ```
2. Compilar y ejecutar la aplicacion de consola:
   ```bash
   cd backend-jdbc
   mvn clean compile
   mvn exec:java
   ```

---

## 9. Suite de Pruebas Automatizadas (Evidencia GA7-AA5-EV04)

El proyecto incluye un ejecutor de pruebas automatizadas en [web/test-api.js](file:///home/omicron/Documentos/finalsena/web/test-api.js) que valida la integridad funcional de la API REST contra un puerto aislado (`3099`) sin alterar la base de datos de produccion.

Para ejecutar la suite de pruebas:
```bash
npm test --prefix web
```

### Matriz de Casos de Prueba Evaluados

| Caso de Prueba | Categoria | Contrato Evaluado | Descripcion de la Prueba | Resultado |
| :--- | :--- | :--- | :--- | :---: |
| **CP-01** | Diagnostico | `GET /api/health` | Verificacion de estado operativo UP y modulos activos | `PASS` |
| **CP-02** | Diagnostico | `GET /api/endpoints` | Catalogo de 14 contratos REST documentados | `PASS` |
| **CP-03** | Clientes | `GET /api/clientes` | Obtencion de la coleccion maestra de titulares | `PASS` |
| **CP-04** | Clientes | `GET /api/clientes/1` | Consulta puntual de titular existente | `PASS` |
| **CP-05** | Clientes | `POST /api/clientes` | Creacion exitosa de titular con cedula valida | `PASS` |
| **CP-06** | Clientes | `POST /api/clientes` | Validacion de rechazo por cedula duplicada (HTTP 409) | `PASS` |
| **CP-07** | Prestamos | `GET /api/prestamos?estado=ACTIVO` | Filtrado de cartera vigente por parametro de consulta | `PASS` |
| **CP-08** | Prestamos | `POST /api/prestamos` | Colocacion comercial con calculo del 20% de interes | `PASS` |
| **CP-09** | Recaudo | `POST /api/pagos` | Asentamiento de recaudo y amortizacion de saldo | `PASS` |
| **CP-10** | Caja | `GET /api/caja/resumen` | Consolidado financiero de arqueo y balance de cartera | `PASS` |
| **CP-11** | Seguridad/JWT | `POST /api/auth/login` | Autenticacion y generacion de token JWT firmado | `PASS` |
| **CP-12** | Seguridad/JWT | `GET /api/auth/me` | Validacion de sesion y permisos con token Bearer | `PASS` |
| **CP-13** | Seguridad/RBAC | `POST /api/prestamos` | Control RBAC: Rechazo de colocacion a rol COBRADOR (403) | `PASS` |
| **CP-14** | Recaudo/GPS | `POST /api/pagos` | Asentamiento con geolocalizacion satelital y enlace a Maps | `PASS` |

**Resultado consolidado:** 14 Casos ejecutados, 14 Aprobados (100% de efectividad).

---

## 10. Informacion Institucional y Creditos

- **Institucion:** Servicio Nacional de Aprendizaje (SENA)
- **Centro de Formacion:** Centro de Operacion y Mantenimiento Minero (COMM) - Regional Cesar
- **Programa de Formacion:** Tecnologia en Analisis y Desarrollo de Software (ADSO)
- **Numero de Ficha:** 3186677
- **Fase del Proyecto:** Fase 4 - Evaluacion
- **Actividades de Aprendizaje:**
  - GA7-220501096-AA2-EV01: Modulo de persistencia relacional con JDBC.
  - GA7-220501096-AA3-EV01: Estandares de codificacion y desarrollo web.
  - GA7-220501096-AA5-EV04: Pruebas automatizadas de servicios web y APIs.
- **Aprendiz Desarrolladora:** Adriana Cristina Villazon Soto (`adrianavillazon@sena.edu.co`)
- **Instructor Tecnico:** Edwin Andres Florez Orejuela
- **Empresa Beneficiaria:** Empresa Llano Grande S.A.S. - Valledupar, Colombia

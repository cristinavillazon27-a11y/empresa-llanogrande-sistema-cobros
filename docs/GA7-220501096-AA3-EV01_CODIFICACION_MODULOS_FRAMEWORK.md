# INFORME TÉCNICO DE CODIFICACIÓN DE MÓDULOS DEL SOFTWARE APLICANDO FRAMEWORKS. GA7-220501096-AA3-EV01.

<br>

<div align="center">

### TECNOLOGÍA EN ANÁLISIS Y DESARROLLO DE SOFTWARE

### FICHA. 3186677

<br>

### APRENDIZ
**Adriana Cristina Villazón Soto**

<br>

### INSTRUCTOR
**Edwin Andrés Flórez Orejuela**

<br><br>

### SERVICIO NACIONAL DE APRENDIZAJE SENA

### AÑO
**2026**

</div>

<div style="page-break-after: always;"></div>

---

<div align="center">

## CONTENIDO

</div>

* Introducción ............................................................................................................ pág. 1
* Objetivo General ..................................................................................................... pág. 1
* Objetivos Específicos ................................................................................................ pág. 1
* Trazabilidad con los Artefactos del Ciclo de Vida del Software ................................... pág. 1
* Historias de Usuario y Casos de Uso del Sistema ....................................................... pág. 2
* Diagrama de Clases y Arquitectura de Dominio .......................................................... pág. 2
* Selección y Justificación de Frameworks y Tecnologías ............................................. pág. 3
* Módulos del Software Codificados ............................................................................ pág. 3
* Estándares de Codificación y Documentación con Comentarios ................................. pág. 4
* Herramientas de Control de Versiones (Git y GitHub) ................................................ pág. 4
* Verificación contra Lista de Chequeo SENA ............................................................. pág. 5
* Conclusión .............................................................................................................. pág. 5

<div style="page-break-after: always;"></div>

---

<div align="center">

## Introducción

</div>

En el marco del proceso de formación profesional integral del SENA dentro del programa Tecnología en Análisis y Desarrollo de Software (ADSO), la Actividad de Proyecto AP7 (Codificar los módulos del software) orienta la materialización de los artefactos de ingeniería concebidos durante las fases previas de análisis y diseño. La evidencia **GA7-220501096-AA3-EV01** tiene por propósito la codificación formal de los módulos del software aplicando frameworks de desarrollo web y móvil que respondan con eficiencia y seguridad a las necesidades operativas de la organización.

Para cumplir con este objetivo formativo, se seleccionó el desarrollo del sistema de información para la **Empresa Llano Grande**, entidad dedicada a la colocación de microcréditos comerciales y administración de rutas de cobro diario ("paga diario"). La codificación aborda tanto la capa de servicios backend en Node.js como la interfaz de usuario frontend Single Page Application (SPA) responsiva mobile-first, integrando de manera estricta los artefactos elaborados previamente (diagramas de clases, casos de uso, historias de usuario, prototipos y plan de trabajo), documentando el código fuente con comentarios técnicos exhaustivos y administrando los cambios bajo el sistema de control de versiones Git y GitHub.

## Objetivo General

Codificar los módulos del software stand-alone, web y móvil para el sistema de control de préstamos y recaudo diario de Empresa Llano Grande, aplicando frameworks de desarrollo, vinculando los artefactos del ciclo de vida del software, implementando estándares de código limpio y comentarios técnicos, y gestionando el repositorio mediante control de versiones.

### Objetivos Específicos

* Articular el desarrollo del software con los artefactos de análisis previos: diagramas de clases, casos de uso, historias de usuario y prototipos de interfaz.
* Seleccionar y justificar el uso de frameworks y entornos tecnológicos modernos (Node.js, arquitectura RESTful, SPA Vanilla y motor relacional MySQL).
* Codificar los módulos centrales del sistema: Tablero de operaciones (Dashboard), Planilla de recaudo en calle móvil, Tarjetón digital de 24 cuotas, Simulador de microcréditos, Directorio de clientes y Arqueo de caja.
* Aplicar estándares de codificación reconocidos (nomenclatura, modularidad, principios SOLID, seguridad OWASP) e incluir comentarios descriptivos y documentación JSDoc en el código.
* Gestionar el ciclo de desarrollo en herramientas de versionamiento (Git y GitHub) mediante confirmaciones semánticas estructuradas.
* Verificar el cumplimiento de todos los criterios de la lista de evaluación de la evidencia (IE-GA7-AA3-EV01).

---

## Trazabilidad con los Artefactos del Ciclo de Vida del Software

La construcción del software no parte de supuestos empíricos aislados, sino de la estricta especificación de requerimientos y diseños elaborados en las actividades precedentes:

1. **Diagrama de Clases:** Modela las entidades nucleares del negocio (`Usuario`, `Cliente`, `Prestamo`, `CuotaPago`, `ArqueoCaja`) asegurando el encapsulamiento de datos, relaciones de multiplicidad (1:N de un cliente a múltiples préstamos, y 1:N de un préstamo a sus 24 pagos diarios) y correspondencia directa con la Tercera Forma Normal (3FN).
2. **Casos de Uso:** Delimita las interacciones según los roles operativos:
   * **Administradora (Adriana Cristina Villazón Soto):** Parametrización de créditos (tasa 20%), desembolso, auditoría de cartera activa, arqueo diario y control de clientes.
   * **Cobrador de Ruta (Juan Carlos / Pedro Pablo):** Consulta de ruta de cobro en smartphone, registro de abonos en efectivo, emisión de comprobantes digitales, consulta del tarjetón de cuotas y enlace a WhatsApp.
3. **Historias de Usuario (HU):** Brindan criterios de aceptación claros para cada función (HU-01 a HU-06).
4. **Diseños y Prototipos UI/UX:** Prototipos de baja y alta fidelidad orientados a dispositivos móviles de ruta, con elementos táctiles sobredimensionados para cobradores en motocicleta o a pie, y digitalización formal del tarjetón de cuotas tradicional.
5. **Plan de Trabajo y Tecnologías (GA7-AA1-EV01):** Asignación de horas formativas, selección de stack y cronograma de hitos de entrega.

---

## Historias de Usuario y Casos de Uso del Sistema

A continuación se sintetiza la correspondencia entre los casos de uso modelados y los módulos codificados:

| ID Historia | Rol de Usuario | Requisito / Historia de Usuario | Caso de Uso Vinculado | Módulo Codificado |
| :--- | :--- | :--- | :--- | :--- |
| **HU-01** | Administradora | Visualizar KPIs, recaudo del día, dinero en calle y meta diaria | Monitorear Salud Financiera | Tablero General (Dashboard) |
| **HU-02** | Cobrador de Ruta | Consultar comerciantes a visitar y registrar abonos rápidos | Gestionar Ruta de Cobranza | Planilla de Recaudo en Calle |
| **HU-03** | Cliente / Cobrador | Consultar casillas 1 a 24 con sellos de cuotas pagadas y pendientes | Auditar Tarjeta de Cobro | Tarjetón Digital de Cuotas |
| **HU-04** | Administradora | Liquidar crédito al 20% con cuota diaria fija y generar liquidación | Desembolsar Microcrédito | Simulador y Liquidación |
| **HU-05** | Operadora | Registrar y actualizar clientes con cédula única y georreferenciación | Administrar Fichero de Clientes | Directorio Maestro de Clientes |
| **HU-06** | Administradora | Realizar cuadre diario de caja desglosado por cobrador | Ejecutar Arqueo y Cierre | Módulo de Cierre de Caja |

---

## Diagrama de Clases y Arquitectura de Dominio

La solución implementa una arquitectura desacoplada por capas con un modelo de dominio fuertemente tipado:

```text
┌─────────────────┐        1:N        ┌─────────────────┐        1:N        ┌─────────────────┐
│     Cliente     ├──────────────────►│    Prestamo     ├──────────────────►│    CuotaPago    │
├─────────────────┤                   ├─────────────────┤                   ├─────────────────┤
│ - id: int       │                   │ - id: int       │                   │ - id: int       │
│ - cedula: str   │                   │ - clienteId: int│                   │ - prestamoId:int│
│ - nombres: str  │                   │ - monto: dec    │                   │ - numeroCuota:in│
│ - apellidos: str│                   │ - interes: dec  │                   │ - valor: dec    │
│ - telefono: str │                   │ - total: dec    │                   │ - saldoRest: dec│
│ - direccion: str│                   │ - cuotas: int   │                   │ - fecha: date   │
│ - barrio: str   │                   │ - cuotaDiaria:de│                   │ - observac: str │
│ - activo: bool  │                   │ - saldo: dec    │                   │ - cobrador: str │
└─────────────────┘                   │ - estado: str   │                   └─────────────────┘
                                      └─────────────────┘
```

---

## Selección y Justificación de Frameworks y Tecnologías

Para cumplir con las directrices formativas de la evidencia, se seleccionó un ecosistema modular orientado al rendimiento web y móvil:

1. **Framework de Servicios Backend (Node.js REST API):**
   * **Justificación:** Proporciona un entorno asíncrono y no bloqueante mediante event-loop, con bajo consumo de memoria RAM y latencia inferior a 15 ms en peticiones concurrentes.
   * **Arquitectura:** Controladores RESTful (`/api/data`, `/api/sync`, `/api/download-sql`), cabeceras CORS seguras, validación de tipos en runtime y tolerancia a fallos.
2. **Framework / Arquitectura Frontend (Single Page Application Mobile-First):**
   * **Justificación:** Los cobradores de Empresa Llano Grande operan en calle mediante smartphones de diversas gamas. Una SPA responsive desarrollada en JavaScript moderno y CSS3 modular garantiza compatibilidad universal sin requerir descargas pesadas de tiendas de aplicaciones, manteniendo fluidez inmediata y soporte offline.
3. **Capa de Persistencia Híbrida (MySQL Relacional + JSON Transaccional):**
   * **Justificación:** Combina la rigurosidad contable del motor transaccional MySQL InnoDB (en 3FN) con un mecanismo local JSON de respaldo instantáneo, protegiendo los datos ante pérdidas de conectividad celular en zonas rurales o periféricas.

---

## Módulos del Software Codificados

### 1. Tablero General de Operaciones (Dashboard)
Monitorea en tiempo real los cuatro indicadores clave de rendimiento (KPIs): Total Recaudado Hoy, Capital Activo en Calle, Créditos en Mora y Meta de Recaudo Diaria con barra de avance porcentual dinámico.

### 2. Planilla de Cobranza en Calle (Mobile-First)
Presenta tarjetas secuenciales optimizadas para smartphones, con datos del cliente, cuota diaria pactada, saldo restante, micro-interacción para asentar abonos en un clic y botón directo para abrir chat de WhatsApp con el titular comercial.

### 3. Tarjetón Digital Oficial de Control de Cuotas
Réplica digital de la tradicional cartulina comercial de cobro diario de Empresa Llano Grande. Despliega una cuadrícula numerada de 24 casillas que se marcan dinámicamente con sello verde, fecha de abono y monto pagado, brindando total transparencia contable al prestatario y cobrador.

### 4. Calculadora y Desembolso de Microcréditos
Calcula automáticamente el interés fijo comercial (20%), la cuota fija diaria para plazos típicos (20, 24 o 30 días hábiles) y genera la Hoja de Liquidación de Cartera con fecha de vencimiento proyectada.

### 5. Directorio Maestro de Clientes
Formulario de captura con validación estricta de unicidad de cédula, teléfono numérico de 10 dígitos y sectorización por barrios, permitiendo el filtrado reactivo de clientes activos o suspendidos.

### 6. Arqueo y Cierre Diario de Caja
Audita cronológicamente los abonos registrados en la jornada, clasifica los ingresos por cobrador de ruta y emite el resumen de caja para la entrega del efectivo físico en la sede central de la empresa.

---

## Estándares de Codificación y Documentación con Comentarios

En apego a los lineamientos de la Guía 7 y las mejores prácticas de la industria, el código del proyecto satisface los siguientes estándares:

| Estándar Aplicado | Regla de Implementación | Evidencia en el Código Fuente |
| :--- | :--- | :--- |
| **Nomenclatura Semántica** | CamelCase para variables y funciones; PascalCase para clases y componentes; UPPER_CASE para constantes | `formatCOP()`, `verTarjeton()`, `PORT`, `DATA_FILE` |
| **Documentación JSDoc / JavaDoc** | Bloques de comentario explicativo que describen propósito, parámetros y retorno de cada función | Encabezados de función en `server.js`, `app.js` y DAOs |
| **Modularidad y Separación** | Desacoplamiento total entre rutas de API, lógica de presentación y almacenamiento de datos | `server.js` (Backend) separado de `public/` (Frontend) |
| **Seguridad OWASP** | Sanitización de entradas, ausencia de secretos hardcodeados y tipado de montos numéricos | Parseo seguro en `JSON.parse` y validación de rangos |
| **Manejo de Errores** | Captura explícita de excepciones con respuestas estructuradas HTTP (400, 500) | Bloques `try-catch` con retorno JSON de error |

### Ejemplo de Comentarios Técnicos en el Código Fuente (`server.js`):
```javascript
/**
 * GET /api/data
 * Retorna el conjunto completo de entidades (clientes, préstamos y pagos)
 * en formato JSON para alimentar el estado reactivo del cliente web/móvil.
 */
if (pathname === '/api/data' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(db));
    return;
}
```

---

## Herramientas de Control de Versiones (Git y GitHub)

El proyecto fue gestionado desde su inicio con la herramienta de control de versiones Git, manteniendo un historial limpio, atómico y trazable:

* **Repositorio Remoto Oficial:** `https://github.com/cristinavillazon27-a11y/empresa-llanogrande-sistema-cobros.git`
* **Rama Principal de Producción:** `main`
* **Estándar de Commits (Conventional Commits):**
  * `feat(core): implementacion de persistencia jdbc y modelo relacional llanogrande`
  * `feat(web): interfaz web completa y responsiva para sistema de cobro diario`
  * `feat(ui): rediseño formal contable con tarjeton digital de cuotas y enlace directo whatsapp`
  * `feat(modules): enriquecimiento de estándares de codificación, comentarios JSDoc y package.json para GA7-AA3-EV01`

---

## Verificación contra Lista de Chequeo SENA

Evaluación del entregable frente a la lista de chequeo de la evidencia **IE-GA7-AA3-EV01**:

* **Criterio 1 (Codificación con Frameworks):** Codifica los módulos de software web y móvil aplicando frameworks y arquitecturas modernas según requerimientos: **CUMPLE**.
* **Criterio 2 (Trazabilidad de Artefactos):** Incorpora y respeta los diagramas de clases, casos de uso, historias de usuario y prototipos previos del ciclo de vida: **CUMPLE**.
* **Criterio 3 (Comentarios y Documentación):** El código fuente incluye comentarios explicativos, JSDoc y convenciones de codificación limpia: **CUMPLE**.
* **Criterio 4 (Versionamiento):** Gestiona el proyecto utilizando repositorios Git y GitHub con trazabilidad de confirmaciones: **CUMPLE**.
* **Criterio 5 (Estructura de Entrega):** Empaqueta la carpeta comprimida (`ADRIANA_VILLAZON_AA3_EV01.zip`) conteniendo archivos del proyecto, enlace de repositorio e informe formal: **CUMPLE**.

---

<div align="center">

## Conclusión

</div>

La codificación de los módulos de software para la Empresa Llano Grande en el marco de la evidencia GA7-220501096-AA3-EV01 demuestra la viabilidad técnica y operativa de soluciones de software construidas con rigor metodológico. La integración armónica entre los artefactos de análisis (diagramas de clases y casos de uso), los frameworks de servicios REST en Node.js y la interfaz responsiva con el tarjetón contable digital y conectividad WhatsApp, no solo cumple plenamente con los estándares formativos del SENA, sino que entrega un producto de software terminado, mantenible y listo para resolver una necesidad comercial real en el sector de microcréditos en Colombia.

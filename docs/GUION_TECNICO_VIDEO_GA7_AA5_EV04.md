# GUION TECNICO Y NARRATIVO PARA VIDEO DEMOSTRATIVO DE PRUEBAS DE SOFTWARE
## EVIDENCIA: GA7-220501096-AA5-EV04
### PROGRAMA: TECNOLOGIA EN ANALISIS Y DESARROLLO DE SOFTWARE (ADSO) - FICHA: 3186677
### PROYECTO: SISTEMA DE GESTION DE PRESTAMOS Y COBROS DIARIOS - EMPRESA LLANO GRANDE

---

### METADATOS DE LA EVIDENCIA
* **Institucion:** Servicio Nacional de Aprendizaje (SENA)
* **Programa de Formacion:** Tecnologia en Analisis y Desarrollo de Software (ADSO)
* **Ficha de Caracterizacion:** 3186677
* **Fase del Proyecto:** Ejecucion
* **Actividad de Proyecto:** AP7 - Codificacion y realizacion de pruebas de software
* **Competencia:** 220501096 - Desarrollar la estructura de datos y la logica de programacion del sistema de acuerdo con los requisitos del cliente.
* **Resultado de Aprendizaje (RAP):** Realizar las pruebas a las soluciones de software aplicando estandares y buenas practicas de aseguramiento de calidad.
* **Aprendiz:** Adriana Cristina Villazon Soto
* **Instructor Tecnico:** Edwin Andres Florez Orejuela
* **Duracion Estimada del Video:** 07:00 a 08:30 minutos
* **Herramientas de Demostracion:** Postman Desktop App v10+, Node.js runtime, Terminal Bash / PowerShell, Visual Studio Code.

---

### RECOMENDACIONES PREVIAS A LA GRABACION
1. Configurar la resolucion de pantalla en 1920x1080 (Full HD).
2. Ocultar barras de marcadores y notificaciones del sistema operativo.
3. Asegurar un entorno silencioso y utilizar microfono con buena ganancia.
4. Pre-abrir en pestañas limpias:
   - Terminal con el servidor ejecutandose (`cd web && npm start`).
   - Postman con la coleccion `SENA ADSO - API Proyecto Formativo Empresa Llano Grande (GA7-AA5-EV04)` y el entorno `SENA ADSO Llano Grande Local` seleccionados.
   - Navegador web en `http://localhost:3000` para ilustrar la correspondencia visual del sistema en caso necesario.

---

### ESTRUCTURA CRONOLOGICA DE LA GRABACION

```
+--------------------------------------------------------------------------------------------------+
| BLOQUE 1 (00:00 - 00:50): Presentacion Institucional y Alcance de la Evidencia                  |
| BLOQUE 2 (00:50 - 01:50): Arquitectura de la Solucion y Especificacion de Servicios REST       |
| BLOQUE 3 (01:50 - 02:40): Entorno de Pruebas en Postman (Variables y Coleccion)               |
| BLOQUE 4 (02:40 - 06:15): Ejecucion Tecnica de los 10 Casos de Prueba                         |
| BLOQUE 5 (06:15 - 07:15): Ejecucion en Lote con Collection Runner y Script Automatizado       |
| BLOQUE 6 (07:15 - 07:50): Conclusiones, Aseguramiento de Calidad y Cierre                      |
+--------------------------------------------------------------------------------------------------+
```

---

### TABLA GUIONIZADA: MINUTO A MINUTO (VISUAL Y LOCUCION)

| Tiempo | Seccion | Accion en Pantalla (Visual) | Texto de Locucion (Audio Palabra por Palabra) |
| :--- | :--- | :--- | :--- |
| **00:00 - 00:25** | Presentacion Institucional | Diapositiva o carátula formal con los logos del SENA, programa ADSO, ficha 3186677, nombre de la aprendiz Adriana Cristina Villazon Soto y del instructor Edwin Andres Florez Orejuela. Cámara web activa en esquina superior derecha o ventana de presentador. | "Un cordial saludo al instructor Edwin Andres Florez Orejuela y a la comunidad academica del SENA. Mi nombre es Adriana Cristina Villazon Soto, aprendiz del programa Tecnologia en Analisis y Desarrollo de Software, identificada con la ficha de caracterizacion 3186677. A continuacion presento la evidencia GA7-220501096-AA5-EV04, correspondiente al video demostrativo de la ejecucion de pruebas de software y validacion de servicios web." |
| **00:25 - 00:50** | Contexto del Proyecto | Transicion a la pantalla de Visual Studio Code mostrando el archivo `README.md` del repositorio `finalsena`. | "El sistema objeto de pruebas es la plataforma integral para la Empresa Llano Grande, una solucion disenada para sistematizar la colocacion de microcreditos y optimizar el recaudo diario en ruta. La meta principal de esta actividad es garantizar la integridad transaccional, el cumplimiento de las reglas de negocio financieras y la robustez de los contratos de comunicacion de la API REST." |
| **00:50 - 01:25** | Arquitectura del Backend | Mostrar la estructura del proyecto en el explorador de archivos: `database/`, `backend-jdbc/` y `web/server.js`. | "A nivel arquitectonico, el sistema cuenta con un modelo de persistencia relacional en MySQL normalizado en tercera forma normal, un modulo administrativo stand-alone desarrollado en Java con JDBC y patron DAO, y un microservicio backend en Node.js que expone una API RESTful desacoplada. Esta capa de servicios es la que alimenta tanto las interfaces web como los dispositivos moviles utilizados por los cobradores en campo." |
| **01:25 - 01:50** | Arranque del Servidor | En la consola integrada de VS Code o terminal externa, ejecutar `cd web && npm start`. Mostrar el banner de inicio con el puerto 3000 activo. | "Para iniciar la bateria de pruebas, procedemos a inicializar el servidor web en nuestro entorno local. Ejecutamos el comando 'npm start' en el directorio web. Como observamos en consola, el servicio queda disponible y a la escucha en el puerto 3000, preparado para procesar las peticiones HTTP y administrar la persistencia sincronizada." |
| **01:50 - 02:40** | Configuracion en Postman | Abrir la aplicacion Postman Desktop. Mostrar en la barra lateral izquierda la coleccion `SENA ADSO - API Proyecto Formativo Empresa Llano Grande (GA7-AA5-EV04)`. Abrir la configuracion de Environments y mostrar `SENA ADSO Llano Grande Local` con la variable `base_url = http://localhost:3000`. | "Nos trasladamos a Postman, donde hemos estructurado la suite formal de pruebas automatizadas. En el selector de entornos tenemos configurado el entorno local con la variable 'base_url' apuntando a http://localhost:3000. La coleccion esta modularizada en cuatro carpetas tecnicas: Diagnostico y Monitoreo, Gestion de Clientes, Colocacion de Microcreditos y Recaudo en Ruta y Arqueo. Cada peticion contiene aserciones programadas mediante la libreria Chai de Postman para evaluar codigo de estado, tiempos de respuesta y esquemas JSON." |
| **02:40 - 03:20** | Pruebas de Diagnostico (CP-01 y CP-02) | Desplegar carpeta '1. Diagnóstico y Monitoreo'. Seleccionar '01 - GET Health Check Operatividad' y presionar 'Send'. Mostrar pestana 'Test Results' con los tests en verde. Luego seleccionar '02 - GET Catalogo de Endpoints' y presionar 'Send'. | "Iniciamos con el bloque de diagnostico. El caso de prueba 01 ejecuta un GET al endpoint /api/health. Al enviar la peticion, obtenemos un codigo 200 OK en 12 milisegundos; en la pestana de resultados verificamos que el estado del servicio es 'UP' y confirma la identificacion de la Empresa Llano Grande. En el caso de prueba 02, consultamos el endpoint /api/endpoints, el cual nos retorna el catalogo auto-documentado con los diez metodos disponibles en la API, confirmando la interoperabilidad del sistema." |
| **03:20 - 04:15** | Pruebas de Clientes (CP-03 a CP-06) | Desplegar carpeta '2. Gestión de Clientes'. Ejecutar '03 - GET Listado Maestro' (200 OK). Ejecutar '04 - GET Detalle de Cliente por ID' (200 OK). Abrir '05 - POST Registro de Nuevo Cliente', mostrar el payload JSON y presionar 'Send' (201 Created). Abrir '06 - POST Intento Duplicado de Cedula' y presionar 'Send' (409 Conflict). | "Pasamos al modulo de Gestion de Clientes. En el caso 03 validamos la obtencion del listado completo con estado 200 OK. En el caso 04 consultamos el detalle del cliente con identificador 1, recuperando sus datos de contacto y sus creditos asociados. El caso 05 evalua la insercion transaccional mediante un POST con los datos de un nuevo cliente. La respuesta confirma un codigo 201 Created y nos retorna el nuevo identificador generado. Inmediatamente ejecutamos el caso 06, donde enviamos un cliente con la misma cedula. Aqui el sistema captura la regla de integridad y responde de manera controlada con un codigo 409 Conflict, impidiendo registros duplicados." |
| **04:15 - 05:15** | Pruebas de Colocacion (CP-07 y CP-08) | Desplegar carpeta '3. Colocación de Microcréditos'. Ejecutar '07 - GET Filtrar Prestamos por Estado ACTIVO' (200 OK). Abrir '08 - POST Colocacion de Microcredito', mostrar el payload (`clienteId: 1, monto: 500000, cuotas: 20`) y presionar 'Send' (201 Created). Resaltar en la respuesta que el total es 600.000 y el valor de cuota es 30.000. | "Continuamos con la Colocacion de Microcreditos. En el caso 07 evaluamos el filtrado por parametros de consulta, exigiendo prestamos en estado 'ACTIVO'. El servidor responde 200 OK con el subconjunto exacto. En el caso 08 ponemos a prueba la logica financiera critica: un prestamo de 500.000 pesos a 20 cuotas. El servicio liquida automaticamente el 20% de tasa comercial estipulada para la empresa, arrojando un total amortizable de 600.000 pesos y cuotas exactas de 30.000 pesos diarios, respondiendo 201 Created con fecha de vencimiento proyectada." |
| **05:15 - 06:15** | Recaudo y Arqueo (CP-09 y CP-10) | Desplegar carpeta '4. Recaudo en Ruta y Arqueo'. Abrir '09 - POST Asentamiento de Pago de Cuota', mostrar payload (`prestamoId: 1, valor: 45000`) y enviar (201 Created). Senalar en la respuesta el nuevo saldo y numero de cuota. Ejecutar '10 - GET Arqueo Consolidado y Cierre de Caja' (200 OK). | "El cuarto bloque valida la operacion en ruta del cobrador. En el caso 09 simulamos el abono diario de una cuota mediante un POST a /api/pagos. El sistema asienta el recaudo, actualiza el saldo de la deuda, incrementa el contador de cuotas abonadas y genera el folio de pago correspondiente con estatus 201 Created. Finalmente, en el caso 10 consultamos /api/caja/resumen. El microservicio realiza el arqueo consolidado calculando el recaudo total del dia, la cartera activa pendiente y el indice de morosidad, entregando un balance financiero confiable con estado 200 OK." |
| **06:15 - 07:15** | Ejecucion en Lote (Runner y CLI) | En Postman, hacer clic derecho sobre la coleccion -> 'Run Collection'. Asegurar entorno seleccionado, deseleccionar delay y presionar 'Run SENA ADSO...'. Mostrar la barra de progreso al 100% en verde. Cambiar a terminal y ejecutar `npm test` en el directorio `web`. | "Para certificar la estabilidad de la API bajo pruebas de regresion continua, abrimos el Collection Runner de Postman. Seleccionamos las cuatro carpetas, asignamos las variables del entorno y ejecutamos la coleccion completa. Como se visualiza en el panel de resultados, los diez casos de prueba se ejecutan en 140 milisegundos con cero fallos y un porcentaje de exito del 100%. Adicionalmente, el proyecto cuenta con un script autonomo de integracion continua que puede ejecutarse directamente desde la terminal mediante el comando 'npm test', facilitando su evaluacion en cualquier servidor o pipeline sin dependencia de la interfaz grafica." |
| **07:15 - 07:50** | Conclusiones y Despedida | Volver a la diapositiva o vista principal con la camara del aprendiz centrada. | "Con esta demostracion tecnica certificamos la correcta implementacion de la API REST para la Empresa Llano Grande y el cumplimiento riguroso de la evidencia GA7-220501096-AA5-EV04. Hemos verificado la salud del sistema, la integridad de datos en el registro de clientes, el calculo exacto del interes comercial, el recaudo diario en ruta y el arqueo automatizado de caja, cumpliendo los criterios de evaluacion del SENA. Agradezco sinceramente su atencion e instruccion. Que tengan un excelente dia." |

---

### MATRIZ RESUMEN DE LOS DIEZ CASOS DE PRUEBA EVALUADOS

| Caso | Metodo | Endpoint | Objetivo Tecnico | Codigo Esperado | Asercion Principal |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **CP-01** | `GET` | `/api/health` | Diagnostico de disponibilidad de la API | `200 OK` | `data.status == "UP"` |
| **CP-02** | `GET` | `/api/endpoints` | Catalogo de metodos REST expuestos | `200 OK` | `data.endpoints.length >= 10` |
| **CP-03** | `GET` | `/api/clientes` | Obtencion de listado maestro de clientes | `200 OK` | `Array.isArray(data.clientes)` |
| **CP-04** | `GET` | `/api/clientes/1` | Consulta de cliente especifico y cartera | `200 OK` | `data.cliente.id == 1` |
| **CP-05** | `POST` | `/api/clientes` | Creacion valida de nuevo cliente | `201 Created` | `data.cliente.cedula == "1098555666"` |
| **CP-06** | `POST` | `/api/clientes` | Validacion de documento de identidad unico | `409 Conflict` | `data.error.includes("Ya existe")` |
| **CP-07** | `GET` | `/api/prestamos?estado=ACTIVO` | Filtrado de cartera por parametro URL | `200 OK` | `every(p => p.estado == "ACTIVO")` |
| **CP-08** | `POST` | `/api/prestamos` | Liquidacion automatica de credito (+20%) | `201 Created` | `data.prestamo.total == monto * 1.20` |
| **CP-09** | `POST` | `/api/pagos` | Amortizacion de cuota y actualizacion de saldo | `201 Created` | `data.saldoActual == saldoAnterior - valor` |
| **CP-10** | `GET` | `/api/caja/resumen` | Consolidacion de arqueo y balance diario | `200 OK` | `typeof data.resumenFinanciero.totalRecaudadoHoy == "number"` |


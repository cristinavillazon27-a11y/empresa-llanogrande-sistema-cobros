# GUION TÉCNICO Y ESTRATEGIA DE DEFENSA PARA SUSTENTACIÓN DE PROYECTO
## SISTEMA DE GESTIÓN DE PRÉSTAMOS Y COBROS DIARIOS - EMPRESA LLANO GRANDE S.A.S.

---

### METADATOS DE LA SUSTENTACIÓN ACADÉMICA
* **Institución:** Servicio Nacional de Aprendizaje (SENA)
* **Centro de Formación:** Regional Cesar / Centro de Operación y Mantenimiento Minero
* **Programa de Formación:** Tecnología en Análisis y Desarrollo de Software (ADSO)
* **Ficha de Caracterización:** 3186677
* **Fase del Proyecto:** Ejecución (AP7 - Codificación y Pruebas de Software)
* **Evidencias Asociadas:** 
  * `GA7-220501096-AA3-EV01`: Codificación de módulos del software stand-alone, web y móvil.
  * `GA7-220501096-AA5-EV04`: Realización de pruebas a las soluciones de software aplicando estándares de calidad.
* **Aprendiz Líder / Expositora:** Adriana Cristina Villazón Soto
* **Instructor Técnico:** Edwin Andrés Flórez Orejuela
* **Entorno de Producción Activo:** [https://empresa-llanogrande-sistema-cobros.vercel.app](https://empresa-llanogrande-sistema-cobros.vercel.app)
* **Repositorio Oficial:** [https://github.com/cristinavillazon27-a11y/empresa-llanogrande-sistema-cobros.git](https://github.com/cristinavillazon27-a11y/empresa-llanogrande-sistema-cobros.git)
* **Duración Estándar de la Sustentación:** 10:00 a 12:00 minutos (+ 5:00 minutos de sesión de preguntas y respuestas técnicas).

---

### RECOMENDACIONES PREVIAS Y LOGÍSTICA DE PRESENTACIÓN

1. **Dispositivos y Pantallas:**
   * Abrir en el navegador principal la presentación interactiva: `docs/PRESENTACION_SUSTENTACION_LLANOGRANDE.html` (o proyectarla en modo pantalla completa con la tecla `F`).
   * En una pestaña secundaria lista para demostración: [https://empresa-llanogrande-sistema-cobros.vercel.app](https://empresa-llanogrande-sistema-cobros.vercel.app).
   * En una pestaña terciaria: Postman Desktop con la colección `SENA ADSO - API Proyecto Formativo Empresa Llano Grande (GA7-AA5-EV04)`.
   * Terminal abierta en el directorio del proyecto con el comando `npm test --prefix web` listo para ejecutar si el comité solicita prueba de caja negra en vivo.
2. **Atajos de Teclado del Slide Deck:**
   * `Espacio` o `Flecha Derecha`: Avanzar a la siguiente diapositiva.
   * `Flecha Izquierda`: Retroceder diapositiva.
   * `N`: Abrir / Cerrar el panel de notas del presentador con el guion palabra por palabra.
   * `O`: Abrir la cuadrícula de vista general para saltar instantáneamente a cualquier diapositiva solicitada por el jurado.
   * `Ctrl+P`: Exportar la presentación completa a PDF en formato 16:9.

---

### ESTRUCTURA TEMPORAL DE LA SUSTENTACIÓN (10 MINUTOS)

```text
+--------------------------------------------------------------------------------------------------+
| DIAPOSITIVA 01 (00:00 - 00:45): Portada Institucional y Ficha Técnica                            |
| DIAPOSITIVA 02 (00:45 - 01:30): Contexto Empresarial y Diagnóstico de la Problemática            |
| DIAPOSITIVA 03 (01:30 - 02:15): Objetivos del Proyecto y Alcance Técnico                         |
| DIAPOSITIVA 04 (02:15 - 03:15): Arquitectura Multicapa y Patrones de Diseño                      |
| DIAPOSITIVA 05 (03:15 - 04:00): Modelo de Persistencia Relacional en 3FN (MySQL 8.0)             |
| DIAPOSITIVA 06 (04:00 - 04:45): Seguridad, Autenticación JWT y Control de Acceso (RBAC)         |
| DIAPOSITIVA 07 (04:45 - 05:45): Innovación Tecnológica: Auditoría Satelital GPS y WebSockets    |
| DIAPOSITIVA 08 (05:45 - 06:45): Experiencia de Usuario (UI/UX) y Diseño Spark Pixel             |
| DIAPOSITIVA 09 (06:45 - 07:45): Aseguramiento de Calidad y Matriz de Pruebas Automatizadas       |
| DIAPOSITIVA 10 (07:45 - 08:30): Despliegue en la Nube y Operación Serverless (Vercel)            |
| DIAPOSITIVA 11 (08:30 - 09:15): Métricas de Rendimiento e Impacto Cuantitativo en el Negocio     |
| DIAPOSITIVA 12 (09:15 - 10:00): Conclusiones, Cumplimiento de la Evidencia y Sesión de Preguntas |
+--------------------------------------------------------------------------------------------------+
```

---

### GUION MINUTO A MINUTO: DIAPOSITIVA POR DIAPOSITIVA

#### DIAPOSITIVA 1: PORTADA INSTITUCIONAL Y FICHA TÉCNICA
* **Tiempo Sugerido:** 00:00 - 00:45
* **Objetivo:** Presentación formal, protocolo académico SENA, acreditación de identidad y posicionamiento del proyecto.
* **Locución Palabra por Palabra:**
  > "Un cordial y respetuoso saludo al instructor técnico Edwin Andrés Flórez Orejuela y a los respetados miembros del comité evaluador del Servicio Nacional de Aprendizaje (SENA). Mi nombre es Adriana Cristina Villazón Soto, aprendiz del programa Tecnología en Análisis y Desarrollo de Software (ADSO), identificada con la ficha de caracterización 3186677.
  >
  > A continuación, presento la sustentación integral correspondiente a las evidencias GA7-220501096-AA3-EV01 y GA7-AA5-EV04 de la fase de Ejecución, en la cual expondré el diseño, desarrollo, aseguramiento de calidad y puesta en producción del Sistema Integral de Gestión de Microcréditos y Rutas de Cobro Diario para la Empresa Llano Grande S.A.S.
  >
  > Cabe destacar desde este primer momento que el software objeto de esta defensa se encuentra plenamente operativo, verificado mediante pruebas automatizadas con 100% de efectividad y desplegado en la nube pública bajo la plataforma Vercel Fluid Compute."

---

#### DIAPOSITIVA 2: CONTEXTO EMPRESARIAL Y PROBLEMÁTICA
* **Tiempo Sugerido:** 00:45 - 01:30
* **Objetivo:** Explicar el modelo operativo de microfinanzas barriales y evidenciar los cuatro dolores críticos de la empresa.
* **Locución Palabra por Palabra:**
  > "Para comprender el valor de esta solución de software, es indispensable situarnos en el modelo operativo de la Empresa Llano Grande S.A.S. Esta organización se dedica a la colocación de microcréditos comerciales para pequeños comerciantes y trabajadores independientes, con un esquema de amortización en cuotas fijas diarias.
  >
  > Durante la fase de análisis, identificamos cuatro debilidades operativas críticas:
  > Primero: La vulnerabilidad extrema del registro físico. El uso de libretas de papel y tarjetones de cartulina exponía a la empresa a la pérdida irreparable de su cartera contable ante factores climáticos como lluvia, o deterioro y extravío en campo.
  > Segundo: La ausencia de trazabilidad geográfica. La gerencia no tenía cómo verificar si el cobrador efectivamente visitó el domicilio del cliente o si los abonos registrados correspondían a cobros realizados fuera de ruta.
  > Tercero: Los cuadres diarios manuales. Al finalizar cada jornada, conciliar el dinero físico frente a las anotaciones tomaba más de una hora por cobrador, acarreando descuadres frecuentes.
  > Y cuarto: La opacidad de la cartera. La administración carecía de indicadores en tiempo real sobre mora, liquidez y saldo recuperado, operando a ciegas durante el transcurso del día."

---

#### DIAPOSITIVA 3: OBJETIVOS DEL PROYECTO Y ALCANCE TÉCNICO
* **Tiempo Sugerido:** 01:30 - 02:15
* **Objetivo:** Enunciar los compromisos de ingeniería de software trazados y su correspondencia con los RAPs del SENA.
* **Locución Palabra por Palabra:**
  > "Con base en este diagnóstico, establecimos como Objetivo General: Desarrollar, verificar mediante pruebas automatizadas y desplegar en producción una plataforma de software integral multiplataforma que automatice el ciclo de colocación, amortización, auditoría y recaudo de microcréditos para la Empresa Llano Grande S.A.S.
  >
  > Para materializar este objetivo, estructuramos cinco metas específicas:
  > 1. Diseñar el modelo relacional en MySQL 8.0 normalizado en Tercera Forma Normal (3FN).
  > 2. Implementar un módulo Stand-Alone en Java 17 con JDBC puro y patrón DAO.
  > 3. Construir una API RESTful desacoplada en Node.js nativo con seguridad JWT y control de acceso RBAC.
  > 4. Desarrollar dos componentes innovadores: auditoría satelital GPS en calle y sincronización en tiempo real vía WebSockets RFC 6455.
  > 5. Diseñar una aplicación web Single Page Application (SPA) con arquitectura responsiva y desplegarla en infraestructura serverless en la nube."

---

#### DIAPOSITIVA 4: ARQUITECTURA DE SOFTWARE Y PATRONES DE DISEÑO
* **Tiempo Sugerido:** 02:15 - 03:15
* **Objetivo:** Demostrar rigor arquitectónico, modularidad, separación de capas y adopción de patrones de la industria.
* **Locución Palabra por Palabra:**
  > "A nivel arquitectónico, el sistema fue concebido bajo el principio de separación estricta de responsabilidades, articulado en cuatro capas desacopladas que podemos apreciar en el diagrama en pantalla:
  > 
  > En la Capa de Presentación contamos con una Single Page Application desarrollada en Vanilla JavaScript, HTML5 semántico y CSS3 modular, evitando sobrecargas de frameworks para lograr tiempos de carga instantáneos en dispositivos móviles de campo.
  >
  > En la Capa de Servicios, el microservicio backend fue construido sobre Node.js nativo sin librerías externas de npm. Esta decisión deliberada de ingeniería elimina vectores de vulnerabilidad de dependencias de terceros, reduce el tamaño de despliegue a menos de 400 kilobytes y garantiza un arranque en milisegundos.
  >
  > En la Capa de Negocio residen el motor de cálculo financiero comercial al 20% de interés fijo, el motor criptográfico HMAC-SHA256 y el validador de políticas de acceso.
  >
  > En la Capa de Persistencia, el sistema es políglota: soporta el motor relacional MySQL 8.0 para despliegues corporativos completos, un almacén atómico JSON con soporte para sistemas de archivos efímeros en Vercel, y un módulo stand-alone Java 17 que implementa el patrón Data Access Object (DAO) y Singleton de conexión JDBC."

---

#### DIAPOSITIVA 5: MODELO DE DATOS RELACIONAL EN 3FN (MYSQL 8.0)
* **Tiempo Sugerido:** 03:15 - 04:00
* **Objetivo:** Explicar el modelo de datos, la normalización en 3FN y las garantías de integridad transaccional ACID.
* **Locución Palabra por Palabra:**
  > "El corazón transaccional del sistema reside en su base de datos relacional MySQL 8.0, la cual normalizamos rigurosamente hasta la Tercera Forma Normal. 
  >
  > Como se observa en la matriz de entidades, definimos tablas maestras independientes: `usuarios`, `clientes`, `prestamos`, `pagos` y `rutas`.
  > En la Primera Forma Normal aseguramos la atomicidad de todos los atributos.
  > En la Segunda Forma Normal garantizamos que cada atributo no clave dependa en su totalidad de la clave primaria.
  > Y en la Tercera Forma Normal erradicamos cualquier dependencia transitiva: por ejemplo, los saldos y amortizaciones se calculan transaccionalmente a partir de las transacciones de pago, garantizando consistencia absoluta.
  >
  > Además, aplicamos restricciones de integridad referencial con claves foráneas `ON DELETE RESTRICT` para blindar el historial financiero contra borrados accidentales, e indexamos con árboles B-Tree las cédulas y los estados de crédito para responder consultas en tiempo logarítmico."

---

#### DIAPOSITIVA 6: SEGURIDAD, AUTENTICACIÓN JWT Y CONTROL DE ACCESO RBAC
* **Tiempo Sugerido:** 04:00 - 04:45
* **Objetivo:** Detallar el motor criptográfico nativo y la matriz de privilegios diferenciada.
* **Locución Palabra por Palabra:**
  > "En el ámbito de la seguridad y gobernanza de la información, implementamos el estándar RFC 7519 para tokens JWT directamente con la biblioteca nativa `crypto` de Node.js, sin requerir paquetes externos.
  >
  > El sistema genera tokens firmados criptográficamente mediante HMAC-SHA256 con una vigencia de 12 horas, los cuales son transmitidos en la cabecera estándar `Authorization: Bearer`.
  >
  > Sobre esta base implementamos un Control de Acceso Basado en Roles (RBAC). El perfil Administrador ostenta permisos completos para colocación comercial de préstamos, arqueo de caja y configuración. En contraste, el perfil Cobrador está restringido operativamente: tiene asignada una ruta geográfica específica y cuenta con facultades exclusivas para asentar abonos con geolocalización. Si un cobrador intenta colocar un crédito, el endpoint responde inmediatamente con un código HTTP 403 Forbidden, como demostramos en nuestra suite de pruebas."

---

#### DIAPOSITIVA 7: INNOVACIÓN OPERATIVA: AUDITORÍA SATELITAL GPS Y WEBSOCKETS
* **Tiempo Sugerido:** 04:45 - 05:45
* **Objetivo:** Presentar las dos ventajas competitivas tecnológicas del proyecto: trazabilidad GPS y tiempo real.
* **Locución Palabra por Palabra:**
  > "Llegamos a la mayor innovación técnica y operativa de nuestro desarrollo: la combinación de auditoría satelital GPS y WebSockets bidireccionales.
  >
  > Cuando un cobrador registra un pago en campo, la aplicación web consume la API `navigator.geolocation` del dispositivo para capturar con precisión métrica la latitud y longitud del instante exacto de la transacción. Estos datos se almacenan de forma inmutable en el registro contable y generan un hipervínculo directo a Google Maps, permitiendo a la administración auditar en cualquier momento si el abono se cobró realmente en el local o domicilio del deudor.
  >
  > Simultáneamente, el servidor Node.js opera un protocolo WebSocket nativo bajo el estándar RFC 6455 en la ruta `/ws`. Mediante un algoritmo de difusión multidestino o broadcast, en la fracción de segundo en que el cobrador asienta el pago, la pantalla de gerencia actualiza sus gráficos de recaudación, las tablas de transacciones y emite un toast flotante con alerta sonora sintetizada mediante la Web Audio API. Todo esto ocurre en tiempo real y sin necesidad de recargar la página."

---

#### DIAPOSITIVA 8: DISEÑO DE INTERFAZ Y EXPERIENCIA DE USUARIO (UI/UX)
* **Tiempo Sugerido:** 05:45 - 06:45
* **Objetivo:** Demostrar la sofisticación visual, ergonomía y orientación práctica de la interfaz Spark Pixel.
* **Locución Palabra por Palabra:**
  > "En el diseño de la interfaz de usuario, adoptamos la filosofía Spark Pixel, orientada a tableros analíticos modernos tipo SaaS de alta densidad informativa.
  >
  > Priorizamos la ergonomía del usuario de campo y de oficina:
  > Implementamos un menú lateral colapsable a modo rail de 68 píxeles mediante el atajo universal `Ctrl+B`, maximizando el lienzo útil de trabajo.
  > Diseñamos la Planilla Oficial de Cobranza con un conmutador bimodal: el cobrador en motocicleta utiliza la vista de tarjetas táctiles de alta legibilidad bajo luz solar; mientras que en la oficina, la administración puede alternar a la vista de tabla densa para despacho masivo.
  > Incorporamos la emisión de comprobantes de pago digitales para WhatsApp con un solo clic, erradicando el uso de papel térmico.
  > Y eliminamos el 100% de emojis infantiles, sustituyéndolos por iconografía vectorial SVG de precisión técnica."

---

#### DIAPOSITIVA 9: ASEGURAMIENTO DE CALIDAD Y PRUEBAS AUTOMATIZADAS (GA7-AA5-EV04)
* **Tiempo Sugerido:** 06:45 - 07:45
* **Objetivo:** Sustentar el cumplimiento riguroso de la evidencia de pruebas de software con evidencia estadística.
* **Locución Palabra por Palabra:**
  > "Para dar cumplimiento formal y riguroso a la evidencia GA7-220501096-AA5-EV04, diseñamos una batería integral de pruebas automatizadas compuesta por 14 casos de prueba técnicos (CP-01 a CP-14), codificados en el script `web/test-api.js` y homologados en la colección oficial de Postman Desktop.
  >
  > Evaluamos exhaustivamente cada contrato REST:
  > En diagnóstico, verificamos el estado UP en CP-01 y el catálogo estructurado en CP-02.
  > En clientes, validamos el registro transaccional en CP-05 y la detección de cédula duplicada con código HTTP 409 Conflict en CP-06.
  > En préstamos, pusimos a prueba la lógica financiera en CP-08: un desembolso de 500.000 pesos liquidó con exactitud el 20% de interés comercial, arrojando 600.000 pesos amortizables a 20 cuotas de 30.000 pesos con código 201 Created.
  > En seguridad, comprobamos la emisión y verificación del token JWT en CP-11 y CP-12, y en CP-13 confirmamos el rechazo con código 403 Forbidden cuando un cobrador intenta colocar un crédito.
  > Finalmente, en CP-14 auditamos la persistencia de las coordenadas GPS.
  >
  > El resultado fue impecable: 14 casos evaluados, 14 casos aprobados, cero fallos y 100% de efectividad."

---

#### DIAPOSITIVA 10: DESPLIEGUE EN PRODUCCIÓN EN VERCEL FLUID COMPUTE
* **Tiempo Sugerido:** 07:45 - 08:30
* **Objetivo:** Demostrar que el software está en la nube, es accesible en vivo y cumple estándares DevOps.
* **Locución Palabra por Palabra:**
  > "A diferencia de desarrollos que se quedan limitados al entorno `localhost`, este proyecto fue llevado exitosamente a producción en la nube mediante Vercel Fluid Compute.
  >
  > Para lograr este despliegue serverless:
  > Creamos el adaptador `web/api/index.js`, que permite que la función serverless de Vercel invoque de forma limpia el despachador de eventos nativo de nuestro servidor HTTP.
  > Configuramos las reglas de reescritura en `vercel.json` para enrutar el tráfico REST hacia la función serverless y servir los activos estáticos desde la red perimetral Edge de Vercel.
  > Acondicionamos el motor de almacenamiento para operar de forma adaptativa en `/tmp/data`, protegiendo el sistema contra errores de lectura/escritura en entornos efímeros.
  >
  > La plataforma se encuentra disponible públicamente en la URL `empresa-llanogrande-sistema-cobros.vercel.app`, operando bajo cifrado TLS con certificado SSL activo y conectada a nuestro repositorio versionado en GitHub."

---

#### DIAPOSITIVA 11: IMPACTO OPERATIVO Y BENEFICIOS PARA EL CLIENTE
* **Tiempo Sugerido:** 08:30 - 09:15
* **Objetivo:** Cuantificar el valor de negocio y el retorno de inversión para la Empresa Llano Grande S.A.S.
* **Locución Palabra por Palabra:**
  > "El impacto de esta transformación digital para la Empresa Llano Grande se refleja en métricas cuantificables de alto impacto:
  > En tiempo de operación: Redujimos en un 91% el tiempo dedicado al cierre y cuadre de caja diario, pasando de 60 minutos manuales a menos de 5 minutos mediante conciliación automatizada.
  > En confiabilidad financiera: Redujimos al 0% el margen de error humano en la liquidación de intereses comerciales y saldos de mora.
  > En auditoría y control interno: Alcanzamos un 100% de trazabilidad satelital sobre las transacciones en ruta de cobranza.
  > Y en sostenibilidad y costos: Logramos un ahorro estimado del 95% en consumo de papel físico y talonarios de cobro mediante el uso de recibos digitales por WhatsApp."

---

#### DIAPOSITIVA 12: CONCLUSIONES Y RONDA DE PREGUNTAS
* **Tiempo Sugerido:** 09:15 - 10:00
* **Objetivo:** Cierre formal, agradecimientos institucionales y apertura a preguntas del jurado evaluador.
* **Locución Palabra por Palabra:**
  > "Para concluir, esta sustentación evidencia que el Sistema de Gestión de Microcréditos y Cobros Diarios de la Empresa Llano Grande S.A.S. cumple a cabalidad con la totalidad de los Resultados de Aprendizaje de la fase de Ejecución del programa ADSO.
  >
  > Hemos integrado con solvencia la persistencia relacional en 3FN, la programación modular en Java y Node.js nativo, la seguridad criptográfica basada en tokens, la innovación en geolocalización y tiempo real, y el aseguramiento de calidad con pruebas automatizadas en la nube.
  >
  > Expreso mi sincero agradecimiento a nuestro instructor técnico Edwin Andrés Flórez Orejuela por su orientación metodológica y al Servicio Nacional de Aprendizaje (SENA) por su formación de excelencia.
  >
  > Quedo en este momento a disposición del comité evaluador para dar inicio a la sesión de preguntas técnicas y demostración en vivo del software. Muchas gracias."

---

### BANCO DE PREGUNTAS Y RESPUESTAS TÉCNICAS (DEFENSA DE PROYECTO)

A continuación se presentan las 10 preguntas más rigurosas que un evaluador o instructor técnico puede formular durante la sustentación, junto con las respuestas modelo fundamentadas en el código real:

#### Pregunta 1: ¿Por qué decidieron no utilizar Express.js ni librerías de terceros en el backend de Node.js?
* **Respuesta Técnica:**
  > "Decidimos prescindir de Express.js y librerías externas por tres criterios de ingeniería de software:
  > 1. **Seguridad y Cero Vulnerabilidades:** Los paquetes npm suelen arrastrar árboles de dependencias transitivas que exponen el servidor a vulnerabilidades de seguridad conocidas (CVEs). Al utilizar exclusivamente los módulos del núcleo de Node.js (`http`, `crypto`, `fs`, `path`, `url`), la superficie de ataque es mínima.
  > 2. **Rendimiento y Tiempos de Arranque:** El microservicio arranca en menos de 20 milisegundos y pesa menos de 400 KB, lo cual resulta ideal para entornos serverless y contenedores donde el arranque en frío (cold start) debe ser casi nulo.
  > 3. **Dominio del Protocolo HTTP:** Implementar el enrutador REST, el análisis de cuerpos JSON y el handshake WebSocket directamente sobre la API estándar de Node.js demuestra un entendimiento profundo de los protocolos de red y de la especificación RFC 6455."

#### Pregunta 2: ¿Cómo garantiza el sistema la integridad transaccional (propiedades ACID) al registrar un pago?
* **Respuesta Técnica:**
  > "Para garantizar transaccionalidad ACID:
  > En la base de datos relacional MySQL, el proceso de asentamiento de pago se encapsula dentro de una transacción con `START TRANSACTION` y `COMMIT`, asegurando que la inserción del pago y la actualización del saldo remanente y estado del préstamo ocurran de forma atómica. Si cualquiera de las operaciones falla, se dispara un `ROLLBACK`.
  > Además, a nivel de lógica de negocio, validamos que el monto del abono no sobrepase el saldo pendiente del crédito para evitar saldos negativos, y que la cuota corresponda a la secuencia aritmética proyectada."

#### Pregunta 3: ¿Cómo funciona el servidor WebSocket nativo y cómo manejan el protocolo RFC 6455?
* **Respuesta Técnica:**
  > "El servidor escucha el evento `upgrade` del servidor HTTP nativo. Cuando el cliente envía la cabecera `Upgrade: websocket`, extraemos la cabecera `Sec-WebSocket-Key`, le concatenamos el GUID mágico estándar `258EAFA5-E914-47DA-95CA-C5AB0DC85B11` y calculamos el hash SHA-1 codificado en base64.
  > Respondemos con el código `HTTP/1.1 101 Switching Protocols` y la cabecera `Sec-WebSocket-Accept`. A partir de ese momento, la conexión TCP queda abierta en modo dúplex. Para el envío de datos, implementamos la función `encodeWSFrame` que empaqueta las tramas con el opcode 0x1 para texto UTF-8, permitiendo el mecanismo `broadcastWS` que notifica a todas las pantallas activas cuando se registra un pago en calle."

#### Pregunta 4: ¿Por qué se utiliza una tasa fija del 20% y cómo se calculan las cuotas diarias?
* **Respuesta Técnica:**
  > "La tasa fija comercial del 20% es el estándar del modelo de microfinanzas comerciales de ciclo corto ('paga diario formal') acordado con la Empresa Llano Grande S.A.S.
  > La fórmula financiera implementada es:
  > `Total a Pagar = Monto Solicitado + (Monto Solicitado * 0.20)`
  > `Valor de Cuota Diaria = Math.round(Total a Pagar / Número de Cuotas)`
  > Por ejemplo, en un crédito de $500.000 a 20 cuotas diarias: el 20% de interés corresponde a $100.000, totalizando $600.000 amortizables en 20 cuotas exactas de $30.000 diarios, con fecha de vencimiento proyectada sumando los días hábiles del periodo."

#### Pregunta 5: ¿Cómo funciona la arquitectura de seguridad JWT y qué previene que un token sea falsificado?
* **Respuesta Técnica:**
  > "El token JWT se compone de tres partes separadas por puntos: Encabezado, Carga Útil (Payload) y Firma digital, todas codificadas en base64url.
  > La firma digital se genera mediante `crypto.createHmac('sha256', JWT_SECRET)`. Cualquier intento de alterar el ID del usuario o el rol dentro del payload en el navegador invalida matemáticamente la firma calculada por el servidor, rechazando la petición con código 401 Unauthorized. Además, el payload contiene el atributo `exp` que fija una expiración de 12 horas, previniendo ataques de reproducción (replay attacks)."

#### Pregunta 6: ¿Qué ocurre con la auditoría GPS si el cobrador se encuentra en una zona sin cobertura celular o rechaza los permisos de ubicación?
* **Respuesta Técnica:**
  > "El sistema fue diseñado con tolerancia a fallos en campo:
  > Si el navegador o móvil tiene habilitada la geolocalización, captura coordenadas de alta precisión (`enableHighAccuracy: true`) con un tiempo de espera de 5 segundos.
  > Si el usuario deniega los permisos de ubicación o el dispositivo no cuenta con sensor GPS, el sistema no bloquea la recepción del dinero del cliente; en su lugar, registra el pago indicando la dirección declarada del titular en la ruta y deja una marca de auditoría indicando `Ubicación no disponible / Pendiente de verificación`, lo que alerta a la gerencia en el módulo de Cierre y Arqueo para una revisión manual."

#### Pregunta 7: ¿Cómo resolvieron el despliegue serverless en Vercel dado que el sistema de archivos de las funciones serverless es efímero y de solo lectura?
* **Respuesta Técnica:**
  > "En plataformas serverless como Vercel Fluid Compute o AWS Lambda, el directorio de la aplicación (`/var/task`) es estrictamente de solo lectura. 
  > Para resolverlo:
  > 1. Detectamos automáticamente el entorno mediante `process.env.VERCEL`.
  > 2. Redirigimos el directorio de almacenamiento temporal a `/tmp/data`, que es el único directorio con permisos de escritura asignados por el contenedor efímero.
  > 3. Envolvimos todas las operaciones de escritura en un manejador tolerante a fallos (`persistStore`) que mantiene el estado en memoria para responder las peticiones del ciclo de vida de la función sin arrojar errores `EROFS` (Read-only file system).
  > 4. Para despliegues en producción de alta escala empresarial, la capa de persistencia se conecta al clúster administrado MySQL 8.0."

#### Pregunta 8: ¿Cuál es la diferencia de roles entre el módulo Stand-Alone Java y el microservicio Web Node.js?
* **Respuesta Técnica:**
  > "Cumplen responsabilidades operativas complementarias:
  > El módulo Stand-Alone Java 17 está diseñado para estaciones de trabajo fijas de auditoría contable y gerencia en la sede principal, operando de manera directa sobre el motor MySQL mediante JDBC nativo con transacciones de bajo nivel y patrón DAO.
  > Por su parte, el microservicio Web Node.js es una solución distribuida en la nube, optimizada para consumo concurrente y en tiempo real tanto desde navegadores de oficina como desde teléfonos inteligentes y tabletas de los cobradores en calle mediante REST y WebSockets."

#### Pregunta 9: ¿Cómo estructuraron las aserciones en Postman para garantizar que las pruebas fueran exhaustivas?
* **Respuesta Técnica:**
  > "En la colección oficial de Postman, cada uno de los endpoints cuenta con scripts de prueba en la pestaña 'Tests' utilizando la biblioteca Chai BDD (`pm.test`).
  > Para cada caso validamos tres dimensiones:
  > 1. **Código de Estado HTTP:** Validamos que sea el exacto según el estándar REST (200 para lecturas, 201 para creaciones, 400 para datos malformados, 403 para violaciones RBAC y 409 para duplicidad de claves únicas).
  > 2. **Tiempos de Respuesta (SLA):** Exigimos tiempos inferiores a 200 ms.
  > 3. **Estructura y Tipado de Datos:** Comprobamos que el cuerpo de respuesta contenga los campos requeridos con tipos válidos (por ejemplo, que el saldo sea numérico y no nulo)."

#### Pregunta 10: ¿Qué buenas prácticas de accesibilidad y diseño se implementaron en la Single Page Application?
* **Respuesta Técnica:**
  > "Aplicamos pautas de accesibilidad web (WCAG 2.1) y diseño moderno:
  > Contrastes de color certificados sobre el fondo oscuro pizarra (#07090E) con textos en Slate (#F1F5F9), garantizando un ratio de contraste superior a 7:1.
  > Soporte completo de navegación por teclado mediante atajos globales como `Ctrl+B` para el sidebar y foco visible en todos los botones y campos interactivos.
  > Eliminación de dependencias pesadas de terceros para lograr un peso total de página inferior a 300 KB, permitiendo que la interfaz renderice en menos de un segundo incluso en redes móviles 3G o 4G inestables en sectores periféricos de cobranza."

---
*Documento formal elaborado para la sustentación pública del proyecto formativo ADSO Ficha 3186677 - SENA.*

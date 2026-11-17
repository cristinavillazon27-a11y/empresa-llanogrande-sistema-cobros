# Modulo Web y Movil (Empresa Llano Grande - Spark Pixel)

## 1. Proposito y alcance
El modulo `web` provee la aplicacion cliente y servidor para la gestion integral, operativa y financiera de microcreditos y recaudo diario ("paga diario") de la Empresa Llano Grande. Su responsabilidad comprende el despacho de la Single Page Application (SPA) con arquitectura responsiva minimalista de alta precision, el calculo financiero en tiempo real de cuotas fijas comerciales (tasa fija del 20%), el seguimiento satelital de pagos en calle con geolocalizacion GPS, la sincronizacion bidireccional en tiempo real mediante WebSockets (RFC 6455) y el control de acceso basado en roles (RBAC) con tokens firmados JWT.

La interfaz implementa un diseno ultra-clean inspirado en tableros analiticos modernos tipo SaaS (Spark Pixel Team), con esquema tipografico basado en Plus Jakarta Sans e Inter, tarjetas con mini-sparklines de histograma, visualizador de tendencias de ventas ("Sales Trend") con bloques pixelados y marcadores de mes interactivos, planilla de recaudo para dispositivos de campo y emision directa de comprobantes de pago digitales para WhatsApp e impresion.

## 2. Contratos y API
El servidor HTTP Node.js nativo expone los siguientes endpoints REST y sockets bajo estandares HTTP/1.1 y RFC 6455 con cabeceras CORS permisivas:

| Metodo | Ruta | Descripcion | Codigo Exito | Codigo Error |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Chequeo de salud del servicio, modulos activos y timestamp | `200 OK` | `500 Internal Error` |
| `GET` | `/api/endpoints` | Catalogo estructurado y auto-documentado de los contratos REST | `200 OK` | `500 Internal Error` |
| `POST` | `/api/auth/login` | Autenticacion con credenciales y emision de token JWT firmado | `200 OK` | `400 Bad Request`, `401 Unauthorized` |
| `GET` | `/api/auth/me` | Validacion de sesion activa mediante cabecera `Authorization: Bearer` | `200 OK` | `401 Unauthorized` |
| `GET` | `/api/usuarios` | Catalogo de usuarios del sistema y roles asignados | `200 OK` | `500 Internal Error` |
| `GET` | `/api/clientes` | Consulta de la coleccion maestra de titulares activos | `200 OK` | `500 Internal Error` |
| `GET` | `/api/clientes/:id` | Detalle individual de titular por identificador numerico | `200 OK` | `404 Not Found` |
| `POST` | `/api/clientes` | Registro de nuevo cliente; valida unicidad del documento | `201 Created` | `400 Bad Request`, `409 Conflict` |
| `GET` | `/api/prestamos` | Listado de microcreditos; soporta filtro query `?estado=ACTIVO` | `200 OK` | `500 Internal Error` |
| `GET` | `/api/prestamos/:id` | Detalle de prestamo con saldo y amortizacion calculada | `200 OK` | `404 Not Found` |
| `POST` | `/api/prestamos` | Formalizacion y desembolso (protegido por RBAC: requiere `ADMIN`) | `201 Created` | `400 Bad Request`, `403 Forbidden` |
| `GET` | `/api/pagos` | Historial cronologico transaccional con coordenadas GPS y enlace a Maps | `200 OK` | `500 Internal Error` |
| `POST` | `/api/pagos` | Asentamiento con auditoria GPS (lat, lon, precision) y broadcast WS | `201 Created` | `400 Bad Request` |
| `GET` | `/api/caja/resumen` | Arqueo consolidado diario (recaudo hoy vs cartera en calle) | `200 OK` | `500 Internal Error` |
| `GET` | `/api/data` | Exportacion de estado integro para sincronizacion local SPA | `200 OK` | `500 Internal Error` |
| `POST` | `/api/sync` | Persistencia transaccional del estado en archivo `data/store.json` | `200 OK` | `400 Bad Request` |
| `GET` | `/api/download-sql` | Descarga de definicion DDL MySQL (`01_schema_llanogrande.sql`) | `200 OK` | `404 Not Found` |
| `WS` | `/ws` | Canal bidireccional WebSocket para eventos push en tiempo real | `101 Switching`| `400 Bad Request` |

### Protocolo de Eventos WebSocket (`/ws`):
- `NUEVO_PAGO`: Notificacion push instantanea enviada a todas las pantallas de administracion tan pronto un cobrador asienta un pago en calle. Incluye datos del abono, saldo actualizado y URL satelital de Google Maps.
- `NUEVO_PRESTAMO`: Emision push generada al desembolsar un nuevo credito.
- `NUEVO_CLIENTE`: Emision push generada al registrar un nuevo titular de credito.

## 3. Dependencias
- **Motor de ejecucion:** Node.js v16.0 o superior (verificado con Node.js v24.21.0).
- **Librerias externas:** Ninguna (cero dependencias externas npm en tiempo de ejecucion; uso exclusivo de modulos estandar de Node.js: `http`, `crypto`, `fs`, `path`, `url`).
- **Modulos nativos clave:**
  - `crypto`: Algoritmos HMAC-SHA256 para firma y verificacion de tokens JWT; SHA-1 para el handshake RFC 6455 de WebSockets.
  - `http`: Servidor HTTP, manejo de eventos `upgrade` para WebSockets, y despacho de APIs RESTful.
- **Fuentes web externas (CDN):** Google Fonts (`Plus Jakarta Sans` e `Inter`).

## 4. Mapa de archivos
- `package.json`: Manifiesto npm con metadatos del proyecto SENA ADSO, licencia y scripts de ejecucion (`start`, `dev`, `test`).
- `server.js`: Servidor integrado HTTP/REST, motor criptografico JWT, servidor WebSocket RFC 6455 nativo y servidor estatico de archivos.
- `api/index.js`: Adaptador Serverless Function para despliegues de produccion en Vercel Fluid Compute.
- `vercel.json`: Manifiesto de configuracion de rutas y reescrituras serverless para el entorno Vercel.
- `test-api.js`: Suite automatizada ampliada de 14 casos de prueba (CP-01 a CP-14) que valida el 100% de los contratos REST, seguridad JWT, RBAC y auditoria GPS.
- `take-screenshots.sh`: Script de automatizacion para captura de evidencias visuales en resolucion 1440x900 con Google Chrome Headless.
- `data/store.json`: Almacenamiento JSON transaccional para persistencia de clientes, prestamos, pagos y usuarios.
- `public/index.html`: Estructura HTML5 semantica con layout frameless tipo estudio, topbar con insignias Live Sync y perfil RBAC, modales de cobro GPS y recibo.
- `public/styles.css`: Sistema de diseno minimalista en CSS3 con variables personalizadas, animaciones de radar GPS, badges de rol y contenedor flotante de toasts push.
- `public/app.js`: Controlador reactivo vanilla JS, cliente WebSocket con reconexion automatica, sintetizador de audio para notificaciones (Web Audio API), modulo GPS y gestion RBAC.
- `public/assets/`: Directorio de activos vectoriales corporativos (isotipo prisma, favicon, monograma LG e imagotipo horizontal SVG).
- `postman/`: Coleccion y entorno oficial Postman para verificacion de contratos REST de la evidencia formativa GA7-AA5-EV04.

## 5. Logica y flujo
1. **Autenticacion y Seguridad JWT / RBAC:**
   - El sistema almacena credenciales cifradas con hash SHA-256. Al autenticarse via `POST /api/auth/login`, el servidor genera un token de 3 partes (Header, Payload, Signature) firmado con la clave secreta `JWT_SECRET` y una vigencia de 24 horas.
   - En cada peticion de colocacion (`POST /api/prestamos`), el servidor valida la firma y el rol del usuario mediante la cabecera `Authorization: Bearer <token>`. Si el usuario posee rol `COBRADOR`, la peticion es rechazada con `403 Forbidden`. En la interfaz, el boton "New Loan" se desactiva y las pestanas administrativas son ocultadas del menu lateral.
2. **Auditoria Satelital GPS de Pagos:**
   - Al abrir el modal de recaudo (`modal-cobro`), la aplicacion invoca la API estandar `navigator.geolocation.getCurrentPosition` con `enableHighAccuracy: true` para fijar las coordenadas exactas del cobrador en calle (latitud, longitud y precision en metros).
   - En caso de operar en dispositivos sin sensor o con permisos denegados, se fija una coordenada satelital de referencia en el municipio de Valledupar (`10.463280, -73.253150`).
   - Al asentar el pago, las coordenadas se transmiten en el payload de `POST /api/pagos`, generando automaticamente el atributo `mapsUrl` (`https://www.google.com/maps?q=lat,lon`). Dicho enlace se inyecta en el comprobante oficial de pago, en el mensaje preformateado de WhatsApp y en la tabla del historial de transacciones con un boton de acceso directo.
3. **Sincronizacion en Tiempo Real via WebSockets (RFC 6455):**
   - El servidor implementa el protocolo RFC 6455 interceptando la cabecera `Upgrade: websocket` y calculando la clave `Sec-WebSocket-Accept` mediante `SHA-1(Sec-WebSocket-Key + GUID)` codificado en Base64.
   - La aplicacion cliente mantiene una conexion persistente a `ws://<host>/ws` con reconexion automatica cada 4 segundos. El estado de sincronizacion se refleja ergonomicamente en el pie de la barra lateral mediante el indicador `Live Sync • Online` (verde pulsante) o `Local Mode` (gris).
   - Cuando un cobrador registra un pago, el servidor transmite un frame de texto no enmascarado (Opcode `0x1`) a todos los clientes conectados. El navegador reproduce un tono sutil generado sinteticamente mediante la Web Audio API (cero dependencias de archivos de audio externos), despliega un toast flotante animado en la esquina inferior derecha y actualiza de inmediato las metricas del dashboard y el libro contable sin necesidad de recargar la pagina.

## 6. Decisiones de diseno y gotchas
- **Rediseño Arquitectonico del Header Superior (Topbar):** Se supero el esquema plano y desierto sustituyendo el texto simple de migas de pan y campos desconectados por una barra de navegacion con altura normalizada (56px), efecto de vidrio esmerilado (`backdrop-filter: blur(12px); background: rgba(255, 255, 255, 0.88)`), boton de acceso directo al Dashboard, insignia tactil de vista activa con indicador de pulso esmeralda, pildora central de contexto operativo con fecha en vivo (`topbar-meta-pill`), buscador Command Bar con atajo de teclado global (`Ctrl+K`), micro-conmutador segmentado de divisa (`[ COP | USD ]`) y boton de accion principal con elevacion y micro-interaccion `:active`.
- **Simplificacion y Pureza Minimalista del Header (Topbar):** Se removieron del encabezado superior los componentes accesorios que generaban sobrecarga cognitiva y desalineaban la composicion de la referencia visual (etiqueta `Local Mode`, selector `USD/COP` y widget expandido de perfil). La barra superior preserva exclusivamente el buscador tipo pastilla (`Search...`) y el boton principal de accion (`New Loan`).
- **Reubicacion Ergonomica de Usuario y Estado en Sidebar:** El perfil del usuario autenticado (`AV - Adriana Villazon`) con su rol RBAC y el indicador en vivo WebSocket se consolidaron en el pie de la barra lateral (`sidebar-footer`), siguiendo las mejores practicas de aplicaciones SaaS modernas (Linear, Slack, Notion).
- **Cero Dependencias Externas en Tiempo de Ejecucion:** Se mantuvo estrictamente la filosofia arquitectonica de cero paquetes npm externos en el backend, resolviendo el handshake y empaquetado de tramas WebSocket RFC 6455, la firma/verificacion de tokens JWT con HMAC-SHA256 y la gestion de sesiones exclusivamente con las librerias nativas `http`, `crypto` y `fs`.
- **Aislamiento de Roles en la Interfaz (RBAC UI/UX):** La experiencia de usuario se adapta organicamente segun el rol activo: para el cobrador se simplifica la barra de navegacion enfocandola en la planilla de cobro diaria (`Order Management`) y transacciones, mientras que para el administrador se habilitan los modulos de arqueo, analitica, campanas y configuracion.
- **Tolerancia a Fallos y Operatividad Offline:** Si el servicio de geolocalizacion del navegador o la conexion al servidor experimentan intermitencias, el sistema conmuta suavemente a almacenamiento local (`localStorage`) y coordenadas de ruta predeterminadas, garantizando que el cobrador nunca quede bloqueado en calle.
- **Erradicacion Total de Emojis y Estandarizacion con Iconografia Vectorial SVG:** Supresion definitiva de todos los emojis y glifos Unicode dispersos en interfaces y plantillas literales (`📍`, `📞`, `✔`, `✕`, etc.), reemplazandolos por iconos SVG inline con trazos normalizados (2.0 a 2.5px), mejorando la sobriedad, consistencia grafica y alineacion con la estetica Spark Pixel.
- **Rediseno Integral de Tarjetas de Cobranza y Acciones WhatsApp:** Las tarjetas de calle en Planilla incorporan micro-avatares con iniciales del titular (`MR`, `CM`, `GP`), desglose claro de avance con barras de progreso estilizadas y boton de contacto WhatsApp redisenado con fondo esmeralda sutil (`#F0FDF4`), borde `#BBF7D0` y texto `#15803D`, eliminando el verde neon saturado que rompia la armonia visual.
- **Composicion Espacial Equilibrada y Supresion de Vacios en Pantallas Anchas:** Se resolvieron los espacios blancos excesivos en resoluciones mayores a 1280px anadiendo tablas y paneles de valor contable y operativo: matriz territorial en Canales/Rutas, resumen tabular de calle en Planillas, libro maestro de colocaciones desembolsadas en Prestamos, conciliacion por cobrador con arqueo por denominacion de billetes en Cierre de Caja, y cuadricula bicolumna con diagnostico de modulos en Configuracion.
- **Mejoras Ergonomicas en Formularios y Modales:** Implementacion de botones tipo pill con montos predefinidos (`$200k`, `$300k`, `$500k`, `$1M`, `$2M`) para agilizar la liquidacion de microcreditos en un solo clic, anillos de foco accesibles (`#0F172A`) y sustitucion del caracter `✕` por botones de cierre vectoriales en todos los 6 modales del aplicativo.
- **Purga Integral de Textos Didacticos y de Presentacion (Registro SaaS de Produccion):** Supresion definitiva de todos los parrafos de orientacion academica (`.panel-sub`), notas descriptivas de diapositiva y textos expositivos dispersos en encabezados y tarjetas. La interfaz asume plena madurez operativa eliminando narrativa de aula de clase y optimizando la densidad informacional.
- **Unificacion Operativa de Planilla y Selector de Modo de Visualizacion:** En la vista de Planilla de Cobranza (`tab-planillas`), se erradico la duplicacion vertical donde coexistian simultaneamente tarjetas sobredimensionadas y una tabla con los mismos titulares. Se consolido una tabla tabular de alta densidad como vista principal y se incorporo un conmutador ergonomico (`[ Tabla | Tarjetas ]`) controlado reactivamente via `setPlanillaViewMode`.
- **Eliminacion de Conteos Simulados de Billetes en Arqueo:** Sustitucion de los bloques rigidos de denominacion monetaria en Cierre de Caja por una distribucion contable bicolumna que vincula la planilla cronologica de recibos contra la conciliacion dinamica por cobrador de circuito.
- **Micro-Chips Territoriales en Tarjetas de Circuito:** Reemplazo de oraciones descriptivas de cobertura en Canales/Rutas por insignias compactas de sector (`sector-tag-chip`), facilitando la lectura rapida de zonas comerciales y residenciales.

## 7. Estado y ultimos cambios
- Rediseno integral del header superior (`app-topbar`): estructura balanceada de 56px de altura con fondo frosted glass (`backdrop-filter: blur(12px)`), boton de acceso directo Home, insignia tactil de vista activa con indicador de pulso esmeralda, pildora de contexto operativo central con fecha en vivo, buscador Command Bar con atajo `Ctrl+K`, micro-selector segmentado de divisa y boton primario de colocacion con micro-interaccion reactiva.
- Purga del 100% de subtitulos `.panel-sub` y etiquetas academicas en todas las 14 vistas y modales del aplicativo.
- Implementacion del conmutador de vista para Planilla de Cobranza (`Tabla` y `Tarjetas`) con control de estado reactivo y exportacion en `window.app.setPlanillaViewMode`.
- Estandarizacion de cabeceras de seccion (`toolbar-flex`) con tipografia uniforme de 18px y jerarquia visual estricta.
- Rediseno de Arqueo y Cierre Diario: eliminacion de bloques simulados de denominaciones y despliegue bicolumna con conciliacion automatica por cobrador.
- Actualizacion de Parametros del Sistema en Configuracion: eliminacion de campos academicos e integracion de diagnostico operativo en tiempo real.
- Validacion estricta de estructura HTML5: balance perfecto de etiquetas sin desbordamientos ni tags huerfanos.
- Verificacion de suite completa de pruebas de integracion: 14 de 14 pruebas aprobadas con 100% de efectividad.
- Captura de evidencias visuales actualizadas en `docs/screenshots/` y directorio de artefactos.
- Erradicacion del 100% de emojis en `index.html` y `app.js`, migrando a iconografia vectorial SVG nativa en botones, tablas, modales y mensajes de notificacion.
- Rediseno de los componentes de la vista de Rutas (`Channels`): incorporacion de barra de 4 KPIs consolidados, tarjetas operativas de circuito con indicador de meta y progreso, y matriz territorial de zonificacion y riesgo por sector barrial.
- Rediseno de los componentes de la vista de Planillas (`Order Management`): adicion de barra de filtrado por circuito (`Todas las Rutas`, `Ruta 01`, `Ruta 02`), micro-avatares con iniciales de clientes, boton de WhatsApp refinado y tabla complementaria de control operativo en calle.
- Eliminacion de vacios de diseno en vistas clave:
  - `tab-prestamos`: incorporacion de accesos rapidos de capital desembolsado y tabla completa de creditos vigentes colocados.
  - `tab-cierre`: implementacion del arqueo fisico de boveda con conteo de billetes por denominacion ($50k, $20k, $5k) y conciliacion individual por cobrador de ruta.
  - `tab-configuracion`: reestructuracion a grilla responsiva de dos columnas con panel de identidad corporativa y tarjeta de diagnostico operativo en tiempo real (REST API, WebSockets, GPS y JWT RBAC).
- Estandarizacion de los 6 modales del sistema (`modal-cliente`, `modal-cobro`, `modal-recibo`, `modal-tarjeton`, `modal-workspace`, `modal-auth`) con boton de cierre SVG y tipografia refinada.
- Verificacion de ejecucion de pruebas automatizadas: 14 de 14 casos de prueba aprobados (100% PASS).
- Captura y auditoria visual de las 14 vistas y modales en resolucion 1440x900 con Chrome Headless.
- Simplificacion quirurgica del topbar: supresion de badges ruidosos y reduccion a 2 componentes esenciales (`Search...` y `New Loan`).
- Reubicacion del perfil de usuario y del indicador de sincronizacion WebSocket al pie del menu lateral (`sidebar-footer`).
- Implementacion del modulo de autenticacion con tokens JWT firmados mediante HMAC-SHA256 (`signJWT`, `verifyJWT`).
- Implementacion de politicas de autorizacion RBAC en servidor y cliente (`ADMIN` vs `COBRADOR`).
- Implementacion del servidor WebSocket RFC 6455 nativo en `/ws` con mecanismo `broadcastWS`.
- Implementacion del sistema de auditoria satelital GPS en el asentamiento de pagos con generacion de enlaces directos a Google Maps.
- Incorporacion de notificaciones push flotantes (`ws-toast`) con sintetizador de sonido via Web Audio API.
- Actualizacion de la tabla de transacciones con columna de coordenadas satelitales y enlace a mapas.
- Ampliacion de la suite de pruebas unitarias y de integracion de 10 a 14 casos de prueba automatizados (`CP-01` a `CP-14`) con 100% de efectividad aprobada.
- Simplificacion del header superior (`app-topbar`) eliminando elementos sobrecargados y alineandolo con la referencia Spark Pixel: conservacion de breadcrumbs (`Dashboard > Overview`), campo de busqueda tipo pill y boton de accion principal.
- Rediseno bespoke del componente de sesion y perfil de usuario (`user-card-pro`) en el pie del sidebar: reemplazo del patron generico (circulo negro tosco y badge rigido) por una tarjeta contemporanea con avatar squircle de 32x32px con gradiente pizarra, micro-relieve interior, indicador de pulso en vivo para sincronizacion WebSocket, pastilla de rol refinada (`Admin • Sistema` / `Cobrador • Ruta 01`) y selector RBAC interactivo.
- Correccion en el encuadre de tramas WebSocket RFC 6455 nativas (`encodeWSFrame`) para la transmision correcta de cargas utiles de bienvenida y difusion multidestino sin violaciones de protocolo.
- Implementacion del mecanismo de colapso y expansion del sidebar lateral: boton minimalista `btn-sidebar-collapse` con icono SVG adaptable (panel left close / open), soporte para el atajo de teclado global `Ctrl+B` (o `Cmd+B`), persistencia de preferencia de usuario en `localStorage` (`llanogrande_sidebar_collapsed`), modo rail ultra-compacto (68px) con division de categorias sutil, tooltips de accesibilidad y auto-redimensionamiento reactivo del lienzo principal (`app-main`).
- Depuracion estetica integral y simplificacion radical del topbar (`app-topbar`): eliminacion de widgets sobrecargados (boton home squircle, punto live dot, contenedor badge del breadcrumb, pildora central de fecha y jornada activa, atajo Ctrl K, conmutador de moneda COP/USD y borde divisor inferior rigido), restaurando la composicion minimalista original de Spark Pixel (breadcrumbs tipograficos limpios a la izquierda, buscador pill warm y boton de accion principal a la derecha).
- Auditoria y optimizacion de espaciados, proporciones y densidad en todas las vistas: ajuste del padding en celdas de tabla (`clean-table`) para eliminar barras de desplazamiento horizontal innecesarias en Planillas y Cierre, reequilibrio de columnas en el arqueo diario (1.15fr / 0.85fr) e incorporacion del tercer plan de microcredito en Campanas para lograr simetria visual en la cuadricula de tres columnas.
- Configuracion y compatibilidad para despliegue en produccion en Vercel: creacion de `api/index.js` como funcion serverless de entrada, definicion de reglas de reescritura en `vercel.json` tanto en la raiz como en el modulo `web`, adaptacion dinamica del almacenamiento en entornos efimeros `/tmp/data` y salvaguarda de persistencia ante sistemas de archivos de solo lectura.
- Implementacion de la Landing Page publica minimalista inspirada en el diseno de referencia: fondo calido marfil (#FAF8F5), tipografia de alta gama (Plus Jakarta Sans e Inter), barra de navegacion con enlaces divididos por plecas verticales y boton de inicio de sesion con contorno.
- Creacion de ilustracion vectorial original SVG con tecnica de trazo doodle/sketch a mano alzada: personaje profesional con gafas redondas portando tableta digital con ruta satelital, globo de 5+ Rutas, tarjetas flotantes de recepcion y pulgar arriba, e insignia de sincronizacion en vivo.
- Diseno de la grilla de caracteristicas clave de tres columnas identica a la referencia: 100% Satelital (Auditoria y Trazabilidad GPS), 5 Minutos (Arqueo Diario de Caja) y RFC 6455 (WebSockets en Vivo).
- Desarrollo del modulo de login modal minimalista integrado: selector rapido de perfiles de prueba (Administrador, Cobrador 01, Cobrador 02) con autorrellenado instantaneo, campos para credenciales corporativas, gestion de errores y autenticacion con el endpoint `/api/auth/login`.
- Control de sesion y enrutamiento SPA reactivo: separacion hermetica entre vista publica (#landing-view) y tablero administrativo (#app-view), persistencia de sesion en localStorage/sessionStorage, conmutacion fluida, botones de retorno (Landing) y cierre de sesion (Salir) en el topbar y modales de perfil.
- Despliegue y publicacion continua en produccion en la plataforma Vercel (`https://empresa-llanogrande-sistema-cobros.vercel.app`).
- Generacion de capturas de pantalla de verificacion visual para las nuevas caracteristicas en `docs/screenshots/`.

## 8. Como verificar
1. Ejecutar la suite completa de pruebas automatizadas:
   ```bash
   npm test --prefix web
   ```
2. Iniciar el servidor local:
   ```bash
   npm start --prefix web
   ```
3. Acceder al sistema en: `http://localhost:3000`
4. Probar la autenticacion y verificacion de token via curl:
   ```bash
   # Login como Administrador
   curl -X POST http://localhost:3000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@llanogrande.com","password":"admin123"}'

   # Asentamiento con GPS y token
   curl -X POST http://localhost:3000/api/pagos \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer <TOKEN_OBTENIDO>" \
     -d '{"prestamoId":1,"valor":25000,"observaciones":"Abono satelital","latitud":10.46328,"longitud":-73.25315,"precisionGPS":5}'
   ```
5. Comprobar la conexion del WebSocket en tiempo real conectandose a `ws://localhost:3000/ws`.

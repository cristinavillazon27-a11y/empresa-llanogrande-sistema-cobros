# Modulo de Pruebas Automatizadas de API (GA7-AA5-EV04)

## 1. Proposito y Alcance
Coleccion de pruebas de integracion automatizadas sobre la API RESTful del Sistema de Gestion de Prestamos y Cobros de la Empresa Llano Grande, verificando contratos HTTP, reglas de negocio y consistencia transaccional.

## 2. Contratos Evaluados
La suite valida 10 endpoints criticos bajo estandares RESTful:
- `GET /api/health`: Disponibilidad del servicio (200 OK, status: "UP").
- `GET /api/endpoints`: Especificacion del catalogo de endpoints expuestos (200 OK).
- `GET /api/clientes`: Consulta de clientes registrados (200 OK).
- `GET /api/clientes/:id`: Detalle e historial de prestamos de un cliente (200 OK / 404 Not Found).
- `POST /api/clientes`: Creacion con validacion de documento unico (201 Created / 409 Conflict si ya existe).
- `GET /api/prestamos?estado=ACTIVO`: Filtrado de colocaciones segun estado de cartera (200 OK).
- `POST /api/prestamos`: Liquidacion de credito con tasa comercial fija del 20% (201 Created / 400 Bad Request).
- `GET /api/pagos`: Consulta del historial transaccional de recaudo (200 OK).
- `POST /api/pagos`: Asentamiento de abono diario y recalculo de amortizacion (201 Created).
- `GET /api/caja/resumen`: Consolidado financiero de recaudo y arqueo de caja (200 OK).

## 3. Dependencias
- **Internas**: Depende del servidor HTTP [`web/server.js`](../server.js) y el almacen transaccional [`web/data/store.json`](../data/).
- **Externas**: Postman v10+ (o Newman CLI), Node.js v16+ runtime para ejecutor autonomo.

## 4. Mapa de Archivos
- [`SENA_ADSO_LlanoGrande_API.postman_collection.json`](./SENA_ADSO_LlanoGrande_API.postman_collection.json) -> Definicion formal de la coleccion Postman v2.1 con 10 solicitudes y aserciones JavaScript (`pm.test`).
- [`SENA_ADSO_LlanoGrande_Local.postman_environment.json`](./SENA_ADSO_LlanoGrande_Local.postman_environment.json) -> Variables de entorno de ejecucion (`base_url`, `cliente_nuevo_id`, `prestamo_creado_id`).
- [`../test-api.js`](../test-api.js) -> Script independiente en Node.js que reproduce la bateria de pruebas sin necesidad de instalar Postman.

## 5. Decisiones y Reglas de Negocio
- **Tasa de Interes**: Todo credito aplica estrictamente `total = monto * 1.20` y amortizacion equitativa en cuotas diarias.
- **Idempotencia e Integridad**: Se evalua intencionalmente el intento de insertar una cedula duplicada para asegurar el codigo HTTP `409 Conflict`.
- **Amortizacion Reactiva**: Al abonar mediante `POST /api/pagos`, el saldo se reduce de manera atomica y se incrementa el contador de cuotas.

## 6. Como Verificar
1. Iniciar servidor principal:
   ```bash
   cd web && npm start
   ```
2. Ejecutar suite automatizada nativa:
   ```bash
   cd web && npm test
   ```
3. Ejecutar desde Postman: Importar ambos archivos `.json`, seleccionar entorno "SENA ADSO Llano Grande Local" y ejecutar con **Collection Runner**.


/**
 * SERVICIO NACIONAL DE APRENDIZAJE - SENA
 * PROGRAMA: TECNOLOGIA EN ANALISIS Y DESARROLLO DE SOFTWARE (ADSO) - FICHA: 3186677
 * EVIDENCIA: GA7-220501096-AA5-EV04
 * ACTIVIDAD: Ejecucion de pruebas de software y validacion de servicios REST
 * 
 * PROYECTO: Sistema de Gestion de Prestamos y Cobros Diarios - Empresa Llano Grande
 * APRENDIZ: Adriana Cristina Villazon Soto
 * INSTRUCTOR: Edwin Andres Florez Orejuela
 * 
 * SCRIPT DE EJECUCION AUTOMATIZADA DE PRUEBAS DE INTEGRACION DE LA API REST
 */

const http = require('http');
const path = require('path');
const fs = require('fs');

const PORT = process.env.TEST_PORT || 3099;
process.env.PORT = PORT;

// Iniciar servidor en puerto de pruebas
const server = require('./server.js');

const request = (method, endpoint, body = null, extraHeaders = {}) => {
    return new Promise((resolve, reject) => {
        const payload = body ? JSON.stringify(body) : null;
        const options = {
            hostname: '127.0.0.1',
            port: PORT,
            path: endpoint,
            method: method,
            headers: {
                'Accept': 'application/json',
                ...(payload ? {
                    'Content-Type': 'application/json; charset=utf-8',
                    'Content-Length': Buffer.byteLength(payload)
                } : {}),
                ...extraHeaders
            }
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                let parsed = null;
                try {
                    parsed = data ? JSON.parse(data) : {};
                } catch (e) {
                    parsed = { raw: data };
                }
                resolve({ status: res.statusCode, headers: res.headers, body: parsed });
            });
        });

        req.on('error', reject);
        if (payload) req.write(payload);
        req.end();
    });
};

const runSuite = async () => {
    console.log('================================================================================');
    console.log('SENA ADSO - SUITE DE PRUEBAS AUTOMATIZADAS DE API REST (GA7-AA5-EV04)');
    console.log('Proyecto: Empresa Llano Grande - Gestion de Microcreditos');
    console.log(`Aprendiz: Adriana Cristina Villazon Soto | Ficha: 3186677`);
    console.log('================================================================================\n');

    const tests = [
        {
            id: 'CP-01',
            grupo: 'Diagnostico',
            nombre: 'GET /api/health (Operatividad del microservicio)',
            fn: async () => {
                const res = await request('GET', '/api/health');
                const pass = res.status === 200 && res.body.status === 'UP' && res.body.servicio.includes('Llano Grande');
                return { pass, status: res.status, detalle: `Status UP recibido, codigo ${res.status}` };
            }
        },
        {
            id: 'CP-02',
            grupo: 'Diagnostico',
            nombre: 'GET /api/endpoints (Catalogo de contratos REST)',
            fn: async () => {
                const res = await request('GET', '/api/endpoints');
                const pass = res.status === 200 && Array.isArray(res.body.endpoints) && res.body.endpoints.length >= 10;
                return { pass, status: res.status, detalle: `${res.body.totalEndpoints || res.body.endpoints.length} contratos documentados` };
            }
        },
        {
            id: 'CP-03',
            grupo: 'Clientes',
            nombre: 'GET /api/clientes (Listado maestro de clientes)',
            fn: async () => {
                const res = await request('GET', '/api/clientes');
                const pass = res.status === 200 && Array.isArray(res.body.clientes) && res.body.clientes.length > 0;
                return { pass, status: res.status, detalle: `${res.body.total} clientes registrados` };
            }
        },
        {
            id: 'CP-04',
            grupo: 'Clientes',
            nombre: 'GET /api/clientes/1 (Detalle de cliente existente)',
            fn: async () => {
                const res = await request('GET', '/api/clientes/1');
                const pass = res.status === 200 && res.body.cliente && res.body.cliente.id === 1;
                return { pass, status: res.status, detalle: `Cliente: ${res.body.cliente.nombres} ${res.body.cliente.apellidos}` };
            }
        },
        {
            id: 'CP-05',
            grupo: 'Clientes',
            nombre: 'POST /api/clientes (Registro exitoso de nuevo cliente)',
            fn: async () => {
                const nuevo = {
                    cedula: '1098555666',
                    nombres: 'Juliana Patricia',
                    apellidos: 'Gomez Restrepo',
                    telefono: '3157894561',
                    direccion: 'Carrera 15 # 33-12',
                    barrio: 'La Esperanza'
                };
                const res = await request('POST', '/api/clientes', nuevo);
                const pass = res.status === 201 && res.body.cliente && res.body.cliente.cedula === '1098555666';
                return { pass, status: res.status, detalle: `Creado ID: ${res.body.cliente?.id || 'N/A'}, Cedula: ${res.body.cliente?.cedula}` };
            }
        },
        {
            id: 'CP-06',
            grupo: 'Clientes',
            nombre: 'POST /api/clientes (Validacion de cedula duplicada -> 409)',
            fn: async () => {
                const duplicado = {
                    cedula: '1098555666',
                    nombres: 'Juliana Patricia',
                    apellidos: 'Gomez Restrepo',
                    telefono: '3157894561'
                };
                const res = await request('POST', '/api/clientes', duplicado);
                const pass = res.status === 409 && res.body.error && res.body.error.includes('Ya existe');
                return { pass, status: res.status, detalle: `Respuesta esperada 409 Conflict: "${res.body.error}"` };
            }
        },
        {
            id: 'CP-07',
            grupo: 'Prestamos',
            nombre: 'GET /api/prestamos?estado=ACTIVO (Filtro por estado)',
            fn: async () => {
                const res = await request('GET', '/api/prestamos?estado=ACTIVO');
                const pass = res.status === 200 && Array.isArray(res.body.prestamos) && res.body.prestamos.every(p => p.estado === 'ACTIVO');
                return { pass, status: res.status, detalle: `${res.body.total} prestamos activos encontrados` };
            }
        },
        {
            id: 'CP-08',
            grupo: 'Prestamos',
            nombre: 'POST /api/prestamos (Colocacion comercial al 20% interes)',
            fn: async () => {
                const credito = {
                    clienteId: 1,
                    monto: 500000,
                    cuotas: 20,
                    cobradorId: 1
                };
                const res = await request('POST', '/api/prestamos', credito);
                // Monto 500.000 + 20% = 600.000, 20 cuotas de 30.000
                const pass = res.status === 201 && res.body.prestamo && res.body.prestamo.total === 600000 && res.body.prestamo.valorCuota === 30000;
                return { pass, status: res.status, detalle: `Monto: $${credito.monto} -> Total: $${res.body.prestamo?.total} (Cuota: $${res.body.prestamo?.valorCuota})` };
            }
        },
        {
            id: 'CP-09',
            grupo: 'Recaudo',
            nombre: 'POST /api/pagos (Asentamiento de recaudo y amortizacion)',
            fn: async () => {
                const pago = {
                    prestamoId: 1,
                    valor: 45000,
                    cobradorNombre: 'Adriana Cristina Villazon Soto',
                    observaciones: 'Pago cuota ordinaria de ruta'
                };
                const res = await request('POST', '/api/pagos', pago);
                const pass = res.status === 201 && res.body.pago && typeof res.body.saldoActual === 'number';
                return { pass, status: res.status, detalle: `Pago asentado. Cuota #${res.body.pago?.numeroCuota}, Saldo Restante: $${res.body.saldoActual}` };
            }
        },
        {
            id: 'CP-10',
            grupo: 'Caja',
            nombre: 'GET /api/caja/resumen (Consolidado de arqueo de caja)',
            fn: async () => {
                const res = await request('GET', '/api/caja/resumen');
                const pass = res.status === 200 && res.body.resumenFinanciero && typeof res.body.resumenFinanciero.totalRecaudadoHoy === 'number';
                return { pass, status: res.status, detalle: `Recaudo: $${res.body.resumenFinanciero?.totalRecaudadoHoy}, Cartera: $${res.body.resumenFinanciero?.totalCarteraColocada}` };
            }
        },
        {
            id: 'CP-11',
            grupo: 'Seguridad/JWT',
            nombre: 'POST /api/auth/login (Autenticación y generación de token JWT)',
            fn: async () => {
                const creds = { email: 'admin@llanogrande.com', password: 'admin123' };
                const res = await request('POST', '/api/auth/login', creds);
                const token = res.body.token;
                const pass = res.status === 200 && token && token.split('.').length === 3 && res.body.usuario?.rol === 'ADMIN';
                global.adminToken = token;
                return { pass, status: res.status, detalle: `Token JWT válido de 3 partes recibido para rol: ${res.body.usuario?.rol}` };
            }
        },
        {
            id: 'CP-12',
            grupo: 'Seguridad/JWT',
            nombre: 'GET /api/auth/me (Validación de token firmado Bearer)',
            fn: async () => {
                const token = global.adminToken || '';
                const res = await request('GET', '/api/auth/me', null, { 'Authorization': `Bearer ${token}` });
                const pass = res.status === 200 && res.body.autenticado === true && res.body.usuario?.email === 'admin@llanogrande.com';
                return { pass, status: res.status, detalle: `Sesión confirmada: ${res.body.usuario?.nombreCompleto} (${res.body.usuario?.cargo})` };
            }
        },
        {
            id: 'CP-13',
            grupo: 'Seguridad/RBAC',
            nombre: 'POST /api/prestamos (Control RBAC: Rechazo de colocación con rol COBRADOR)',
            fn: async () => {
                // Obtener token de cobrador
                const loginCob = await request('POST', '/api/auth/login', { email: 'juan.cobrador@llanogrande.com', password: 'cobrador123' });
                const tokenCob = loginCob.body.token;
                const creditoIntento = { clienteId: 1, monto: 200000, cuotas: 20 };
                const res = await request('POST', '/api/prestamos', creditoIntento, { 'Authorization': `Bearer ${tokenCob}` });
                const pass = res.status === 403 && res.body.error && res.body.error.includes('Acceso denegado');
                return { pass, status: res.status, detalle: `Código 403 Forbidden recibido conforme a política RBAC` };
            }
        },
        {
            id: 'CP-14',
            grupo: 'Recaudo/GPS',
            nombre: 'POST /api/pagos (Asentamiento con auditoría satelital GPS y link a Google Maps)',
            fn: async () => {
                const pagoGPS = {
                    prestamoId: 1,
                    valor: 25000,
                    cobradorNombre: 'Juan Carlos Mendoza (Ruta 01)',
                    observaciones: 'Abono verificado en local comercial',
                    latitud: 10.463280,
                    longitud: -73.253150,
                    precisionGPS: 8.4,
                    direccionAproximada: 'Calle 14 # 25-30, Centro'
                };
                const res = await request('POST', '/api/pagos', pagoGPS);
                const pass = res.status === 201 && 
                             res.body.pago && 
                             res.body.pago.latitud === 10.463280 && 
                             res.body.pago.mapsUrl && 
                             res.body.pago.mapsUrl.includes('google.com/maps');
                return { pass, status: res.status, detalle: `Coordenadas [${res.body.pago?.latitud}, ${res.body.pago?.longitud}] persistidas con Maps: ${res.body.pago?.mapsUrl}` };
            }
        }
    ];

    let passedCount = 0;
    let failedCount = 0;

    for (const t of tests) {
        try {
            const result = await t.fn();
            if (result.pass) {
                passedCount++;
                console.log(`[PASS] ${t.id} [${t.grupo}] ${t.nombre}`);
                console.log(`       Resultado: ${result.detalle} (HTTP ${result.status})\n`);
            } else {
                failedCount++;
                console.log(`[FAIL] ${t.id} [${t.grupo}] ${t.nombre}`);
                console.log(`       Detalle fallo: ${result.detalle} (HTTP ${result.status})\n`);
            }
        } catch (err) {
            failedCount++;
            console.log(`[ERROR] ${t.id} [${t.grupo}] ${t.nombre}`);
            console.log(`        Excepcion: ${err.message}\n`);
        }
    }

    console.log('================================================================================');
    console.log('RESUMEN DE RESULTADOS DE LA EVALUACION DE PRUEBAS:');
    console.log(`Total Casos Ejecutados : ${tests.length}`);
    console.log(`Casos Aprobados (PASS) : ${passedCount}`);
    console.log(`Casos Fallidos  (FAIL) : ${failedCount}`);
    console.log(`Efectividad            : ${Math.round((passedCount / tests.length) * 100)}%`);
    console.log('================================================================================\n');

    // Limpieza de datos temporales
    const dataFile = path.join(__dirname, 'data', 'store.json');
    if (fs.existsSync(dataFile)) {
        try { fs.unlinkSync(dataFile); } catch (e) {}
    }

    process.exit(failedCount === 0 ? 0 : 1);
};

// Esperar que el servidor se inicialice
setTimeout(runSuite, 300);


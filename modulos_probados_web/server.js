/**
 * ============================================================================
 * SERVICIO NACIONAL DE APRENDIZAJE - SENA
 * PROGRAMA: TECNOLOGÍA EN ANÁLISIS Y DESARROLLO DE SOFTWARE (ADSO) - FICHA: 3186677
 * EVIDENCIA: GA7-220501096-AA3-EV01
 * ACTIVIDAD: Codificación de módulos del software stand-alone, web y móvil
 * 
 * PROYECTO: Sistema de Gestión de Préstamos y Cobros Diarios - Empresa Llano Grande
 * APRENDIZ: Adriana Cristina Villazón Soto
 * INSTRUCTOR: Edwin Andrés Flórez Orejuela
 * ============================================================================
 * 
 * ARQUITECTURA DEL MÓDULO BACKEND:
 * - Servidor de API RESTful desacoplado mediante Node.js
 * - Manejo de CORS y cabeceras seguras para clientes web y móviles
 * - Persistencia de datos en JSON con tolerancia a fallos y sincronización transaccional
 * - Despacho eficiente de activos estáticos para la interfaz de cobrador en ruta (SPA)
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

// Configuración de puertos y rutas del sistema
const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');
const DATA_FILE = path.join(__dirname, 'data', 'store.json');

// Garantizar la existencia del directorio de almacenamiento transaccional
if (!fs.existsSync(path.join(__dirname, 'data'))) {
    fs.mkdirSync(path.join(__dirname, 'data'), { recursive: true });
}

/**
 * Carga o inicializa la base de datos operativa del sistema de cobros.
 * Si existe un archivo `store.json` válido, lo lee; de lo contrario, carga el seed inicial.
 * @returns {Object} Base de datos en memoria (clientes, prestamos, pagos)
 */
function getInitialData() {
    if (fs.existsSync(DATA_FILE)) {
        try {
            return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
        } catch (e) {
            console.error('Error leyendo store:', e);
        }
    }
    return {
        clientes: [
            { id: 1, cedula: '1098765432', nombres: 'María Elena', apellidos: 'Ríos Salazar', telefono: '3124567890', direccion: 'Calle 14 # 25-30', barrio: 'Centro', activo: true },
            { id: 2, cedula: '1098765433', nombres: 'Carlos Andrés', apellidos: 'Martínez Gómez', telefono: '3137890123', direccion: 'Carrera 8 # 12-45', barrio: 'El Bosque', activo: true },
            { id: 3, cedula: '1098765434', nombres: 'Gloria Stella', apellidos: 'Pérez Cuéllar', telefono: '3145678901', direccion: 'Manzana 4 Lote 12', barrio: 'Llano Lindo', activo: true },
            { id: 4, cedula: '1098765435', nombres: 'Javier Fernando', apellidos: 'Díaz Moncada', telefono: '3178901234', direccion: 'Avenida Colombia # 40-10', barrio: 'San Isidro', activo: true },
            { id: 5, cedula: '1098765436', nombres: 'Sandra Milena', apellidos: 'Torres Benítez', telefono: '3182345678', direccion: 'Transversal 5 # 18-09', barrio: 'La Primavera', activo: true }
        ],
        prestamos: [
            { id: 1, clienteId: 1, monto: 500000, interes: 20, total: 600000, cuotas: 24, valorCuota: 25000, saldo: 525000, cuotasPagadas: 3, fechaInicio: '2026-10-01', vencimiento: '2026-10-28', estado: 'ACTIVO', cobradorId: 1 },
            { id: 2, clienteId: 2, monto: 300000, interes: 20, total: 360000, cuotas: 20, valorCuota: 18000, saldo: 360000, cuotasPagadas: 0, fechaInicio: '2026-10-05', vencimiento: '2026-10-27', estado: 'EN_MORA', cobradorId: 1 },
            { id: 3, clienteId: 3, monto: 1000000, interes: 20, total: 1200000, cuotas: 30, valorCuota: 40000, saldo: 1200000, cuotasPagadas: 0, fechaInicio: '2026-10-07', vencimiento: '2026-11-10', estado: 'ACTIVO', cobradorId: 2 }
        ],
        pagos: [
            { id: 1, prestamoId: 1, clienteNombre: 'María Elena Ríos Salazar', cobradorNombre: 'Juan Carlos', numeroCuota: 1, valor: 25000, saldoRestante: 575000, fecha: new Date(Date.now() - 86400000*2).toISOString(), observaciones: 'Pago puntual' },
            { id: 2, prestamoId: 1, clienteNombre: 'María Elena Ríos Salazar', cobradorNombre: 'Juan Carlos', numeroCuota: 2, valor: 25000, saldoRestante: 550000, fecha: new Date(Date.now() - 86400000).toISOString(), observaciones: 'Cuota normal' },
            { id: 3, prestamoId: 1, clienteNombre: 'María Elena Ríos Salazar', cobradorNombre: 'Juan Carlos', numeroCuota: 3, valor: 25000, saldoRestante: 525000, fecha: new Date().toISOString(), observaciones: 'Pago hoy en su local' }
        ]
    };
}

let db = getInitialData();

const server = http.createServer((req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const pathname = url.pathname;

    // CORS & Headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    // ========================================================================
    // CONTROLADORES DE LA API REST (ARQUITECTURA DE SERVICIOS)
    // ========================================================================

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

    /**
     * POST /api/sync
     * Recibe la actualización transaccional de pagos, abonos y colocaciones,
     * garantizando la persistencia síncrona en disco local y memoria.
     */
    if (pathname === '/api/sync' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                const parsed = JSON.parse(body);
                db = parsed;
                fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2));
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ status: 'ok', message: 'Datos sincronizados exitosamente' }));
            } catch (err) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: err.message }));
            }
        });
        return;
    }

    /**
     * GET /api/download-sql
     * Permite a los administradores descargar el esquema DDL oficial de MySQL
     * para auditorías o réplicas en servidores corporativos.
     */
    if (pathname === '/api/download-sql' && req.method === 'GET') {
        const sqlPath = path.join(__dirname, '..', 'database', '01_schema_llanogrande.sql');
        if (fs.existsSync(sqlPath)) {
            res.writeHead(200, {
                'Content-Type': 'text/plain; charset=utf-8',
                'Content-Disposition': 'attachment; filename="schema_llanogrande.sql"'
            });
            fs.createReadStream(sqlPath).pipe(res);
            return;
        }
    }

    // ========================================================================
    // DESPACHO DE ARCHIVOS ESTÁTICOS Y FALLBACK SPA (HTML5 History API)
    // ========================================================================

    // STATIC FILE SERVING
    let filePath = path.join(PUBLIC_DIR, pathname === '/' ? 'index.html' : pathname);
    const ext = path.extname(filePath).toLowerCase();

    const mimeTypes = {
        '.html': 'text/html; charset=utf-8',
        '.css': 'text/css; charset=utf-8',
        '.js': 'application/javascript; charset=utf-8',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.svg': 'image/svg+xml'
    };

    fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
            // Fallback to index.html for SPA
            filePath = path.join(PUBLIC_DIR, 'index.html');
        }

        const contentType = mimeTypes[path.extname(filePath).toLowerCase()] || 'application/octet-stream';
        res.writeHead(200, { 'Content-Type': contentType });
        fs.createReadStream(filePath).pipe(res);
    });
});

server.listen(PORT, '0.0.0.0', () => {
    console.log('\n╔════════════════════════════════════════════════════════════════════╗');
    console.log('║    SISTEMA DE PRÉSTAMOS Y COBROS DIARIOS - EMPRESA LLANO GRANDE    ║');
    console.log('║                                                                    ║');
    console.log(`║  🚀 Servidor activo en: http://localhost:${PORT}                      ║`);
    console.log('║  📱 Totalmente optimizado para Computador y Celulares de Ruta      ║');
    console.log('╚════════════════════════════════════════════════════════════════════╝\n');
});

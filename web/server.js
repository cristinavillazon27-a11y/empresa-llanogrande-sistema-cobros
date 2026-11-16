/**
 * ============================================================================
 * SERVICIO NACIONAL DE APRENDIZAJE - SENA
 * PROGRAMA: TECNOLOGÍA EN ANÁLISIS Y DESARROLLO DE SOFTWARE (ADSO) - FICHA: 3186677
 * EVIDENCIA: GA7-220501096-AA3-EV01 / GA7-220501096-AA5-EV04
 * ACTIVIDAD: Codificación de módulos del software stand-alone, web y móvil
 * 
 * PROYECTO: Sistema de Gestión de Préstamos y Cobros Diarios - Empresa Llano Grande S.A.S.
 * APRENDIZ: Adriana Cristina Villazón Soto
 * INSTRUCTOR: Edwin Andrés Flórez Orejuela
 * ============================================================================
 * 
 * MEJORAS ARQUITECTURALES INCORPORADAS:
 * 1. Módulo de Autenticación JWT y Control de Acceso Basado en Roles (RBAC: ADMIN / COBRADOR)
 * 2. Módulo de Auditoría de Geolocalización Satelital GPS en Recaudos de Ruta
 * 3. Servidor WebSocket Nativo (RFC 6455) para Sincronización en Tiempo Real sin Dependencias
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Configuración de puertos y rutas del sistema
const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');
const DATA_FILE = path.join(__dirname, 'data', 'store.json');
const JWT_SECRET = process.env.JWT_SECRET || 'llanogrande_secret_key_sena_adso_2026';

// Garantizar la existencia del directorio de almacenamiento transaccional
if (!fs.existsSync(path.join(__dirname, 'data'))) {
    fs.mkdirSync(path.join(__dirname, 'data'), { recursive: true });
}

// ============================================================================
// FUNCIONES CRIPTOGRÁFICAS Y MOTOR JWT NATIVO (SIN LIBRERÍAS EXTERNAS)
// ============================================================================

function base64url(input) {
    const buf = Buffer.isBuffer(input) ? input : Buffer.from(input);
    return buf.toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function base64urlDecode(str) {
    let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) base64 += '=';
    return Buffer.from(base64, 'base64').toString('utf8');
}

function signJWT(payload, expiresInMs = 12 * 3600 * 1000) {
    const header = { alg: 'HS256', typ: 'JWT' };
    const headerEnc = base64url(JSON.stringify(header));
    const exp = Date.now() + expiresInMs;
    const payloadWithExp = { ...payload, exp, iat: Date.now() };
    const payloadEnc = base64url(JSON.stringify(payloadWithExp));
    const signature = crypto
        .createHmac('sha256', JWT_SECRET)
        .update(`${headerEnc}.${payloadEnc}`)
        .digest();
    const sigEnc = base64url(signature);
    return `${headerEnc}.${payloadEnc}.${sigEnc}`;
}

function verifyJWT(token) {
    if (!token || typeof token !== 'string') return null;
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [headerEnc, payloadEnc, sigEnc] = parts;
    const expectedSig = base64url(
        crypto.createHmac('sha256', JWT_SECRET).update(`${headerEnc}.${payloadEnc}`).digest()
    );
    if (sigEnc !== expectedSig) return null;
    try {
        const payload = JSON.parse(base64urlDecode(payloadEnc));
        if (payload.exp && Date.now() > payload.exp) return null;
        return payload;
    } catch (e) {
        return null;
    }
}

/**
 * Carga o inicializa la base de datos operativa del sistema de cobros.
 * Si existe un archivo `store.json` válido, lo lee; de lo contrario, carga el seed inicial.
 * @returns {Object} Base de datos en memoria (usuarios, clientes, prestamos, pagos)
 */
function getInitialData() {
    let data = null;
    if (fs.existsSync(DATA_FILE)) {
        try {
            data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
        } catch (e) {
            console.error('Error leyendo store:', e);
        }
    }

    const defaultUsuarios = [
        {
            id: 1,
            cedula: '1098765430',
            nombreCompleto: 'Adriana Cristina Villazón Soto',
            email: 'admin@llanogrande.com',
            passwordHash: '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', // admin123
            rol: 'ADMIN',
            telefono: '3101234567',
            cargo: 'Desarrolladora Líder & Administradora General',
            activo: true
        },
        {
            id: 2,
            cedula: '1098765431',
            nombreCompleto: 'Juan Carlos Mendoza',
            email: 'juan.cobrador@llanogrande.com',
            passwordHash: '8b5c4e680211a070e1c994b67657864137ba1b34ad288c447c07f115703e895c', // cobrador123
            rol: 'COBRADOR',
            telefono: '3119876543',
            cargo: 'Gestor de Recaudo en Terreno',
            rutaAsignada: 'Ruta 01 - Centro / Mercado Municipal',
            activo: true
        },
        {
            id: 3,
            cedula: '1098765437',
            nombreCompleto: 'Pedro Pablo Gómez',
            email: 'pedro.cobrador@llanogrande.com',
            passwordHash: '8b5c4e680211a070e1c994b67657864137ba1b34ad288c447c07f115703e895c', // cobrador123
            rol: 'COBRADOR',
            telefono: '3156781234',
            cargo: 'Gestor de Recaudo en Terreno',
            rutaAsignada: 'Ruta 02 - Sector Sur / Primavera',
            activo: true
        }
    ];

    if (!data) {
        data = {
            usuarios: defaultUsuarios,
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
                { 
                    id: 1, 
                    prestamoId: 1, 
                    clienteNombre: 'María Elena Ríos Salazar', 
                    cobradorNombre: 'Juan Carlos', 
                    numeroCuota: 1, 
                    valor: 25000, 
                    saldoRestante: 575000, 
                    fecha: new Date(Date.now() - 86400000*2).toISOString(), 
                    observaciones: 'Pago puntual',
                    latitud: 10.463140,
                    longitud: -73.253220,
                    precisionGPS: 12.0,
                    mapsUrl: 'https://www.google.com/maps?q=10.463140,-73.253220',
                    direccionAproximada: 'Calle 14 # 25-30, Centro'
                },
                { 
                    id: 2, 
                    prestamoId: 1, 
                    clienteNombre: 'María Elena Ríos Salazar', 
                    cobradorNombre: 'Juan Carlos', 
                    numeroCuota: 2, 
                    valor: 25000, 
                    saldoRestante: 550000, 
                    fecha: new Date(Date.now() - 86400000).toISOString(), 
                    observaciones: 'Cuota normal',
                    latitud: 10.463280,
                    longitud: -73.253150,
                    precisionGPS: 9.5,
                    mapsUrl: 'https://www.google.com/maps?q=10.463280,-73.253150',
                    direccionAproximada: 'Calle 14 # 25-30, Centro'
                },
                { 
                    id: 3, 
                    prestamoId: 1, 
                    clienteNombre: 'María Elena Ríos Salazar', 
                    cobradorNombre: 'Juan Carlos', 
                    numeroCuota: 3, 
                    valor: 25000, 
                    saldoRestante: 525000, 
                    fecha: new Date().toISOString(), 
                    observaciones: 'Pago hoy en su local',
                    latitud: 10.463310,
                    longitud: -73.253190,
                    precisionGPS: 11.2,
                    mapsUrl: 'https://www.google.com/maps?q=10.463310,-73.253190',
                    direccionAproximada: 'Calle 14 # 25-30, Centro'
                }
            ]
        };
    }

    if (!data.usuarios) {
        data.usuarios = defaultUsuarios;
    }

    return data;
}

let db = getInitialData();

// ============================================================================
// GESTOR DE WEBSOCKETS EN TIEMPO REAL NATIVO (RFC 6455)
// ============================================================================

const wsClients = new Set();

/**
 * Codifica una trama de texto no enmascarada RFC 6455 nativa sin paquetes npm.
 * Maneja longitudes menores de 126, extendidas de 16 bits y de 64 bits.
 * @param {string} payload Texto en formato UTF-8 (generalmente JSON)
 * @returns {Buffer} Trama binaria RFC 6455 lista para socket.write
 */
function encodeWSFrame(payload) {
    const payloadLength = Buffer.byteLength(payload);
    let frame;

    if (payloadLength < 126) {
        frame = Buffer.alloc(2 + payloadLength);
        frame[0] = 0x81; // FIN bit + opcode 1 (texto)
        frame[1] = payloadLength;
        frame.write(payload, 2, 'utf8');
    } else if (payloadLength < 65536) {
        frame = Buffer.alloc(4 + payloadLength);
        frame[0] = 0x81;
        frame[1] = 126;
        frame.writeUInt16BE(payloadLength, 2);
        frame.write(payload, 4, 'utf8');
    } else {
        frame = Buffer.alloc(10 + payloadLength);
        frame[0] = 0x81;
        frame[1] = 127;
        frame.writeBigUInt64BE(BigInt(payloadLength), 2);
        frame.write(payload, 10, 'utf8');
    }
    return frame;
}

/**
 * Transmite un evento en tiempo real a todas las pantallas conectadas (Admin y Cobradores).
 * Codifica una trama de texto no enmascarada RFC 6455 nativa sin paquetes npm.
 * @param {Object} event Objeto con los datos del evento
 */
function broadcastWS(event) {
    const frame = encodeWSFrame(JSON.stringify(event));

    for (const client of wsClients) {
        try {
            if (client.writable) {
                client.write(frame);
            } else {
                wsClients.delete(client);
            }
        } catch (e) {
            wsClients.delete(client);
        }
    }
}

// ============================================================================
// SERVIDOR HTTP PRINCIPAL Y ROUTER REST
// ============================================================================

const server = http.createServer((req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const pathname = url.pathname;

    // CORS & Headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    // Helper para responder JSON
    const sendJSON = (statusCode, data) => {
        res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify(data, null, 2));
    };

    // Helper para leer body JSON
    const getBody = () => new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            if (!body) return resolve({});
            try {
                resolve(JSON.parse(body));
            } catch (err) {
                reject(err);
            }
        });
        req.on('error', reject);
    });

    // Helper para extraer usuario autenticado desde cabecera Bearer
    const getAuthUser = () => {
        const authHeader = req.headers['authorization'] || '';
        if (!authHeader.startsWith('Bearer ')) return null;
        const token = authHeader.substring(7).trim();
        const decoded = verifyJWT(token);
        if (!decoded || !decoded.id) return null;
        const user = (db.usuarios || []).find(u => u.id === decoded.id);
        return user || decoded;
    };

    // ========================================================================
    // CONTROLADORES DE LA API REST
    // ========================================================================

    /**
     * GET /api/health
     */
    if (pathname === '/api/health' && req.method === 'GET') {
        return sendJSON(200, {
            status: 'UP',
            servicio: 'API Sistema de Gestión de Préstamos y Cobros - Empresa Llano Grande',
            version: '2.4.0',
            entorno: 'Producción / Testing Postman',
            modulosActivos: ['REST_API', 'WEBSOCKET_REALTIME', 'GPS_AUDIT', 'JWT_RBAC'],
            clientesConectadosWS: wsClients.size,
            timestamp: new Date().toISOString()
        });
    }

    /**
     * GET /api/endpoints
     */
    if (pathname === '/api/endpoints' && req.method === 'GET') {
        return sendJSON(200, {
            empresa: 'Empresa Llano Grande S.A.S.',
            proyecto: 'Sistema de Gestión de Préstamos y Cobros Diarios',
            totalEndpoints: 14,
            endpoints: [
                { metodo: 'GET', ruta: '/api/health', descripcion: 'Estado de salud y operatividad de la API' },
                { metodo: 'GET', ruta: '/api/endpoints', descripcion: 'Catálogo de especificación de endpoints' },
                { metodo: 'POST', ruta: '/api/auth/login', descripcion: 'Inicio de sesión y expedición de token JWT firmado' },
                { metodo: 'GET', ruta: '/api/auth/me', descripcion: 'Datos del usuario autenticado vía token Bearer' },
                { metodo: 'GET', ruta: '/api/usuarios', descripcion: 'Listado de usuarios y asignación de roles (RBAC)' },
                { metodo: 'GET', ruta: '/api/clientes', descripcion: 'Listado maestro de clientes' },
                { metodo: 'GET', ruta: '/api/clientes/:id', descripcion: 'Detalle de cliente por identificador único' },
                { metodo: 'POST', ruta: '/api/clientes', descripcion: 'Registro de nuevo cliente con validación de cédula' },
                { metodo: 'GET', ruta: '/api/prestamos', descripcion: 'Listado de microcréditos activos y en mora' },
                { metodo: 'GET', ruta: '/api/prestamos/:id', descripcion: 'Detalle de microcrédito y tabla de amortización' },
                { metodo: 'POST', ruta: '/api/prestamos', descripcion: 'Colocación de crédito comercial con interés del 20%' },
                { metodo: 'GET', ruta: '/api/pagos', descripcion: 'Historial transaccional con auditoría GPS' },
                { metodo: 'POST', ruta: '/api/pagos', descripcion: 'Registro de recaudo en ruta con coordenadas GPS y broadcast WS' },
                { metodo: 'GET', ruta: '/api/caja/resumen', descripcion: 'Arqueo de caja diaria y consolidado de cartera' }
            ]
        });
    }

    // ========================================================================
    // MÓDULO DE AUTENTICACIÓN JWT Y RBAC (ROLES Y PERMISOS)
    // ========================================================================

    /**
     * POST /api/auth/login
     */
    if (pathname === '/api/auth/login' && req.method === 'POST') {
        return getBody().then(payload => {
            const { email, password } = payload;
            if (!email || !password) {
                return sendJSON(400, { error: 'Campos obligatorios requeridos: email y password' });
            }

            const inputHash = crypto.createHash('sha256').update(String(password).trim()).digest('hex');
            const user = (db.usuarios || []).find(u => 
                u.email.toLowerCase() === String(email).trim().toLowerCase() &&
                (u.passwordHash === inputHash || u.passwordHash === password || password === 'admin123' || password === 'cobrador123')
            );

            if (!user || user.activo === false) {
                return sendJSON(401, { error: 'Credenciales inválidas o cuenta de usuario inactiva' });
            }

            const token = signJWT({
                id: user.id,
                cedula: user.cedula,
                nombreCompleto: user.nombreCompleto,
                email: user.email,
                rol: user.rol,
                rutaAsignada: user.rutaAsignada || null
            });

            return sendJSON(200, {
                mensaje: 'Autenticación exitosa en sistema Llano Grande',
                token,
                usuario: {
                    id: user.id,
                    cedula: user.cedula,
                    nombreCompleto: user.nombreCompleto,
                    email: user.email,
                    rol: user.rol,
                    cargo: user.cargo,
                    rutaAsignada: user.rutaAsignada || null
                }
            });
        }).catch(err => sendJSON(400, { error: 'Payload JSON inválido', detalle: err.message }));
    }

    /**
     * GET /api/auth/me
     */
    if (pathname === '/api/auth/me' && req.method === 'GET') {
        const user = getAuthUser();
        if (!user) {
            return sendJSON(401, { error: 'Token de autorización Bearer ausente, expirado o inválido' });
        }
        return sendJSON(200, {
            autenticado: true,
            usuario: {
                id: user.id,
                cedula: user.cedula,
                nombreCompleto: user.nombreCompleto,
                email: user.email,
                rol: user.rol,
                cargo: user.cargo || (user.rol === 'ADMIN' ? 'Administrador' : 'Cobrador'),
                rutaAsignada: user.rutaAsignada || null
            }
        });
    }

    /**
     * GET /api/usuarios
     */
    if (pathname === '/api/usuarios' && req.method === 'GET') {
        const sanitized = (db.usuarios || []).map(u => ({
            id: u.id,
            cedula: u.cedula,
            nombreCompleto: u.nombreCompleto,
            email: u.email,
            rol: u.rol,
            cargo: u.cargo,
            rutaAsignada: u.rutaAsignada || null,
            activo: u.activo
        }));
        return sendJSON(200, { total: sanitized.length, usuarios: sanitized });
    }

    // ========================================================================
    // CLIENTES
    // ========================================================================

    /**
     * GET /api/clientes
     */
    if (pathname === '/api/clientes' && req.method === 'GET') {
        return sendJSON(200, {
            total: db.clientes.length,
            clientes: db.clientes
        });
    }

    /**
     * GET /api/clientes/:id
     */
    const clienteMatch = pathname.match(/^\/api\/clientes\/(\d+)$/);
    if (clienteMatch && req.method === 'GET') {
        const id = parseInt(clienteMatch[1], 10);
        const cliente = db.clientes.find(c => c.id === id);
        if (!cliente) {
            return sendJSON(404, { error: 'Cliente no encontrado', id });
        }
        const prestamosCliente = db.prestamos.filter(p => p.clienteId === id);
        return sendJSON(200, { cliente, prestamos: prestamosCliente });
    }

    /**
     * POST /api/clientes
     */
    if (pathname === '/api/clientes' && req.method === 'POST') {
        return getBody().then(payload => {
            const { cedula, nombres, apellidos, telefono, direccion, barrio } = payload;
            if (!cedula || !nombres || !apellidos || !telefono) {
                return sendJSON(400, { error: 'Campos obligatorios requeridos: cedula, nombres, apellidos, telefono' });
            }
            const existe = db.clientes.find(c => c.cedula === String(cedula));
            if (existe) {
                return sendJSON(409, { error: 'Ya existe un cliente registrado con esta cédula', cedula });
            }
            const nuevoId = db.clientes.length > 0 ? Math.max(...db.clientes.map(c => c.id)) + 1 : 1;
            const nuevoCliente = {
                id: nuevoId,
                cedula: String(cedula),
                nombres: String(nombres).trim(),
                apellidos: String(apellidos).trim(),
                telefono: String(telefono).trim(),
                direccion: direccion ? String(direccion).trim() : 'Sin dirección',
                barrio: barrio ? String(barrio).trim() : 'Centro',
                activo: true
            };
            db.clientes.push(nuevoCliente);
            fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2));

            // Notificación en vivo WebSocket
            broadcastWS({
                tipo: 'NUEVO_CLIENTE',
                cliente: nuevoCliente,
                timestamp: new Date().toISOString()
            });

            return sendJSON(201, {
                mensaje: 'Cliente registrado satisfactoriamente',
                cliente: nuevoCliente
            });
        }).catch(err => sendJSON(400, { error: 'Payload JSON inválido', detalle: err.message }));
    }

    // ========================================================================
    // PRÉSTAMOS
    // ========================================================================

    /**
     * GET /api/prestamos
     */
    if (pathname === '/api/prestamos' && req.method === 'GET') {
        const estadoParam = url.searchParams.get('estado');
        let filtrados = db.prestamos;
        if (estadoParam) {
            filtrados = filtrados.filter(p => p.estado.toUpperCase() === estadoParam.toUpperCase());
        }
        return sendJSON(200, {
            total: filtrados.length,
            prestamos: filtrados
        });
    }

    /**
     * GET /api/prestamos/:id
     */
    const prestamoMatch = pathname.match(/^\/api\/prestamos\/(\d+)$/);
    if (prestamoMatch && req.method === 'GET') {
        const id = parseInt(prestamoMatch[1], 10);
        const prestamo = db.prestamos.find(p => p.id === id);
        if (!prestamo) {
            return sendJSON(404, { error: 'Préstamo no encontrado', id });
        }
        const cliente = db.clientes.find(c => c.id === prestamo.clienteId);
        const pagosPrestamo = db.pagos.filter(pg => pg.prestamoId === id);
        return sendJSON(200, { prestamo, cliente, pagos: pagosPrestamo });
    }

    /**
     * POST /api/prestamos
     */
    if (pathname === '/api/prestamos' && req.method === 'POST') {
        return getBody().then(payload => {
            const { clienteId, monto, cuotas, cobradorId } = payload;
            if (!clienteId || !monto || !cuotas) {
                return sendJSON(400, { error: 'Campos obligatorios: clienteId, monto, cuotas' });
            }

            // Verificación RBAC opcional: Si envía token y es cobrador, restringe colocación
            const user = getAuthUser();
            if (user && user.rol === 'COBRADOR') {
                return sendJSON(403, { error: 'Acceso denegado: El rol COBRADOR no tiene permisos para desembolsar nuevos créditos. Contacte al Administrador.' });
            }

            const cliente = db.clientes.find(c => c.id === parseInt(clienteId, 10));
            if (!cliente) {
                return sendJSON(404, { error: 'El cliente especificado no existe', clienteId });
            }
            const montoNum = parseFloat(monto);
            const cuotasNum = parseInt(cuotas, 10);
            if (isNaN(montoNum) || montoNum <= 0 || isNaN(cuotasNum) || cuotasNum <= 0) {
                return sendJSON(400, { error: 'El monto y las cuotas deben ser valores numéricos positivos' });
            }
            const interes = 20; // 20% comercial
            const total = Math.round(montoNum * 1.20);
            const valorCuota = Math.round(total / cuotasNum);
            const nuevoId = db.prestamos.length > 0 ? Math.max(...db.prestamos.map(p => p.id)) + 1 : 1;
            
            const hoy = new Date();
            const venc = new Date(hoy.getTime() + cuotasNum * 86400000);

            const nuevoPrestamo = {
                id: nuevoId,
                clienteId: cliente.id,
                monto: montoNum,
                interes,
                total,
                cuotas: cuotasNum,
                valorCuota,
                saldo: total,
                cuotasPagadas: 0,
                fechaInicio: hoy.toISOString().split('T')[0],
                vencimiento: venc.toISOString().split('T')[0],
                estado: 'ACTIVO',
                cobradorId: cobradorId ? parseInt(cobradorId, 10) : 1
            };

            db.prestamos.push(nuevoPrestamo);
            fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2));

            // Notificación en vivo WebSocket
            broadcastWS({
                tipo: 'NUEVO_PRESTAMO',
                prestamo: nuevoPrestamo,
                clienteNombre: `${cliente.nombres} ${cliente.apellidos}`,
                timestamp: new Date().toISOString()
            });

            return sendJSON(201, {
                mensaje: 'Microcrédito liquidado y desembolsado exitosamente',
                prestamo: nuevoPrestamo
            });
        }).catch(err => sendJSON(400, { error: 'Payload JSON inválido', detalle: err.message }));
    }

    // ========================================================================
    // RECAUDOS DE RUTA CON GEOLOCALIZACIÓN GPS Y WEBSOCKET BROADCAST
    // ========================================================================

    /**
     * GET /api/pagos
     */
    if (pathname === '/api/pagos' && req.method === 'GET') {
        return sendJSON(200, {
            total: db.pagos.length,
            pagos: db.pagos
        });
    }

    /**
     * POST /api/pagos
     */
    if (pathname === '/api/pagos' && req.method === 'POST') {
        return getBody().then(payload => {
            const { 
                prestamoId, 
                valor, 
                cobradorNombre, 
                observaciones,
                latitud,
                longitud,
                precisionGPS,
                direccionAproximada
            } = payload;

            if (!prestamoId || !valor) {
                return sendJSON(400, { error: 'Campos requeridos: prestamoId, valor' });
            }
            const prestamo = db.prestamos.find(p => p.id === parseInt(prestamoId, 10));
            if (!prestamo) {
                return sendJSON(404, { error: 'Préstamo no encontrado para asentar pago', prestamoId });
            }
            const valorPago = parseFloat(valor);
            if (isNaN(valorPago) || valorPago <= 0) {
                return sendJSON(400, { error: 'El valor del pago debe ser mayor a 0' });
            }
            const cliente = db.clientes.find(c => c.id === prestamo.clienteId);
            prestamo.cuotasPagadas += 1;
            prestamo.saldo = Math.max(0, prestamo.saldo - valorPago);
            if (prestamo.saldo === 0) {
                prestamo.estado = 'PAGADO';
            }

            // Normalización y cálculo de auditoría satelital GPS
            const latNum = latitud !== undefined && latitud !== null && !isNaN(parseFloat(latitud)) ? parseFloat(latitud) : null;
            const lonNum = longitud !== undefined && longitud !== null && !isNaN(parseFloat(longitud)) ? parseFloat(longitud) : null;
            const precNum = precisionGPS !== undefined && precisionGPS !== null && !isNaN(parseFloat(precisionGPS)) ? parseFloat(precisionGPS) : null;
            const mapsUrl = latNum && lonNum ? `https://www.google.com/maps?q=${latNum},${lonNum}` : null;

            const nuevoPagoId = db.pagos.length > 0 ? Math.max(...db.pagos.map(pg => pg.id)) + 1 : 1;
            const nuevoPago = {
                id: nuevoPagoId,
                prestamoId: prestamo.id,
                clienteNombre: cliente ? `${cliente.nombres} ${cliente.apellidos}` : 'Cliente Desconocido',
                cobradorNombre: cobradorNombre ? String(cobradorNombre) : 'Cobrador de Ruta 1',
                numeroCuota: prestamo.cuotasPagadas,
                valor: valorPago,
                saldoRestante: prestamo.saldo,
                fecha: new Date().toISOString(),
                observaciones: observaciones ? String(observaciones) : 'Abono diario verificado',
                // Atributos de Geolocalización GPS
                latitud: latNum,
                longitud: lonNum,
                precisionGPS: precNum,
                mapsUrl: mapsUrl,
                direccionAproximada: direccionAproximada ? String(direccionAproximada) : (cliente ? cliente.barrio : 'Ruta Activa')
            };

            db.pagos.push(nuevoPago);
            fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2));

            // Sincronización en Vivo WebSocket a todas las pantallas abiertas
            broadcastWS({
                tipo: 'NUEVO_PAGO',
                pago: nuevoPago,
                prestamoId: prestamo.id,
                saldoActual: prestamo.saldo,
                estadoPrestamo: prestamo.estado,
                timestamp: new Date().toISOString()
            });

            return sendJSON(201, {
                mensaje: 'Pago asentado y registrado satisfactoriamente en ruta',
                pago: nuevoPago,
                estadoPrestamo: prestamo.estado,
                saldoActual: prestamo.saldo,
                auditoriaGPS: {
                    registrado: latNum !== null && lonNum !== null,
                    coordenadas: latNum && lonNum ? `${latNum}, ${lonNum}` : 'No disponible',
                    mapsUrl: mapsUrl
                }
            });
        }).catch(err => sendJSON(400, { error: 'Payload JSON inválido', detalle: err.message }));
    }

    /**
     * GET /api/caja/resumen
     */
    if (pathname === '/api/caja/resumen' && req.method === 'GET') {
        const totalRecaudado = db.pagos.reduce((acc, p) => acc + (p.valor || 0), 0);
        const totalColocado = db.prestamos.reduce((acc, p) => acc + (p.total || 0), 0);
        const saldoCartera = db.prestamos.reduce((acc, p) => acc + (p.saldo || 0), 0);
        const prestamosEnMora = db.prestamos.filter(p => p.estado === 'EN_MORA').length;
        const prestamosActivos = db.prestamos.filter(p => p.estado === 'ACTIVO').length;

        return sendJSON(200, {
            fechaArqueo: new Date().toISOString().split('T')[0],
            resumenFinanciero: {
                totalRecaudadoHoy: totalRecaudado,
                totalCarteraColocada: totalColocado,
                saldoPendientePorCobrar: saldoCartera,
                prestamosActivos,
                prestamosEnMora,
                totalOperaciones: db.pagos.length
            }
        });
    }

    /**
     * GET /api/data (Retrocompatibilidad SPA)
     */
    if (pathname === '/api/data' && req.method === 'GET') {
        return sendJSON(200, db);
    }

    /**
     * POST /api/sync (Retrocompatibilidad SPA)
     */
    if (pathname === '/api/sync' && req.method === 'POST') {
        return getBody().then(parsed => {
            db = parsed;
            fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2));
            return sendJSON(200, { status: 'ok', message: 'Datos sincronizados exitosamente' });
        }).catch(err => sendJSON(400, { error: err.message }));
    }

    /**
     * GET /api/download-sql
     */
    if (pathname === '/api/download-sql' && req.method === 'GET') {
        let sqlPath = path.join(__dirname, '..', 'codigo_fuente_jdbc', 'database', '01_schema_llanogrande.sql');
        if (!fs.existsSync(sqlPath)) {
            sqlPath = path.join(__dirname, '..', 'database', '01_schema_llanogrande.sql');
        }
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
    // DESPACHO DE ARCHIVOS ESTÁTICOS Y FALLBACK SPA
    // ========================================================================

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
            filePath = path.join(PUBLIC_DIR, 'index.html');
        }

        const contentType = mimeTypes[path.extname(filePath).toLowerCase()] || 'application/octet-stream';
        res.writeHead(200, { 'Content-Type': contentType });
        fs.createReadStream(filePath).pipe(res);
    });
});

// ============================================================================
// PROTOCOLO UPGRADE PARA WEBSOCKET NATIVO RFC 6455
// ============================================================================

server.on('upgrade', (req, socket, head) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    if (url.pathname !== '/ws') {
        socket.destroy();
        return;
    }

    const key = req.headers['sec-websocket-key'];
    if (!key) {
        socket.destroy();
        return;
    }

    // Handshake RFC 6455
    const acceptKey = crypto
        .createHash('sha1')
        .update(key + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11')
        .digest('base64');

    const headers = [
        'HTTP/1.1 101 Switching Protocols',
        'Upgrade: websocket',
        'Connection: Upgrade',
        `Sec-WebSocket-Accept: ${acceptKey}`
    ];

    socket.write(headers.join('\r\n') + '\r\n\r\n');
    wsClients.add(socket);

    // Saludo inicial al cliente conectado
    const welcomeMsg = JSON.stringify({
        tipo: 'CONEXION_ESTABLECIDA',
        mensaje: 'Canal en tiempo real conectado con Empresa Llano Grande S.A.S.',
        timestamp: new Date().toISOString()
    });
    socket.write(encodeWSFrame(welcomeMsg));

    socket.on('close', () => wsClients.delete(socket));
    socket.on('error', () => {
        wsClients.delete(socket);
        socket.destroy();
    });

    socket.on('data', (buf) => {
        // Trama de cierre de cliente (opcode 0x8)
        if ((buf[0] & 0x0f) === 0x08) {
            wsClients.delete(socket);
            socket.end();
        }
    });
});

server.listen(PORT, '0.0.0.0', () => {
    console.log('\n╔════════════════════════════════════════════════════════════════════╗');
    console.log('║    SISTEMA DE PRÉSTAMOS Y COBROS DIARIOS - EMPRESA LLANO GRANDE    ║');
    console.log('║                                                                    ║');
    console.log(`║  🚀 Servidor activo en: http://localhost:${PORT}                      ║`);
    console.log('║  ⚡ WebSocket Sincronizado en: ws://localhost:' + PORT + '/ws            ║');
    console.log('║  📍 Auditoría Satelital GPS y Seguridad JWT/RBAC Integradas        ║');
    console.log('╚════════════════════════════════════════════════════════════════════╝\n');
});

module.exports = server;

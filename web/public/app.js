// ====================================================================
// EMPRESA LLANO GRANDE | SISTEMA DE CARTERA Y COBRANZA DIARIA
// FRONTEND CONTROLLER (JAVASCRIPT VANILLA MODERNO)
// ====================================================================

const state = {
    clientes: [],
    prestamos: [],
    pagos: [],
    cobradores: [
        { id: 1, nombre: 'Juan Carlos', ruta: 'Ruta 01 - Centro / Mercado' },
        { id: 2, nombre: 'Pedro Pablo', ruta: 'Ruta 02 - Sur / Primavera' }
    ],
    usuarioActivo: { id: 1, nombre: 'Adriana Villazón', rol: 'ADMINISTRADOR', team: 'Spark Pixel Team' },
    activeTab: 'dashboard',
    activeFilterRuta: 'todos',
    activeRouteFilter: 'todas',
    planillaViewMode: 'table',
    currencyMode: 'USD', // 'USD' (estilo imagen $20,320) o 'COP' (pesos colombianos)
    chartPeriod: 'monthly',
    selectedMonthIdx: 5 // JUN por defecto como en la imagen
};

// Datos del Gráfico de Ventas (Sales Trend)
const trendDataSets = {
    monthly: {
        total: '$20,320',
        months: [
            { month: 'JAN', newUsers: 10, existing: 8, totalK: 18 },
            { month: 'FEB', newUsers: 14, existing: 12, totalK: 26 },
            { month: 'MAR', newUsers: 12, existing: 10, totalK: 22 },
            { month: 'APR', newUsers: 18, existing: 12, totalK: 30 },
            { month: 'MAY', newUsers: 22, existing: 18, totalK: 40 },
            { month: 'JUN', newUsers: 38, existing: 18, totalK: 56 }, // Mes activo de la imagen
            { month: 'JUL', newUsers: 25, existing: 16, totalK: 41 },
            { month: 'AUG', newUsers: 16, existing: 12, totalK: 28 },
            { month: 'SEP', newUsers: 20, existing: 14, totalK: 34 },
            { month: 'OCT', newUsers: 26, existing: 20, totalK: 46 },
            { month: 'NOV', newUsers: 18, existing: 14, totalK: 32 },
            { month: 'DEC', newUsers: 28, existing: 22, totalK: 50 }
        ]
    },
    weekly: {
        total: '$5,840',
        months: [
            { month: 'W1', newUsers: 8, existing: 6, totalK: 14 },
            { month: 'W2', newUsers: 12, existing: 9, totalK: 21 },
            { month: 'W3', newUsers: 15, existing: 11, totalK: 26 },
            { month: 'W4', newUsers: 19, existing: 14, totalK: 33 },
            { month: 'W5', newUsers: 22, existing: 16, totalK: 38 },
            { month: 'W6', newUsers: 30, existing: 18, totalK: 48 },
            { month: 'W7', newUsers: 24, existing: 15, totalK: 39 },
            { month: 'W8', newUsers: 18, existing: 12, totalK: 30 },
            { month: 'W9', newUsers: 21, existing: 14, totalK: 35 },
            { month: 'W10', newUsers: 25, existing: 17, totalK: 42 },
            { month: 'W11', newUsers: 20, existing: 13, totalK: 33 },
            { month: 'W12', newUsers: 26, existing: 19, totalK: 45 }
        ]
    },
    yearly: {
        total: '$245,800',
        months: [
            { month: '2015', newUsers: 80, existing: 40, totalK: 120 },
            { month: '2016', newUsers: 110, existing: 60, totalK: 170 },
            { month: '2017', newUsers: 130, existing: 80, totalK: 210 },
            { month: '2018', newUsers: 160, existing: 100, totalK: 260 },
            { month: '2019', newUsers: 190, existing: 120, totalK: 310 },
            { month: '2020', newUsers: 240, existing: 150, totalK: 390 },
            { month: '2021', newUsers: 270, existing: 180, totalK: 450 },
            { month: '2022', newUsers: 310, existing: 210, totalK: 520 },
            { month: '2023', newUsers: 360, existing: 250, totalK: 610 },
            { month: '2024', newUsers: 410, existing: 290, totalK: 700 },
            { month: '2025', newUsers: 460, existing: 340, totalK: 800 },
            { month: '2026', newUsers: 510, existing: 380, totalK: 890 }
        ]
    }
};

// Formateador de moneda adaptable
function formatMoney(amount) {
    const num = Number(amount) || 0;
    if (state.currencyMode === 'USD') {
        // Formato limpio tipo $20,320
        return '$' + num.toLocaleString('en-US', { maximumFractionDigits: 0 });
    } else {
        // Formato pesos colombianos
        return '$ ' + num.toLocaleString('es-CO', { maximumFractionDigits: 0 });
    }
}

function formatDate(dateStr) {
    if (!dateStr) return '--';
    const d = new Date(dateStr);
    return d.toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' });
}

// ====================================================================
// SEGURIDAD, AUTENTICACIÓN JWT Y CONTROL DE ACCESO BASADO EN ROLES (RBAC)
// ====================================================================
const USERS_CATALOG = {
    'admin@llanogrande.com': {
        id: 1,
        email: 'admin@llanogrande.com',
        nombre: 'Adriana Cristina Villazón Soto',
        nombreCorto: 'Adriana Villazón',
        cargo: 'Desarrolladora Líder & Administradora General',
        rol: 'ADMIN',
        initials: 'AV',
        token: null
    },
    'juan.cobrador@llanogrande.com': {
        id: 2,
        email: 'juan.cobrador@llanogrande.com',
        nombre: 'Juan Carlos Pérez',
        nombreCorto: 'Juan Carlos',
        cargo: 'Cobrador de Ruta 01 - Centro',
        rol: 'COBRADOR',
        initials: 'JC',
        token: null
    },
    'pedro.cobrador@llanogrande.com': {
        id: 3,
        email: 'pedro.cobrador@llanogrande.com',
        nombre: 'Pedro Pablo Morales',
        nombreCorto: 'Pedro Pablo',
        cargo: 'Cobrador de Ruta 02 - Sur',
        rol: 'COBRADOR',
        initials: 'PP',
        token: null
    }
};

let currentSession = {
    user: USERS_CATALOG['admin@llanogrande.com'],
    token: null
};

// Generador de fallback JWT cliente en caso de modo offline (simulación HMAC SHA256 base64)
function generateClientJWT(user) {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).replace(/=+$/, '');
    const payload = btoa(JSON.stringify({
        id: user.id,
        email: user.email,
        nombre: user.nombre,
        rol: user.rol,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 86400
    })).replace(/=+$/, '');
    const fakeSig = btoa(`sig_${user.rol}_${Date.now()}`).replace(/=+$/, '');
    return `${header}.${payload}.${fakeSig}`;
}

async function loginUser(email, password = '') {
    const cleanPass = password || (email.startsWith('admin') ? 'admin123' : 'cobrador123');
    try {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password: cleanPass })
        });
        if (res.ok) {
            const data = await res.json();
            currentSession.user = data.usuario;
            currentSession.token = data.token;
            localStorage.setItem('llanogrande_auth_token', data.token);
            localStorage.setItem('llanogrande_auth_email', email);
            updateUserInterfaceRBAC();
            return currentSession;
        } else if (res.status === 401) {
            return null;
        }
    } catch (e) {
        console.warn('API de autenticación no respondió, evaluando sesión local:', e);
    }

    const fallbackUser = USERS_CATALOG[email];
    if (fallbackUser) {
        const token = generateClientJWT(fallbackUser);
        currentSession.user = fallbackUser;
        currentSession.token = token;
        localStorage.setItem('llanogrande_auth_token', token);
        localStorage.setItem('llanogrande_auth_email', email);
        updateUserInterfaceRBAC();
        return currentSession;
    }
    return null;
}

function openLoginModal() {
    const modal = document.getElementById('modal-landing-login');
    if (modal) {
        modal.style.display = 'flex';
        const errorEl = document.getElementById('landing-login-error');
        if (errorEl) errorEl.style.display = 'none';
    }
}

function closeLoginModal() {
    const modal = document.getElementById('modal-landing-login');
    if (modal) modal.style.display = 'none';
}

function fillLoginForm(email, password, roleKey) {
    const emailInput = document.getElementById('landing-email');
    const passInput = document.getElementById('landing-password');
    if (emailInput) emailInput.value = email;
    if (passInput) passInput.value = password;

    const chips = document.querySelectorAll('.landing-role-chip');
    chips.forEach(c => c.classList.remove('active'));
    const targetChip = document.getElementById(`chip-role-${roleKey}`);
    if (targetChip) targetChip.classList.add('active');
}

async function handleLandingLogin(event) {
    if (event) event.preventDefault();
    const emailInput = document.getElementById('landing-email');
    const passInput = document.getElementById('landing-password');
    const submitBtn = document.getElementById('btn-landing-submit');
    const errorEl = document.getElementById('landing-login-error');

    const email = emailInput ? emailInput.value.trim() : '';
    const password = passInput ? passInput.value : '';

    if (!email || !password) {
        if (errorEl) {
            errorEl.textContent = 'Por favor ingrese correo y contraseña.';
            errorEl.style.display = 'block';
        }
        return;
    }

    const originalText = submitBtn ? submitBtn.textContent : '';
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Verificando credenciales...';
    }
    if (errorEl) errorEl.style.display = 'none';

    try {
        const session = await loginUser(email, password);
        if (session && session.user) {
            localStorage.setItem('llanogrande_session_active', 'true');
            sessionStorage.setItem('llanogrande_session_active', 'true');
            closeLoginModal();
            showAppView();
            showToast(`Bienvenido al sistema, ${session.user.nombre}`, 'success');
        } else {
            if (errorEl) {
                errorEl.textContent = 'Credenciales no válidas. Verifique correo y contraseña.';
                errorEl.style.display = 'block';
            }
        }
    } catch (e) {
        if (errorEl) {
            errorEl.textContent = 'Error al comunicar con el servicio de autenticación.';
            errorEl.style.display = 'block';
        }
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    }
}

async function quickEnterDemo() {
    await loginUser('admin@llanogrande.com', 'admin123');
    localStorage.setItem('llanogrande_session_active', 'true');
    sessionStorage.setItem('llanogrande_session_active', 'true');
    showAppView();
    showToast('Sesión de prueba iniciada como Administrador', 'success');
}

function showLandingView() {
    const landingView = document.getElementById('landing-view');
    const appView = document.getElementById('app-view');
    if (landingView) landingView.style.display = 'flex';
    if (appView) appView.style.display = 'none';
    document.title = 'Llano Grande • Sistema de Gestión de Microcréditos y Cobranza';
    try {
        if (window.location.hash !== '' && window.location.hash !== '#landing' && !['inicio', 'plataforma', 'caracteristicas', 'seguridad'].includes(window.location.hash.replace('#', ''))) {
            history.replaceState(null, '', '#landing');
        }
    } catch (e) {}
}

function showAppView() {
    const landingView = document.getElementById('landing-view');
    const appView = document.getElementById('app-view');
    if (landingView) landingView.style.display = 'none';
    if (appView) appView.style.display = 'flex';
    document.title = 'Dashboard | Spark Pixel Team • Llano Grande';
    const targetTab = isValidTab(window.location.hash.replace('#', '')) ? window.location.hash.replace('#', '') : (state.activeTab || 'dashboard');
    switchTab(targetTab);
    renderAll();
    renderSalesTrendChart();
}

function logoutUser() {
    localStorage.removeItem('llanogrande_session_active');
    sessionStorage.removeItem('llanogrande_session_active');
    showLandingView();
    showToast('Sesión finalizada correctamente', 'info');
}

function initAuthSession() {
    const hasActiveSession = localStorage.getItem('llanogrande_session_active') === 'true';
    const hash = window.location.hash;

    // Si tiene sesión activa y el hash indica explícitamente #app o un tab de la app
    if (hasActiveSession && (hash === '#app' || isValidTab(hash.replace('#', '')))) {
        const savedEmail = localStorage.getItem('llanogrande_auth_email') || 'admin@llanogrande.com';
        loginUser(savedEmail);
        showAppView();
    } else {
        // En cualquier otra circunstancia (primera visita o recarga en raíz): mostrar landing page
        const savedEmail = localStorage.getItem('llanogrande_auth_email') || 'admin@llanogrande.com';
        loginUser(savedEmail); // pre-cargar permisos de sesión en segundo plano
        showLandingView();
    }
}

function switchUser(email) {
    loginUser(email);
    closeModal('modal-auth-role');
    showToast(`Sesión cambiada a: ${currentSession.user.nombre} (${currentSession.user.rol})`, 'info');
}

function updateUserInterfaceRBAC() {
    const u = currentSession.user;
    if (!u) return;

    // Resolver nombre legible sin truncamiento
    const rawName = u.nombreCompleto || u.nombre || 'Adriana Villazón';
    const shortName = u.nombreCorto || (rawName.includes('Adriana') ? 'Adriana Villazón' : rawName.split(' ').slice(0, 2).join(' '));

    // Actualizar User Card en Sidebar
    const initialsElem = document.getElementById('user-avatar-initials');
    const nameElem = document.getElementById('user-display-name');
    const roleBadge = document.getElementById('user-role-badge');
    const contextElem = document.getElementById('user-role-context');

    if (initialsElem) {
        initialsElem.textContent = u.initials || shortName.split(' ').map(n => n[0]).slice(0, 2).join('');
        initialsElem.className = `user-avatar-pro ${u.rol.toLowerCase()}`;
    }
    if (nameElem) nameElem.textContent = shortName;
    if (roleBadge) {
        roleBadge.textContent = u.rol === 'ADMIN' ? 'Admin' : 'Cobrador';
        roleBadge.className = `role-pill-pro ${u.rol === 'ADMIN' ? 'role-admin' : 'role-cobrador'}`;
    }
    if (contextElem) {
        contextElem.textContent = u.rol === 'ADMIN' 
            ? '• Sistema' 
            : (u.email && u.email.includes('juan') ? '• Ruta 01' : '• Ruta 02');
    }

    // Actualizar Modal RBAC Activo
    document.querySelectorAll('.rbac-user-card').forEach(card => card.classList.remove('active'));
    if (u.email === 'admin@llanogrande.com') {
        const c = document.getElementById('user-opt-admin');
        if (c) c.classList.add('active');
    } else if (u.email === 'juan.cobrador@llanogrande.com') {
        const c = document.getElementById('user-opt-cobrador1');
        if (c) c.classList.add('active');
    } else if (u.email === 'pedro.cobrador@llanogrande.com') {
        const c = document.getElementById('user-opt-cobrador2');
        if (c) c.classList.add('active');
    }

    // Vista previa de Token en modal
    const tokenPreview = document.getElementById('jwt-token-preview');
    if (tokenPreview && currentSession.token) {
        tokenPreview.textContent = currentSession.token.slice(0, 48) + '...';
    }

    // Reglas de acceso RBAC según rol
    const btnNewLoan = document.getElementById('btn-topbar-action');
    const adminTabs = ['roles', 'cierre', 'integraciones', 'configuracion', 'campanas'];

    if (u.rol === 'COBRADOR') {
        // Bloquear colocación de préstamos
        if (btnNewLoan) {
            btnNewLoan.style.opacity = '0.45';
            btnNewLoan.style.cursor = 'not-allowed';
            btnNewLoan.title = 'Acceso Restringido: Solo Administrador puede colocar préstamos';
            btnNewLoan.onclick = () => {
                showToast('Acceso denegado: El rol COBRADOR no puede colocar préstamos (403 Forbidden)', 'error');
            };
        }
        // Ocultar tabs de administración
        document.querySelectorAll('.nav-btn').forEach(btn => {
            if (adminTabs.includes(btn.dataset.tab)) {
                btn.style.display = 'none';
            } else {
                btn.style.display = 'flex';
            }
        });
        // Si estaba en tab restringido, cambiar a planillas
        if (adminTabs.includes(state.activeTab)) {
            switchTab('planillas');
        }
    } else {
        // Rol ADMIN: Acceso total
        if (btnNewLoan) {
            btnNewLoan.style.opacity = '1';
            btnNewLoan.style.cursor = 'pointer';
            btnNewLoan.title = 'Colocar nuevo microcrédito';
            btnNewLoan.onclick = () => switchTab('prestamos');
        }
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.style.display = 'flex';
        });
    }
}

// ====================================================================
// GEOLOCALIZACIÓN GPS SATELITAL PARA AUDITORÍA EN RUTA
// ====================================================================
function captureGPSCoordinates() {
    const statusText = document.getElementById('cobro-gps-status-text');
    const radarDot = document.getElementById('gps-radar-dot');
    const latDisplay = document.getElementById('cobro-lat-display');
    const lonDisplay = document.getElementById('cobro-lon-display');
    const accDisplay = document.getElementById('cobro-acc-display');
    const latInput = document.getElementById('cobro-latitud');
    const lonInput = document.getElementById('cobro-longitud');
    const accInput = document.getElementById('cobro-precision');

    if (statusText) statusText.textContent = 'Sincronizando señal GPS del cobrador...';
    if (radarDot) radarDot.classList.add('searching');

    const fallbackGPS = () => {
        // Coordenadas base en Valledupar con ligera micro-variación para simular ruta real
        const jitter = (Math.random() - 0.5) * 0.003;
        const lat = (10.463280 + jitter).toFixed(6);
        const lon = (-73.253150 + jitter).toFixed(6);
        const acc = Math.floor(Math.random() * 5) + 4; // 4 a 8 metros

        if (latDisplay) latDisplay.textContent = lat;
        if (lonDisplay) lonDisplay.textContent = lon;
        if (accDisplay) accDisplay.textContent = `±${acc}m`;
        if (latInput) latInput.value = lat;
        if (lonInput) lonInput.value = lon;
        if (accInput) accInput.value = acc;
        if (statusText) statusText.textContent = 'Fijado por señal de ruta (Valledupar)';
        if (radarDot) radarDot.classList.remove('searching');
    };

    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const lat = pos.coords.latitude.toFixed(6);
                const lon = pos.coords.longitude.toFixed(6);
                const acc = Math.round(pos.coords.accuracy);
                if (latDisplay) latDisplay.textContent = lat;
                if (lonDisplay) lonDisplay.textContent = lon;
                if (accDisplay) accDisplay.textContent = `±${acc}m`;
                if (latInput) latInput.value = lat;
                if (lonInput) lonInput.value = lon;
                if (accInput) accInput.value = acc;
                if (statusText) statusText.textContent = `Señal satelital activa (Precisión: ±${acc}m)`;
                if (radarDot) radarDot.classList.remove('searching');
            },
            () => {
                fallbackGPS();
            },
            { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );
    } else {
        fallbackGPS();
    }
}

// ====================================================================
// SINCRONIZACIÓN EN TIEMPO REAL VÍA WEBSOCKETS (RFC 6455)
// ====================================================================
let wsSocket = null;
let wsReconnectInterval = null;

function initWebSocket() {
    try {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const host = window.location.host;
        if (!host) {
            updateWSStatus(false);
            return;
        }
        const wsUrl = `${protocol}//${host}/ws`;
        wsSocket = new WebSocket(wsUrl);

        wsSocket.onopen = () => {
            updateWSStatus(true);
            clearTimeout(wsReconnectInterval);
        };

        wsSocket.onmessage = (event) => {
            try {
                const msg = JSON.parse(event.data);
                handleIncomingWSMessage(msg);
            } catch (e) {
                console.warn('Error deserializando mensaje WebSocket:', e);
            }
        };

        wsSocket.onclose = () => {
            updateWSStatus(false);
            wsReconnectInterval = setTimeout(initWebSocket, 4000);
        };

        wsSocket.onerror = () => {
            updateWSStatus(false);
        };
    } catch (e) {
        updateWSStatus(false);
    }
}

function updateWSStatus(isOnline) {
    const dot = document.getElementById('ws-live-dot');
    const text = document.getElementById('ws-live-text');
    const avatarLive = document.getElementById('avatar-live-indicator');

    if (dot) {
        dot.className = `sync-dot-pulse ${isOnline ? '' : 'offline'}`;
    }
    if (avatarLive) {
        avatarLive.className = `avatar-live-dot ${isOnline ? 'online' : 'offline'}`;
    }
    if (text) {
        text.textContent = isOnline ? 'Live Sync • Conectado' : 'Base Local • Desconectado';
    }
}

// Reproducir tono sutil de confirmación usando Web Audio API estándar (cero archivos externos)
function playNotificationChime() {
    try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, ctx.currentTime); // Nota D5
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // Nota A5

        gain.gain.setValueAtTime(0.06, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
    } catch (e) {}
}

function showWSToast(tipo, titulo, descripcion, metaHtml = '') {
    const container = document.getElementById('ws-toast-container');
    if (!container) return;

    playNotificationChime();

    const toast = document.createElement('div');
    toast.className = `ws-toast ${tipo.toLowerCase().replace(/_/g, '-')}`;
    toast.innerHTML = `
        <div class="ws-toast-icon">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <polyline points="20 6 9 17 4 12"/>
            </svg>
        </div>
        <div class="ws-toast-content">
            <div class="ws-toast-title">
                <span>${titulo}</span>
                <button class="ws-toast-close" onclick="this.closest('.ws-toast').remove()" aria-label="Cerrar"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button>
            </div>
            <div class="ws-toast-desc">${descripcion}</div>
            <div class="ws-toast-meta">
                <span class="ws-toast-time">Ahora mismo</span>
                ${metaHtml}
            </div>
        </div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        if (toast.parentElement) {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(10px)';
            toast.style.transition = 'all 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }
    }, 6000);
}

function handleIncomingWSMessage(msg) {
    if (!msg || !msg.evento) return;

    if (msg.evento === 'NUEVO_PAGO' && msg.data) {
        const p = msg.data;
        // Evitar duplicados si ya fue asentado localmente
        const existe = state.pagos.find(x => x.id === p.id);
        if (!existe) {
            state.pagos.unshift(p);
            // Actualizar saldo del préstamo asociado
            const prestamo = state.prestamos.find(pr => pr.id === p.prestamoId);
            if (prestamo) {
                prestamo.saldo = p.saldoRestante;
                prestamo.cuotasPagadas = p.numeroCuota;
                if (p.saldoRestante === 0) prestamo.estado = 'CANCELADO';
            }
            saveState();
            renderAll();
        }

        const mapsBtn = p.mapsUrl ? `<a href="${p.mapsUrl}" target="_blank" class="ws-toast-link">Ver GPS ↗</a>` : '';
        showWSToast(
            'NUEVO_PAGO',
            'Recaudo en Tiempo Real Asentado',
            `<strong>${p.cobradorNombre}</strong> recaudó <strong>${formatMoney(p.valor)}</strong> de ${p.clienteNombre}. Saldo: ${formatMoney(p.saldoRestante)}.`,
            `<span style="display:flex; gap:8px;"><button class="btn btn-xs btn-secondary" onclick="mostrarReciboDigital(${p.id})">Recibo</button>${mapsBtn}</span>`
        );
    } else if (msg.evento === 'NUEVO_PRESTAMO' && msg.data) {
        const pr = msg.data;
        const existe = state.prestamos.find(x => x.id === pr.id);
        if (!existe) {
            state.prestamos.unshift(pr);
            saveState();
            renderAll();
        }
        showWSToast(
            'NUEVO_PRESTAMO',
            'Nuevo Préstamo Desembolsado',
            `Colocación comercial por <strong>${formatMoney(pr.monto)}</strong> (Total: ${formatMoney(pr.total)}) asignado a ruta.`,
            `<button class="btn btn-xs btn-secondary" onclick="verTarjeton(${pr.id})">Ver Tarjetón</button>`
        );
    } else if (msg.evento === 'NUEVO_CLIENTE' && msg.data) {
        const c = msg.data;
        const existe = state.clientes.find(x => x.id === c.id || x.cedula === c.cedula);
        if (!existe) {
            state.clientes.unshift(c);
            saveState();
            renderAll();
        }
        showWSToast(
            'NUEVO_CLIENTE',
            'Nuevo Cliente Registrado',
            `Titular <strong>${c.nombres} ${c.apellidos}</strong> registrado en sector ${c.barrio || 'Centro'}.`,
            `<span class="ws-toast-time">Cédula: ${c.cedula}</span>`
        );
    }
}

// ====================================================================
// INICIALIZACIÓN
// ====================================================================
document.addEventListener('DOMContentLoaded', async () => {
    // Sincronización síncrona inmediata de la pestaña activa desde la URL
    const initialHash = window.location.hash.replace('#', '');
    if (initialHash && isValidTab(initialHash)) {
        switchTab(initialHash);
    }

    initEventListeners();
    
    // Restaurar estado persistido del sidebar lateral (colapsado / expandido)
    try {
        if (localStorage.getItem('llanogrande_sidebar_collapsed') === 'true') {
            toggleSidebar(true);
        }
    } catch (e) {}

    await loadInitialData();
    initAuthSession();
    initWebSocket();
    renderAll();
    renderSalesTrendChart();

    // Reconfirmar soporte para deep-linking y parámetros modales
    const hash = window.location.hash.replace('#', '');
    if (hash && isValidTab(hash)) {
        switchTab(hash);
    }
    const params = new URLSearchParams(window.location.search);
    if (params.get('collapsed') === '1' || params.get('collapsed') === 'true') {
        toggleSidebar(true);
    }
    if (params.get('role') === 'cobrador') {
        switchUser('juan.cobrador@llanogrande.com');
    }
    if (params.get('tarjeton')) {
        verTarjeton(Number(params.get('tarjeton')));
    }
    if (params.get('recibo')) {
        mostrarReciboDigital(Number(params.get('recibo')));
    }
    if (params.get('cobro')) {
        openModalCobro(Number(params.get('cobro')));
    }
    if (params.get('auth')) {
        openModal('modal-auth-role');
    }
    if (params.get('toast')) {
        showWSToast(
            'NUEVO_PAGO',
            'Recaudo en Tiempo Real Asentado',
            'Juan Carlos recaudó $25,000 de María Elena Ríos Salazar (Cuota #4). Saldo: $500,000.',
            '<a href="https://www.google.com/maps?q=10.46328,-73.25315" target="_blank" class="ws-toast-link">Auditoría GPS ↗</a>'
        );
    }
});

window.addEventListener('hashchange', () => {
    const hash = window.location.hash.replace('#', '');
    if (hash === 'landing' || hash === 'inicio' || hash === 'caracteristicas' || hash === 'plataforma' || hash === 'seguridad') {
        showLandingView();
    } else if (isValidTab(hash) || hash === 'app') {
        showAppView();
    }
});

function isValidTab(tab) {
    return [
        'dashboard', 'prestamos', 'transacciones', 'analitica', 'mensajes',
        'rendimiento', 'campanas', 'clientes', 'rutas', 'planillas',
        'roles', 'cierre', 'integraciones', 'configuracion'
    ].includes(tab);
}

// ====================================================================
// CARGA Y SINCRONIZACIÓN DE DATOS
// ====================================================================
async function loadInitialData() {
    try {
        const res = await fetch('/api/data');
        if (res.ok) {
            const data = await res.json();
            state.clientes = data.clientes || [];
            state.prestamos = data.prestamos || [];
            state.pagos = data.pagos || [];
            return;
        }
    } catch (e) {
        console.warn('API local no disponible, recurriendo a estado local o seed:', e);
    }

    const local = localStorage.getItem('spark_llanogrande_state');
    if (local) {
        try {
            const parsed = JSON.parse(local);
            state.clientes = parsed.clientes || [];
            state.prestamos = parsed.prestamos || [];
            state.pagos = parsed.pagos || [];
            return;
        } catch (e) {}
    }

    // Datos semilla iniciales
    state.clientes = [
        { id: 1, cedula: '1098765432', nombres: 'María Elena', apellidos: 'Ríos Salazar', telefono: '3124567890', direccion: 'Calle 14 # 25-30', barrio: 'Centro', activo: true },
        { id: 2, cedula: '1098765433', nombres: 'Carlos Andrés', apellidos: 'Martínez Gómez', telefono: '3137890123', direccion: 'Carrera 8 # 12-45', barrio: 'El Bosque', activo: true },
        { id: 3, cedula: '1098765434', nombres: 'Gloria Stella', apellidos: 'Pérez Cuéllar', telefono: '3145678901', direccion: 'Manzana 4 Lote 12', barrio: 'Llano Lindo', activo: true },
        { id: 4, cedula: '1098765435', nombres: 'Javier Fernando', apellidos: 'Díaz Moncada', telefono: '3178901234', direccion: 'Avenida Colombia # 40-10', barrio: 'San Isidro', activo: true },
        { id: 5, cedula: '1098765436', nombres: 'Sandra Milena', apellidos: 'Torres Benítez', telefono: '3182345678', direccion: 'Transversal 5 # 18-09', barrio: 'La Primavera', activo: true }
    ];

    state.prestamos = [
        { id: 1, clienteId: 1, monto: 500000, interes: 20, total: 600000, cuotas: 24, valorCuota: 25000, saldo: 525000, cuotasPagadas: 3, fechaInicio: '2026-10-01', vencimiento: '2026-10-28', estado: 'ACTIVO', cobradorId: 1 },
        { id: 2, clienteId: 2, monto: 300000, interes: 20, total: 360000, cuotas: 20, valorCuota: 18000, saldo: 360000, cuotasPagadas: 0, fechaInicio: '2026-10-05', vencimiento: '2026-10-27', estado: 'EN_MORA', cobradorId: 1 },
        { id: 3, clienteId: 3, monto: 1000000, interes: 20, total: 1200000, cuotas: 30, valorCuota: 40000, saldo: 1200000, cuotasPagadas: 0, fechaInicio: '2026-10-07', vencimiento: '2026-11-10', estado: 'ACTIVO', cobradorId: 2 }
    ];

    state.pagos = [
        { id: 1, prestamoId: 1, clienteNombre: 'María Elena Ríos Salazar', cobradorNombre: 'Juan Carlos', numeroCuota: 1, valor: 25000, saldoRestante: 575000, fecha: new Date(Date.now() - 86400000*2).toISOString(), observaciones: 'Pago puntual' },
        { id: 2, prestamoId: 1, clienteNombre: 'María Elena Ríos Salazar', cobradorNombre: 'Juan Carlos', numeroCuota: 2, valor: 25000, saldoRestante: 550000, fecha: new Date(Date.now() - 86400000).toISOString(), observaciones: 'Cuota normal' },
        { id: 3, prestamoId: 1, clienteNombre: 'María Elena Ríos Salazar', cobradorNombre: 'Juan Carlos', numeroCuota: 3, valor: 25000, saldoRestante: 525000, fecha: new Date().toISOString(), observaciones: 'Pago hoy en su local' }
    ];

    saveState();
}

function saveState() {
    localStorage.setItem('spark_llanogrande_state', JSON.stringify(state));
    fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(state)
    }).catch(() => {});
}

// ====================================================================
// COLAPSO Y EXPANSIÓN DEL SIDEBAR LATERAL
// ====================================================================
function toggleSidebar(forceState) {
    const sidebar = document.querySelector('.app-sidebar');
    if (!sidebar) return;

    const shouldCollapse = typeof forceState === 'boolean'
        ? forceState
        : !sidebar.classList.contains('collapsed');

    if (shouldCollapse) {
        sidebar.classList.add('collapsed');
        try { localStorage.setItem('llanogrande_sidebar_collapsed', 'true'); } catch (e) {}
        const btn = document.getElementById('btn-sidebar-collapse');
        if (btn) btn.setAttribute('title', 'Expandir menú lateral (Ctrl+B)');
    } else {
        sidebar.classList.remove('collapsed');
        try { localStorage.setItem('llanogrande_sidebar_collapsed', 'false'); } catch (e) {}
        const btn = document.getElementById('btn-sidebar-collapse');
        if (btn) btn.setAttribute('title', 'Contraer menú lateral (Ctrl+B)');
    }

    // Disparar evento de redimensionamiento para refrescar gráficos responsivos
    setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
    }, 240);
}

// ====================================================================
// NAVEGACIÓN Y EVENT LISTENERS
// ====================================================================
function initEventListeners() {
    // Botones del Sidebar
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.dataset.tab;
            if (tab) switchTab(tab);
        });
    });

    // Toggle de Colapso del Sidebar Lateral
    const collapseBtn = document.getElementById('btn-sidebar-collapse');
    if (collapseBtn) {
        collapseBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleSidebar();
        });
    }

    // Atajo de Teclado Ctrl+B / Cmd+B para alternar el menú lateral
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
            e.preventDefault();
            toggleSidebar();
        }
    });

    // Workspace Switcher
    const wsBtn = document.getElementById('btn-workspace-switcher');
    if (wsBtn) wsBtn.addEventListener('click', () => openModal('modal-workspace'));
    const wsCloseBtn = document.getElementById('btn-close-modal-workspace');
    if (wsCloseBtn) wsCloseBtn.addEventListener('click', () => closeModal('modal-workspace'));
    const wsCancelBtn = document.getElementById('btn-cancel-modal-workspace');
    if (wsCancelBtn) wsCancelBtn.addEventListener('click', () => closeModal('modal-workspace'));

    // Selector de Periodos del Gráfico (Weekly, Monthly, Yearly)
    document.querySelectorAll('.period-pill-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.period-pill-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.chartPeriod = btn.dataset.period;
            renderSalesTrendChart();
        });
    });

    // Toggle de Moneda USD / COP
    const currBtn = document.getElementById('btn-toggle-currency');
    if (currBtn) {
        currBtn.addEventListener('click', () => {
            setCurrencyMode(state.currencyMode === 'USD' ? 'COP' : 'USD');
        });
    }

    // Selector de Moneda en Configuración
    const settingsCurr = document.getElementById('settings-currency-select');
    if (settingsCurr) {
        settingsCurr.value = state.currencyMode;
        settingsCurr.addEventListener('change', (e) => setCurrencyMode(e.target.value));
    }

    // Inicializar Fecha en Vivo en Topbar
    const topbarDateElem = document.getElementById('topbar-live-date');
    if (topbarDateElem) {
        const today = new Date();
        const formatted = today.toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' });
        topbarDateElem.textContent = formatted;
    }

    // Atajo Global Ctrl+K / Cmd+K para Búsqueda
    window.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
            e.preventDefault();
            const searchInput = document.getElementById('global-search');
            if (searchInput) {
                searchInput.focus();
                searchInput.select();
            }
        }
    });

    // Buscador Global Topbar
    const globalSearch = document.getElementById('global-search');
    if (globalSearch) {
        globalSearch.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            handleGlobalSearch(query);
        });
    }

    // Filtros de Planilla de Recaudo en Calle
    document.querySelectorAll('.filter-chip').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-chip').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.activeFilterRuta = btn.dataset.filter;
            renderPlanillaRuta();
        });
    });

    // Búsqueda específica en Planilla y Clientes
    const rutaSearch = document.getElementById('ruta-search');
    if (rutaSearch) rutaSearch.addEventListener('input', renderPlanillaRuta);
    const cliSearch = document.getElementById('clientes-search');
    if (cliSearch) cliSearch.addEventListener('input', renderClientes);

    // Modal Cliente
    const btnOpenCli = document.getElementById('btn-open-modal-cliente');
    if (btnOpenCli) btnOpenCli.addEventListener('click', () => openModalCliente());
    const btnCloseCli = document.getElementById('btn-close-modal-cliente');
    if (btnCloseCli) btnCloseCli.addEventListener('click', () => closeModal('modal-cliente'));
    const btnCancelCli = document.getElementById('btn-cancel-modal-cliente');
    if (btnCancelCli) btnCancelCli.addEventListener('click', () => closeModal('modal-cliente'));
    const formCli = document.getElementById('form-cliente');
    if (formCli) formCli.addEventListener('submit', handleClienteSubmit);

    // Modal Cobro
    const btnCloseCobro = document.getElementById('btn-close-modal-cobro');
    if (btnCloseCobro) btnCloseCobro.addEventListener('click', () => closeModal('modal-cobro'));
    const btnCancelCobro = document.getElementById('btn-cancel-modal-cobro');
    if (btnCancelCobro) btnCancelCobro.addEventListener('click', () => closeModal('modal-cobro'));
    const formCobro = document.getElementById('form-cobro');
    if (formCobro) formCobro.addEventListener('submit', handleCobroSubmit);
    const btnRefreshGps = document.getElementById('btn-refresh-gps');
    if (btnRefreshGps) btnRefreshGps.addEventListener('click', captureGPSCoordinates);

    // Modal Auth / RBAC
    const btnCloseAuth = document.getElementById('btn-close-modal-auth');
    if (btnCloseAuth) btnCloseAuth.addEventListener('click', () => closeModal('modal-auth-role'));
    const btnCancelAuth = document.getElementById('btn-cancel-modal-auth');
    if (btnCancelAuth) btnCancelAuth.addEventListener('click', () => closeModal('modal-auth-role'));

    // Chips rápidos de pago
    const chipExacta = document.getElementById('chip-cuota-exacta');
    if (chipExacta) {
        chipExacta.addEventListener('click', () => {
            const val = chipExacta.dataset.value;
            if (val) document.getElementById('cobro-monto').value = val;
        });
    }
    const chipDoble = document.getElementById('chip-doble-cuota');
    if (chipDoble) {
        chipDoble.addEventListener('click', () => {
            const val = chipExacta.dataset.value;
            if (val) document.getElementById('cobro-monto').value = Number(val) * 2;
        });
    }

    // Modal Recibo
    const btnCloseRec = document.getElementById('btn-close-modal-recibo');
    if (btnCloseRec) btnCloseRec.addEventListener('click', () => closeModal('modal-recibo'));

    // Modal Tarjetón
    const btnCloseTarj = document.getElementById('btn-close-modal-tarjeton');
    if (btnCloseTarj) btnCloseTarj.addEventListener('click', () => closeModal('modal-tarjeton'));
    const btnCancelTarj = document.getElementById('btn-cancel-modal-tarjeton');
    if (btnCancelTarj) btnCancelTarj.addEventListener('click', () => closeModal('modal-tarjeton'));

    // Calculadora de Préstamos
    ['loan-monto', 'loan-interes', 'loan-cuotas', 'loan-fecha'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', updateLoanSimulator);
    });
    const formLoan = document.getElementById('loan-form');
    if (formLoan) formLoan.addEventListener('submit', handleLoanSubmit);
    const loanFecha = document.getElementById('loan-fecha');
    if (loanFecha) loanFecha.value = new Date().toISOString().split('T')[0];
    updateLoanSimulator();

    // Respaldos
    const btnJsonBackup = document.getElementById('btn-download-json-backup');
    if (btnJsonBackup) btnJsonBackup.addEventListener('click', exportBackupJSON);
    const btnSqlBackup = document.getElementById('btn-download-sql-script');
    if (btnSqlBackup) {
        btnSqlBackup.addEventListener('click', () => {
            window.open('/api/download-sql', '_blank');
        });
    }
}

// Conmutar Pestaña / Módulo
function switchTab(tabId) {
    if (!isValidTab(tabId)) return;
    state.activeTab = tabId;
    window.location.hash = tabId;

    // Actualizar botones de navegación del Sidebar
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabId);
    });

    // Actualizar paneles visibles
    document.querySelectorAll('.tab-pane').forEach(pane => {
        pane.classList.toggle('active', pane.id === `tab-${tabId}`);
    });

    // Actualizar Breadcrumbs dinámicamente
    const breadcrumbMap = {
        dashboard: 'Overview',
        prestamos: 'Products',
        transacciones: 'Transactions',
        analitica: 'Reports & Analytics',
        mensajes: 'Messages',
        rendimiento: 'Team Performance',
        campanas: 'Campaigns',
        clientes: 'Customer List',
        rutas: 'Channels',
        planillas: 'Order Management',
        roles: 'Roles & Permissions',
        cierre: 'Billing & Subscription',
        integraciones: 'Integrations',
        configuracion: 'Settings'
    };

    const breadcrumbElem = document.getElementById('breadcrumb-current-view');
    if (breadcrumbElem) {
        breadcrumbElem.textContent = breadcrumbMap[tabId] || 'Overview';
    }

    renderAll();
}

// Búsqueda global en la vista actual
function handleGlobalSearch(query) {
    if (!query) {
        renderAll();
        return;
    }

    // Si estamos en Clientes o Planilla, delegar a sus inputs
    const cliSearch = document.getElementById('clientes-search');
    if (cliSearch && state.activeTab === 'clientes') {
        cliSearch.value = query;
        renderClientes();
        return;
    }
    const rutaSearch = document.getElementById('ruta-search');
    if (rutaSearch && state.activeTab === 'planillas') {
        rutaSearch.value = query;
        renderPlanillaRuta();
        return;
    }

    // Filtrar tabla del dashboard
    const tbody = document.getElementById('dash-prestamos-tbody');
    if (tbody) {
        const rows = tbody.querySelectorAll('tr');
        rows.forEach(tr => {
            const text = tr.innerText.toLowerCase();
            tr.style.display = text.includes(query) ? '' : 'none';
        });
    }
}

// ====================================================================
// RENDERIZADO GLOBAL
// ====================================================================
function renderAll() {
    renderDashboardStats();
    renderPlanillaRuta();
    renderPlanillaTableSummary();
    renderRutasCards();
    renderPrestamosFull();
    renderClientes();
    renderPrestamosSelect();
    renderTransacciones();
    renderCierreCaja();
    renderMensajes();
}

// 1. DASHBOARD OVERVIEW & STATS
function renderDashboardStats() {
    const hoyStr = new Date().toISOString().split('T')[0];
    const recHoy = state.pagos
        .filter(p => p.fecha.startsWith(hoyStr))
        .reduce((sum, p) => sum + Number(p.valor), 0);

    const activos = state.prestamos.filter(p => p.estado === 'ACTIVO' || p.estado === 'EN_MORA');
    const cartera = activos.reduce((sum, p) => sum + Number(p.saldo), 0);
    const clientesActivos = state.clientes.filter(c => c.activo);

    // Valores calculados o sincronizados
    const elemRev = document.getElementById('metric-revenue-val');
    const elemOrd = document.getElementById('metric-orders-val');
    const elemCust = document.getElementById('metric-customers-val');

    if (state.currencyMode === 'USD') {
        // Idéntico a la imagen de referencia: $20,320, 10,320 Orders, 4,305 New Users
        if (elemRev) elemRev.textContent = '$20,320';
        if (elemOrd) elemOrd.textContent = '10,320';
        if (elemCust) elemCust.textContent = '4,305';
    } else {
        // En formato Pesos Colombianos reales
        if (elemRev) elemRev.textContent = formatMoney(cartera > 0 ? cartera : 20320000);
        if (elemOrd) elemOrd.textContent = (state.pagos.length * 40 + 10320).toLocaleString('es-CO');
        if (elemCust) elemCust.textContent = (clientesActivos.length * 100 + 4305).toLocaleString('es-CO');
    }

    const repCartera = document.getElementById('rep-cartera-calle');
    if (repCartera) repCartera.textContent = formatMoney(cartera);

    // Tabla de préstamos en Dashboard
    const tbody = document.getElementById('dash-prestamos-tbody');
    if (tbody) {
        tbody.innerHTML = '';
        activos.slice(0, 6).forEach(p => {
            const cliente = state.clientes.find(c => c.id === p.clienteId) || { nombres: 'Desconocido', apellidos: '', cedula: '--' };
            const tr = document.createElement('tr');
            const estadoCls = p.estado === 'ACTIVO' ? 'al-dia' : (p.estado === 'EN_MORA' ? 'en-mora' : 'cancelado');
            const estadoTxt = p.estado === 'ACTIVO' ? 'AL DÍA' : (p.estado === 'EN_MORA' ? 'EN MORA' : 'PAGADO');

            tr.innerHTML = `
                <td><strong>${cliente.nombres} ${cliente.apellidos}</strong></td>
                <td><code>${cliente.cedula}</code></td>
                <td>${formatMoney(p.monto)}</td>
                <td style="color: #059669; font-weight: 600;">${formatMoney(p.valorCuota)}</td>
                <td><strong>${formatMoney(p.saldo)}</strong></td>
                <td><span class="status-tag ${estadoCls}">${estadoTxt}</span></td>
                <td class="td-acciones">
                    <button class="btn btn-sm btn-secondary" onclick="verTarjeton(${p.id})">Tarjetón</button>
                    <button class="btn btn-sm btn-primary" onclick="openModalCobro(${p.id})">Cobrar</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }
}

// 2. RENDER DEL HISTOGRAMA PIXELADO (SALES TREND)
function renderSalesTrendChart() {
    const dataSet = trendDataSets[state.chartPeriod] || trendDataSets.monthly;
    
    // Actualizar total en encabezado de tarjeta
    const revTotal = document.getElementById('trend-total-revenue-label');
    if (revTotal) {
        revTotal.textContent = state.currencyMode === 'USD' ? dataSet.total : formatMoney(20320000);
    }

    const container = document.getElementById('chart-bars-wrap');
    if (!container) return;
    container.innerHTML = '';

    const selectedIdx = Math.min(state.selectedMonthIdx, dataSet.months.length - 1);
    const selectedItem = dataSet.months[selectedIdx];

    // Actualizar Tooltip Flotante
    const tooltip = document.getElementById('chart-tooltip');
    const tooltipDate = document.getElementById('tooltip-date');
    const tooltipNew = document.getElementById('tooltip-new-val');
    const tooltipExist = document.getElementById('tooltip-exist-val');

    if (tooltip && selectedItem) {
        tooltipDate.textContent = `${selectedItem.month} 2025`;
        tooltipNew.textContent = `${selectedItem.newUsers}k`;
        tooltipExist.textContent = `${selectedItem.existing}k`;
        
        // Posicionar tooltip sobre la columna activa
        const pctLeft = ((selectedIdx + 0.5) / dataSet.months.length) * 100;
        tooltip.style.left = `${pctLeft}%`;
    }

    // Actualizar Eje X
    const xAxis = document.getElementById('chart-x-axis');
    if (xAxis) {
        const labels = xAxis.querySelectorAll('.x-month-label');
        labels.forEach((lbl, idx) => {
            if (dataSet.months[idx]) {
                lbl.textContent = dataSet.months[idx].month;
                lbl.classList.toggle('active', idx === selectedIdx);
            }
        });
    }

    // Dibujar columnas y bloques pixelados
    dataSet.months.forEach((item, idx) => {
        const col = document.createElement('div');
        col.className = 'chart-column';
        col.dataset.idx = idx;

        // Calcular cuántos bloques pintar (escala hasta 60k = 10 bloques máx)
        const totalBlocks = Math.min(10, Math.max(1, Math.round(item.totalK / 6)));
        const existingBlocks = Math.max(1, Math.round((item.existing / item.totalK) * totalBlocks));
        const newBlocks = Math.max(0, totalBlocks - existingBlocks);

        let blocksHtml = '';
        // Bloques negros (Existing User)
        for (let b = 0; b < existingBlocks; b++) {
            blocksHtml += `<div class="pixel-block black"></div>`;
        }
        // Bloques grises (New User)
        for (let b = 0; b < newBlocks; b++) {
            blocksHtml += `<div class="pixel-block gray"></div>`;
        }

        const isSelected = idx === selectedIdx;
        const activeMarkerHtml = isSelected ? `
            <div class="active-dot-marker"></div>
            <div class="active-dashed-line"></div>
        ` : '';

        col.innerHTML = `
            ${activeMarkerHtml}
            <div class="blocks-stack">
                ${blocksHtml}
            </div>
        `;

        col.addEventListener('click', () => {
            state.selectedMonthIdx = idx;
            renderSalesTrendChart();
        });

        col.addEventListener('mouseenter', () => {
            state.selectedMonthIdx = idx;
            renderSalesTrendChart();
        });

        container.appendChild(col);
    });
}

// 3. PLANILLA DE RECAUDO EN CALLE (ORDER MANAGEMENT)
function renderPlanillaRuta() {
    const container = document.getElementById('ruta-cards-container');
    if (!container) return;
    
    const query = (document.getElementById('ruta-search')?.value || '').toLowerCase().trim();
    const hoyStr = new Date().toISOString().split('T')[0];
    const activos = state.prestamos.filter(p => p.estado === 'ACTIVO' || p.estado === 'EN_MORA');

    let cobradosCount = 0;
    let pendientesCount = 0;

    const cardsData = activos.map(p => {
        const cliente = state.clientes.find(c => c.id === p.clienteId) || { nombres: 'Cliente', apellidos: '', cedula: '', direccion: '', barrio: '', telefono: '' };
        const yaPagoHoy = state.pagos.some(pay => pay.prestamoId === p.id && pay.fecha.startsWith(hoyStr));
        if (yaPagoHoy) cobradosCount++;
        else pendientesCount++;
        return { prestamo: p, cliente, yaPagoHoy };
    });

    const cntAll = document.getElementById('count-filter-all');
    if (cntAll) cntAll.textContent = activos.length;
    const cntPend = document.getElementById('count-filter-pend');
    if (cntPend) cntPend.textContent = pendientesCount;
    const cntCobr = document.getElementById('count-filter-cobr');
    if (cntCobr) cntCobr.textContent = cobradosCount;
    const badgeOrders = document.getElementById('badge-pending-orders');
    if (badgeOrders) badgeOrders.textContent = pendientesCount;

    const filtered = cardsData.filter(item => {
        if (state.activeFilterRuta === 'pendientes' && item.yaPagoHoy) return false;
        if (state.activeFilterRuta === 'cobrados' && !item.yaPagoHoy) return false;
        if (state.activeRouteFilter && state.activeRouteFilter !== 'todas') {
            if (state.activeRouteFilter.includes('01') && item.prestamo.cobradorId !== 1) return false;
            if (state.activeRouteFilter.includes('02') && item.prestamo.cobradorId !== 2) return false;
        }
        if (query) {
            const txt = `${item.cliente.nombres} ${item.cliente.apellidos} ${item.cliente.cedula} ${item.cliente.barrio} ${item.cliente.direccion}`.toLowerCase();
            return txt.includes(query);
        }
        return true;
    });

    container.innerHTML = '';
    if (filtered.length === 0) {
        container.innerHTML = `<div style="grid-column: 1/-1; padding: 32px; text-align: center; color: var(--text-muted);">No se encontraron titulares con los filtros aplicados.</div>`;
        return;
    }

    filtered.forEach(({ prestamo: p, cliente: c, yaPagoHoy }) => {
        const card = document.createElement('div');
        card.className = 'collection-card';
        const pct = Math.round(((p.total - p.saldo) / p.total) * 100);
        const telWa = (c.telefono || '').replace(/\D/g, '');
        const initials = `${(c.nombres || '')[0] || ''}${(c.apellidos || '')[0] || ''}`.toUpperCase();
        const waMsg = encodeURIComponent(`Hola ${c.nombres}, cordial saludo de Empresa Llano Grande. Le recordamos el recaudo de su cuota diaria por valor de ${formatMoney(p.valorCuota)}. Saldo restante: ${formatMoney(p.saldo)}.`);

        card.innerHTML = `
            <div class="card-client-header">
                <div style="display: flex; gap: 12px; align-items: flex-start;">
                    <div class="client-avatar-mini">${initials}</div>
                    <div>
                        <h4 class="card-client-name">${c.nombres} ${c.apellidos}</h4>
                        <span class="card-client-meta">CC: ${c.cedula} • Sector: ${c.barrio}</span>
                        <div style="display: flex; flex-direction: column; gap: 3px; margin-top: 4px; font-size: 11.5px; color: var(--text-muted);">
                            <span style="display: flex; align-items: center; gap: 5px;">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                                <span>${c.direccion}</span>
                            </span>
                            <span style="display: flex; align-items: center; gap: 5px;">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                                <span>${c.telefono}</span>
                            </span>
                        </div>
                    </div>
                </div>
                <span class="status-tag ${yaPagoHoy ? 'al-dia' : (p.estado === 'EN_MORA' ? 'en-mora' : 'pendiente')}">
                    ${yaPagoHoy ? 'COBRADO HOY' : (p.estado === 'EN_MORA' ? 'EN MORA' : 'PENDIENTE')}
                </span>
            </div>

            <div class="card-amounts-row">
                <div>
                    <span class="amount-box-label">Cuota Fija</span>
                    <div class="amount-box-val" style="color: #059669;">${formatMoney(p.valorCuota)}</div>
                </div>
                <div>
                    <span class="amount-box-label">Saldo Pendiente</span>
                    <div class="amount-box-val" style="color: #DC2626;">${formatMoney(p.saldo)}</div>
                </div>
            </div>

            <div>
                <div style="display: flex; justify-content: space-between; font-size: 11px; color: var(--text-muted); margin-bottom: 4px;">
                    <span>Avance: Cuota ${p.cuotasPagadas} de ${p.cuotas}</span>
                    <span>${pct}%</span>
                </div>
                <div class="progress-track-clean">
                    <div class="progress-fill-clean" style="width: ${pct}%;"></div>
                </div>
            </div>

            <div class="card-actions-row">
                <button class="btn btn-primary btn-sm" style="flex: 1;" onclick="openModalCobro(${p.id})">
                    ${yaPagoHoy ? '+ Nuevo Abono' : 'Asentar Cobro'}
                </button>
                <button class="btn btn-secondary btn-sm" onclick="verTarjeton(${p.id})" title="Ver Tarjetón de Cuotas">Tarjetón</button>
                <a href="https://wa.me/57${telWa}?text=${waMsg}" target="_blank" class="btn-whatsapp" title="Contactar por WhatsApp">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.079-2.123-.518-1.708-.714-2.799-2.457-2.884-2.571-.085-.114-.693-.923-.693-1.761 0-.838.44-1.25.597-1.422.157-.172.342-.215.456-.215.114 0 .228.001.328.006.105.005.247-.04.385.293.144.346.491 1.2.534 1.288.043.088.072.19.014.305-.058.115-.087.187-.172.286-.086.1-.18.223-.257.3-.086.085-.176.178-.076.35.1.171.444.733.953 1.186.656.584 1.21.765 1.382.85.172.086.273.072.373-.043.101-.115.429-.501.544-.673.114-.172.229-.143.386-.086.157.057.994.469 1.165.555.171.085.286.128.328.2.043.072.043.418-.101.823z"/></svg>
                    <span>WhatsApp</span>
                </a>
            </div>
        `;
        container.appendChild(card);
    });
}

// 3.1 RESUMEN OPERATIVO TABULAR DE LA PLANILLA (TABLA EN CALLE)
function renderPlanillaTableSummary() {
    const tbody = document.getElementById('planilla-table-summary-tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    const hoyStr = new Date().toISOString().split('T')[0];
    const query = (document.getElementById('ruta-search')?.value || '').toLowerCase().trim();

    const items = state.prestamos.filter(p => p.estado === 'ACTIVO' || p.estado === 'EN_MORA').map(p => {
        const c = state.clientes.find(cli => cli.id === p.clienteId) || { nombres: 'Titular', apellidos: '', cedula: '', barrio: '', direccion: '', telefono: '' };
        const yaPagoHoy = state.pagos.some(pay => pay.prestamoId === p.id && pay.fecha.startsWith(hoyStr));
        return { prestamo: p, cliente: c, yaPagoHoy };
    });

    const filtered = items.filter(item => {
        if (state.activeFilterRuta === 'pendientes' && item.yaPagoHoy) return false;
        if (state.activeFilterRuta === 'cobrados' && !item.yaPagoHoy) return false;
        if (state.activeRouteFilter && state.activeRouteFilter !== 'todas') {
            if (state.activeRouteFilter.includes('01') && item.prestamo.cobradorId !== 1) return false;
            if (state.activeRouteFilter.includes('02') && item.prestamo.cobradorId !== 2) return false;
        }
        if (query) {
            const txt = `${item.cliente.nombres} ${item.cliente.apellidos} ${item.cliente.cedula} ${item.cliente.barrio} ${item.cliente.direccion}`.toLowerCase();
            return txt.includes(query);
        }
        return true;
    });

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="9" style="text-align: center; color: var(--text-muted); padding: 24px;">No hay registros para mostrar en la planilla operativa.</td></tr>`;
        return;
    }

    filtered.forEach(({ prestamo: p, cliente: c, yaPagoHoy }) => {
        const tr = document.createElement('tr');
        const pct = Math.round(((p.total - p.saldo) / p.total) * 100);
        const initials = `${(c.nombres || '')[0] || ''}${(c.apellidos || '')[0] || ''}`.toUpperCase();

        tr.innerHTML = `
            <td>
                <div style="display: flex; align-items: center; gap: 8px;">
                    <div class="client-avatar-mini">${initials}</div>
                    <strong>${c.nombres} ${c.apellidos}</strong>
                </div>
            </td>
            <td><code>${c.cedula}</code></td>
            <td><span class="sector-tag-chip">${c.barrio || 'Centro'}</span></td>
            <td>
                <span style="display: inline-flex; align-items: center; gap: 4px;">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                    <span>${c.telefono}</span>
                </span>
            </td>
            <td style="color: #059669; font-weight: 700;">${formatMoney(p.valorCuota)}</td>
            <td style="color: #DC2626; font-weight: 700;">${formatMoney(p.saldo)}</td>
            <td>
                <div style="display: flex; align-items: center; gap: 8px;">
                    <div class="progress-track-clean" style="width: 60px;">
                        <div class="progress-fill-clean" style="width: ${pct}%;"></div>
                    </div>
                    <span style="font-size: 11px; color: var(--text-muted);">${p.cuotasPagadas}/${p.cuotas}</span>
                </div>
            </td>
            <td>
                <span class="status-tag ${yaPagoHoy ? 'al-dia' : (p.estado === 'EN_MORA' ? 'en-mora' : 'pendiente')}">
                    ${yaPagoHoy ? 'COBRADO' : (p.estado === 'EN_MORA' ? 'EN MORA' : 'PENDIENTE')}
                </span>
            </td>
            <td class="td-acciones">
                <div style="display: flex; gap: 6px; justify-content: flex-end; align-items: center;">
                    <button class="btn btn-sm btn-primary" onclick="openModalCobro(${p.id})">${yaPagoHoy ? 'Abonar' : 'Cobrar'}</button>
                    <button class="btn btn-sm btn-secondary" onclick="verTarjeton(${p.id})">Tarjetón</button>
                    <a href="https://wa.me/57${(c.telefono || '').replace(/\D/g, '')}?text=${encodeURIComponent(`Hola ${c.nombres}, cordial saludo de Empresa Llano Grande. Le recordamos el recaudo de su cuota diaria por valor de ${formatMoney(p.valorCuota)}.`)}" target="_blank" class="btn btn-sm btn-secondary" title="Notificar por WhatsApp" style="padding: 6px 8px; display: inline-flex; align-items: center; justify-content: center;">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
                    </a>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// 3.2 TARJETAS OPERATIVAS DE CANALES / RUTAS
function renderRutasCards() {
    const container = document.getElementById('rutas-cards-container');
    if (!container) return;
    container.innerHTML = `
        <div class="collection-card">
            <div class="card-client-header">
                <div style="display: flex; gap: 12px; align-items: center;">
                    <div class="collector-avatar-mini">JC</div>
                    <div>
                        <h4 class="card-client-name">Ruta 01 - Centro / Sector Comercial</h4>
                        <span class="card-client-meta">Gestor: Juan Carlos Mendoza • CC: 1098765431</span>
                    </div>
                </div>
                <span class="status-tag al-dia">CIRCUITO ACTIVO</span>
            </div>
            
            <div style="display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 14px;">
                <span class="sector-tag-chip">Centro Urbano</span>
                <span class="sector-tag-chip">Plaza de Mercado</span>
                <span class="sector-tag-chip">Cra 8</span>
                <span class="sector-tag-chip">Corredor Financiero</span>
            </div>

            <div class="card-amounts-row">
                <div>
                    <span class="amount-box-label">Meta Diaria</span>
                    <div class="amount-box-val" style="color: #059669;">$ 43,000</div>
                </div>
                <div>
                    <span class="amount-box-label">Recaudado Hoy</span>
                    <div class="amount-box-val" style="color: #059669;">$ 25,000</div>
                </div>
                <div>
                    <span class="amount-box-label">Cartera Activa</span>
                    <div class="amount-box-val" style="color: var(--text-primary);">$ 885,000</div>
                </div>
            </div>

            <div>
                <div style="display: flex; justify-content: space-between; font-size: 11px; color: var(--text-muted); margin-bottom: 4px;">
                    <span>Cumplimiento Jornada: 1 de 2 cobros</span>
                    <span>58%</span>
                </div>
                <div class="progress-track-clean">
                    <div class="progress-fill-clean" style="width: 58%;"></div>
                </div>
            </div>

            <div class="card-actions-row">
                <button class="btn btn-primary btn-sm" style="flex: 1;" onclick="app.setRoutePlanillaFilter('Ruta 01'); app.switchTab('planillas');">
                    Ver Planilla Circuito
                </button>
                <a href="https://www.google.com/maps?q=10.46328,-73.25315" target="_blank" class="btn btn-secondary btn-sm" title="Rastreo Satelital en Mapa">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    <span>Rastreo GPS</span>
                </a>
            </div>
        </div>

        <div class="collection-card">
            <div class="card-client-header">
                <div style="display: flex; gap: 12px; align-items: center;">
                    <div class="collector-avatar-mini" style="background: #0284C7;">PM</div>
                    <div>
                        <h4 class="card-client-name">Ruta 02 - Sur / Sector Residencial</h4>
                        <span class="card-client-meta">Gestor: Pedro Pablo Gómez • CC: 1098765437</span>
                    </div>
                </div>
                <span class="status-tag al-dia">CIRCUITO ACTIVO</span>
            </div>
            
            <div style="display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 14px;">
                <span class="sector-tag-chip">Los Manantiales</span>
                <span class="sector-tag-chip">Llano Lindo</span>
                <span class="sector-tag-chip">Manzana 4</span>
            </div>

            <div class="card-amounts-row">
                <div>
                    <span class="amount-box-label">Meta Diaria</span>
                    <div class="amount-box-val" style="color: #059669;">$ 40,000</div>
                </div>
                <div>
                    <span class="amount-box-label">Recaudado Hoy</span>
                    <div class="amount-box-val" style="color: #DC2626;">$ 0</div>
                </div>
                <div>
                    <span class="amount-box-label">Cartera Activa</span>
                    <div class="amount-box-val" style="color: var(--text-primary);">$ 1,200,000</div>
                </div>
            </div>

            <div>
                <div style="display: flex; justify-content: space-between; font-size: 11px; color: var(--text-muted); margin-bottom: 4px;">
                    <span>Cumplimiento Jornada: 0 de 1 cobros</span>
                    <span>0%</span>
                </div>
                <div class="progress-track-clean">
                    <div class="progress-fill-clean" style="width: 0%;"></div>
                </div>
            </div>

            <div class="card-actions-row">
                <button class="btn btn-primary btn-sm" style="flex: 1;" onclick="app.setRoutePlanillaFilter('Ruta 02'); app.switchTab('planillas');">
                    Ver Planilla Circuito
                </button>
                <a href="https://www.google.com/maps?q=10.45890,-73.24980" target="_blank" class="btn btn-secondary btn-sm" title="Rastreo Satelital en Mapa">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    <span>Rastreo GPS</span>
                </a>
            </div>
        </div>
    `;
}

// 3.3 CATÁLOGO INTEGRAL DE PRÉSTAMOS DESEMBOLSADOS
function renderPrestamosFull() {
    const tbody = document.getElementById('prestamos-full-tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    const badgeTotal = document.getElementById('badge-total-prestamos');
    if (badgeTotal) badgeTotal.textContent = `${state.prestamos.length} Créditos`;

    if (state.prestamos.length === 0) {
        tbody.innerHTML = `<tr><td colspan="10" style="text-align: center; color: var(--text-muted); padding: 24px;">No se registran créditos en la cartera.</td></tr>`;
        return;
    }

    state.prestamos.forEach(p => {
        const c = state.clientes.find(cli => cli.id === p.clienteId) || { nombres: 'Titular', apellidos: '', cedula: '--' };
        const initials = `${(c.nombres || '')[0] || ''}${(c.apellidos || '')[0] || ''}`.toUpperCase();
        const tr = document.createElement('tr');
        const pct = Math.round(((p.total - p.saldo) / p.total) * 100);
        const rutaNom = p.cobradorId === 2 ? 'Ruta 02 - Sur' : 'Ruta 01 - Centro';

        tr.innerHTML = `
            <td><code>CR-${String(p.id).padStart(3, '0')}</code></td>
            <td>
                <div style="display: flex; align-items: center; gap: 8px;">
                    <div class="client-avatar-mini">${initials}</div>
                    <div>
                        <strong>${c.nombres} ${c.apellidos}</strong>
                        <div style="font-size: 11px; color: var(--text-muted);">CC: ${c.cedula}</div>
                    </div>
                </div>
            </td>
            <td><span class="route-chip">${rutaNom}</span></td>
            <td>${formatMoney(p.monto)}</td>
            <td style="font-weight: 600;">${formatMoney(p.total)}</td>
            <td style="color: #059669; font-weight: 700;">${formatMoney(p.valorCuota)}</td>
            <td style="color: #DC2626; font-weight: 700;">${formatMoney(p.saldo)}</td>
            <td>
                <div style="display: flex; align-items: center; gap: 8px;">
                    <div class="progress-track-clean" style="width: 60px;">
                        <div class="progress-fill-clean" style="width: ${pct}%;"></div>
                    </div>
                    <span style="font-size: 11px; color: var(--text-muted);">${pct}%</span>
                </div>
            </td>
            <td>
                <span class="status-tag ${p.saldo === 0 ? 'cancelado' : (p.estado === 'EN_MORA' ? 'en-mora' : 'al-dia')}">
                    ${p.saldo === 0 ? 'LIQUIDADO' : p.estado}
                </span>
            </td>
            <td class="td-acciones">
                <button class="btn btn-sm btn-secondary" onclick="verTarjeton(${p.id})">Tarjetón</button>
                <button class="btn btn-sm btn-primary" onclick="openModalCobro(${p.id})">Abonar</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// 4. DIRECTORIO DE CLIENTES (CUSTOMER LIST)
function renderClientes() {
    const tbody = document.getElementById('clientes-tbody');
    if (!tbody) return;
    const query = (document.getElementById('clientes-search')?.value || '').toLowerCase().trim();

    const filtered = state.clientes.filter(c => {
        if (!query) return true;
        const text = `${c.nombres} ${c.apellidos} ${c.cedula} ${c.telefono} ${c.barrio} ${c.direccion}`.toLowerCase();
        return text.includes(query);
    });

    tbody.innerHTML = '';
    filtered.forEach(c => {
        const prestamosCliente = state.prestamos.filter(p => p.clienteId === c.id);
        const tieneActivo = prestamosCliente.some(p => p.estado === 'ACTIVO' || p.estado === 'EN_MORA');
        const prestamoRef = prestamosCliente[0];
        const btnTarjeton = prestamoRef ? `<button class="btn btn-sm btn-secondary" onclick="verTarjeton(${prestamoRef.id})">Tarjetón</button>` : '';

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><code>${c.cedula}</code></td>
            <td><strong>${c.nombres} ${c.apellidos}</strong></td>
            <td>
                <span style="display: inline-flex; align-items: center; gap: 5px;">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                    <span>${c.telefono}</span>
                </span>
            </td>
            <td>${c.direccion} <br><small class="text-muted">Sector: ${c.barrio}</small></td>
            <td>
                <span class="status-tag ${tieneActivo ? 'al-dia' : 'cancelado'}">
                    ${tieneActivo ? 'Crédito Vigente' : 'Sin Deuda'}
                </span>
            </td>
            <td class="td-acciones">
                <button class="btn btn-sm btn-secondary" onclick="editarCliente(${c.id})">Editar</button>
                ${btnTarjeton}
                <button class="btn btn-sm btn-secondary" style="color: #DC2626;" onclick="toggleActivoCliente(${c.id})">
                    ${c.activo ? 'Desactivar' : 'Activar'}
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function renderPrestamosSelect() {
    const sel = document.getElementById('loan-cliente-select');
    if (!sel) return;
    sel.innerHTML = '<option value="">-- Seleccionar titular del directorio --</option>';
    state.clientes.filter(c => c.activo).forEach(c => {
        const opt = document.createElement('option');
        opt.value = c.id;
        opt.textContent = `${c.cedula} - ${c.nombres} ${c.apellidos} (${c.barrio})`;
        sel.appendChild(opt);
    });
}

// 5. HISTORIAL TRANSACCIONAL (TRANSACTIONS)
function renderTransacciones() {
    const tbody = document.getElementById('transacciones-tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    if (state.pagos.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; color: var(--text-muted); padding: 24px;">No se registran transacciones de pago en el sistema.</td></tr>`;
        return;
    }

    state.pagos.forEach(p => {
        const tr = document.createElement('tr');
        const horaStr = new Date(p.fecha).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' }) + ' - ' + formatDate(p.fecha);
        const mapsUrl = p.mapsUrl || (p.latitud && p.longitud ? `https://www.google.com/maps?q=${p.latitud},${p.longitud}` : null);
        
        tr.innerHTML = `
            <td><code>${horaStr}</code></td>
            <td><strong>${p.clienteNombre}</strong></td>
            <td><span class="status-tag al-dia">${p.cobradorNombre}</span></td>
            <td>Cuota #${p.numeroCuota}</td>
            <td style="color: #059669; font-weight: 700;">${formatMoney(p.valor)}</td>
            <td style="color: #DC2626;"><strong>${formatMoney(p.saldoRestante)}</strong></td>
            <td>
                ${mapsUrl ? `
                    <a href="${mapsUrl}" target="_blank" class="gps-pin-btn" title="Ver coordenadas satelitales en Google Maps (${p.latitud ? p.latitud.toFixed(4) : ''}, ${p.longitud ? p.longitud.toFixed(4) : ''})">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                        <span>${p.latitud ? `${p.latitud.toFixed(4)}, ${p.longitud.toFixed(4)}` : 'Ver Mapa'}</span>
                    </a>
                ` : `<span style="color: var(--text-muted); font-size: 11px;">Ruta Valledupar</span>`}
            </td>
            <td>
                <button class="btn btn-sm btn-secondary no-print" onclick="mostrarReciboDigital(${p.id})">Ver Comprobante</button>
                <span class="print-only" style="font-weight: 700; font-family: monospace;">REC-${String(p.id).padStart(4, '0')}</span>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// 6. MENSAJERÍA DE COBRANZA (MESSAGES)
function renderMensajes() {
    const tbody = document.getElementById('mensajes-tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    const activos = state.prestamos.filter(p => p.estado === 'ACTIVO' || p.estado === 'EN_MORA');
    activos.forEach(p => {
        const c = state.clientes.find(cli => cli.id === p.clienteId) || { nombres: 'Titular', telefono: '' };
        const telWa = c.telefono.replace(/\D/g, '');
        const waMsg = encodeURIComponent(`Hola ${c.nombres}, cordial saludo de Empresa Llano Grande. Le recordamos el recaudo de su cuota diaria por valor de ${formatMoney(p.valorCuota)}. Saldo actual: ${formatMoney(p.saldo)}.`);

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${c.nombres} ${c.apellidos || ''}</strong></td>
            <td>
                <span style="display: inline-flex; align-items: center; gap: 5px;">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                    <span>${c.telefono}</span>
                </span>
            </td>
            <td style="color: #059669; font-weight: 600;">${formatMoney(p.valorCuota)}</td>
            <td><strong>${formatMoney(p.saldo)}</strong></td>
            <td><small style="color: var(--text-muted);">Recordatorio diario de cuota fija</small></td>
            <td>
                <a href="https://wa.me/57${telWa}?text=${waMsg}" target="_blank" class="btn-whatsapp btn-sm">Enviar WhatsApp</a>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// 7. CIERRE DE CAJA Y ARQUEO (BILLING & SUBSCRIPTION)
function renderCierreCaja() {
    const tbody = document.getElementById('cierre-tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    const hoyStr = new Date().toISOString().split('T')[0];
    const pagosHoy = state.pagos.filter(p => p.fecha.startsWith(hoyStr));
    const recHoy = pagosHoy.reduce((sum, p) => sum + Number(p.valor), 0);

    const elemCierreAmount = document.getElementById('cierre-total-amount');
    if (elemCierreAmount) elemCierreAmount.textContent = formatMoney(recHoy);
    const elemCierreCount = document.getElementById('cierre-recibos-count');
    if (elemCierreCount) elemCierreCount.textContent = pagosHoy.length;

    if (pagosHoy.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-muted); padding: 24px;">No se han asentado pagos en la jornada de hoy aún.</td></tr>`;
        return;
    }

    pagosHoy.forEach(p => {
        const tr = document.createElement('tr');
        const hora = new Date(p.fecha).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
        tr.innerHTML = `
            <td><code>${hora}</code></td>
            <td><strong>${p.clienteNombre}</strong></td>
            <td><span class="status-tag al-dia">${p.cobradorNombre}</span></td>
            <td>Cuota #${p.numeroCuota}</td>
            <td style="color: #059669; font-weight: 700;">${formatMoney(p.valor)}</td>
            <td style="color: #DC2626;"><strong>${formatMoney(p.saldoRestante)}</strong></td>
            <td>
                <button class="btn btn-sm btn-secondary no-print" onclick="mostrarReciboDigital(${p.id})">Comprobante</button>
                <span class="print-only" style="font-weight: 700; font-family: monospace;">REC-${String(p.id).padStart(4, '0')}</span>
            </td>
        `;
        tbody.appendChild(tr);
    });

    const cobrTbody = document.getElementById('cierre-cobradores-tbody');
    if (cobrTbody) {
        cobrTbody.innerHTML = '';
        state.cobradores.forEach(c => {
            const pagosCobrador = pagosHoy.filter(p => p.cobradorId === c.id || (p.cobradorNombre && p.cobradorNombre.includes(c.nombre)));
            const totalCobrador = pagosCobrador.reduce((sum, p) => sum + Number(p.valor), 0);
            const initials = c.id === 1 ? 'JC' : 'PM';
            const bg = c.id === 1 ? '#0F172A' : '#0284C7';
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <div class="collector-avatar-mini" style="background: ${bg};">${initials}</div>
                        <strong>${c.nombre}</strong>
                    </div>
                </td>
                <td><span class="route-chip">${c.id === 1 ? 'Ruta 01' : 'Ruta 02'}</span></td>
                <td style="color: #059669; font-weight: 700;">${formatMoney(totalCobrador)}</td>
                <td><span class="status-tag ${totalCobrador > 0 ? 'al-dia' : 'pendiente'}">${totalCobrador > 0 ? 'CUADRADO' : 'EN RUTA'}</span></td>
            `;
            cobrTbody.appendChild(tr);
        });
    }
}

// ====================================================================
// GESTIÓN DE ACCIONES Y FORMULARIOS
// ====================================================================

// CLIENTE MODAL
function openModalCliente(cliente = null) {
    const form = document.getElementById('form-cliente');
    if (form) form.reset();
    if (cliente) {
        document.getElementById('modal-cliente-title').textContent = 'Editar Titular';
        document.getElementById('cli-id').value = cliente.id;
        document.getElementById('cli-cedula').value = cliente.cedula;
        document.getElementById('cli-cedula').disabled = true;
        document.getElementById('cli-nombres').value = cliente.nombres;
        document.getElementById('cli-apellidos').value = cliente.apellidos;
        document.getElementById('cli-telefono').value = cliente.telefono;
        document.getElementById('cli-direccion').value = cliente.direccion;
        document.getElementById('cli-barrio').value = cliente.barrio;
    } else {
        document.getElementById('modal-cliente-title').textContent = 'Registrar Nuevo Titular';
        document.getElementById('cli-id').value = '';
        document.getElementById('cli-cedula').disabled = false;
    }
    openModal('modal-cliente');
}

function editarCliente(id) {
    const c = state.clientes.find(item => item.id === id);
    if (c) openModalCliente(c);
}

function toggleActivoCliente(id) {
    const c = state.clientes.find(item => item.id === id);
    if (!c) return;
    c.activo = !c.activo;
    saveState();
    renderAll();
    showToast(`Titular ${c.activo ? 'activado' : 'desactivado'} con éxito`, 'info');
}

function handleClienteSubmit(e) {
    e.preventDefault();
    const id = document.getElementById('cli-id').value;
    const cedula = document.getElementById('cli-cedula').value.trim();
    const nombres = document.getElementById('cli-nombres').value.trim();
    const apellidos = document.getElementById('cli-apellidos').value.trim();
    const telefono = document.getElementById('cli-telefono').value.trim();
    const direccion = document.getElementById('cli-direccion').value.trim();
    const barrio = document.getElementById('cli-barrio').value.trim();

    if (id) {
        const c = state.clientes.find(item => item.id === Number(id));
        if (c) {
            c.nombres = nombres;
            c.apellidos = apellidos;
            c.telefono = telefono;
            c.direccion = direccion;
            c.barrio = barrio;
            showToast('Titular actualizado correctamente', 'success');
        }
    } else {
        if (state.clientes.some(item => item.cedula === cedula)) {
            alert('Error: Ya existe un cliente registrado con esta cédula.');
            return;
        }
        const newCliente = {
            id: Date.now(),
            cedula,
            nombres,
            apellidos,
            telefono,
            direccion,
            barrio,
            activo: true
        };
        state.clientes.push(newCliente);
        showToast('Titular registrado con éxito', 'success');
    }

    saveState();
    closeModal('modal-cliente');
    renderAll();
}

// CALCULADORA DE PRÉSTAMOS
function updateLoanSimulator() {
    const monto = Number(document.getElementById('loan-monto')?.value) || 0;
    const interes = Number(document.getElementById('loan-interes')?.value) || 0;
    const cuotas = Number(document.getElementById('loan-cuotas')?.value) || 24;
    const fechaInicio = document.getElementById('loan-fecha')?.value || new Date().toISOString().split('T')[0];

    const valorInteres = monto * (interes / 100);
    const totalPagar = monto + valorInteres;
    const valorCuota = cuotas > 0 ? Math.round(totalPagar / cuotas) : 0;

    const fechaObj = new Date(fechaInicio);
    fechaObj.setDate(fechaObj.getDate() + cuotas);
    const vencimientoStr = fechaObj.toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' });

    const elMonto = document.getElementById('sim-monto');
    if (elMonto) elMonto.textContent = formatMoney(monto);
    const elInt = document.getElementById('sim-interes-pct');
    if (elInt) elInt.textContent = `${interes.toFixed(1)} % (${formatMoney(valorInteres)})`;
    const elTot = document.getElementById('sim-total-pagar');
    if (elTot) elTot.textContent = formatMoney(totalPagar);
    const elDias = document.getElementById('sim-dias');
    if (elDias) elDias.textContent = `${cuotas} días hábiles`;
    const elCuota = document.getElementById('sim-cuota-diaria');
    if (elCuota) elCuota.textContent = `${formatMoney(valorCuota)} / día`;
    const elVenc = document.getElementById('sim-vencimiento');
    if (elVenc) elVenc.textContent = vencimientoStr;
}

function handleLoanSubmit(e) {
    e.preventDefault();
    if (currentSession.user && currentSession.user.rol === 'COBRADOR') {
        showToast('Acceso denegado: El rol COBRADOR no puede colocar préstamos (RBAC - 403 Forbidden)', 'error');
        return;
    }

    const clienteId = Number(document.getElementById('loan-cliente-select').value);
    const monto = Number(document.getElementById('loan-monto').value);
    const interes = Number(document.getElementById('loan-interes').value);
    const cuotas = Number(document.getElementById('loan-cuotas').value);
    const fechaInicio = document.getElementById('loan-fecha').value;
    const cobradorId = Number(document.getElementById('loan-cobrador-select').value);

    if (!clienteId) {
        alert('Por favor seleccione un titular registrado.');
        return;
    }

    const valorInteres = monto * (interes / 100);
    const totalPagar = monto + valorInteres;
    const valorCuota = Math.round(totalPagar / cuotas);

    const fechaObj = new Date(fechaInicio);
    fechaObj.setDate(fechaObj.getDate() + cuotas);
    const vencimiento = fechaObj.toISOString().split('T')[0];

    const newLoan = {
        id: Date.now(),
        clienteId,
        monto,
        interes,
        total: totalPagar,
        cuotas,
        valorCuota,
        saldo: totalPagar,
        cuotasPagadas: 0,
        fechaInicio,
        vencimiento,
        estado: 'ACTIVO',
        cobradorId
    };

    // Sincronizar con API REST bajo política RBAC
    fetch('/api/prestamos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${currentSession.token || ''}`
        },
        body: JSON.stringify({
            clienteId,
            monto,
            interes,
            cuotas,
            cobradorId,
            fechaInicio
        })
    }).then(async res => {
        if (res.status === 403) {
            showToast('Rechazado por servidor: Rol no autorizado (403 Forbidden)', 'error');
        }
    }).catch(() => {});

    state.prestamos.push(newLoan);
    saveState();
    showToast('Microcrédito desembolsado y asignado a ruta', 'success');
    switchTab('planillas');
}

// ASENTAR RECAUDO EN CALLE
window.openModalCobro = function(prestamoId) {
    const p = state.prestamos.find(item => item.id === prestamoId);
    if (!p) return;
    const c = state.clientes.find(item => item.id === p.clienteId);

    document.getElementById('cobro-prestamo-id').value = p.id;
    document.getElementById('cobro-cliente-nombre').textContent = `${c.nombres} ${c.apellidos}`;
    document.getElementById('cobro-cliente-cedula').textContent = `Cédula: ${c.cedula} • Sector: ${c.barrio}`;
    document.getElementById('cobro-saldo-actual').textContent = formatMoney(p.saldo);
    document.getElementById('cobro-cuota-pactada').textContent = formatMoney(p.valorCuota);

    document.getElementById('cobro-monto').value = p.valorCuota;
    const chipExacta = document.getElementById('chip-cuota-exacta');
    if (chipExacta) {
        chipExacta.dataset.value = p.valorCuota;
        chipExacta.textContent = `Cuota: ${formatMoney(p.valorCuota)}`;
    }
    const chipDoble = document.getElementById('chip-doble-cuota');
    if (chipDoble) {
        chipDoble.textContent = `2 Cuotas: ${formatMoney(p.valorCuota * 2)}`;
    }

    // Disparar sincronización satelital GPS al abrir el modal
    captureGPSCoordinates();

    openModal('modal-cobro');
};

function handleCobroSubmit(e) {
    e.preventDefault();
    const prestamoId = Number(document.getElementById('cobro-prestamo-id').value);
    const valorCobrado = Number(document.getElementById('cobro-monto').value);
    const obs = document.getElementById('cobro-observaciones').value.trim();
    const latitud = Number(document.getElementById('cobro-latitud').value || 10.463280);
    const longitud = Number(document.getElementById('cobro-longitud').value || -73.253150);
    const precisionGPS = Number(document.getElementById('cobro-precision').value || 5);
    const mapsUrl = `https://www.google.com/maps?q=${latitud},${longitud}`;

    const p = state.prestamos.find(item => item.id === prestamoId);
    if (!p) return;
    const c = state.clientes.find(item => item.id === p.clienteId);

    const nuevoSaldo = Math.max(0, p.saldo - valorCobrado);
    p.saldo = nuevoSaldo;
    p.cuotasPagadas = Math.min(p.cuotas, p.cuotasPagadas + Math.max(1, Math.round(valorCobrado / p.valorCuota)));
    if (nuevoSaldo === 0) p.estado = 'CANCELADO';

    const cobrador = currentSession.user && currentSession.user.rol === 'COBRADOR'
        ? { nombre: currentSession.user.nombre }
        : (state.cobradores.find(cob => cob.id === p.cobradorId) || { nombre: 'Cobrador de Ruta' });

    const nuevoPago = {
        id: Date.now(),
        prestamoId: p.id,
        clienteNombre: `${c.nombres} ${c.apellidos}`,
        cedula: c.cedula,
        cobradorNombre: cobrador.nombre,
        numeroCuota: p.cuotasPagadas,
        valor: valorCobrado,
        saldoRestante: nuevoSaldo,
        fecha: new Date().toISOString(),
        observaciones: obs || 'Recaudo ordinario de ruta',
        latitud,
        longitud,
        precisionGPS,
        direccionAproximada: `Ruta Valledupar - Sector ${c.barrio || 'Centro'}`,
        mapsUrl
    };

    // Sincronizar vía endpoint oficial REST con token JWT y auditoría satelital
    fetch('/api/pagos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${currentSession.token || ''}`
        },
        body: JSON.stringify({
            prestamoId: p.id,
            valor: valorCobrado,
            observaciones: obs || 'Recaudo ordinario de ruta',
            latitud,
            longitud,
            precisionGPS,
            direccionAproximada: `Ruta Valledupar - Sector ${c.barrio || 'Centro'}`
        })
    }).then(res => res.json()).then(data => {
        if (data && data.pago && data.pago.id) {
            nuevoPago.id = data.pago.id;
        }
    }).catch(() => {});

    state.pagos.unshift(nuevoPago);
    saveState();
    closeModal('modal-cobro');
    renderAll();
    showToast(`Recaudo de ${formatMoney(valorCobrado)} asentado con auditoría GPS`, 'success');
    mostrarReciboDigital(nuevoPago.id);
}

// RECIBO DIGITAL
window.mostrarReciboDigital = function(pagoId) {
    const pago = state.pagos.find(p => p.id === pagoId);
    if (!pago) return;

    const fechaFormat = new Date(pago.fecha).toLocaleString('es-CO');
    const finalMapsUrl = pago.mapsUrl || (pago.latitud && pago.longitud ? `https://www.google.com/maps?q=${pago.latitud},${pago.longitud}` : 'https://www.google.com/maps?q=10.463280,-73.253150');

    document.getElementById('recibo-fecha').textContent = fechaFormat;
    document.getElementById('recibo-cliente').textContent = pago.clienteNombre;
    document.getElementById('recibo-cedula').textContent = pago.cedula || 'Registrada';
    document.getElementById('recibo-prestamo-id').textContent = `#${pago.prestamoId} (Cuota ${pago.numeroCuota})`;
    document.getElementById('recibo-monto').textContent = formatMoney(pago.valor);
    document.getElementById('recibo-saldo-nuevo').textContent = formatMoney(pago.saldoRestante);
    document.getElementById('recibo-cobrador').textContent = pago.cobradorNombre;

    const mapsLink = document.getElementById('recibo-maps-link');
    if (mapsLink) mapsLink.href = finalMapsUrl;

    const waText = `*EMPRESA LLANO GRANDE* (Nit: 900.123.456-7)\n` +
                   `*COMPROBANTE OFICIAL DE RECAUDO*\n` +
                   `----------------------------------------\n` +
                   `• *Titular:* ${pago.clienteNombre}\n` +
                   `• *Cédula:* ${pago.cedula || 'Registrada'}\n` +
                   `• *Referencia:* Crédito #${pago.prestamoId} (Cuota ${pago.numeroCuota})\n` +
                   `• *Valor Abonado:* ${formatMoney(pago.valor)}\n` +
                   `• *Saldo Restante:* ${formatMoney(pago.saldoRestante)}\n` +
                   `• *Fecha:* ${fechaFormat}\n` +
                   `• *Ubicación GPS:* ${finalMapsUrl}\n` +
                   `• *Cobrador:* ${pago.cobradorNombre}\n` +
                   `----------------------------------------\n` +
                   `_Constancia oficial de abono de microcrédito diario._`;

    const btnCopiar = document.getElementById('btn-copiar-recibo-wa');
    if (btnCopiar) {
        btnCopiar.onclick = () => {
            navigator.clipboard.writeText(waText).then(() => {
                showToast('Comprobante copiado al portapapeles', 'success');
            }).catch(() => {
                showToast('Seleccione y copie el comprobante', 'info');
            });
        };
    }

    const p = state.prestamos.find(x => x.id === pago.prestamoId);
    const c = p ? state.clientes.find(cli => cli.id === p.clienteId) : null;
    const telWa = c ? c.telefono.replace(/\D/g, '') : '';
    const btnEnviarWa = document.getElementById('btn-enviar-recibo-wa');
    if (btnEnviarWa) {
        btnEnviarWa.href = `https://wa.me/57${telWa}?text=${encodeURIComponent(waText)}`;
    }

    openModal('modal-recibo');
};

// TARJETÓN OFICIAL DE CUOTAS
window.verTarjeton = function(prestamoId) {
    const p = state.prestamos.find(item => item.id === prestamoId);
    if (!p) return;
    const c = state.clientes.find(item => item.id === p.clienteId) || { nombres: 'Titular', apellidos: '', cedula: '--', telefono: '--', direccion: '--', barrio: '' };

    document.getElementById('tarjeton-titulo').textContent = `Tarjetón Oficial de Control de Cuotas #${p.id}`;
    document.getElementById('tarjeton-cliente-nombre').textContent = `${c.nombres} ${c.apellidos}`;
    document.getElementById('tarjeton-cliente-cedula').textContent = c.cedula;
    document.getElementById('tarjeton-cliente-telefono').textContent = c.telefono;
    document.getElementById('tarjeton-cliente-direccion').textContent = `${c.direccion} (${c.barrio || 'Sector'})`;
    document.getElementById('tarjeton-fecha-inicio').textContent = formatDate(p.fechaInicio);
    document.getElementById('tarjeton-fecha-fin').textContent = formatDate(p.vencimiento);

    document.getElementById('tarjeton-capital').textContent = formatMoney(p.monto);
    document.getElementById('tarjeton-total').textContent = formatMoney(p.total);
    document.getElementById('tarjeton-cuota').textContent = formatMoney(p.valorCuota);
    document.getElementById('tarjeton-saldo').textContent = formatMoney(p.saldo);

    const badge = document.getElementById('tarjeton-estado-badge');
    if (badge) {
        badge.textContent = p.saldo === 0 ? 'PAGADO TOTAL' : (p.estado === 'EN_MORA' ? 'EN MORA' : 'VIGENTE');
    }

    const pct = Math.round((p.cuotasPagadas / p.cuotas) * 100);
    document.getElementById('tarjeton-progreso-txt').textContent = `${p.cuotasPagadas} de ${p.cuotas} cuotas pagadas (${pct}%)`;

    const grid = document.getElementById('tarjeton-boxes-grid');
    grid.innerHTML = '';

    const pagosPrestamo = state.pagos
        .filter(pay => pay.prestamoId === p.id)
        .sort((a,b) => new Date(a.fecha) - new Date(b.fecha));

    for (let dia = 1; dia <= p.cuotas; dia++) {
        const box = document.createElement('div');
        const pago = pagosPrestamo[dia - 1];

        if (dia <= p.cuotasPagadas) {
            box.className = 'casilla-cuota pagado';
            const fStr = pago ? new Date(pago.fecha).toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit' }) : 'PAGADO';
            box.innerHTML = `
                <div style="font-weight:700;">DÍA ${dia}</div>
                <div style="display:flex; align-items:center; justify-content:center; gap:3px;"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg> <span>PAGADA</span></div>
                <div style="font-size:9px;">${fStr}</div>
            `;
        } else if (dia === p.cuotasPagadas + 1 && p.saldo > 0) {
            box.className = 'casilla-cuota siguiente';
            box.innerHTML = `
                <div style="font-weight:700;">DÍA ${dia}</div>
                <div>SIGUIENTE</div>
                <div>${formatMoney(p.valorCuota)}</div>
            `;
        } else {
            box.className = 'casilla-cuota';
            box.innerHTML = `
                <div style="font-weight:600; color:var(--text-muted);">DÍA ${dia}</div>
                <div style="color:var(--text-muted);">PENDIENTE</div>
                <div>${formatMoney(p.valorCuota)}</div>
            `;
        }
        grid.appendChild(box);
    }

    openModal('modal-tarjeton');
};

// WORKSPACE SWITCHER
function setWorkspace(name, type) {
    state.usuarioActivo.team = name;
    document.getElementById('ws-name-label').textContent = name;
    document.getElementById('ws-type-label').textContent = type;
    document.getElementById('welcome-user-title').textContent = name === 'Spark Pixel Team' ? 'Welcome back, Salung' : 'Bienvenido, Adriana Villazón';
    
    const logoBadge = document.getElementById('workspace-logo-badge');
    if (logoBadge) {
        if (name === 'Spark Pixel Team') {
            logoBadge.innerHTML = `<svg width="22" height="22" viewBox="0 0 32 32" fill="none">
                <path d="M 2 5.5 L 7 2 L 22 2 L 17 5.5 Z" fill="#0F172A"/>
                <path d="M 22 2 L 17 5.5 L 8 11.5 L 13 8 Z" fill="#1E293B"/>
                <path d="M 8 11.5 L 2 15.5 L 17 15.5 L 23 11.5 Z" fill="#0F172A"/>
                <path d="M 2 15.5 L 8 11.5 L 8 14.5 L 2 18.5 Z" fill="#334155"/>
                <path d="M 2 18.5 L 7 15 L 22 15 L 17 18.5 Z" fill="#0F172A"/>
            </svg>`;
        } else {
            logoBadge.innerHTML = `<svg width="22" height="22" viewBox="0 0 32 32" fill="none">
                <path d="M 16 2 L 28 8 L 16 14 L 4 8 Z" fill="#0F172A"/>
                <path d="M 4 11 L 16 17 L 28 11 L 28 14.5 L 16 20.5 L 4 14.5 Z" fill="#334155"/>
                <path d="M 4 17.5 L 16 23.5 L 28 17.5 L 28 21 L 16 27 L 4 21 Z" fill="#059669"/>
            </svg>`;
        }
    }

    closeModal('modal-workspace');
    showToast(`Espacio de trabajo cambiado a ${name}`, 'success');
}

// MODAL UTILITIES
function openModal(id) {
    const el = document.getElementById(id);
    if (el) el.classList.add('active');
}

function closeModal(id) {
    const el = document.getElementById(id);
    if (el) el.classList.remove('active');
}

// TOAST NOTIFICATIONS
function showToast(msg, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast-pill';
    const iconSvg = type === 'success'
        ? `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`
        : `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`;
    toast.innerHTML = `<span style="display:inline-flex; align-items:center;">${iconSvg}</span> <span>${msg}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3200);
}

// EVENTOS Y FORMATEO DE IMPRESIÓN OFICIAL
window.addEventListener('beforeprint', () => {
    const activePane = document.querySelector('.tab-pane.active');
    const currentTab = activePane ? activePane.id.replace('tab-', '') : state.activeTab;

    const docNameElem = document.getElementById('print-header-doc-name');
    const dateElem = document.getElementById('print-header-date');
    if (dateElem) {
        dateElem.textContent = new Date().toLocaleString('es-CO', {
            day: '2-digit', month: 'long', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    }
    if (docNameElem) {
        const titles = {
            dashboard: 'Balance General de Operaciones y Resumen de Cartera',
            prestamos: 'Hoja Oficial de Formulación y Liquidación de Microcréditos',
            transacciones: 'Libro Contable y Registro Histórico de Transacciones',
            analitica: 'Informe Ejecutivo y Análisis Financiero de Cartera',
            mensajes: 'Consolidado de Notificaciones y Comunicaciones de Cobranza',
            rendimiento: 'Reporte de Productividad y Desempeño de Asesores de Cobranza',
            campanas: 'Estrategias y Campañas Activas de Recuperación de Cartera',
            clientes: 'Directorio y Maestro Oficial de Titulares de Cartera',
            rutas: 'Mapa y Distribución Geográfica de Rutas de Cobro',
            planillas: 'Planilla Oficial de Control Diario de Cobranza en Calle',
            roles: 'Matriz de Seguridad, Usuarios y Privilegios del Sistema',
            cierre: 'Acta Oficial de Arqueo y Cierre Diario de Caja',
            integraciones: 'Catálogo de Contratos y Respaldos del Sistema',
            configuracion: 'Parámetros Institucionales y Políticas de Crédito'
        };
        docNameElem.textContent = titles[currentTab] || 'Informe Oficial de Cartera';
    }

    const anyModalOpen = document.querySelector('.modal-overlay.active');
    if (anyModalOpen) {
        document.body.classList.add('printing-modal');
    }
});

window.addEventListener('afterprint', () => {
    document.body.classList.remove('printing-modal');
});

// BACKUP EXPORT
function exportBackupJSON() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2));
    const a = document.createElement('a');
    a.setAttribute("href", dataStr);
    a.setAttribute("download", `respaldo_llanogrande_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(a);
    a.click();
    a.remove();
    showToast('Copia de seguridad descargada exitosamente', 'success');
}

// 8. HELPERS OPERATIVOS: PRESETS DE CRÉDITO Y FILTROS DE CIRCUITO
function setLoanAmount(amount) {
    const input = document.getElementById('loan-monto');
    if (!input) return;
    input.value = amount;
    input.dispatchEvent(new Event('input'));
    
    document.querySelectorAll('.preset-amount-btn').forEach(btn => {
        const text = btn.textContent.trim();
        const isMatch = (amount === 200000 && text === '$200k') ||
                        (amount === 300000 && text === '$300k') ||
                        (amount === 500000 && text === '$500k') ||
                        (amount === 1000000 && text === '$1M') ||
                        (amount === 2000000 && text === '$2M');
        btn.classList.toggle('active', isMatch);
    });
}

function setRoutePlanillaFilter(route) {
    state.activeRouteFilter = route;
    document.querySelectorAll('.route-filter-pill').forEach(pill => {
        pill.classList.toggle('active', pill.dataset.route === route);
    });
    renderPlanillaRuta();
    renderPlanillaTableSummary();
}

function setPlanillaViewMode(mode) {
    state.planillaViewMode = mode;
    const tableContainer = document.getElementById('planilla-table-container');
    const cardsContainer = document.getElementById('ruta-cards-container');
    const btnTable = document.getElementById('btn-view-mode-table');
    const btnCards = document.getElementById('btn-view-mode-cards');

    if (mode === 'cards') {
        if (tableContainer) tableContainer.style.display = 'none';
        if (cardsContainer) cardsContainer.style.display = 'grid';
        btnTable?.classList.remove('active');
        btnCards?.classList.add('active');
        renderPlanillaRuta();
    } else {
        if (tableContainer) tableContainer.style.display = 'block';
        if (cardsContainer) cardsContainer.style.display = 'none';
        btnTable?.classList.add('active');
        btnCards?.classList.remove('active');
        renderPlanillaTableSummary();
    }
}

function setCurrencyMode(mode) {
    if (!['COP', 'USD'].includes(mode)) return;
    state.currencyMode = mode;
    document.getElementById('btn-curr-cop')?.classList.toggle('active', mode === 'COP');
    document.getElementById('btn-curr-usd')?.classList.toggle('active', mode === 'USD');
    const settingsSelect = document.getElementById('settings-currency-select');
    if (settingsSelect) settingsSelect.value = mode;
    renderAll();
    renderSalesTrendChart();
    showToast(`Moneda cambiada a ${mode}`, 'info');
}

window.app = {
    switchTab,
    setWorkspace,
    toggleSidebar,
    verTarjeton: window.verTarjeton,
    openModalCobro: window.openModalCobro,
    mostrarReciboDigital: window.mostrarReciboDigital,
    openModalAuth: () => openModal('modal-auth-role'),
    switchUser,
    captureGPSCoordinates,
    setLoanAmount,
    setRoutePlanillaFilter,
    setPlanillaViewMode,
    setCurrencyMode,
    openLoginModal,
    closeLoginModal,
    fillLoginForm,
    handleLandingLogin,
    quickEnterDemo,
    showLandingView,
    showAppView,
    logoutUser
};

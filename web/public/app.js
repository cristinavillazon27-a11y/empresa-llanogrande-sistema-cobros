// ====================================================================
// EMPRESA LLANO GRANDE - SISTEMA DE COBROS DIARIOS Y MICROCRÉDITOS
// LÓGICA DE APLICACIÓN WEB CLIENTE (JAVASCRIPT VANILLA)
// ====================================================================

const state = {
    clientes: [],
    prestamos: [],
    pagos: [],
    cobradores: [
        { id: 1, nombre: 'Juan Carlos', ruta: 'Ruta Centro / Mercado' },
        { id: 2, nombre: 'Pedro Pablo', ruta: 'Ruta Sur / Primavera' }
    ],
    usuarioActivo: { id: 1, nombre: 'Don Alberto Morales', rol: 'ADMINISTRADOR' },
    activeFilterRuta: 'todos'
};

// Formatter Helpers
const formatCOP = (val) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(val);
const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' });
};

// ====================================================================
// INITIALIZATION & API SYNC
// ====================================================================
document.addEventListener('DOMContentLoaded', async () => {
    initClock();
    initEventListeners();
    await loadInitialData();
    renderAll();
});

function initClock() {
    const updateTime = () => {
        const now = new Date();
        const str = now.toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) +
                    ' - ' + now.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
        document.getElementById('current-date-time').textContent = str.charAt(0).toUpperCase() + str.slice(1);
    };
    updateTime();
    setInterval(updateTime, 1000);
}

async function loadInitialData() {
    try {
        const res = await fetch('/api/data');
        if (res.ok) {
            const data = await res.json();
            state.clientes = data.clientes || [];
            state.prestamos = data.prestamos || [];
            state.pagos = data.pagos || [];
            showToast('Conectado al servidor de Llano Grande', 'info');
            return;
        }
    } catch (e) {
        console.warn('Usando almacenamiento local de respaldo:', e);
    }

    // Default Seed Data if API is unavailable or empty
    const local = localStorage.getItem('llanogrande_state');
    if (local) {
        const parsed = JSON.parse(local);
        state.clientes = parsed.clientes || [];
        state.prestamos = parsed.prestamos || [];
        state.pagos = parsed.pagos || [];
    } else {
        // Sample seed faithful to Empresa Llano Grande
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
}

function saveState() {
    localStorage.setItem('llanogrande_state', JSON.stringify(state));
    // Sincronizar en background con servidor si existe
    fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(state)
    }).catch(() => {});
}

// ====================================================================
// EVENT LISTENERS & NAVIGATION
// ====================================================================
function initEventListeners() {
    // Nav Tabs
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.dataset.tab;
            switchTab(tabId);
        });
    });

    // Quick New Loan button in header
    document.getElementById('btn-quick-new-loan').addEventListener('click', () => switchTab('prestamos'));

    // Ruta Filter Buttons
    document.querySelectorAll('.pill-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.pill-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.activeFilterRuta = btn.dataset.filter;
            renderRutaCobro();
        });
    });

    // Search inputs
    document.getElementById('ruta-search').addEventListener('input', renderRutaCobro);
    document.getElementById('clientes-search').addEventListener('input', renderClientes);

    // Modal Cliente Open/Close
    document.getElementById('btn-open-modal-cliente').addEventListener('click', () => openModalCliente());
    document.getElementById('btn-close-modal-cliente').addEventListener('click', () => closeModal('modal-cliente'));
    document.getElementById('btn-cancel-modal-cliente').addEventListener('click', () => closeModal('modal-cliente'));

    // Form Cliente Submit
    document.getElementById('form-cliente').addEventListener('submit', handleClienteSubmit);

    // Modal Cobro Close
    document.getElementById('btn-close-modal-cobro').addEventListener('click', () => closeModal('modal-cobro'));
    document.getElementById('btn-cancel-modal-cobro').addEventListener('click', () => closeModal('modal-cobro'));
    document.getElementById('form-cobro').addEventListener('submit', handleCobroSubmit);

    // Modal Recibo Close
    document.getElementById('btn-close-modal-recibo').addEventListener('click', () => closeModal('modal-recibo'));

    // Modal Tarjeton Close
    document.getElementById('btn-close-modal-tarjeton').addEventListener('click', () => closeModal('modal-tarjeton'));
    document.getElementById('btn-cancel-modal-tarjeton').addEventListener('click', () => closeModal('modal-tarjeton'));

    // Quick chips in cobro modal
    document.getElementById('chip-cuota-exacta').addEventListener('click', () => {
        const cuota = document.getElementById('chip-cuota-exacta').dataset.value;
        if (cuota) document.getElementById('cobro-monto').value = cuota;
    });
    document.getElementById('chip-doble-cuota').addEventListener('click', () => {
        const cuota = document.getElementById('chip-cuota-exacta').dataset.value;
        if (cuota) document.getElementById('cobro-monto').value = Number(cuota) * 2;
    });

    // Loan Simulator calculation triggers
    ['loan-monto', 'loan-interes', 'loan-cuotas', 'loan-fecha'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', updateLoanSimulator);
    });
    document.getElementById('loan-form').addEventListener('submit', handleLoanSubmit);

    // Backup actions
    document.getElementById('btn-download-json-backup').addEventListener('click', exportBackupJSON);
    document.getElementById('btn-download-sql-script').addEventListener('click', () => {
        window.open('/api/download-sql', '_blank');
    });

    // Default date in loan form to today
    document.getElementById('loan-fecha').value = new Date().toISOString().split('T')[0];
    updateLoanSimulator();
}

function switchTab(tabId) {
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabId);
    });
    document.querySelectorAll('.tab-pane').forEach(pane => {
        pane.classList.toggle('active', pane.id === `tab-${tabId}`);
    });

    const titles = {
        dashboard: ['Panel de Control General', 'Resumen ejecutivo en tiempo real de cartera y recaudos'],
        ruta: ['Ruta de Cobro del Día', 'Registro de pagos y recaudos en calle para cobradores'],
        clientes: ['Directorio de Clientes', 'Gestión de titulares, contactos y verificación de identidad'],
        prestamos: ['Desembolso de Préstamo', 'Calculadora y formalización de microcréditos diarios'],
        cierre: ['Arqueo y Cierre de Caja', 'Consolidado de dinero recaudado por cada cobrador'],
        respaldos: ['Copias de Seguridad', 'Exportación y protección de datos contables']
    };

    if (titles[tabId]) {
        document.getElementById('page-title').textContent = titles[tabId][0];
        document.getElementById('page-subtitle').textContent = titles[tabId][1];
    }

    renderAll();
}

// ====================================================================
// RENDERERS
// ====================================================================
function renderAll() {
    renderDashboardStats();
    renderRutaCobro();
    renderClientes();
    renderPrestamosSelect();
    renderCierreCaja();
}

// 1. DASHBOARD STATS
function renderDashboardStats() {
    // Total Recaudado Hoy
    const hoyStr = new Date().toISOString().split('T')[0];
    const recHoy = state.pagos
        .filter(p => p.fecha.startsWith(hoyStr))
        .reduce((sum, p) => sum + Number(p.valor), 0);
    document.getElementById('stat-recaudo-hoy').textContent = formatCOP(recHoy);
    document.getElementById('cierre-total-amount').textContent = formatCOP(recHoy);

    // Dinero en Calle (Suma de saldos de prestamos activos)
    const activos = state.prestamos.filter(p => p.estado === 'ACTIVO' || p.estado === 'EN_MORA');
    const cartera = activos.reduce((sum, p) => sum + Number(p.saldo), 0);
    document.getElementById('stat-cartera-calle').textContent = formatCOP(cartera);
    document.getElementById('stat-prestamos-activos-count').textContent = `${activos.length} préstamos activos en calle`;

    // Clientes totales
    const clientesActivos = state.clientes.filter(c => c.activo);
    document.getElementById('stat-clientes-totales').textContent = clientesActivos.length;

    // Clientes en mora
    const mora = state.prestamos.filter(p => p.estado === 'EN_MORA').length;
    document.getElementById('stat-clientes-mora').textContent = mora;

    // Meta de Recaudo de la Jornada
    const metaRecaudo = activos.reduce((sum, p) => sum + Number(p.valorCuota), 0) || 500000;
    const pctMeta = Math.min(100, Math.round((recHoy / metaRecaudo) * 100));
    const elTarget = document.getElementById('goal-target-amount');
    if (elTarget) elTarget.textContent = formatCOP(metaRecaudo);
    const elRecHoy = document.getElementById('goal-collected-today');
    if (elRecHoy) elRecHoy.textContent = formatCOP(recHoy);
    const elPct = document.getElementById('goal-progress-percent');
    if (elPct) elPct.textContent = `${pctMeta}% alcanzado`;
    const elBar = document.getElementById('goal-progress-bar');
    if (elBar) elBar.style.width = `${pctMeta}%`;

    // Tabla de préstamos recientes en dashboard
    const tbody = document.getElementById('dash-prestamos-tbody');
    tbody.innerHTML = '';
    activos.slice(0, 5).forEach(p => {
        const cliente = state.clientes.find(c => c.id === p.clienteId) || { nombres: 'Desconocido', apellidos: '', cedula: '--' };
        const tr = document.createElement('tr');
        const estadoCls = p.estado === 'ACTIVO' ? 'status-al-dia' : (p.estado === 'EN_MORA' ? 'status-en-mora' : 'status-liquidado');
        tr.innerHTML = `
            <td><strong>${cliente.nombres} ${cliente.apellidos}</strong></td>
            <td><code>${cliente.cedula}</code></td>
            <td>${formatCOP(p.monto)}</td>
            <td class="text-success"><strong>${formatCOP(p.valorCuota)}</strong></td>
            <td><strong>${formatCOP(p.saldo)}</strong></td>
            <td><span class="status-pill ${estadoCls}">${p.estado === 'ACTIVO' ? 'AL DÍA' : (p.estado === 'EN_MORA' ? 'EN MORA' : 'PAGADO')}</span></td>
            <td><button class="btn btn-sm btn-secondary" onclick="verTarjeton(${p.id})">Ver Tarjetón</button></td>
        `;
        tbody.appendChild(tr);
    });
}

// 2. RUTA DE COBRO (STREET COLLECTOR VIEW)
function renderRutaCobro() {
    const container = document.getElementById('ruta-cards-container');
    const query = document.getElementById('ruta-search').value.toLowerCase().trim();
    const hoyStr = new Date().toISOString().split('T')[0];

    const prestamosActivos = state.prestamos.filter(p => p.estado === 'ACTIVO' || p.estado === 'EN_MORA');
    
    let cobradosCount = 0;
    let pendientesCount = 0;

    const cardsData = prestamosActivos.map(p => {
        const cliente = state.clientes.find(c => c.id === p.clienteId) || { nombres: 'Cliente', apellidos: '', cedula: '', direccion: '', barrio: '', telefono: '' };
        const pagoHoy = state.pagos.some(pay => pay.prestamoId === p.id && pay.fecha.startsWith(hoyStr));
        if (pagoHoy) cobradosCount++;
        else pendientesCount++;

        return { prestamo: p, cliente, yaPagoHoy: pagoHoy };
    });

    document.getElementById('count-filter-all').textContent = prestamosActivos.length;
    document.getElementById('count-filter-pend').textContent = pendientesCount;
    document.getElementById('count-filter-cobr').textContent = cobradosCount;
    document.getElementById('badge-ruta-count').textContent = pendientesCount;

    const filtered = cardsData.filter(item => {
        if (state.activeFilterRuta === 'pendientes' && item.yaPagoHoy) return false;
        if (state.activeFilterRuta === 'cobrados' && !item.yaPagoHoy) return false;

        if (query) {
            const fullText = `${item.cliente.nombres} ${item.cliente.apellidos} ${item.cliente.cedula} ${item.cliente.barrio} ${item.cliente.direccion}`.toLowerCase();
            return fullText.includes(query);
        }
        return true;
    });

    container.innerHTML = '';
    if (filtered.length === 0) {
        container.innerHTML = `<div class="panel-section p-4 text-center text-muted" style="grid-column: 1/-1; padding: 24px;">No se encontraron registros de cobro con los filtros aplicados.</div>`;
        return;
    }

    filtered.forEach(({ prestamo: p, cliente: c, yaPagoHoy }) => {
        const card = document.createElement('div');
        card.className = 'planilla-card';
        const pctProgreso = Math.round(((p.total - p.saldo) / p.total) * 100);
        const estadoCls = yaPagoHoy ? 'status-al-dia' : (p.estado === 'EN_MORA' ? 'status-en-mora' : 'status-al-dia');
        const telWa = (c.telefono || '').replace(/\D/g, '');
        const waMsg = encodeURIComponent(`Hola ${c.nombres}, cordial saludo de Empresa Llano Grande. Le recordamos el recaudo de su cuota diaria por valor de ${formatCOP(p.valorCuota)}. Saldo actual: ${formatCOP(p.saldo)}.`);

        card.innerHTML = `
            <div class="card-top">
                <div class="client-title">
                    <h4>${c.nombres} ${c.apellidos}</h4>
                    <div class="client-loc">
                        <span>CC: ${c.cedula}</span> • <span>${c.barrio}</span>
                    </div>
                    <small class="text-muted" style="display:block; margin-top:2px;">📍 ${c.direccion} • 📞 ${c.telefono}</small>
                </div>
                <div>
                    <span class="status-pill ${estadoCls}">
                        ${yaPagoHoy ? 'COBRADO HOY' : (p.estado === 'EN_MORA' ? 'ATRASADO' : 'PENDIENTE')}
                    </span>
                </div>
            </div>

            <div class="balance-grid">
                <div class="balance-item">
                    <span>Cuota Diaria Fija:</span>
                    <strong class="text-success">${formatCOP(p.valorCuota)}</strong>
                </div>
                <div class="balance-item">
                    <span>Saldo Restante:</span>
                    <strong class="text-danger">${formatCOP(p.saldo)}</strong>
                </div>
            </div>

            <div>
                <div style="display:flex; justify-content:space-between; font-size:11px; margin-bottom:4px;" class="text-muted">
                    <span>Avance: Cuota ${p.cuotasPagadas} de ${p.cuotas}</span>
                    <span>${pctProgreso}%</span>
                </div>
                <div class="progress-track">
                    <div class="progress-bar-fill" style="width: ${pctProgreso}%;"></div>
                </div>
            </div>

            <div style="display:flex; gap:6px; flex-wrap: wrap;">
                <button class="btn btn-primary btn-sm" style="flex: 1;" onclick="openModalCobro(${p.id})">
                    <span>${yaPagoHoy ? '+ Abono' : 'Cobrar Cuota'}</span>
                </button>
                <button class="btn btn-secondary btn-sm" onclick="verTarjeton(${p.id})" title="Ver Tarjetón de Cuotas">
                    <span>Tarjetón</span>
                </button>
                <a href="https://wa.me/57${telWa}?text=${waMsg}" target="_blank" class="btn-whatsapp btn-sm" title="Contactar por WhatsApp">
                    <span>WhatsApp</span>
                </a>
            </div>
        `;
        container.appendChild(card);
    });
}

// 3. GESTIÓN DE CLIENTES
function renderClientes() {
    const tbody = document.getElementById('clientes-tbody');
    const query = document.getElementById('clientes-search').value.toLowerCase().trim();

    const filtered = state.clientes.filter(c => {
        if (!query) return true;
        const text = `${c.nombres} ${c.apellidos} ${c.cedula} ${c.telefono} ${c.barrio}`.toLowerCase();
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
            <td>📞 ${c.telefono}</td>
            <td>${c.direccion} <br><small class="text-muted">Sector: ${c.barrio}</small></td>
            <td>
                <span class="status-pill ${tieneActivo ? 'status-al-dia' : 'status-liquidado'}">
                    ${tieneActivo ? 'Crédito Vigente' : 'Sin Deuda'}
                </span>
            </td>
            <td>
                <button class="btn btn-sm btn-secondary" onclick="editarCliente(${c.id})">Editar</button>
                ${btnTarjeton}
                <button class="btn btn-sm btn-secondary text-danger" onclick="toggleActivoCliente(${c.id})">
                    ${c.activo ? 'Desactivar' : 'Reactivar'}
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function renderPrestamosSelect() {
    const sel = document.getElementById('loan-cliente-select');
    sel.innerHTML = '<option value="">-- Seleccione un cliente registrado --</option>';
    state.clientes.filter(c => c.activo).forEach(c => {
        const opt = document.createElement('option');
        opt.value = c.id;
        opt.textContent = `${c.cedula} - ${c.nombres} ${c.apellidos} (${c.barrio})`;
        sel.appendChild(opt);
    });
}

// 4. CIERRE DE CAJA
function renderCierreCaja() {
    const tbody = document.getElementById('cierre-tbody');
    tbody.innerHTML = '';

    const hoyStr = new Date().toISOString().split('T')[0];
    const pagosHoy = state.pagos.filter(p => p.fecha.startsWith(hoyStr));

    if (pagosHoy.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="text-center text-muted p-4">No se han registrado cobros hoy aún.</td></tr>`;
        return;
    }

    pagosHoy.forEach(p => {
        const tr = document.createElement('tr');
        const hora = new Date(p.fecha).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
        tr.innerHTML = `
            <td><code>${hora}</code></td>
            <td><strong>${p.clienteNombre}</strong></td>
            <td><span class="status-pill status-al-dia">${p.cobradorNombre}</span></td>
            <td>Cuota #${p.numeroCuota}</td>
            <td class="text-success"><strong>${formatCOP(p.valor)}</strong></td>
            <td class="text-danger"><strong>${formatCOP(p.saldoRestante)}</strong></td>
            <td>
                <button class="btn btn-sm btn-secondary" onclick="mostrarReciboDigital(${p.id})">Comprobante</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// ====================================================================
// MODAL & ACTION HANDLERS
// ====================================================================

// CLIENTE MODAL
function openModalCliente(cliente = null) {
    document.getElementById('form-cliente').reset();
    if (cliente) {
        document.getElementById('modal-cliente-title').textContent = 'Editar Cliente';
        document.getElementById('cli-id').value = cliente.id;
        document.getElementById('cli-cedula').value = cliente.cedula;
        document.getElementById('cli-cedula').disabled = true;
        document.getElementById('cli-nombres').value = cliente.nombres;
        document.getElementById('cli-apellidos').value = cliente.apellidos;
        document.getElementById('cli-telefono').value = cliente.telefono;
        document.getElementById('cli-direccion').value = cliente.direccion;
        document.getElementById('cli-barrio').value = cliente.barrio;
    } else {
        document.getElementById('modal-cliente-title').textContent = 'Registrar Nuevo Cliente';
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
    showToast(`Cliente ${c.activo ? 'activado' : 'desactivado'} con éxito`, 'info');
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
        // Edit
        const c = state.clientes.find(item => item.id === Number(id));
        if (c) {
            c.nombres = nombres;
            c.apellidos = apellidos;
            c.telefono = telefono;
            c.direccion = direccion;
            c.barrio = barrio;
            showToast('Cliente actualizado correctamente', 'success');
        }
    } else {
        // Validation: Unique cedula
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
        showToast('Cliente registrado con éxito en Llano Grande', 'success');
    }

    saveState();
    closeModal('modal-cliente');
    renderAll();
}

// LOAN SIMULATOR & SUBMIT
function updateLoanSimulator() {
    const monto = Number(document.getElementById('loan-monto').value) || 0;
    const interes = Number(document.getElementById('loan-interes').value) || 0;
    const cuotas = Number(document.getElementById('loan-cuotas').value) || 24;
    const fechaInicio = document.getElementById('loan-fecha').value || new Date().toISOString().split('T')[0];

    const valorInteres = monto * (interes / 100);
    const totalPagar = monto + valorInteres;
    const valorCuota = cuotas > 0 ? Math.round(totalPagar / cuotas) : 0;

    const fechaObj = new Date(fechaInicio);
    fechaObj.setDate(fechaObj.getDate() + cuotas);
    const vencimientoStr = fechaObj.toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' });

    document.getElementById('sim-monto').textContent = formatCOP(monto);
    document.getElementById('sim-interes-pct').textContent = `${interes.toFixed(1)} % (${formatCOP(valorInteres)})`;
    document.getElementById('sim-total-pagar').textContent = formatCOP(totalPagar);
    document.getElementById('sim-dias').textContent = `${cuotas} días hábiles`;
    document.getElementById('sim-cuota-diaria').textContent = `${formatCOP(valorCuota)} / día`;
    document.getElementById('sim-vencimiento').textContent = vencimientoStr;
}

function handleLoanSubmit(e) {
    e.preventDefault();
    const clienteId = Number(document.getElementById('loan-cliente-select').value);
    const monto = Number(document.getElementById('loan-monto').value);
    const interes = Number(document.getElementById('loan-interes').value);
    const cuotas = Number(document.getElementById('loan-cuotas').value);
    const fechaInicio = document.getElementById('loan-fecha').value;
    const cobradorId = Number(document.getElementById('loan-cobrador-select').value);

    if (!clienteId) {
        alert('Por favor seleccione un cliente registrado.');
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

    state.prestamos.push(newLoan);
    saveState();
    showToast('Préstamo desembolsado exitosamente', 'success');
    switchTab('ruta');
}

// COBRO MODAL & SUBMIT
window.openModalCobro = function(prestamoId) {
    const p = state.prestamos.find(item => item.id === prestamoId);
    if (!p) return;
    const c = state.clientes.find(item => item.id === p.clienteId);

    document.getElementById('cobro-prestamo-id').value = p.id;
    document.getElementById('cobro-cliente-nombre').textContent = `${c.nombres} ${c.apellidos}`;
    document.getElementById('cobro-cliente-cedula').textContent = `Cédula: ${c.cedula} • Sector: ${c.barrio}`;
    document.getElementById('cobro-saldo-actual').textContent = formatCOP(p.saldo);
    document.getElementById('cobro-cuota-pactada').textContent = formatCOP(p.valorCuota);

    document.getElementById('cobro-monto').value = p.valorCuota;
    document.getElementById('chip-cuota-exacta').dataset.value = p.valorCuota;
    document.getElementById('chip-cuota-exacta').textContent = `Cuota: ${formatCOP(p.valorCuota)}`;
    document.getElementById('chip-doble-cuota').textContent = `2 Cuotas: ${formatCOP(p.valorCuota * 2)}`;

    openModal('modal-cobro');
};

function handleCobroSubmit(e) {
    e.preventDefault();
    const prestamoId = Number(document.getElementById('cobro-prestamo-id').value);
    const valorCobrado = Number(document.getElementById('cobro-monto').value);
    const obs = document.getElementById('cobro-observaciones').value.trim();

    const p = state.prestamos.find(item => item.id === prestamoId);
    if (!p) return;
    const c = state.clientes.find(item => item.id === p.clienteId);

    const nuevoSaldo = Math.max(0, p.saldo - valorCobrado);
    p.saldo = nuevoSaldo;
    p.cuotasPagadas = Math.min(p.cuotas, p.cuotasPagadas + Math.max(1, Math.round(valorCobrado / p.valorCuota)));
    if (nuevoSaldo === 0) {
        p.estado = 'CANCELADO';
    }

    const cobrador = state.cobradores.find(cob => cob.id === p.cobradorId) || { nombre: 'Cobrador de Ruta' };

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
        observaciones: obs || 'Cobro diario de ruta'
    };

    state.pagos.unshift(nuevoPago);
    saveState();
    closeModal('modal-cobro');
    renderAll();
    showToast(`Cobro de ${formatCOP(valorCobrado)} asentado con éxito`, 'success');
    mostrarReciboDigital(nuevoPago.id);
}

// RECIBO DIGITAL
window.mostrarReciboDigital = function(pagoId) {
    const pago = state.pagos.find(p => p.id === pagoId);
    if (!pago) return;

    const fechaFormat = new Date(pago.fecha).toLocaleString('es-CO');
    document.getElementById('recibo-fecha').textContent = fechaFormat;
    document.getElementById('recibo-cliente').textContent = pago.clienteNombre;
    document.getElementById('recibo-cedula').textContent = pago.cedula || 'Registrada';
    document.getElementById('recibo-prestamo-id').textContent = `#${pago.prestamoId} (Cuota ${pago.numeroCuota})`;
    document.getElementById('recibo-monto').textContent = formatCOP(pago.valor);
    document.getElementById('recibo-saldo-nuevo').textContent = formatCOP(pago.saldoRestante);
    document.getElementById('recibo-cobrador').textContent = pago.cobradorNombre;

    // Generar texto para WhatsApp
    const waText = `🧾 *EMPRESA LLANO GRANDE* (Nit: 900.123.456-7)\n` +
                   `*COMPROBANTE OFICIAL DE RECAUDO*\n` +
                   `----------------------------------------\n` +
                   `👤 *Titular:* ${pago.clienteNombre}\n` +
                   `💳 *Cédula:* ${pago.cedula || 'Registrada'}\n` +
                   `📌 *Referencia:* Crédito #${pago.prestamoId} (Cuota ${pago.numeroCuota})\n` +
                   `💰 *Valor Abonado:* ${formatCOP(pago.valor)}\n` +
                   `📉 *Saldo Restante:* ${formatCOP(pago.saldoRestante)}\n` +
                   `📅 *Fecha:* ${fechaFormat}\n` +
                   `🏍️ *Cobrador:* ${pago.cobradorNombre}\n` +
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

// TARJETÓN DE CRÉDITO VIRTUALIZADO (24 / 30 CUOTAS DIARIAS)
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

    document.getElementById('tarjeton-capital').textContent = formatCOP(p.monto);
    document.getElementById('tarjeton-total').textContent = formatCOP(p.total);
    document.getElementById('tarjeton-cuota').textContent = formatCOP(p.valorCuota);
    document.getElementById('tarjeton-saldo').textContent = formatCOP(p.saldo);
    
    const estadoBadge = document.getElementById('tarjeton-estado-badge');
    if (estadoBadge) {
        estadoBadge.textContent = p.saldo === 0 ? 'PAGADO TOTAL' : (p.estado === 'EN_MORA' ? 'EN MORA' : 'VIGENTE');
    }

    const pct = Math.round((p.cuotasPagadas / p.cuotas) * 100);
    document.getElementById('tarjeton-progreso-txt').textContent = `${p.cuotasPagadas} de ${p.cuotas} cuotas pagadas (${pct}%)`;

    // Renderizar casillas
    const grid = document.getElementById('tarjeton-boxes-grid');
    grid.innerHTML = '';

    const pagosPrestamo = state.pagos
        .filter(pay => pay.prestamoId === p.id)
        .sort((a,b) => new Date(a.fecha) - new Date(b.fecha));

    for (let dia = 1; dia <= p.cuotas; dia++) {
        const box = document.createElement('div');
        const pago = pagosPrestamo[dia - 1];

        if (dia <= p.cuotasPagadas) {
            box.className = 'tarjeton-box box-pagado';
            const fStr = pago ? new Date(pago.fecha).toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit' }) : 'PAGADO';
            box.innerHTML = `
                <span class="box-num">DÍA ${dia}</span>
                <span class="box-state">✔ PAGADA</span>
                <span class="box-val">${fStr}</span>
            `;
        } else if (dia === p.cuotasPagadas + 1 && p.saldo > 0) {
            box.className = 'tarjeton-box box-siguiente';
            box.innerHTML = `
                <span class="box-num">DÍA ${dia}</span>
                <span class="box-state" style="color:#0284c7;">SIGUIENTE</span>
                <span class="box-val">${formatCOP(p.valorCuota)}</span>
            `;
        } else {
            box.className = 'tarjeton-box';
            box.innerHTML = `
                <span class="box-num">DÍA ${dia}</span>
                <span class="box-state text-muted">PENDIENTE</span>
                <span class="box-val">${formatCOP(p.valorCuota)}</span>
            `;
        }
        grid.appendChild(box);
    }

    openModal('modal-tarjeton');
};

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
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>${type === 'success' ? '✔' : 'ℹ'}</span> <span>${msg}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}

// BACKUP EXPORT
function exportBackupJSON() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `respaldo_llanogrande_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Copia de seguridad descargada exitosamente', 'success');
}

window.app = { 
    switchTab, 
    verTarjeton: window.verTarjeton, 
    openModalCobro: window.openModalCobro, 
    mostrarReciboDigital: window.mostrarReciboDigital 
};

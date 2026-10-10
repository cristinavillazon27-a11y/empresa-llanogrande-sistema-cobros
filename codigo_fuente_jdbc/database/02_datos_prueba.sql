-- ====================================================================
-- SISTEMA DE GESTIÓN DE PRÉSTAMOS Y COBROS DIARIOS - EMPRESA LLANO GRANDE
-- SCRIPT DML: DATOS INICIALES Y DE PRUEBA
-- ====================================================================

USE llanogrande_db;

-- 1. USUARIOS DEL SISTEMA
INSERT INTO usuarios (nombre, usuario, clave, rol, telefono) VALUES
('Don Alberto Morales', 'admin', 'admin123', 'ADMINISTRADOR', '3109876543'),
('Juan Carlos Cobrador', 'cobrador1', 'cobre123', 'COBRADOR', '3151234567'),
('Pedro Ruta Sur', 'cobrador2', 'cobre456', 'COBRADOR', '3207654321');

-- 2. CLIENTES DE EJEMPLO
INSERT INTO clientes (cedula, nombres, apellidos, telefono, direccion, barrio_sector, activo) VALUES
('1098765432', 'María Elena', 'Ríos Salazar', '3124567890', 'Calle 14 # 25-30', 'Centro', 1),
('1098765433', 'Carlos Andrés', 'Martínez Gómez', '3137890123', 'Carrera 8 # 12-45', 'El Bosque', 1),
('1098765434', 'Gloria Stella', 'Pérez Cuéllar', '3145678901', 'Manzana 4 Lote 12', 'Llano Lindo', 1),
('1098765435', 'Javier Fernando', 'Díaz Moncada', '3178901234', 'Avenida Colombia # 40-10', 'San Isidro', 1),
('1098765436', 'Sandra Milena', 'Torres Benítez', '3182345678', 'Transversal 5 # 18-09', 'La Primavera', 1);

-- 3. PRÉSTAMOS ACTIVOS DE PAGA DIARIO (Ejemplo: $500.000 al 20% en 24 cuotas diarias de $25.000)
INSERT INTO prestamos 
(cliente_id, usuario_creador_id, monto_prestado, porcentaje_interes, total_pagar, numero_cuotas, valor_cuota, saldo_pendiente, fecha_prestamo, fecha_vencimiento, estado)
VALUES
(1, 1, 500000.00, 20.00, 600000.00, 24, 25000.00, 525000.00, '2026-10-01', '2026-10-28', 'ACTIVO'),
(2, 1, 300000.00, 20.00, 360000.00, 20, 18000.00, 360000.00, '2026-10-05', '2026-10-27', 'ACTIVO'),
(3, 1, 1000000.00, 20.00, 1200000.00, 30, 40000.00, 1200000.00, '2026-10-07', '2026-11-10', 'ACTIVO');

-- 4. REGISTRO DE CUOTAS COBRADAS
INSERT INTO cuotas_pagos (prestamo_id, usuario_cobrador_id, numero_cuota, valor_pagado, saldo_restante, observaciones) VALUES
(1, 2, 1, 25000.00, 575000.00, 'Pago cuota 1 normal'),
(1, 2, 2, 25000.00, 550000.00, 'Pago cuota 2 al mediodía'),
(1, 2, 3, 25000.00, 525000.00, 'Pago cuota 3');

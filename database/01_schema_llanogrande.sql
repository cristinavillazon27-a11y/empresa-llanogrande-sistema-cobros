-- ====================================================================
-- SISTEMA DE GESTIÓN DE PRÉSTAMOS Y COBROS DIARIOS - EMPRESA LLANO GRANDE
-- SCRIPT DDL: CREACIÓN DE BASE DE DATOS Y TABLAS (MYSQL)
-- EVIDENCIA SENA: GA7-220501096-AA2-EV01
-- ====================================================================

CREATE DATABASE IF NOT EXISTS llanogrande_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE llanogrande_db;

-- 1. TABLA DE USUARIOS Y ROLES (ADMINISTRADOR / COBRADOR)
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    usuario VARCHAR(50) NOT NULL UNIQUE,
    clave VARCHAR(255) NOT NULL,
    rol ENUM('ADMINISTRADOR', 'COBRADOR') NOT NULL DEFAULT 'COBRADOR',
    telefono VARCHAR(20),
    activo TINYINT(1) NOT NULL DEFAULT 1,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. TABLA DE CLIENTES
CREATE TABLE IF NOT EXISTS clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cedula VARCHAR(20) NOT NULL UNIQUE,
    nombres VARCHAR(80) NOT NULL,
    apellidos VARCHAR(80) NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    direccion VARCHAR(150) NOT NULL,
    barrio_sector VARCHAR(80) NOT NULL,
    activo TINYINT(1) NOT NULL DEFAULT 1,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_cliente_cedula (cedula),
    INDEX idx_cliente_nombre (nombres, apellidos)
) ENGINE=InnoDB;

-- 3. TABLA DE PRÉSTAMOS DIARIOS
CREATE TABLE IF NOT EXISTS prestamos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NOT NULL,
    usuario_creador_id INT NOT NULL,
    monto_prestado DECIMAL(12, 2) NOT NULL,
    porcentaje_interes DECIMAL(5, 2) NOT NULL DEFAULT 20.00,
    total_pagar DECIMAL(12, 2) NOT NULL,
    numero_cuotas INT NOT NULL,
    valor_cuota DECIMAL(12, 2) NOT NULL,
    saldo_pendiente DECIMAL(12, 2) NOT NULL,
    fecha_prestamo DATE NOT NULL,
    fecha_vencimiento DATE NOT NULL,
    estado ENUM('ACTIVO', 'EN_MORA', 'CANCELADO') NOT NULL DEFAULT 'ACTIVO',
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_prestamo_cliente FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON UPDATE CASCADE,
    CONSTRAINT fk_prestamo_usuario FOREIGN KEY (usuario_creador_id) REFERENCES usuarios(id) ON UPDATE CASCADE,
    INDEX idx_prestamo_estado (estado),
    INDEX idx_prestamo_fecha (fecha_prestamo)
) ENGINE=InnoDB;

-- 4. TABLA DE RECAUDOS / PAGOS DE CUOTAS DIARIAS
CREATE TABLE IF NOT EXISTS cuotas_pagos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    prestamo_id INT NOT NULL,
    usuario_cobrador_id INT NOT NULL,
    numero_cuota INT NOT NULL,
    valor_pagado DECIMAL(12, 2) NOT NULL,
    fecha_pago TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    saldo_restante DECIMAL(12, 2) NOT NULL,
    observaciones VARCHAR(255),
    CONSTRAINT fk_pago_prestamo FOREIGN KEY (prestamo_id) REFERENCES prestamos(id) ON UPDATE CASCADE,
    CONSTRAINT fk_pago_cobrador FOREIGN KEY (usuario_cobrador_id) REFERENCES usuarios(id) ON UPDATE CASCADE,
    INDEX idx_pago_fecha (fecha_pago)
) ENGINE=InnoDB;

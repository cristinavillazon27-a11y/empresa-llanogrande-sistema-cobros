package com.llanogrande.model;

import java.sql.Timestamp;

public class Cliente {
    private int id;
    private String cedula;
    private String nombres;
    private String apellidos;
    private String telefono;
    private String direccion;
    private String barrioSector;
    private boolean activo;
    private Timestamp creadoEn;

    public Cliente() {}

    public Cliente(int id, String cedula, String nombres, String apellidos, String telefono, String direccion, String barrioSector, boolean activo) {
        this.id = id;
        this.cedula = cedula;
        this.nombres = nombres;
        this.apellidos = apellidos;
        this.telefono = telefono;
        this.direccion = direccion;
        this.barrioSector = barrioSector;
        this.activo = activo;
    }

    public Cliente(String cedula, String nombres, String apellidos, String telefono, String direccion, String barrioSector) {
        this(0, cedula, nombres, apellidos, telefono, direccion, barrioSector, true);
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getCedula() { return cedula; }
    public void setCedula(String cedula) { this.cedula = cedula; }

    public String getNombres() { return nombres; }
    public void setNombres(String nombres) { this.nombres = nombres; }

    public String getApellidos() { return apellidos; }
    public void setApellidos(String apellidos) { this.apellidos = apellidos; }

    public String getTelefono() { return telefono; }
    public void setTelefono(String telefono) { this.telefono = telefono; }

    public String getDireccion() { return direccion; }
    public void setDireccion(String direccion) { this.direccion = direccion; }

    public String getBarrioSector() { return barrioSector; }
    public void setBarrioSector(String barrioSector) { this.barrioSector = barrioSector; }

    public boolean isActivo() { return activo; }
    public void setActivo(boolean activo) { this.activo = activo; }

    public Timestamp getCreadoEn() { return creadoEn; }
    public void setCreadoEn(Timestamp creadoEn) { this.creadoEn = creadoEn; }

    public String getNombreCompleto() {
        return nombres + " " + apellidos;
    }

    @Override
    public String toString() {
        return String.format("[%d] %s (%s) - Tel: %s - Dir: %s, %s",
                id, getNombreCompleto(), cedula, telefono, direccion, barrioSector);
    }
}

package com.llanogrande.model;

import java.sql.Timestamp;

public class Usuario {
    private int id;
    private String nombre;
    private String usuario;
    private String clave;
    private String rol; // 'ADMINISTRADOR', 'COBRADOR'
    private String telefono;
    private boolean activo;
    private Timestamp creadoEn;

    public Usuario() {}

    public Usuario(int id, String nombre, String usuario, String clave, String rol, String telefono, boolean activo) {
        this.id = id;
        this.nombre = nombre;
        this.usuario = usuario;
        this.clave = clave;
        this.rol = rol;
        this.telefono = telefono;
        this.activo = activo;
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getUsuario() { return usuario; }
    public void setUsuario(String usuario) { this.usuario = usuario; }

    public String getClave() { return clave; }
    public void setClave(String clave) { this.clave = clave; }

    public String getRol() { return rol; }
    public void setRol(String rol) { this.rol = rol; }

    public String getTelefono() { return telefono; }
    public void setTelefono(String telefono) { this.telefono = telefono; }

    public boolean isActivo() { return activo; }
    public void setActivo(boolean activo) { this.activo = activo; }

    public Timestamp getCreadoEn() { return creadoEn; }
    public void setCreadoEn(Timestamp creadoEn) { this.creadoEn = creadoEn; }

    @Override
    public String toString() {
        return "Usuario{" + "id=" + id + ", usuario='" + usuario + '\'' + ", rol='" + rol + '\'' + '}';
    }
}

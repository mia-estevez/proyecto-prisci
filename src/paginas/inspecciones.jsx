import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';


function Inspeccion() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simula el envío exitoso del formulario
    alert("Inspección cargada exitosamente.");
    navigate("/clientes");
  };

  return (
    <div className="contenedor-principal">
      <main className="layout-principal">
        <div className="tarjeta formulario-card">
          
          {/* Encabezado */}
          <div className="formulario-header">
            <span className="badge-categoria">Nueva Inspección</span>
            <h2>Registro de Control Anti-Incendios</h2>
            <p className="subtitulo-inmueble">Inmueble: Consorcio Edificio Av. Argentina 450</p>
          </div>

          <hr className="divisor" />

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="formulario-inspeccion">
            
            <div className="campo-grupo">
              <label htmlFor="tipoInspeccion">Tipo de Inspección</label>
              <select id="tipoInspeccion" className="input-control" required defaultValue="">
                <option value="" disabled>Seleccioná un tipo...</option>
                <option value="extintores">Control de Extintores / Matafuegos</option>
                <option value="mangueras">Red de Hidrantes y Mangueras</option>
                <option value="alarmas">Sistema de Alarmas y Detectores</option>
                <option value="bombas">Prueba de Presión de Bombas</option>
              </select>
            </div>

            <div className="campo-grupo">
              <label htmlFor="fecha">Fecha de Inspección</label>
              <input type="date" id="fecha" className="input-control" required />
            </div>

            <div className="campo-grupo">
              <label htmlFor="estado">Resultado de la Inspección</label>
              <select id="estado" className="input-control" required defaultValue="Aprobado">
                <option value="Aprobado">Aprobado</option>
                <option value="Pendiente">Pendiente de Corrección</option>
                <option value="Rechazado">Rechazado / Desaprobado</option>
              </select>
            </div>

            <div className="campo-grupo">
              <label htmlFor="inspector">Nombre del Inspector / Técnico</label>
              <input 
                type="text" 
                id="inspector" 
                className="input-control" 
                placeholder="Ej. Juan Pérez" 
                required 
              />
            </div>

            <div className="campo-grupo">
              <label htmlFor="observaciones">Observaciones / Detalles Técnicos</label>
              <textarea 
                id="observaciones" 
                className="input-control textarea-control" 
                rows="4" 
                placeholder="Escribí los hallazgos o recomendaciones de la inspección..."
              ></textarea>
            </div>

            {/* Acciones */}
            <div className="formulario-footer">
              <button type="submit" className="btn-accion-primario">
                Guardar Inspección
              </button>
              <Link to="/clientes" className="btn-volver">
                Cancelar y Volver
              </Link>
            </div>

          </form>

        </div>
      </main>
    </div>
  );
}

export default Inspeccion;
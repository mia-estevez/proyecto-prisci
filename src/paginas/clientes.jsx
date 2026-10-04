import React from 'react';
import { Link } from 'react-router-dom';
import './clientes.css';

function Clientes() {
  return (
    <div className="layout-dashboard">
      
      {/* SIDEBAR LATERAL IZQUIERDO */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-logo">🔥</div>
          <div className="brand-text">
            <h2>PRISCI</h2>
            <span>Conservador / Profesional</span>
          </div>
        </div>

        <nav className="sidebar-menu">
          <Link to="/conservadores" className="menu-item">
            <span className="icon">🏠</span> Inicio
          </Link>
          <Link to="/clientes" className="menu-item active">
            <span className="icon">👥</span> Mis clientes
          </Link>
          <Link to="/historial" className="menu-item">
            <span className="icon">🕒</span> Historial
          </Link>
          <Link to="/ayuda" className="menu-item">
            <span className="icon">❓</span> Ayuda
          </Link>
        </nav>

        <div className="sidebar-footer">
          <Link to="/login" className="btn-logout-sidebar">
            🚪 Cerrar sesión
          </Link>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="dashboard-content">
        
        {/* BREADCRUMB / BARRAS DE NAVEGACIÓN */}
        <div className="breadcrumb">
          <span>Mapa de inmuebles</span> › <strong>Edificio Torres del Limay</strong>
        </div>

        <header className="cliente-detail-header">
          <div className="title-with-badge">
            <h1>Edificio Torres del Limay</h1>
            <span className="status-badge-green">Registrado</span>
          </div>
        </header>

        {/* CONTENEDOR 3 COLUMNAS: FOTO, INFO/DOCUMENTOS, SERVICIOS/HISTORIAL */}
        <div className="inmueble-detail-grid">
          
          {/* COLUMNA 1: FOTO Y DOCUMENTACIÓN */}
          <div className="col-left">
            <div className="card-panel building-photo-card">
              <div className="photo-placeholder">
                🏙️
              </div>
            </div>

            <div className="card-panel docs-card">
              <h3>Documentación</h3>
              <div className="docs-list">
                <div className="doc-item">
                  <span>📄 Plano habilitado (PDF)</span>
                  <button className="btn-icon">📥</button>
                </div>
                <div className="doc-item">
                  <span>📜 Certificado de instalaciones</span>
                  <button className="btn-icon">📥</button>
                </div>
                <div className="doc-item">
                  <span>📋 Última inspección (15/03/2024)</span>
                  <button className="btn-icon">📥</button>
                </div>
              </div>
            </div>
          </div>

          {/* COLUMNA 2: INFORMACIÓN DEL INMUEBLE */}
          <div className="col-center">
            <div className="card-panel info-card">
              <h3>Información del inmueble</h3>

              <div className="info-group">
                <label>Dirección</label>
                <p>Av. Argentina 1234, Neuquén</p>
              </div>

              <div className="info-group">
                <label>Tipo de inmueble</label>
                <p>Edificio residencial</p>
              </div>

              <div className="info-group">
                <label>Titular / Consorcio</label>
                <p>Consorcio Torres del Limay</p>
              </div>

              <div className="info-group">
                <label>Superficie</label>
                <p>1.250 m²</p>
              </div>

              <div className="info-group">
                <label>Año de construcción</label>
                <p>2018</p>
              </div>

              <div className="info-group">
                <label>Estado</label>
                <span className="tag-activo">Activo</span>
              </div>
            </div>
          </div>

          {/* COLUMNA 3: SERVICIOS ASOCIADOS E HISTORIAL */}
          <div className="col-right">
            
            {/* SERVICIOS ASOCIADOS */}
            <div className="card-panel services-card">
              <h3>Servicios asociados</h3>
              <div className="services-list">
                <div className="service-row">
                  <span>🧯 Extintores</span>
                  <span className="badge-v">Vigente</span>
                </div>
                <div className="service-row">
                  <span>💧 Red de incendio</span>
                  <span className="badge-v">Vigente</span>
                </div>
                <div className="service-row">
                  <span>🔔 Detección de humo</span>
                  <span className="badge-v">Vigente</span>
                </div>
                <div className="service-row">
                  <span>💡 Iluminación de emergencia</span>
                  <span className="badge-v">Vigente</span>
                </div>
                <div className="service-row">
                  <span>🚪 Señalización</span>
                  <span className="badge-v">Vigente</span>
                </div>
              </div>
            </div>

            {/* HISTORIAL DE INSPECCIONES Y BOTÓN DE CARGA */}
            <div className="card-panel history-card">
              <div className="flex-between">
                <h3>Historial de inspecciones</h3>
                <Link to="/historial" className="link-subtle">Ver todos</Link>
              </div>

              <div className="history-list">
                <div className="history-row">
                  <div>
                    <strong>15/01/2024</strong>
                    <p>Sin observaciones</p>
                  </div>
                  <button className="btn-text">Ver</button>
                </div>

                <div className="history-row">
                  <div>
                    <strong>21/03/2023</strong>
                    <p className="text-warn">Observaciones</p>
                  </div>
                  <button className="btn-text">Ver</button>
                </div>
              </div>

              <Link to="/inspecciones" className="btn-primary-action">
                + Cargar inspección
              </Link>
            </div>

          </div>

        </div>

      </main>
    </div>
  );
}

export default Clientes;
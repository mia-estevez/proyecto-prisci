import React from 'react';
import { Link } from 'react-router-dom';
import './PaginaMunicipal.css';

export default function PaginaMunicipal() {
  return (
    <div className="prisci-municipal-wrapper">
      {/* Sección de Bienvenida y Fecha */}
      <div className="dashboard-header-row">
        <div className="welcome-box">
          <h1>¡Hola, María!</h1>
          <p>Gestioná y supervisá toda la información del sistema.</p>
        </div>
        <div className="date-box">
          Martes, 19 de agosto de 2025
        </div>
      </div>

      {/* Tarjetas de Métricas Superiores */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon-box blue-bg">🏢</div>
          <div className="metric-data">
            <span className="metric-number">156</span>
            <span className="metric-label">Inmuebles registrados</span>
          </div>
          <span className="metric-trend positive">↑ 12%</span>
        </div>

        <div className="metric-card">
          <div className="metric-icon-box blue-bg">👥</div>
          <div className="metric-data">
            <span className="metric-number">48</span>
            <span className="metric-label">Profesionales registrados</span>
          </div>
          <span className="metric-trend positive">↑ 8% <small>respecto al mes anterior</small></span>
        </div>

        <div className="metric-card">
          <div className="metric-icon-box blue-bg">💼</div>
          <div className="metric-data">
            <span className="metric-number">36</span>
            <span className="metric-label">Conservadores registrados</span>
          </div>
          <span className="metric-trend positive">↑ 5% <small>respecto al mes anterior</small></span>
        </div>

        <div className="metric-card">
          <div className="metric-icon-box blue-bg">📋</div>
          <div className="metric-data">
            <span className="metric-number">28</span>
            <span className="metric-label">Inspecciones este mes</span>
          </div>
          <span className="metric-trend positive">↑ 16% <small>respecto al mes anterior</small></span>
        </div>
      </div>

      {/* Sección Central: Mapa de Inmuebles e Inmuebles Registrados */}
      <div className="dashboard-grid-layout">
        
        {/* Contenedor del Mapa (Con la palabra MAPA y dimensiones exactas) */}
        <div className="map-section-card">
          <div className="map-section-title">
            <span className="map-icon-title">🗺️</span>
            <div>
              <h2>Mapa de mis inmuebles</h2>
              <p>Visualizá la ubicación de todos los inmuebles con instalaciones de seguridad contra incendios.</p>
            </div>
          </div>

          <div className="search-filter-bar">
            <div className="search-input-wrapper">
              <span className="search-ico">🔍</span>
              <input type="text" placeholder="Buscar por dirección, cliente o nombre de inmueble..." readOnly />
            </div>
            <button className="filter-btn">
              <span>⚡</span> Filtros <span>▼</span>
            </button>
          </div>

          <div className="map-placeholder-box">
            <span className="map-text-indicator">MAPA</span>
          </div>
        </div>

        {/* Columna Derecha: Últimos Inmuebles Registrados */}
        <div className="properties-sidebar-card">
          <div className="sidebar-card-header">
            <div className="title-with-ico">
              <span>🏢</span>
              <h3>Últimos inmuebles registrados</h3>
            </div>
            <a href="#ver-todos" className="see-all-link">Ver todos</a>
          </div>

          <div className="properties-list">
            <div className="property-item">
              <div className="property-thumb"></div>
              <div className="property-details">
                <h4>Edificio Torres del Limay</h4>
                <p>Av. Argentina 1234, Neuquén</p>
                <small>Edificio residencial</small>
              </div>
              <span className="arrow-right">›</span>
            </div>

            <div className="property-item">
              <div className="property-thumb"></div>
              <div className="property-details">
                <h4>Consorcio Los Teros</h4>
                <p>Calle San Martín 567, Neuquén</p>
                <small>Edificio residencial</small>
              </div>
              <span className="arrow-right">›</span>
            </div>

            <div className="property-item">
              <div className="property-thumb"></div>
              <div className="property-details">
                <h4>Hotel del Comahue</h4>
                <p>Av. Olascoaga 890, Neuquén</p>
                <small>Hotel</small>
              </div>
              <span className="arrow-right">›</span>
            </div>

            <div className="property-item">
              <div className="property-thumb"></div>
              <div className="property-details">
                <h4>Centro Médico Neuquén</h4>
                <p>Calle Roca 345, Neuquén</p>
                <small>Centro de salud</small>
              </div>
              <span className="arrow-right">›</span>
            </div>

            <div className="property-item">
              <div className="property-thumb"></div>
              <div className="property-details">
                <h4>Supermercado La Anónima</h4>
                <p>Av. Argentina 2200, Neuquén</p>
                <small>Local comercial</small>
              </div>
              <span className="arrow-right">›</span>
            </div>
          </div>

          <Link to="/agregar" className="add-property-main-btn">
            + Agregar inmueble
          </Link>
        </div>

      </div>
    </div>
  );
}
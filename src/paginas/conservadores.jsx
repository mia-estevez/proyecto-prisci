import React from 'react';
import { Link } from "react-router-dom";
import "./conservadores.css";

function Conservadores() {
  return (
    <div className="layout-dashboard">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-logo">🔥</div>
          <div className="brand-text">
            <h2>PRISCI</h2>
            <span>Conservador / Profesional</span>
          </div>
        </div>

        <nav className="sidebar-menu">
          <Link to="/conservadores" className="menu-item active">
            <span className="icon">🏠</span> Inicio
          </Link>
          <Link to="/clientes" className="menu-item">
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

      <main className="dashboard-content">
        
        <header className="topbar">
          <div></div>
          <div className="user-profile">
            <Link to="/notificacionesConservadores" className="icon-btn">🔔</Link>
            <div className="avatar">👤</div>
            <div className="user-info">
              <strong>Juan Pérez</strong>
              <span>Profesional</span>
            </div>
          </div>
        </header>
      </main>

        <section className="welcome-section">
          <h1>¡Hola, Juan!</h1>
          <p>Gestioná y consultá la información de los inmuebles asignados.</p>

          <div className="kpi-grid">
            <div className="kpi-card">
              <div className="kpi-icon blue">🏢</div>
              <div className="kpi-data">
                <h3>23</h3>
                <span>Inmuebles Asignados</span>
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-icon cyan">👥</div>
              <div className="kpi-data">
                <h3>12</h3>
                <span>Clientes Activos</span>
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-icon green">📋</div>
              <div className="kpi-data">
                <h3>5</h3>
                <span>Servicios Este mes</span>
              </div>
            </div>

            <div className="kpi-card">
              <div className="kpi-icon clock">🕒</div>
              <div className="kpi-data">
                <h3>2</h3>
                <span>Vencimientos Próximos 30 días</span>
              </div>
            </div>
          </div>
        </section> 

        <div className="main-grid">
          <section className="card-panel map-section">
            <div className="panel-header">
              <div>
                <h3>🗺️ Mapa de mis inmuebles</h3>
                <p>Visualizá la ubicación de todos los inmuebles con instalaciones de seguridad contra incendios.</p>
              </div>
            </div>

            <div className="map-search-bar">
              <input type="text" placeholder="🔍 Buscar por dirección, cliente o nombre de inmueble..." />
              <button className="btn-filter">🎛️ Filtros</button>
            </div>

            <div className="map-display">
              <div className="map-placeholder">
                <span className="map-city-tag">Neuquén</span>
                <div className="pin pin-red" style={{ top: '30%', left: '40%' }}>📍</div>
                <div className="pin pin-red" style={{ top: '50%', left: '60%' }}>📍</div>
                <div className="pin pin-blue" style={{ top: '45%', left: '48%' }}>📍</div>
              </div>

              <div className="map-legend">
                <div><span className="dot red"></span> Inmueble registrado</div>
                <div><span className="dot blue"></span> Inmueble seleccionado</div>
              </div>
            </div>
          </section>
    </div>


        <aside className="tarjeta panel-lateral">
          <div className="panel-header">
            <div className="panel-buscador">
              <Link to="/notificacionesConservadores" style={{ textDecoration: 'none' }}>
                <button className="btn-campanita">
                  🔔
                </button>
              </Link>
              <input type="text" placeholder="Buscar..." className="input-buscar" />
              <button type="button" className="btn-buscar">Q</button>
            </div>
          </div>
          
          <p>Accedé a los registros de tus clientes.</p>

          <div className="panel-botones">
            <Link className="nav-link" to="/clientes">Cliente 1</Link>
            <Link className="nav-link" to="/clientes">Cliente 2</Link>
            <Link className="nav-link" to="/clientes">Cliente 3</Link>
            <Link className="nav-link" to="/clientes">Cliente 4</Link>
            <Link className="nav-link" to="/clientes">Cliente 5</Link>
          </div>
        </aside>
      </main>
    </div>
  );
}

export default Conservadores;
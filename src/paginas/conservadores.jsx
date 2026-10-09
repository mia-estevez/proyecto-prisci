import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
// Importamos componentes de React-Leaflet para el mapa gratuito de OpenStreetMap
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Home, Users, ClipboardList, Clock, Bell, Search, Filter, ChevronRight, LogOut, Flame, ShieldCheck } from 'lucide-react';
import './conservadores.css';
// Importamos los íconos profesionales de Lucide React (vectoriales, sin emojis)
import { 
  Home, 
  Users, 
  ClipboardList, 
  Clock, 
  Bell, 
  Search, 
  Filter, 
  ChevronRight, 
  LogOut, 
  Flame, 
  ShieldCheck 
} from 'lucide-react';
// Estilos necesarios para que Leaflet renderice el mapa correctamente
import 'leaflet/dist/leaflet.css';
import './conservadores.css';



// Coordenadas geográficas centradas en Neuquén Capital
const CENTRO_NEUQUEN = [-38.9516, -68.0591];

// Definición de íconos personalizados para el mapa (Rojo = Registrado, Azul = Seleccionado)
const iconoRojo = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const iconoAzul = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});


function Conservadores() {
  const navigate = useNavigate();

  // ESTADOS (REACT HOOKS)
  // 1. Estado para almacenar el resumen numérico de las tarjetas superiores
  const [resumen, setResumen] = useState({ inmuebles: 0, clientes: 0, servicios: 0, vencimientos: 0 });
  
  // 2. Estado para almacenar el listado completo de inmuebles desde MySQL
  const [inmuebles, setInmuebles] = useState([]);
  
  // 3. Estado para el filtro de texto del buscador
  const [busqueda, setBusqueda] = useState('');
  
  // 4. Estado para saber qué inmueble cliqueó el usuario en el mapa
  const [inmuebleSeleccionado, setInmuebleSeleccionado] = useState(null);
  
  return (
    <div className="layout-dashboard">
      <aside>
        <nav className="sidebar-menu">
          <Link to="/conservadores" className="menu-item active">
            <span className="icon"></span> Inicio
          </Link>
          <Link to="/clientes" className="menu-item">
            <span className="icon"></span> Mis clientes
          </Link>
          <Link to="/historial" className="menu-item">
            <span className="icon"></span> Historial
          </Link>
          <Link to="/ayuda" className="menu-item">
            <span className="icon"></span> Ayuda
          </Link>
        </nav>

        <div className="sidebar-footer">
          <Link to="/login" className="btn-logout-sidebar">
             Cerrar sesión
          </Link>
        </div>
      </aside>
      <main className="dashboard-content">

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

        {/* CONTENEDOR CENTRAL: MAPA + LISTA DE INMUEBLES */}
        <div className="main-grid">
          
          {/* SECCIÓN MAPA */}
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

          {/* LISTA LATERAL DE INMUEBLES */}
          <aside className="card-panel list-section">
            <div className="panel-header flex-between">
              <h3>🏢 Mis inmuebles</h3>
              <span className="badge-count">23 Inmuebles</span>
            </div>

            <div className="inmuebles-list">
              <Link to="/clientes" className="inmueble-item">
                <div className="inmueble-thumb">🏢</div>
                <div className="inmueble-details">
                  <strong>Edificio Torres del Limay</strong>
                  <p>Av. Argentina 1234, Neuquén</p>
                  <span className="sub-tag">Edificio residencial</span>
                </div>
                <span className="arrow">›</span>
              </Link>

              <Link to="/clientes" className="inmueble-item">
                <div className="inmueble-thumb">🏢</div>
                <div className="inmueble-details">
                  <strong>Consorcio Los Teros</strong>
                  <p>Gral. San Martín 207, Neuquén</p>
                  <span className="sub-tag">Edificio residencial</span>
                </div>
                <span className="arrow">›</span>
              </Link>

              <Link to="/clientes" className="inmueble-item">
                <div className="inmueble-thumb">🏨</div>
                <div className="inmueble-details">
                  <strong>Hotel del Comahue</strong>
                  <p>Av. Argentina 381, Neuquén</p>
                  <span className="sub-tag">Hotel</span>
                </div>
                <span className="arrow">›</span>
              </Link>
            </div>

            <button className="btn-link-all">Ver todos los inmuebles</button>
          </aside>

        </div>

      </main>
    </div>
  );
}

export default Conservadores;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Componentes de React-Leaflet
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Íconos vectoriales Lucide React
import { 
  Home, 
  Users, 
  ClipboardList, 
  Clock, 
  Search, 
  Filter, 
  ChevronRight, 
  LogOut, 
  Flame, 
  Building2 
} from 'lucide-react';

import 'leaflet/dist/leaflet.css';
import './conservadores.css';

// Coordenadas Neuquén Capital
const CENTRO_NEUQUEN = [-38.9516, -68.0591];

// Íconos de pines para el mapa
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

  // ID del Conservador actualmente logueado (por ahora fijo en 1 para las pruebas)
  const ID_CONSERVADOR = 1;

  // ESTADOS
  const [resumen, setResumen] = useState({ inmuebles: 0, clientes: 0, servicios: 0, vencimientos: 0 });
  const [inmuebles, setInmuebles] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [inmuebleSeleccionado, setInmuebleSeleccionado] = useState(null);

  // PETICIONES AL BACKEND
  useEffect(() => {
    // Carga las métricas del conservador
    fetch(`http://localhost:3001/api/conservador/${ID_CONSERVADOR}/resumen`)
      .then(res => res.json())
      .then(data => setResumen(data))
      .catch(err => console.error("Error al obtener resumen:", err));

    // Carga SOLO los inmuebles asignados a este conservador
    fetch(`http://localhost:3001/api/conservador/${ID_CONSERVADOR}/inmuebles`)
      .then(res => res.json())
      .then(data => setInmuebles(data))
      .catch(err => console.error("Error al obtener inmuebles:", err));
  }, []);

  // Filtrado en vivo por texto
  const inmueblesFiltrados = inmuebles.filter(item =>
    item.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
    item.direccion?.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="layout-dashboard">
      
      {/* SIDEBAR LATERAL IZQUIERDO */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <Flame className="brand-icon" size={28} color="#38bdf8" />
          <div className="brand-text">
            <h2>PRISCI</h2>
            <span>Conservador / Profesional</span>
          </div>
        </div>

        <nav className="sidebar-menu">
          <button className="menu-item active">
            <Home size={18} /> Inicio
          </button>
          <button className="menu-item" onClick={() => navigate('/clientes')}>
            <Users size={18} /> Mis clientes
          </button>
          <button className="menu-item" onClick={() => navigate('/historial')}>
            <Clock size={18} /> Historial
          </button>
        </nav>

        <div className="sidebar-footer">
          <button className="btn-logout-sidebar" onClick={() => navigate('/login')}>
            <LogOut size={18} /> Cerrar sesión
          </button>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="dashboard-content">

        {/* MENSAJE DE BIENVENIDA Y TARJETAS KPI */}
        <section className="welcome-section">
          <h1>¡Hola, Juan!</h1>
          <p>Gestioná y consultá la información de los inmuebles asignados.</p>

          <div className="kpi-grid">
            
            {/* Tarjeta 1: Inmuebles Asignados */}
            <div className="kpi-card" onClick={() => navigate('/inmuebles')}>
              <div className="kpi-icon-wrapper blue">
                <Home size={26} color="#3b82f6" />
              </div>
              <div className="kpi-data">
                <h3>{resumen.inmuebles}</h3>
                <span>Inmuebles Asignados</span>
              </div>
            </div>

            {/* Tarjeta 2: Clientes Activos */}
            <div className="kpi-card" onClick={() => navigate('/clientes')}>
              <div className="kpi-icon-wrapper cyan">
                <Users size={26} color="#06b6d4" />
              </div>
              <div className="kpi-data">
                <h3>{resumen.clientes}</h3>
                <span>Clientes Activos</span>
              </div>
            </div>

            {/* Tarjeta 3: Servicios Este Mes */}
            <div className="kpi-card" onClick={() => navigate('/servicios-mes')}>
              <div className="kpi-icon-wrapper green">
                <ClipboardList size={26} color="#10b981" />
              </div>
              <div className="kpi-data">
                <h3>{resumen.servicios}</h3>
                <span>Servicios Este mes</span>
              </div>
            </div>

            {/* Tarjeta 4: Vencimientos Próximos */}
            <div className="kpi-card" onClick={() => navigate('/vencimientos')}>
              <div className="kpi-icon-wrapper orange">
                <Clock size={26} color="#f59e0b" />
              </div>
              <div className="kpi-data">
                <h3>{resumen.vencimientos}</h3>
                <span>Vencimientos Próximos 30 días</span>
              </div>
            </div>

          </div>
        </section>

        {/* MAPA + LISTA LATERAL */}
        <div className="main-grid">
          
          {/* SECCIÓN DEL MAPA MUNICIPAL */}
          <section className="card-panel map-section">
            <div className="panel-header">
              <h3>Mapa de mis inmuebles</h3>
              <p>Visualizá la ubicación de todos los inmuebles con instalaciones de seguridad contra incendios.</p>
            </div>

            <div className="map-search-bar">
              <Search size={18} className="search-icon" />
              <input 
                type="text" 
                placeholder="Buscar por dirección, cliente o nombre de inmueble..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
              <button className="btn-filter"><Filter size={16} /> Filtros</button>
            </div>

            <div className="map-display" style={{ height: '360px', width: '100%' }}>
              <MapContainer center={CENTRO_NEUQUEN} zoom={13} style={{ height: '100%', width: '100%', borderRadius: '8px' }}>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; OpenStreetMap contributors'
                />
                
                {inmueblesFiltrados.map((item) => (
                  <Marker
                    key={item.id}
                    position={[item.latitud || -38.9516, item.longitud || -68.0591]}
                    icon={inmuebleSeleccionado?.id === item.id ? iconoAzul : iconoRojo}
                    eventHandlers={{
                      click: () => setInmuebleSeleccionado(item),
                    }}
                  >
                    <Popup>
                      <strong>{item.nombre}</strong><br />
                      {item.direccion}<br />
                      <button className="btn-popup" onClick={() => navigate(`/clientes/${item.id}`)}>
                        Ver expediente
                      </button>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </section>

          {/* LISTA DE INMUEBLES REGISTRADOS */}
          <aside className="card-panel list-section">
            <div className="panel-header flex-between">
              <h3>Mis inmuebles</h3>
              <span className="badge-count">{inmuebles.length} inmuebles</span>
            </div>

            <div className="inmuebles-list">
              {inmueblesFiltrados.length === 0 ? (
                <p className="empty-msg">No hay inmuebles asignados registrados.</p>
              ) : (
                inmueblesFiltrados.slice(0, 6).map((item) => (
                  <div key={item.id} className="inmueble-item" onClick={() => navigate(`/clientes/${item.id}`)}>
                    <div className="inmueble-icon-box">
                      <Building2 size={24} color="#38bdf8" />
                    </div>
                    <div className="inmueble-details">
                      <strong>{item.nombre}</strong>
                      <p>{item.direccion}</p>
                      <span className="sub-tag">{item.tipoInmueble}</span>
                    </div>
                    <ChevronRight size={18} className="arrow" />
                  </div>
                ))
              )}
            </div>

            <button className="btn-link-all" onClick={() => navigate('/inmuebles')}>
              Ver todos los inmuebles ›
            </button>
          </aside>

        </div>

      </main>
    </div>
  );
}

export default Conservadores;
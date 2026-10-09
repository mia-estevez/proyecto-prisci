import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Componentes de React-Leaflet
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Íconos vectoriales de Lucide React
import { 
  Home, 
  Users, 
  ClipboardList, 
  Clock, 
  Search, 
  Filter, 
  ChevronRight, 
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
  const ID_CONSERVADOR = 1;

  // ESTADOS
  const [resumen, setResumen] = useState({ inmuebles: 0, clientes: 0, servicios: 0, vencimientos: 0 });
  const [inmuebles, setInmuebles] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [inmuebleSeleccionado, setInmuebleSeleccionado] = useState(null);

  // PETICIONES AL BACKEND
  useEffect(() => {
    fetch(`http://localhost:3001/api/conservador/${ID_CONSERVADOR}/resumen`)
      .then(res => res.json())
      .then(data => setResumen(data))
      .catch(err => console.error("Error al obtener resumen:", err));

    fetch(`http://localhost:3001/api/conservador/${ID_CONSERVADOR}/inmuebles`)
      .then(res => res.json())
      .then(data => setInmuebles(data))
      .catch(err => console.error("Error al obtener inmuebles:", err));
  }, []);

  const inmueblesFiltrados = inmuebles.filter(item =>
    item.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
    item.direccion?.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="conservadores-page-container">

      {/* ENCABEZADO Y TARJETAS KPI */}
      <section className="welcome-section">
        <h1>¡Hola, Juan!</h1>
        <p>Gestioná y consultá la información de los inmuebles asignados.</p>

        <div className="kpi-grid">
          <div className="kpi-card" onClick={() => navigate('/inmuebles')}>
            <div className="kpi-icon-wrapper blue">
              <Home size={22} color="#3b82f6" />
            </div>
            <div className="kpi-data">
              <h3>{resumen.inmuebles}</h3>
              <span>Inmuebles Asignados</span>
            </div>
          </div>

          <div className="kpi-card" onClick={() => navigate('/clientes')}>
            <div className="kpi-icon-wrapper cyan">
              <Users size={22} color="#06b6d4" />
            </div>
            <div className="kpi-data">
              <h3>{resumen.clientes}</h3>
              <span>Clientes Activos</span>
            </div>
          </div>

          <div className="kpi-card" onClick={() => navigate('/servicios-mes')}>
            <div className="kpi-icon-wrapper green">
              <ClipboardList size={22} color="#10b981" />
            </div>
            <div className="kpi-data">
              <h3>{resumen.servicios}</h3>
              <span>Servicios Este mes</span>
            </div>
          </div>

          <div className="kpi-card" onClick={() => navigate('/vencimientos')}>
            <div className="kpi-icon-wrapper orange">
              <Clock size={22} color="#f59e0b" />
            </div>
            <div className="kpi-data">
              <h3>{resumen.vencimientos}</h3>
              <span>Vencimientos Próximos 30 días</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN DEL MAPA + LISTA LATERAL */}
      <div className="main-grid">
        
        {/* MAPA */}
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

          <div className="map-display">
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

        {/* LISTA DE INMUEBLES */}
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
                    <Building2 size={20} color="#38bdf8" />
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

    </div>
  );
}

export default Conservadores;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// Importamos componentes de React-Leaflet para el mapa gratuito de OpenStreetMap
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Importamos los íconos profesionales de Lucide React en UNA SOLA LÍNEA (sin duplicados)
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

// Estilos necesarios para Leaflet y tu página
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
  // 1. Resumen numérico para las tarjetas superiores
  const [resumen, setResumen] = useState({ inmuebles: 0, clientes: 0, servicios: 0, vencimientos: 0 });
  
  // 2. Listado completo de inmuebles desde la Base de Datos MySQL
  const [inmuebles, setInmuebles] = useState([]);
  
  // 3. Filtro de búsqueda por texto
  const [busqueda, setBusqueda] = useState('');
  
  // 4. Inmueble seleccionado al hacer clic en el mapa
  const [inmuebleSeleccionado, setInmuebleSeleccionado] = useState(null);

  // EFECTO PRINCIPAL: Trae los datos de la base de datos al cargar la vista
  useEffect(() => {
    // Petición al backend para métricas del dashboard
    fetch('http://localhost:3001/api/conservador/resumen')
      .then(res => res.json())
      .then(data => setResumen(data))
      .catch(err => console.error("Error al obtener resumen:", err));

    // Petición al backend para lista de inmuebles
    fetch('http://localhost:3001/api/inmuebles')
      .then(res => res.json())
      .then(data => setInmuebles(data))
      .catch(err => console.error("Error al obtener inmuebles:", err));
  }, []);

  // Filtrado de inmuebles según la búsqueda ingresada por el usuario
  const inmueblesFiltrados = inmuebles.filter(item =>
    item.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
    item.direccion?.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="layout-dashboard">
      
      {/* -------------------------------------------------- */}
      {/* SECCIÓN 1: MENÚ LATERAL IZQUIERDO (SIDEBAR)         */}
      {/* -------------------------------------------------- */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <Flame className="brand-icon" size={28} />
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

      {/* -------------------------------------------------- */}
      {/* SECCIÓN 2: CONTENIDO PRINCIPAL                      */}
      {/* -------------------------------------------------- */}
      <main className="dashboard-content">
        
        {/* Barra superior con avatar de usuario y centro de notificaciones */}
        <header className="topbar">
          <div className="user-profile">
            <button className="icon-btn-bell" onClick={() => navigate('/notificaciones')} title="Notificaciones">
              <Bell size={20} />
              <span className="notif-badge"></span>
            </button>
            <ShieldCheck size={24} className="user-avatar-icon" />
            <div className="user-info">
              <strong>Juan Pérez</strong>
              <span>Profesional</span>
            </div>
          </div>
        </header>

        {/* Mensaje de bienvenida y tarjetas de métricas (KPIs) */}
        <section className="welcome-section">
          <h1>¡Hola, Juan!</h1>
          <p>Gestioná y consultá la información de los inmuebles asignados.</p>

          <div className="kpi-grid">
            <div className="kpi-card" onClick={() => navigate('/inmuebles')}>
              <Home className="kpi-icon blue" size={24} />
              <div className="kpi-data">
                <h3>{resumen.inmuebles}</h3>
                <span>Inmuebles Asignados</span>
              </div>
            </div>

            <div className="kpi-card" onClick={() => navigate('/clientes')}>
              <Users className="kpi-icon cyan" size={24} />
              <div className="kpi-data">
                <h3>{resumen.clientes}</h3>
                <span>Clientes Activos</span>
              </div>
            </div>

            <div className="kpi-card" onClick={() => navigate('/servicios-mes')}>
              <ClipboardList className="kpi-icon green" size={24} />
              <div className="kpi-data">
                <h3>{resumen.servicios}</h3>
                <span>Servicios Este mes</span>
              </div>
            </div>

            <div className="kpi-card" onClick={() => navigate('/vencimientos')}>
              <Clock className="kpi-icon orange" size={24} />
              <div className="kpi-data">
                <h3>{resumen.vencimientos}</h3>
                <span>Vencimientos Próximos 30 días</span>
              </div>
            </div>
          </div>
        </section>

        {/* -------------------------------------------------- */}
        {/* SECCIÓN 3: MAPA Y LISTA LATERAL                     */}
        {/* -------------------------------------------------- */}
        <div className="main-grid">
          
          {/* MAPA INTERACTIVO MUNICIPAL */}
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

            {/* Visualizador Leaflet */}
            <div className="map-display" style={{ height: '350px', width: '100%' }}>
              <MapContainer center={CENTRO_NEUQUEN} zoom={13} style={{ height: '100%', width: '100%', borderRadius: '8px' }}>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; OpenStreetMap contributors'
                />
                
                {/* Renderizado dinámico de los marcadores desde MySQL */}
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
                      <button onClick={() => navigate(`/clientes/${item.id}`)}>Ver expediente</button>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </section>

          {/* LISTA LATERAL DE INMUEBLES REGISTRADOS */}
          <aside className="card-panel list-section">
            <div className="panel-header flex-between">
              <h3>Mis inmuebles</h3>
              <span className="badge-count">{inmuebles.length} inmuebles</span>
            </div>

            <div className="inmuebles-list">
              {inmueblesFiltrados.slice(0, 6).map((item) => (
                <div key={item.id} className="inmueble-item" onClick={() => navigate(`/clientes/${item.id}`)}>
                  <img src={item.imagenUrl || "/building-placeholder.jpg"} alt={item.nombre} className="inmueble-thumb-img" />
                  <div className="inmueble-details">
                    <strong>{item.nombre}</strong>
                    <p>{item.direccion}</p>
                    <span className="sub-tag">{item.tipoInmueble}</span>
                  </div>
                  <ChevronRight size={18} className="arrow" />
                </div>
              ))}
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
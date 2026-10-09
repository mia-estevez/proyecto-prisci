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

  // EFECTO PRINCIPAL: Se ejecuta una sola vez al cargar el componente en pantalla
  useEffect(() => {
    // Petición HTTP al backend para traer los conteos calculados
    fetch('http://localhost:3001/api/conservador/resumen')
      .then(res => res.json())
      .then(data => setResumen(data))
      .catch(err => console.error("Error al obtener resumen:", err));

    // Petición HTTP al backend para obtener los inmuebles registrados
    fetch('http://localhost:3001/api/inmuebles')
      .then(res => res.json())
      .then(data => setInmuebles(data))
      .catch(err => console.error("Error al obtener inmuebles:", err));
  }, []);

  // FILTRADO DINÁMICO: Filtra el arreglo según el texto escrito en el buscador
  const inmueblesFiltrados = inmuebles.filter(item =>
    item.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
    item.direccion?.toLowerCase().includes(busqueda.toLowerCase())
  );


  return (
    <div className="layout-dashboard">
      
      {/* MENÚ LATERAL IZQUIERDO (SIDEBAR)         */}

      <aside className="sidebar">
        {/* Identificación del sistema e Isologotipo */}
        <div className="sidebar-brand">
          <Flame className="brand-icon" size={28} />
          <div className="brand-text">
            <h2>PRISCI</h2>
            <span>Conservador / Profesional</span>
          </div>
        </div>

        {/* Opciones de Navegación del Sistema */}
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

        {/* Botón de salida para cerrar sesión */}
        <div className="sidebar-footer">
          <button className="btn-logout-sidebar" onClick={() => navigate('/login')}>
            <LogOut size={18} /> Cerrar sesión
          </button>
        </div>
      </aside>

      {/* SECCIÓN 2: CONTENIDO PRINCIPAL                      */}
      
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

        {/* Mensaje de bienvenida y tarjetas de accesos directos (KPIs) */}
        <section className="welcome-section">
          <h1>¡Hola, Juan!</h1>
          <p>Gestioná y consultá la información de los inmuebles asignados.</p>

          <div className="kpi-grid">
            {/* Tarjeta 1: Lleva al listado de inmuebles */}
            <div className="kpi-card" onClick={() => navigate('/inmuebles')}>
              <Home className="kpi-icon blue" size={24} />
              <div className="kpi-data">
                <h3>{resumen.inmuebles}</h3>
                <span>Inmuebles Asignados</span>
              </div>
            </div>

            {/* Tarjeta 2: Lleva al listado de clientes activos */}
            <div className="kpi-card" onClick={() => navigate('/clientes')}>
              <Users className="kpi-icon cyan" size={24} />
              <div className="kpi-data">
                <h3>{resumen.clientes}</h3>
                <span>Clientes Activos</span>
              </div>
            </div>

            {/* Tarjeta 3: Lleva a los servicios de este mes */}
            <div className="kpi-card" onClick={() => navigate('/servicios-mes')}>
              <ClipboardList className="kpi-icon green" size={24} />
              <div className="kpi-data">
                <h3>{resumen.servicios}</h3>
                <span>Servicios Este mes</span>
              </div>
            </div>

            {/* Tarjeta 4: Lleva a los servicios próximos a vencer */}
            <div className="kpi-card" onClick={() => navigate('/vencimientos')}>
              <Clock className="kpi-icon orange" size={24} />
              <div className="kpi-data">
                <h3>{resumen.vencimientos}</h3>
                <span>Vencimientos Próximos 30 días</span>
              </div>
            </div>
          </div>
        </section>

        {/* SECCIÓN 3: MAPA Y LISTA LATERAL                     */}
        
        <div className="main-grid">
          
          {/* MAPA INTERACTIVO MUNICIPAL */}
          <section className="card-panel map-section">
            <div className="panel-header">
              <h3>Mapa de mis inmuebles</h3>
              <p>Visualizá la ubicación de todos los inmuebles con instalaciones de seguridad contra incendios.</p>
            </div>

            {/* Campo de búsqueda sobre el mapa */}
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

            {/* Renderizado del mapa de Leaflet */}
            <div className="map-display" style={{ height: '350px', width: '100%' }}>
              <MapContainer center={CENTRO_NEUQUEN} zoom={13} style={{ height: '100%', width: '100%', borderRadius: '8px' }}>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; OpenStreetMap contributors'
                />
                
                {/* Mapeo dinámico de marcadores traídos de la base de datos */}
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
  );
}

export default Conservadores;
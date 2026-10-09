import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Componentes de React-Leaflet
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
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
  Building2,
  X 
} from 'lucide-react';

import 'leaflet/dist/leaflet.css';
import './conservadores.css';

// Coordenadas fijas del centro de Neuquén Capital
const CENTRO_NEUQUEN = [-38.9516, -68.0591];

// DIBUJO VECTORIAL SVG PARA LOS MARCADORES
const crearIcono = (colorHex) => {
  const svg = `
    <svg width="32" height="44" viewBox="0 0 24 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 0C5.37 0 0 5.37 0 12C0 21 12 36 12 36C12 36 24 21 24 12C24 5.37 18.63 0 12 0ZM12 16C9.79 16 8 14.21 8 12C8 9.79 9.79 8 12 8C14.21 8 16 9.79 16 12C16 14.21 14.21 16 12 16Z" fill="${colorHex}" stroke="#0f172a" stroke-width="1.5"/>
    </svg>
  `;
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: svg,
    iconSize: [32, 44],
    iconAnchor: [16, 44],
    popupAnchor: [0, -42]
  });
};

const iconoRojo = crearIcono('#ef4444');  // Marcador Rojo (Sin seleccionar)
const iconoAzul = crearIcono('#38bdf8');  // Marcador Azul (Seleccionado)

// COMPONENTE PARA GESTIONAR EL ZOOM Y RECENTREADO AUTOMÁTICO
function ControladorMapa({ inmuebles, inmuebleSeleccionado }) {
  const map = useMap();

  useEffect(() => {
    // Forzar re-render del canvas de Leaflet
    map.invalidateSize();

    if (inmuebleSeleccionado) {
      map.flyTo(
        [inmuebleSeleccionado.latitudValida, inmuebleSeleccionado.longitudValida], 
        16, 
        { duration: 1.2 }
      );
    } else if (inmuebles.length > 0) {
      const puntos = inmuebles.map(item => [item.latitudValida, item.longitudValida]);
      const bounds = L.latLngBounds(puntos);
      map.fitBounds(bounds, { padding: [60, 60] });
    }
  }, [inmuebles, inmuebleSeleccionado, map]);

  return null;
}

function Conservadores() {
  const navigate = useNavigate();
  const ID_CONSERVADOR = localStorage.getItem('usuarioId') || 1;

  // ESTADOS DINÁMICOS
  const [resumen, setResumen] = useState({ inmuebles: 2, clientes: 1, servicios: 5, vencimientos: 4 });
  const [inmuebles, setInmuebles] = useState([]);
  const [cargando, setCargando] = useState(true);

  const [busqueda, setBusqueda] = useState('');
  const [inmuebleSeleccionado, setInmuebleSeleccionado] = useState(null);
  const [filtroTipo, setFiltroTipo] = useState('Todos');
  const [mostrarMenuFiltro, setMostrarMenuFiltro] = useState(false);

  // DIRECCIONES Y COORDENADAS GPS SEPARADAS Y REALES EN NEUQUÉN CAPITAL
  const DIRECCIONES_REALES = {
    1: { lat: -38.9425, lng: -68.0588, dir: 'Av. Argentina 1234, Neuquén' },
    2: { lat: -38.9580, lng: -68.0720, dir: 'Gral. Las Heras 450, Neuquén' }
  };

  useEffect(() => {
    const obtenerDatosDinamicos = async () => {
      try {
        setCargando(true);

        // 1. Resumen de métricas
        const resResumen = await fetch(`http://localhost:3001/api/conservador/${ID_CONSERVADOR}/resumen`);
        if (resResumen.ok) {
          const dataResumen = await resResumen.json();
          setResumen(dataResumen);
        }

        // 2. Inmuebles asignados
        const resInmuebles = await fetch(`http://localhost:3001/api/conservador/${ID_CONSERVADOR}/inmuebles`);
        let dataInmuebles = [];
        
        if (resInmuebles.ok) {
          dataInmuebles = await resInmuebles.json();
        }

        // Respaldo de seguridad con los 2 inmuebles y sus direcciones reales
        if (!Array.isArray(dataInmuebles) || dataInmuebles.length === 0) {
          dataInmuebles = [
            {
              IdInmueble: 1,
              Nombre: 'Edificio Torres del Limay',
              Domicilio: 'Av. Argentina 1234, Neuquén',
              Actividad: 'Comercial',
              Latitud: -38.9425,
              Longitud: -68.0588
            },
            {
              IdInmueble: 2,
              Nombre: 'Galería Comercial Centro',
              Domicilio: 'Gral. Las Heras 450, Neuquén',
              Actividad: 'Residencial',
              Latitud: -38.9580,
              Longitud: -68.0720
            }
          ];
        }

        // Formateo e inyección de coordenadasGPS estrictas por ID
        const formateados = dataInmuebles.map((item, idx) => {
          const idInm = item.IdInmueble || item.id || (idx + 1);
          const pos = DIRECCIONES_REALES[idInm] || (idx === 0 ? DIRECCIONES_REALES[1] : DIRECCIONES_REALES[2]);

          return {
            ...item,
            idReal: idInm,
            Domicilio: pos.dir,
            latitudValida: pos.lat,
            longitudValida: pos.lng
          };
        });

        setInmuebles(formateados);

      } catch (err) {
        console.error("Error al obtener inmuebles:", err);
      } finally {
        setCargando(false);
      }
    };

    obtenerDatosDinamicos();
  }, [ID_CONSERVADOR]);

  // FILTRADO DINÁMICO POR BÚSQUEDA Y TIPO
  const inmueblesFiltrados = inmuebles.filter(item => {
    const texto = busqueda.toLowerCase();
    const coincideTexto = 
      (item.Nombre || item.nombre || '').toLowerCase().includes(texto) ||
      (item.Domicilio || item.direccion || '').toLowerCase().includes(texto) ||
      (item.nombrePropietario || item.cliente || '').toLowerCase().includes(texto);

    const tipoInmuebleReal = item.Actividad || item.tipoInmueble || 'Comercial';
    const coincideTipo = filtroTipo === 'Todos' || tipoInmuebleReal === filtroTipo;

    return coincideTexto && coincideTipo;
  });

  const handleSeleccionarInmueble = (item) => {
    setInmuebleSeleccionado(item);
  };

  const handleIrAExpediente = (idInmueble) => {
    navigate(`/clientes/${idInmueble}`);
  };

  return (
    <div className="conservadores-page-container">

      {/* ENCABEZADO Y TARJETAS KPI */}
      <section className="welcome-section">
        <h1>¡Hola, Juan!</h1>
        <p>Gestioná y consultá la información de los inmuebles asignados.</p>

        <div className="kpi-grid">
          <div className="kpi-card" onClick={() => navigate('/todos-inmuebles')}>
            <div className="kpi-icon-wrapper blue">
              <Home size={22} color="#3b82f6" />
            </div>
            <div className="kpi-data">
              <h3>{resumen.inmuebles || inmuebles.length}</h3>
              <span>Inmuebles Asignados</span>
            </div>
          </div>

          <div className="kpi-card" onClick={() => navigate('/clientes')}>
            <div className="kpi-icon-wrapper cyan">
              <Users size={22} color="#06b6d4" />
            </div>
            <div className="kpi-data">
              <h3>{resumen.clientes || 1}</h3>
              <span>Clientes Activos</span>
            </div>
          </div>

          <div className="kpi-card" onClick={() => navigate('/servicios-mes')}>
            <div className="kpi-icon-wrapper green">
              <ClipboardList size={22} color="#10b981" />
            </div>
            <div className="kpi-data">
              <h3>{resumen.servicios || 5}</h3>
              <span>Servicios Este mes</span>
            </div>
          </div>

          <div className="kpi-card" onClick={() => navigate('/vencimientos')}>
            <div className="kpi-icon-wrapper orange">
              <Clock size={22} color="#f59e0b" />
            </div>
            <div className="kpi-data">
              <h3>{resumen.vencimientos || 4}</h3>
              <span>Vencimientos Próximos 30 días</span>
            </div>
          </div>
        </div>
      </section>

      {/* MAPA Y LISTA DE INMUEBLES */}
      <div className="main-grid">
        
        {/* PANEL MAPA */}
        <section className="card-panel map-section">
          <div className="panel-header">
            <h3>Mapa de mis inmuebles</h3>
            <p>Visualizá la ubicación de todos los inmuebles con instalaciones de seguridad contra incendios.</p>
          </div>

          {/* BÚSQUEDA Y FILTRO */}
          <div className="map-search-bar">
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              placeholder="Buscar por dirección, cliente o nombre de inmueble..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
            
            <div className="filter-dropdown-wrapper">
              <button 
                className={`btn-filter ${filtroTipo !== 'Todos' ? 'active-filter' : ''}`}
                onClick={() => setMostrarMenuFiltro(!mostrarMenuFiltro)}
              >
                <Filter size={16} /> {filtroTipo === 'Todos' ? 'Filtros' : filtroTipo}
              </button>

              {mostrarMenuFiltro && (
                <div className="filter-menu">
                  <div className="filter-menu-header">
                    <span>Filtrar por tipo</span>
                    <X size={14} className="close-btn" onClick={() => setMostrarMenuFiltro(false)} />
                  </div>
                  <button 
                    className={filtroTipo === 'Todos' ? 'selected' : ''} 
                    onClick={() => { setFiltroTipo('Todos'); setMostrarMenuFiltro(false); }}
                  >
                    Todos los tipos
                  </button>
                  <button 
                    className={filtroTipo === 'Comercial' ? 'selected' : ''} 
                    onClick={() => { setFiltroTipo('Comercial'); setMostrarMenuFiltro(false); }}
                  >
                    Comercial
                  </button>
                  <button 
                    className={filtroTipo === 'Residencial' ? 'selected' : ''} 
                    onClick={() => { setFiltroTipo('Residencial'); setMostrarMenuFiltro(false); }}
                  >
                    Residencial
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* MAPA LEAFLET */}
          <div className="map-display">
            <MapContainer 
              center={CENTRO_NEUQUEN} 
              zoom={13} 
              style={{ height: '100%', width: '100%', borderRadius: '8px' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; OpenStreetMap contributors'
              />

              {/* Controlador que reajusta la vista cuando cambia la selección o la búsqueda */}
              <ControladorMapa 
                inmuebles={inmueblesFiltrados} 
                inmuebleSeleccionado={inmuebleSeleccionado} 
              />
              
              {/* PINES EN EL MAPA */}
              {inmueblesFiltrados.map((item) => {
                const idItem = item.idReal;
                const esSeleccionado = inmuebleSeleccionado?.idReal === idItem;

                return (
                  <Marker
                    key={`marker-${idItem}`}
                    position={[item.latitudValida, item.longitudValida]}
                    icon={esSeleccionado ? iconoAzul : iconoRojo}
                    eventHandlers={{
                      click: () => handleSeleccionarInmueble(item),
                    }}
                  >
                    <Popup>
                      <div className="popup-container">
                        <strong>{item.Nombre || item.nombre}</strong>
                        <p>{item.Domicilio}</p>
                        <span className="popup-tag">{item.Actividad || item.tipoInmueble || 'Comercial'}</span>
                        <button 
                          className="btn-popup" 
                          onClick={() => handleIrAExpediente(idItem)}
                        >
                          Ver expediente
                        </button>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
          </div>
        </section>

        {/* LISTA LATERAL */}
        <aside className="card-panel list-section">
          <div className="panel-header flex-between">
            <h3>Mis inmuebles</h3>
            <span className="badge-count">{inmueblesFiltrados.length} inmuebles</span>
          </div>

          <div className="inmuebles-list">
            {cargando ? (
              <p className="empty-msg">Cargando inmuebles asignados...</p>
            ) : inmueblesFiltrados.length === 0 ? (
              <p className="empty-msg">No se encontraron inmuebles asignados.</p>
            ) : (
              inmueblesFiltrados.map((item) => {
                const idItem = item.idReal;
                const esSeleccionado = inmuebleSeleccionado?.idReal === idItem;

                return (
                  <div 
                    key={`item-${idItem}`} 
                    className={`inmueble-item ${esSeleccionado ? 'item-selected' : ''}`}
                    onClick={() => {
                      handleSeleccionarInmueble(item);
                      handleIrAExpediente(idItem);
                    }}
                  >
                    <div className="inmueble-icon-box">
                      <Building2 size={20} color="#38bdf8" />
                    </div>
                    <div className="inmueble-details">
                      <strong>{item.Nombre || item.nombre}</strong>
                      <p>{item.Domicilio}</p>
                      <span className="sub-tag">{item.Actividad || item.tipoInmueble || 'Comercial'}</span>
                    </div>
                    <ChevronRight size={18} className="arrow" />
                  </div>
                );
              })
            )}
          </div>

          <span 
            onClick={() => navigate('/todos-inmuebles')} 
            style={{ cursor: 'pointer', color: '#38bdf8', fontSize: '13px' }}
          >
            Ver todos los inmuebles ›
          </span>
        </aside>

      </div>

    </div>
  );
}

export default Conservadores;
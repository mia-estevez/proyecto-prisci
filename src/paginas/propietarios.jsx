import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FichaInm from '../componentes/fichaInm.jsx';

// Componentes de React-Leaflet
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

import { 
  Home, 
  ClipboardList, 
  Clock, 
  Search, 
  Filter, 
  ChevronRight, 
  Building2,
  X 
} from 'lucide-react';

import 'leaflet/dist/leaflet.css';
import './conservadores.css'; // Reutilizamos los estilos limpios de mapas

const CENTRO_NEUQUEN = [-38.9516, -68.0591];

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

const iconoRojo = crearIcono('#ef4444');
const iconoAzul = crearIcono('#38bdf8');

function ControladorMapa({ inmuebles, inmuebleSeleccionado }) {
  const map = useMap();

  useEffect(() => {
    map.invalidateSize();
    if (inmuebleSeleccionado) {
      map.flyTo([inmuebleSeleccionado.latitudValida, inmuebleSeleccionado.longitudValida], 16, { duration: 1.2 });
    } else if (inmuebles.length > 0) {
      const puntos = inmuebles.map(item => [item.latitudValida, item.longitudValida]);
      const bounds = L.latLngBounds(puntos);
      map.fitBounds(bounds, { padding: [60, 60] });
    }
  }, [inmuebles, inmuebleSeleccionado, map]);

  return null;
}

function Propietarios() {
  const navigate = useNavigate();
  const ID_USUARIO = localStorage.getItem('usuarioId') || 3; // ID del usuario Propietario

  const [resumen, setResumen] = useState({ inmuebles: 0, servicios: 0, vencimientos: 0 });
  const [inmuebles, setInmuebles] = useState([]);
  const [cargando, setCargando] = useState(true);

  const [busqueda, setBusqueda] = useState('');
  const [inmuebleSeleccionado, setInmuebleSeleccionado] = useState(null);
  const [filtroTipo, setFiltroTipo] = useState('Todos');
  const [mostrarMenuFiltro, setMostrarMenuFiltro] = useState(false);

  const [fichaAbierta, setFichaAbierta] = useState(false);
  const [inmuebleParaFicha, setInmuebleParaFicha] = useState(null);

  const handleAbrirFicha = (item) => {
    setInmuebleParaFicha(item);
    setFichaAbierta(true);
  };

  const DIRECCIONES_REALES = {
    1: { lat: -38.9425, lng: -68.0588, dir: 'Av. Argentina 1234, Neuquén' },
    2: { lat: -38.9580, lng: -68.0720, dir: 'Gral. Las Heras 450, Neuquén' }
  };

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        setCargando(true);
        const resResumen = await fetch(`http://localhost:3001/api/propietario/${ID_USUARIO}/resumen`);
        if (resResumen.ok) setResumen(await resResumen.json());

        const resInm = await fetch(`http://localhost:3001/api/propietario/${ID_USUARIO}/inmuebles`);
        let dataInm = resInm.ok ? await resInm.json() : [];

        if (!Array.isArray(dataInm) || dataInm.length === 0) {
          dataInm = [
            { IdInmueble: 1, Nombre: 'Edificio Torres del Limay', Actividad: 'Comercial' }
          ];
        }

        const formateados = dataInm.map((item, idx) => {
          const idInm = item.IdInmueble || (idx + 1);
          const pos = DIRECCIONES_REALES[idInm] || DIRECCIONES_REALES[1];
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
        console.error("Error al cargar inmuebles de propietario:", err);
      } finally {
        setCargando(false);
      }
    };

    obtenerDatos();
  }, [ID_USUARIO]);

  const inmueblesFiltrados = inmuebles.filter(item => {
    const texto = busqueda.toLowerCase();
    const coincideTexto = (item.Nombre || '').toLowerCase().includes(texto) || (item.Domicilio || '').toLowerCase().includes(texto);
    const tipo = item.Actividad || 'Comercial';
    const coincideTipo = filtroTipo === 'Todos' || tipo === filtroTipo;
    return coincideTexto && coincideTipo;
  });

  return (
    <div className="clientes-page-container" style={{ padding: '30px' }}>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '28px', color: '#f8fafc', marginBottom: '8px' }}>¡Hola, Propietario!</h1>
        <p style={{ color: '#94a3b8', fontSize: '14px' }}>Visualizá el estado y las instalaciones de tus inmuebles.</p>
      </div>

      {/* TARJETAS KPI */}
      <div className="kpi-grid" style={{ marginBottom: '30px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
        <div className="kpi-card" onClick={() => navigate('/propietario/inmuebles')}>
          <div className="kpi-icon-wrapper blue"><Home size={22} color="#3b82f6" /></div>
          <div className="kpi-data">
            <h3>{inmuebles.length}</h3>
            <span>Mis Inmuebles</span>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon-wrapper green"><ClipboardList size={22} color="#10b981" /></div>
          <div className="kpi-data">
            <h3>{resumen.servicios}</h3>
            <span>Servicios Vigentes</span>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon-wrapper orange"><Clock size={22} color="#f59e0b" /></div>
          <div className="kpi-data">
            <h3>{resumen.vencimientos}</h3>
            <span>Vencimientos Próximos</span>
          </div>
        </div>
      </div>

      {/* MAPA Y LISTA */}
      <div className="main-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        <section className="card-panel map-section" style={{ margin: 0, padding: '20px', display: 'flex', flexDirection: 'column' }}>
          <div className="panel-header" style={{ marginBottom: '15px' }}>
            <h3 style={{ fontSize: '16px', color: '#f8fafc', marginBottom: '4px' }}>Ubicación de mis inmuebles</h3>
            <p style={{ fontSize: '12px', color: '#94a3b8' }}>Mapa interactivo con el estado de seguridad contra incendios.</p>
          </div>

          <div className="map-search-bar" style={{ display: 'flex', gap: '10px', marginBottom: '15px', position: 'relative' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }} />
              <input 
                type="text" 
                placeholder="Buscar por nombre o dirección..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                style={{ width: '100%', padding: '10px 10px 10px 38px', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: '#f8fafc', fontSize: '13px', outline: 'none' }}
              />
            </div>
          </div>

          <div className="map-display" style={{ flex: 1, minHeight: '340px', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' }}>
            <MapContainer center={CENTRO_NEUQUEN} zoom={13} style={{ height: '100%', width: '100%', borderRadius: '8px' }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap contributors' />
              <ControladorMapa inmuebles={inmueblesFiltrados} inmuebleSeleccionado={inmuebleSeleccionado} />
              
              {inmueblesFiltrados.map((item) => {
                const idItem = item.idReal;
                const esSeleccionado = inmuebleSeleccionado?.idReal === idItem;
                return (
                  <Marker
                    key={`marker-${idItem}`}
                    position={[item.latitudValida, item.longitudValida]}
                    icon={esSeleccionado ? iconoAzul : iconoRojo}
                    eventHandlers={{ click: () => setInmuebleSeleccionado(item) }}
                  >
                    <Popup>
                      <div className="popup-container" style={{ padding: '5px' }}>
                        <strong style={{ fontSize: '14px', color: '#0f172a' }}>{item.Nombre}</strong>
                        <p style={{ fontSize: '12px', margin: '4px 0', color: '#334155' }}>{item.Domicilio}</p>
                        <button 
                          className="btn-popup" 
                          onClick={() => navigate(`/propietario/inmuebles/${idItem}`)}
                          style={{ background: '#0284c7', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', cursor: 'pointer', marginTop: '6px' }}
                        >
                          Ver información
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
        <aside className="card-panel list-section" style={{ margin: 0, padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div className="panel-header flex-between" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h3 style={{ fontSize: '16px', color: '#f8fafc', margin: 0 }}>Mis inmuebles</h3>
              <span className="badge-count" style={{ fontSize: '12px', color: '#38bdf8', background: 'rgba(56, 189, 248, 0.1)', padding: '2px 8px', borderRadius: '4px' }}>
                {inmueblesFiltrados.length}
              </span>
            </div>

            <div className="inmuebles-list" style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '340px', overflowY: 'auto' }}>
              {cargando ? (
                <p className="empty-msg" style={{ color: '#94a3b8', fontSize: '13px', textAlign: 'center' }}>Cargando...</p>
              ) : inmueblesFiltrados.length === 0 ? (
                <p className="empty-msg" style={{ color: '#94a3b8', fontSize: '13px', textAlign: 'center' }}>No se encontraron inmuebles.</p>
              ) : (
                inmueblesFiltrados.map((item) => {
                  const idItem = item.idReal;
                  return (
                    <div 
                      key={`item-${idItem}`} 
                      className="inmueble-item"
                      onClick={() => navigate(`/propietario/inmuebles/${idItem}`)}
                      style={{ padding: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Building2 size={20} color="#38bdf8" />
                        <div>
                          <strong style={{ color: '#f8fafc', fontSize: '14px', display: 'block' }}>{item.Nombre}</strong>
                          <p style={{ color: '#94a3b8', fontSize: '12px', margin: 0 }}>{item.Domicilio}</p>
                        </div>
                      </div>
                      <ChevronRight size={18} color="#94a3b8" />
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div style={{ marginTop: '15px', textAlign: 'right', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '12px' }}>
            <span 
              onClick={() => navigate('/propietario/inmuebles')} 
              style={{ cursor: 'pointer', color: '#38bdf8', fontSize: '13px', fontWeight: '500' }}
            >
              Ver todos los inmuebles ›
            </span>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default Propietarios;
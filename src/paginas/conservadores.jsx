import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FichaInm from '../componentes/fichaInm.jsx';

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

  // Controla la apertura y el cierre de la ficha
  const [fichaAbierta, setFichaAbierta] = useState(false);
  const [inmuebleParaFicha, setInmuebleParaFicha] = useState(null);

  const handleAbrirFicha = (item) => {
    setInmuebleParaFicha(item);
    setFichaAbierta(true);
  };

  const handleCerrarFicha = () => {
    setFichaAbierta(false);
  };

  // DIRECCIONES Y COORDENADAS GPS EN NEUQUÉN CAPITAL
  const DIRECCIONES_REALES = {
    1: { lat: -38.9425, lng: -68.0588, dir: 'Av. Argentina 1234, Neuquén' },
    2: { lat: -38.9580, lng: -68.0720, dir: 'Gral. Las Heras 450, Neuquén' }
  };

  useEffect(() => {
    const obtenerDatosDinamicos = async () => {
      try {
        setCargando(true);

        const resResumen = await fetch(`http://localhost:3001/api/conservador/${ID_CONSERVADOR}/resumen`);
        if (resResumen.ok) {
          const dataResumen = await resResumen.json();
          setResumen(dataResumen);
        }

        const resInmuebles = await fetch(`http://localhost:3001/api/conservador/${ID_CONSERVADOR}/inmuebles`);
        let dataInmuebles = [];
        
        if (resInmuebles.ok) {
          dataInmuebles = await resInmuebles.json();
        }

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
    <div className="clientes-page-container" style={{ padding: '30px' }}>

      {/* HEADER DE BIENVENIDA */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '28px', color: '#f8fafc', marginBottom: '8px' }}>¡Hola, Juan!</h1>
        <p style={{ color: '#94a3b8', fontSize: '14px' }}>Gestioná y consultá la información de los inmuebles asignados.</p>
      </div>

      {/* TARJETAS DE RESUMEN KPI */}
      <div className="kpi-grid" style={{ marginBottom: '30px' }}>
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

      {/* MAPA Y LISTA DE INMUEBLES */}
      <div className="main-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        
        {/* PANEL MAPA */}
        <section className="card-panel map-section" style={{ margin: 0, padding: '20px', display: 'flex', flexDirection: 'column' }}>
          <div className="panel-header" style={{ marginBottom: '15px' }}>
            <h3 style={{ fontSize: '16px', color: '#f8fafc', marginBottom: '4px' }}>Mapa de mis inmuebles</h3>
            <p style={{ fontSize: '12px', color: '#94a3b8' }}>Visualizá la ubicación de todos los inmuebles con instalaciones de seguridad contra incendios.</p>
          </div>

          {/* BÚSQUEDA Y FILTRO */}
          <div className="map-search-bar" style={{ display: 'flex', gap: '10px', marginBottom: '15px', position: 'relative' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }} />
              <input 
                type="text" 
                placeholder="Buscar por dirección, cliente o nombre de inmueble..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '10px 10px 10px 38px', 
                  background: 'rgba(15, 23, 42, 0.8)', 
                  border: '1px solid rgba(255, 255, 255, 0.1)', 
                  borderRadius: '8px', 
                  color: '#f8fafc',
                  fontSize: '13px',
                  outline: 'none'
                }}
              />
            </div>
            
            <div className="filter-dropdown-wrapper" style={{ position: 'relative' }}>
              <button 
                className={`btn-filter ${filtroTipo !== 'Todos' ? 'active-filter' : ''}`}
                onClick={() => setMostrarMenuFiltro(!mostrarMenuFiltro)}
                style={{ padding: '10px 16px', background: 'rgba(56, 189, 248, 0.1)', border: '1px solid #38bdf8', color: '#38bdf8', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', height: '100%' }}
              >
                <Filter size={16} /> {filtroTipo === 'Todos' ? 'Filtros' : filtroTipo}
              </button>

              {mostrarMenuFiltro && (
                <div className="filter-menu" style={{ position: 'absolute', right: 0, top: '45px', background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '10px', zIndex: 1000, width: '160px', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
                  <div className="filter-menu-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', paddingBottom: '6px', borderBottom: '1px solid rgba(255,255,255,0.1)', fontSize: '11px', color: '#94a3b8' }}>
                    <span>Filtrar por tipo</span>
                    <X size={14} style={{ cursor: 'pointer' }} onClick={() => setMostrarMenuFiltro(false)} />
                  </div>
                  {['Todos', 'Comercial', 'Residencial'].map(tipo => (
                    <button 
                      key={tipo}
                      onClick={() => { setFiltroTipo(tipo); setMostrarMenuFiltro(false); }}
                      style={{ width: '100%', textAlign: 'left', background: filtroTipo === tipo ? 'rgba(56, 189, 248, 0.2)' : 'transparent', border: 'none', color: '#f8fafc', padding: '6px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', marginBottom: '2px' }}
                    >
                      {tipo === 'Todos' ? 'Todos los tipos' : tipo}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* MAPA LEAFLET */}
          <div className="map-display" style={{ flex: 1, minHeight: '340px', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' }}>
            <MapContainer 
              center={CENTRO_NEUQUEN} 
              zoom={13} 
              style={{ height: '100%', width: '100%', borderRadius: '8px' }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; OpenStreetMap contributors'
              />

              <ControladorMapa 
                inmuebles={inmueblesFiltrados} 
                inmuebleSeleccionado={inmuebleSeleccionado} 
              />
              
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
                      <div className="popup-container" style={{ padding: '5px' }}>
                        <strong style={{ fontSize: '14px', color: '#0f172a' }}>{item.Nombre || item.nombre}</strong>
                        <p style={{ fontSize: '12px', margin: '4px 0', color: '#334155' }}>{item.Domicilio}</p>
                        <span className="popup-tag" style={{ fontSize: '10px', background: '#e2e8f0', padding: '2px 6px', borderRadius: '4px', display: 'inline-block', marginBottom: '8px' }}>{item.Actividad || item.tipoInmueble || 'Comercial'}</span>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button 
                            className="btn-popup" 
                            onClick={() => handleIrAExpediente(idItem)}
                            style={{ background: '#0284c7', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' }}
                          >
                            Expediente
                          </button>
                          <button
                            className="btn-popup"
                            onClick={() => handleAbrirFicha(item)}
                            style={{ background: '#334155', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' }}
                          >
                            Ficha técnica
                          </button>
                        </div>
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
                {inmueblesFiltrados.length} inmuebles
              </span>
            </div>

            <div className="inmuebles-list" style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '340px', overflowY: 'auto' }}>
              {cargando ? (
                <p className="empty-msg" style={{ color: '#94a3b8', fontSize: '13px', textAlign: 'center' }}>Cargando inmuebles asignados...</p>
              ) : inmueblesFiltrados.length === 0 ? (
                <p className="empty-msg" style={{ color: '#94a3b8', fontSize: '13px', textAlign: 'center' }}>No se encontraron inmuebles asignados.</p>
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
                      style={{ 
                        padding: '12px', 
                        background: esSeleccionado ? 'rgba(56, 189, 248, 0.08)' : 'rgba(255,255,255,0.02)', 
                        border: `1px solid ${esSeleccionado ? '#38bdf8' : 'rgba(255,255,255,0.08)'}`, 
                        borderRadius: '8px', 
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'all 0.2s'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div className="inmueble-icon-box">
                          <Building2 size={20} color="#38bdf8" />
                        </div>
                        <div className="inmueble-details">
                          <strong style={{ color: '#f8fafc', fontSize: '14px', display: 'block', marginBottom: '2px' }}>{item.Nombre || item.nombre}</strong>
                          <p style={{ color: '#94a3b8', fontSize: '12px', margin: 0 }}>{item.Domicilio}</p>
                        </div>
                      </div>
                      <ChevronRight size={18} className="arrow" color="#94a3b8" />
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div style={{ marginTop: '15px', textAlign: 'right', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '12px' }}>
            <span 
              onClick={() => navigate('/todos-inmuebles')} 
              style={{ cursor: 'pointer', color: '#38bdf8', fontSize: '13px', fontWeight: '500' }}
            >
              Ver todos los inmuebles ›
            </span>
          </div>
        </aside>

      </div>

      {/* MODAL DE LA FICHA TÉCNICA */}
      {fichaAbierta && inmuebleParaFicha && (
        <FichaInm
          inmueble={{
            ...inmuebleParaFicha,
            id: inmuebleParaFicha.IdInmueble || inmuebleParaFicha.idReal,
            nombre: inmuebleParaFicha.Nombre || inmuebleParaFicha.nombre || "Inmueble sin nombre",
            direccion: inmuebleParaFicha.Domicilio || inmuebleParaFicha.direccion || "Dirección no disponible",
            tipo: inmuebleParaFicha.Actividad || inmuebleParaFicha.tipoInmueble || "No especificado",
          }}
          rol="profesional"
          onCerrar={handleCerrarFicha}
        />
      )}

    </div>
  );
}

export default Conservadores;
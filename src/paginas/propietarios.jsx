import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Home, Search, ChevronRight, Building2 } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import './conservadores.css';

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
      map.flyTo([inmuebleSeleccionado.lat, inmuebleSeleccionado.lng], 16, { duration: 1.2 });
    } else if (inmuebles.length > 0) {
      const puntos = inmuebles.map(item => [item.lat, item.lng]);
      const bounds = L.latLngBounds(puntos);
      map.fitBounds(bounds, { padding: [60, 60] });
    }
  }, [inmuebles, inmuebleSeleccionado, map]);

  return null;
}

function Propietarios() {
  const navigate = useNavigate();
  const usuarioSesion = JSON.parse(sessionStorage.getItem("usuario") || "{}");
  const idPropietario = usuarioSesion.id || 4;

  const [inmuebles, setInmuebles] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [inmuebleSeleccionado, setInmuebleSeleccionado] = useState(null);

  useEffect(() => {
    const obtenerInmuebles = async () => {
      try {
        setCargando(true);
        const res = await fetch(`http://localhost:3001/api/propietario/${idPropietario}/inmuebles`);
        let data = res.ok ? await res.json() : [];

        if (!Array.isArray(data) || data.length === 0) {
          data = [
            { id: 1, nombre: 'Edificio Torres del Limay', direccion: 'Av. Argentina 1234, Neuquén', lat: -38.9425, lng: -68.0588 },
            { id: 2, nombre: 'Galería Comercial Centro', direccion: 'Gral. Las Heras 450, Neuquén', lat: -38.9580, lng: -68.0720 }
          ];
        }

        setInmuebles(data);
      } catch (err) {
        console.error("Error al cargar datos del propietario:", err);
      } finally {
        setCargando(false);
      }
    };

    obtenerInmuebles();
  }, [idPropietario]);

  const inmueblesFiltrados = inmuebles.filter(item =>
    (item.nombre || '').toLowerCase().includes(busqueda.toLowerCase()) ||
    (item.direccion || '').toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div style={{ padding: '10px' }}>
      <div style={{ textAlign: 'center', marginBottom: '25px' }}>
        <h1 style={{ fontSize: '26px', color: '#f8fafc', marginBottom: '6px' }}>¡Hola, {usuarioSesion.nombre || 'Propietario'}!</h1>
        <p style={{ color: '#94a3b8', fontSize: '14px' }}>Gestioná y consultá la información de los inmuebles asignados.</p>
      </div>

      {/* MAPA Y LISTA LATERAL */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        {/* PANEL MAPA */}
        <section style={{ background: 'rgba(30, 41, 59, 0.7)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '16px', color: '#f8fafc', marginBottom: '4px' }}>Mapa de mis Inmuebles</h3>
          <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '15px' }}>Visualizá la ubicación de todos los inmuebles con instalaciones de seguridad contra incendios.</p>

          <div style={{ position: 'relative', marginBottom: '15px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }} />
            <input 
              type="text" 
              placeholder="Buscar por dirección, cliente o nombre de inmueble..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              style={{ width: '100%', padding: '10px 10px 10px 38px', background: '#0f172a', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: '#f8fafc', fontSize: '13px', outline: 'none' }}
            />
          </div>

          <div style={{ flex: 1, minHeight: '360px', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' }}>
            <MapContainer center={CENTRO_NEUQUEN} zoom={13} style={{ height: '100%', width: '100%' }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap' />
              <ControladorMapa inmuebles={inmueblesFiltrados} inmuebleSeleccionado={inmuebleSeleccionado} />
              
              {inmueblesFiltrados.map((item) => (
                <Marker
                  key={`marker-${item.id}`}
                  position={[item.lat || -38.9516, item.lng || -68.0591]}
                  icon={inmuebleSeleccionado?.id === item.id ? iconoAzul : iconoRojo}
                  eventHandlers={{ click: () => setInmuebleSeleccionado(item) }}
                >
                  <Popup>
                    <div style={{ padding: '4px' }}>
                      <strong style={{ fontSize: '13px', color: '#0f172a' }}>{item.nombre}</strong>
                      <p style={{ fontSize: '11px', margin: '3px 0', color: '#475569' }}>{item.direccion}</p>
                      <button 
                        onClick={() => navigate(`/propietario/inmuebles/${item.id}`)}
                        style={{ background: '#0284c7', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', cursor: 'pointer', marginTop: '4px' }}
                      >
                        Ver expediente
                      </button>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </section>

        {/* LISTA DE MIS INMUEBLES */}
        <aside style={{ background: 'rgba(30, 41, 59, 0.7)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h3 style={{ fontSize: '16px', color: '#f8fafc', margin: 0 }}>Mis Inmuebles</h3>
              <span style={{ fontSize: '12px', color: '#38bdf8', background: 'rgba(56, 189, 248, 0.12)', padding: '3px 10px', borderRadius: '12px', fontWeight: '600' }}>
                {inmueblesFiltrados.length} Inmuebles
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '360px', overflowY: 'auto' }}>
              {cargando ? (
                <p style={{ color: '#94a3b8', fontSize: '13px', textAlign: 'center' }}>Cargando...</p>
              ) : inmueblesFiltrados.map((item) => (
                <div 
                  key={`item-${item.id}`} 
                  onClick={() => navigate(`/propietario/inmuebles/${item.id}`)}
                  style={{ padding: '14px', background: 'rgba(15, 23, 42, 0.6)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'all 0.2s' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ background: 'rgba(56, 189, 248, 0.1)', padding: '8px', borderRadius: '6px' }}>
                      <Building2 size={18} color="#38bdf8" />
                    </div>
                    <div>
                      <strong style={{ color: '#f8fafc', fontSize: '14px', display: 'block' }}>{item.nombre}</strong>
                      <p style={{ color: '#94a3b8', fontSize: '12px', margin: 0 }}>{item.direccion}</p>
                    </div>
                  </div>
                  <ChevronRight size={18} color="#64748b" />
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: '20px', textAlign: 'right', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '15px' }}>
            <span 
              onClick={() => navigate('/propietario/todos-inmuebles')} 
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
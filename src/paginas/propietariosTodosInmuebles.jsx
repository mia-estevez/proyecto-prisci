import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Search, ChevronRight, ArrowLeft } from 'lucide-react';
import './conservadores.css';

function PropietariosTodosInmuebles() {
  const navigate = useNavigate();
  const usuarioSesion = JSON.parse(sessionStorage.getItem("usuario") || "{}");
  const idPropietario = usuarioSesion.id || 3;

  const [inmuebles, setInmuebles] = useState([]);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    const obtenerInmuebles = async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/propietario/${idPropietario}/inmuebles`);
        let data = res.ok ? await res.json() : [];
        if (!Array.isArray(data) || data.length === 0) {
          data = [
            { id: 1, nombre: 'Edificio Torres del Limay', direccion: 'Av. Argentina 1234, Neuquén', actividad: 'Comercial', superficie: '1.250 m²' },
            { id: 2, nombre: 'Galería Comercial Centro', direccion: 'Gral. Las Heras 450, Neuquén', actividad: 'Residencial', superficie: '1.200 m²' }
          ];
        }
        setInmuebles(data);
      } catch (err) {
        console.error("Error al cargar inmuebles:", err);
      }
    };
    obtenerInmuebles();
  }, [idPropietario]);

  const filtrados = inmuebles.filter(item => 
    (item.nombre || '').toLowerCase().includes(busqueda.toLowerCase()) ||
    (item.direccion || '').toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div style={{ padding: '20px', maxWidth: '1100px', margin: '0 auto' }}>
      <button 
        onClick={() => navigate('/propietario')}
        style={{ background: 'transparent', border: 'none', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '20px' }}
      >
        <ArrowLeft size={18} /> Volver al inicio
      </button>

      <div style={{ background: 'rgba(30, 41, 59, 0.7)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '24px', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '22px', color: '#f8fafc', margin: '0 0 6px 0' }}>Mis Inmuebles Asignados</h1>
        <p style={{ color: '#94a3b8', fontSize: '13px', margin: 0 }}>Listado general de propiedades bajo tu titularidad.</p>
      </div>

      <div style={{ position: 'relative', marginBottom: '20px' }}>
        <Search size={18} style={{ position: 'absolute', left: '14px', top: '12px', color: '#94a3b8' }} />
        <input 
          type="text" 
          placeholder="Buscar por nombre, dirección o tipo..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          style={{ width: '100%', padding: '10px 10px 10px 42px', background: 'rgba(30, 41, 59, 0.7)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#f8fafc', fontSize: '13px', outline: 'none' }}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '15px' }}>
        {filtrados.map((item) => (
          <div 
            key={item.id}
            onClick={() => navigate(`/propietario/inmuebles/${item.id}`)}
            style={{ background: 'rgba(30, 41, 59, 0.7)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '18px', cursor: 'pointer', transition: 'all 0.2s' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <div style={{ background: 'rgba(56, 189, 248, 0.1)', padding: '10px', borderRadius: '8px' }}>
                  <Building2 size={20} color="#38bdf8" />
                </div>
                <div>
                  <h3 style={{ fontSize: '15px', color: '#f8fafc', margin: 0 }}>{item.nombre}</h3>
                  <span style={{ fontSize: '11px', color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '2px 6px', borderRadius: '4px' }}>Activo</span>
                </div>
              </div>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '12px', margin: '0 0 12px 0' }}>{item.direccion}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '10px', fontSize: '12px', color: '#cbd5e1' }}>
              <span>Tipo: {item.actividad || 'Comercial'}</span>
              <span style={{ color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '4px' }}>Ver expediente <ChevronRight size={14} /></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PropietariosTodosInmuebles;
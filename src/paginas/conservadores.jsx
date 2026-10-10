import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Users, FileText, Clock, Bell, MapPin, Search } from 'lucide-react';
import './clientes.css';

function Conservadores() {
  const navigate = useNavigate();
  const [inmueblesAsignados, setInmueblesAsignados] = useState([]);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    const inmueblesBaseIniciales = [
      {
        id: 1,
        nombre: 'Edificio Torres del Limay',
        domicilio: 'Av. Argentina 1234, Neuquén',
        tipo: 'Comercial',
        superficie: '1.250 m²',
        estado: 'Activo'
      },
      {
        id: 2,
        nombre: 'Galería Comercial Centro',
        domicilio: 'Gral. Las Heras 450, Neuquén',
        tipo: 'Residencial',
        superficie: '1.200 m²',
        estado: 'Inactivo'
      }
    ];

    const guardadosEnStorage = localStorage.getItem('inmuebles_conservador');
    if (!guardadosEnStorage) {
      localStorage.setItem('inmuebles_conservador', JSON.stringify(inmueblesBaseIniciales));
      setInmueblesAsignados(inmueblesBaseIniciales);
    } else {
      setInmueblesAsignados(JSON.parse(guardadosEnStorage));
    }
  }, []);

  const inmueblesFiltrados = inmueblesAsignados.filter(inm => 
    inm.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    inm.domicilio.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="clientes-page-container" style={{ padding: '30px' }}>

      {/* HEADER DE BIENVENIDA */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '28px', color: '#f8fafc', marginBottom: '8px' }}>¡Hola, Juan!</h1>
        <p style={{ color: '#94a3b8', fontSize: '14px' }}>Gestioná y consultá la información de los inmuebles asignados.</p>
      </div>

      {/* TARJETAS DE RESUMEN SUPERIOR */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', marginBottom: '30px' }}>
        
        <div className="card-panel" style={{ margin: 0, padding: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ padding: '12px', background: 'rgba(56, 189, 248, 0.1)', borderRadius: '10px', color: '#38bdf8' }}>
            <Building2 size={22} />
          </div>
          <div>
            <span style={{ fontSize: '22px', fontWeight: 'bold', color: '#f8fafc' }}>{inmueblesAsignados.length}</span>
            <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>Inmuebles Asignados</p>
          </div>
        </div>

        <div className="card-panel" style={{ margin: 0, padding: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ padding: '12px', background: 'rgba(56, 189, 248, 0.1)', borderRadius: '10px', color: '#38bdf8' }}>
            <Users size={22} />
          </div>
          <div>
            <span style={{ fontSize: '22px', fontWeight: 'bold', color: '#f8fafc' }}>
              {inmueblesAsignados.filter(i => i.estado === 'Activo').length}
            </span>
            <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>Clientes Activos</p>
          </div>
        </div>

        <div className="card-panel" style={{ margin: 0, padding: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ padding: '12px', background: 'rgba(56, 189, 248, 0.1)', borderRadius: '10px', color: '#38bdf8' }}>
            <FileText size={22} />
          </div>
          <div>
            <span style={{ fontSize: '22px', fontWeight: 'bold', color: '#f8fafc' }}>7</span>
            <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>Servicios Este mes</p>
          </div>
        </div>

        <div className="card-panel" style={{ margin: 0, padding: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ padding: '12px', background: 'rgba(56, 189, 248, 0.1)', borderRadius: '10px', color: '#38bdf8' }}>
            <Clock size={22} />
          </div>
          <div>
            <span style={{ fontSize: '22px', fontWeight: 'bold', color: '#f8fafc' }}>6</span>
            <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>Vencimientos Próximos 30 días</p>
          </div>
        </div>

      </div>

      {/* SECCIÓN CENTRAL: MAPA Y LISTA LATERAL */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>

        {/* MAPA DE INMUEBLES */}
        <div className="card-panel" style={{ margin: 0, padding: '20px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '16px', color: '#f8fafc', marginBottom: '4px' }}>Mapa de mis inmuebles</h3>
          <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '15px' }}>Visualizá la ubicación de todos los inmuebles con instalaciones de seguridad contra incendios.</p>
          
          <div style={{ position: 'relative', marginBottom: '15px' }}>
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

          <div style={{ flex: 1, minHeight: '340px', background: '#1e293b', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.06)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ textAlign: 'center', color: '#94a3b8' }}>
              <MapPin size={32} color="#38bdf8" style={{ margin: '0 auto 8px auto' }} />
              <p style={{ fontSize: '14px', fontWeight: '500' }}>Mapa interactivo de Neuquén Capital</p>
              <span style={{ fontSize: '12px' }}>{inmueblesFiltrados.length} inmuebles localizados en coordenadas</span>
            </div>
          </div>
        </div>

        {/* LISTA LATERAL: MIS INMUEBLES */}
        <div className="card-panel" style={{ margin: 0, padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h3 style={{ fontSize: '16px', color: '#f8fafc', margin: 0 }}>Mis inmuebles</h3>
              <span style={{ fontSize: '12px', color: '#38bdf8', background: 'rgba(56, 189, 248, 0.1)', padding: '2px 8px', borderRadius: '4px' }}>
                {inmueblesAsignados.length} inmuebles
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '340px', overflowY: 'auto' }}>
              {inmueblesFiltrados.length > 0 ? (
                inmueblesFiltrados.map((inm) => (
                  <div 
                    key={inm.id}
                    onClick={() => navigate(`/clientes/${inm.id}`)}
                    style={{ 
                      padding: '12px', 
                      background: 'rgba(255,255,255,0.02)', 
                      border: '1px solid rgba(255,255,255,0.08)', 
                      borderRadius: '8px', 
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#38bdf8';
                      e.currentTarget.style.background = 'rgba(56, 189, 248, 0.04)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                      e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <strong style={{ color: '#f8fafc', fontSize: '14px', display: 'block', marginBottom: '4px' }}>{inm.nombre}</strong>
                      <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', background: inm.estado === 'Activo' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(148, 163, 184, 0.15)', color: inm.estado === 'Activo' ? '#4ade80' : '#94a3b8' }}>
                        {inm.estado}
                      </span>
                    </div>
                    <span style={{ color: '#94a3b8', fontSize: '12px', display: 'block' }}>{inm.domicilio}</span>
                    <span style={{ color: '#38bdf8', fontSize: '11px', display: 'block', marginTop: '6px' }}>Tipo: {inm.tipo}</span>
                  </div>
                ))
              ) : (
                <p style={{ color: '#94a3b8', fontSize: '13px', textAlign: 'center', padding: '20px 0' }}>No se encontraron inmuebles asignados.</p>
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
        </div>

      </div>

    </div>
  );
}

export default Conservadores;
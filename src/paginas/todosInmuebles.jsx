import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Building2, Search, MapPin, ChevronRight, ShieldCheck } from 'lucide-react';
import './clientes.css'; // Reutilizamos estilos globales

function TodosInmuebles() {
  const navigate = useNavigate();
  const [busqueda, setBusqueda] = useState('');

  // Listado oficial de inmuebles asignados al conservador
  const inmueblesAsignados = [
    {
      id: 1,
      nombre: 'Edificio Torres del Limay',
      domicilio: 'Av. Argentina 1234, Neuquén',
      tipo: 'Comercial',
      superficie: '1.250 m²',
      estado: 'Activo',
      serviciosVigentes: 5
    },
    {
      id: 2,
      nombre: 'Galería Comercial Centro',
      domicilio: 'Gral. Las Heras 450, Neuquén',
      tipo: 'Residencial',
      superficie: '1.200 m²',
      estado: 'Activo',
      serviciosVigentes: 5
    }
  ];

  const inmueblesFiltrados = inmueblesAsignados.filter(inm => 
    inm.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    inm.domicilio.toLowerCase().includes(busqueda.toLowerCase()) ||
    inm.tipo.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="clientes-page-container" style={{ padding: '30px' }}>

      {/* BARRA DE NAVEGACIÓN / BREADCRUMB */}
      <div className="breadcrumb-bar" style={{ marginBottom: '20px' }}>
        <button className="btn-back-link" onClick={() => navigate('/conservadores')}>
          <ArrowLeft size={16} /> Volver al panel principal
        </button>
      </div>

      <header className="ficha-header" style={{ marginBottom: '25px' }}>
        <div className="title-group">
          <h1>Inmuebles Asignados</h1>
          <p style={{ color: '#94a3b8', marginTop: '5px' }}>Listado general de inmuebles bajo tu supervisión y conservación técnica.</p>
        </div>
      </header>

      {/* BUSCADOR */}
      <div className="card-panel" style={{ width: '100%', padding: '20px', marginBottom: '25px', display: 'flex', alignItems: 'center' }}>
        <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', color: '#94a3b8' }} />
          <input 
            type="text" 
            placeholder="Buscar por nombre, dirección o tipo de inmueble..." 
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '10px 10px 10px 40px', 
              background: 'rgba(15, 23, 42, 0.8)', 
              border: '1px solid rgba(255, 255, 255, 0.1)', 
              borderRadius: '8px', 
              color: '#f8fafc',
              outline: 'none'
            }}
          />
        </div>
      </div>

      {/* GRILLA DE INMUEBLES */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
        {inmueblesFiltrados.length > 0 ? (
          inmueblesFiltrados.map((inm) => (
            <div 
              key={inm.id}
              onClick={() => navigate(`/clientes/${inm.id}`)}
              className="card-panel" 
              style={{ 
                margin: 0, 
                cursor: 'pointer', 
                transition: 'transform 0.2s, border-color 0.2s',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#38bdf8';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ padding: '10px', background: 'rgba(56, 189, 248, 0.1)', borderRadius: '8px', color: '#38bdf8' }}>
                      <Building2 size={20} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '16px', color: '#f8fafc', margin: 0 }}>{inm.nombre}</h3>
                      <span className="badge-activo" style={{ marginTop: '4px', display: 'inline-block' }}>{inm.estado}</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8', fontSize: '13px', marginBottom: '15px' }}>
                  <MapPin size={14} />
                  <span>{inm.domicilio}</span>
                </div>

                <div style={{ display: 'flex', gap: '10px', fontSize: '12px', color: '#cbd5e1', marginBottom: '15px' }}>
                  <span style={{ background: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: '4px' }}>Tipo: {inm.tipo}</span>
                  <span style={{ background: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: '4px' }}>Superficie: {inm.superficie}</span>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '12px', marginTop: '10px' }}>
                <span style={{ fontSize: '13px', color: '#38bdf8' }}>Ver expediente técnico</span>
                <ChevronRight size={16} color="#38bdf8" />
              </div>
            </div>
          ))
        ) : (
          <p style={{ color: '#94a3b8', gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>No se encontraron inmuebles que coincidan con la búsqueda.</p>
        )}
      </div>

    </div>
  );
}

export default TodosInmuebles;
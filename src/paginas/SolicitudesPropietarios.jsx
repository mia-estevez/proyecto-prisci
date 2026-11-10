import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { ArrowLeft, FileText, CheckCircle, XCircle, User, Building } from 'lucide-react';

export default function SolicitudesMunicipales() {
  const navigate = useNavigate();
  const [solicitudes, setSolicitudes] = useState([]);

  // Cargar solicitudes guardadas (simulando las enviadas por propietarios)
  useEffect(() => {
    const guardadas = JSON.parse(localStorage.getItem('solicitudes_propietarios') || '[]');
    // Si no hay ninguna guardada de prueba, le ponemos un par por defecto para que no aparezca vacío
    if (guardadas.length === 0) {
      const dePrueba = [
        { id: 1, propietario: "Carlos Gómez", inmueble: "Edificio Torres del Limay", tipo: "Actualización de Planos", fecha: "2026-11-08", estado: "Pendiente" },
        { id: 2, propietario: "Ana Martínez", inmueble: "Hotel del Comahue", tipo: "Habilitación Comercial", fecha: "2026-11-09", estado: "Pendiente" }
      ];
      setSolicitudes(dePrueba);
      localStorage.setItem('solicitudes_propietarios', JSON.stringify(dePrueba));
    } else {
      setSolicitudes(guardadas);
    }
  }, []);

  // Función para aprobar o rechazar
  const cambiarEstado = (id, nuevoEstado) => {
    const actualizadas = solicitudes.map(sol => sol.id === id ? { ...sol, estado: nuevoEstado } : sol);
    setSolicitudes(actualizadas);
    localStorage.setItem('solicitudes_propietarios', JSON.stringify(actualizadas));
  };

  return (
    <div className="clientes-page-container" style={{ padding: '30px' }}>
      
      {/* BOTÓN VOLVER */}
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={() => navigate('/')}
          style={{ 
            background: 'transparent', 
            border: 'none', 
            color: '#38bdf8', 
            cursor: 'pointer', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            fontSize: '14px', 
            fontWeight: '500', 
            padding: 0 
          }}
        >
          <ArrowLeft size={16} /> Volver al panel principal
        </button>
      </div>

      <header style={{ marginBottom: '25px' }}>
        <h1>Solicitudes de Propietarios</h1>
        <p style={{ color: '#94a3b8', marginTop: '5px' }}>Bandeja de entrada de trámites y peticiones enviadas por los propietarios de la ciudad.</p>
      </header>

      {/* LISTADO DE SOLICITUDES */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {solicitudes.length > 0 ? (
          solicitudes.map((sol) => (
            <div 
              key={sol.id}
              style={{ 
                background: 'rgba(15, 23, 42, 0.8)', 
                border: '1px solid rgba(255, 255, 255, 0.08)', 
                borderRadius: '12px', 
                padding: '20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '15px'
              }}
            >
              <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
                <div style={{ padding: '12px', background: 'rgba(56, 189, 248, 0.1)', borderRadius: '10px', color: '#38bdf8' }}>
                  <FileText size={24} />
                </div>
                <div>
                  <h3 style={{ fontSize: '16px', color: '#f8fafc', margin: '0 0 5px 0' }}>{sol.tipo}</h3>
                  <div style={{ display: 'flex', gap: '15px', color: '#94a3b8', fontSize: '13px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><User size={14} /> {sol.propietario}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Building size={14} /> {sol.inmueble}</span>
                    <span>📅 {sol.fecha}</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <span style={{ 
                  padding: '6px 12px', 
                  borderRadius: '20px', 
                  fontSize: '12px', 
                  fontWeight: '600',
                  background: sol.estado === 'Aprobado' ? 'rgba(34, 197, 94, 0.15)' : sol.estado === 'Rechazado' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(234, 179, 8, 0.15)',
                  color: sol.estado === 'Aprobado' ? '#4ade80' : sol.estado === 'Rechazado' ? '#f87171' : '#facc15'
                }}>
                  {sol.estado}
                </span>

                {sol.estado === 'Pendiente' && (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                      onClick={() => cambiarEstado(sol.id, 'Aprobado')}
                      style={{ background: '#22c55e', border: 'none', color: 'white', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '5px' }}
                    >
                      <CheckCircle size={14} /> Aprobar
                    </button>
                    <button 
                      onClick={() => cambiarEstado(sol.id, 'Rechazado')}
                      style={{ background: '#ef4444', border: 'none', color: 'white', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '5px' }}
                    >
                      <XCircle size={14} /> Rechazar
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <p style={{ color: '#94a3b8', textAlign: 'center', padding: '40px' }}>No hay solicitudes pendientes.</p>
        )}
      </div>

    </div>
  );
}
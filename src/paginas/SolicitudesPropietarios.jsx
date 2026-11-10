import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { ArrowLeft, FileText, CheckCircle, XCircle, Clock, User, Building } from 'lucide-react';
import './SolicitudesPropietarios.css';

export default function SolicitudesPropietarios() {
  const navigate = useNavigate();
  const [solicitudes, setSolicitudes] = useState([]);
  const [expandida, setExpandida] = useState(null);

  useEffect(() => {
    const cargarSolicitudes = async () => {
      try {
        const respuesta = await fetch('http://localhost:3001/api/solicitudes-propietario');
        if (respuesta.ok) {
          const data = await respuesta.json();
          setSolicitudes(data || []);
          return;
        }
      } catch (error) {
        console.log("No se pudo conectar al servidor, cargando datos locales.");
      }

      // Respaldo local si el servidor no responde
      const guardadas = JSON.parse(
        localStorage.getItem('solicitudes_propietarios') || 
        localStorage.getItem('solicitudes-propietario') || '[]'
      );
      setSolicitudes(guardadas);
    };

    cargarSolicitudes();
    const intervalo = setInterval(cargarSolicitudes, 2000);
    return () => clearInterval(intervalo);
  }, []);

  const cambiarEstado = async (id, nuevoEstado, e) => {
    e.stopPropagation();
    
    // Actualización visual inmediata
    const actualizadas = solicitudes.map(sol => (sol.id === id || sol.idInmueble === id) ? { ...sol, estado: nuevoEstado } : sol);
    setSolicitudes(actualizadas);
    localStorage.setItem('solicitudes_propietarios', JSON.stringify(actualizadas));

    try {
      await fetch(`http://localhost:3001/api/solicitudes-propietario/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: nuevoEstado })
      });
    } catch (err) {
      console.log("Estado actualizado en la interfaz.");
    }
  };

  const toggleExpandir = (id) => {
    setExpandida(expandida === id ? null : id);
  };

  return (
    <div className="solicitudes-container">
      
      <div className="solicitudes-back-wrapper">
        <button onClick={() => navigate('/')} className="solicitudes-back-btn">
          <ArrowLeft size={16} /> Volver al panel principal
        </button>
      </div>

      <header className="solicitudes-header">
        <h1>Solicitudes de Propietarios</h1>
        <p>Bandeja de entrada sincronizada en tiempo real con los formularios de los propietarios.</p>
      </header>

      <div className="solicitudes-list">
        {solicitudes && solicitudes.length > 0 ? (
          solicitudes.map((sol, index) => {
            const idUnico = sol.id || index;
            const estaAbierta = expandida === idUnico;

            return (
              <div 
                key={idUnico} 
                className="solicitud-card"
                onClick={() => toggleExpandir(idUnico)}
                style={{ cursor: 'pointer', flexDirection: 'column', alignItems: 'stretch' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                  <div className="solicitud-info-wrapper">
                    <div className="solicitud-icon-box">
                      <FileText size={24} />
                    </div>
                    <div className="solicitud-details">
                      {/* Muestra exactamente el motivo que guardó tu compañera */}
                      <h3>{sol.motivo || sol.tipo || 'Solicitud de Trámite'}</h3>
                      <div className="solicitud-meta">
                        <span><User size={14} /> Propietario ID: {sol.idPropietario || '1'}</span>
                        {/* Muestra exactamente el nombre del inmueble que seleccionó en el formulario */}
                        <span><Building size={14} /> {sol.nombreInmueble || sol.inmueble || 'Inmueble'}</span>
                        <span>📅 {sol.fecha || '2026-11-10'}</span>
                        <span style={{ color: '#38bdf8', fontSize: '11px' }}>
                          {estaAbierta ? 'Ocultar detalle ▲' : 'Ver detalle ▼'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Botones de acción con tu diseño transparente */}
                  <div className="solicitudes-actions" onClick={(e) => e.stopPropagation()}>
                    <button 
                      onClick={(e) => cambiarEstado(idUnico, 'Pendiente', e)}
                      className="btn-estado btn-pendiente"
                    >
                      <Clock size={14} /> Pendiente
                    </button>

                    <button 
                      onClick={(e) => cambiarEstado(idUnico, 'Aprobado', e)}
                      className="btn-estado btn-aprobar"
                    >
                      <CheckCircle size={14} /> Aprobar
                    </button>

                    <button 
                      onClick={(e) => cambiarEstado(idUnico, 'Rechazado', e)}
                      className="btn-estado btn-rechazar"
                    >
                      <XCircle size={14} /> Rechazar
                    </button>
                  </div>
                </div>

                {/* Desplegable con el detalle exacto escrito en el textarea de su formulario */}
                {estaAbierta && (
                  <div style={{ 
                    marginTop: '15px', 
                    paddingTop: '15px', 
                    borderTop: '1px solid rgba(255,255,255,0.08)', 
                    background: 'rgba(2, 6, 23, 0.4)', 
                    padding: '15px', 
                    borderRadius: '8px' 
                  }}>
                    <h4 style={{ color: '#38bdf8', fontSize: '14px', margin: '0 0 6px 0' }}>Detalle Específico de los Cambios Requeridos:</h4>
                    <p style={{ color: '#e2e8f0', fontSize: '13px', margin: '0 0 10px 0', lineHeight: '1.5' }}>
                      {sol.detalle || sol.descripcion || 'Sin detalle especificado.'}
                    </p>
                    <div style={{ display: 'flex', gap: '20px', fontSize: '12px', color: '#94a3b8' }}>
                      <span><strong>Estado actual:</strong> <span style={{ color: sol.estado === 'Aprobado' ? '#4ade80' : sol.estado === 'Rechazado' ? '#f87171' : '#facc15' }}>{sol.estado || 'Pendiente'}</span></span>
                    </div>
                  </div>
                )}

              </div>
            );
          })
        ) : (
          <p className="solicitudes-empty">No hay solicitudes enviadas desde la página de propietarios.</p>
        )}
      </div>

    </div>
  );
}
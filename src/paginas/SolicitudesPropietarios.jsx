import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { ArrowLeft, FileText, CheckCircle, XCircle, Clock, User, Building } from 'lucide-react';
import './SolicitudesPropietarios.css';

export default function SolicitudesMunicipales() {
  const navigate = useNavigate();
  const [solicitudes, setSolicitudes] = useState([]);

  useEffect(() => {
    const cargarSolicitudes = () => {
      const guardadas = JSON.parse(localStorage.getItem('solicitudes_propietarios') || '[]');
      
      if (guardadas.length === 0) {
        const dePrueba = [
          { id: 1, propietario: "Carlos Gómez", inmueble: "Edificio Torres del Limay", tipo: "Actualización de Planos", fecha: "2026-11-08", estado: "Pendiente" },
          { id: 2, propietario: "Ana Martínez", inmueble: "Hotel del Comahue", tipo: "Habilitación Comercial", fecha: "2026-11-09", estado: "Pendiente" }
        ];
        localStorage.setItem('solicitudes_propietarios', JSON.stringify(dePrueba));
        setSolicitudes(dePrueba);
      } else {
        setSolicitudes(guardadas);
      }
    };

    cargarSolicitudes();

    window.addEventListener('storage', cargarSolicitudes);
    return () => window.removeEventListener('storage', cargarSolicitudes);
  }, []);

  const cambiarEstado = (id, nuevoEstado) => {
    const actualizadas = solicitudes.map(sol => sol.id === id ? { ...sol, estado: nuevoEstado } : sol);
    setSolicitudes(actualizadas);
    localStorage.setItem('solicitudes_propietarios', JSON.stringify(actualizadas));
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
        <p>Bandeja de entrada de trámites y peticiones enviadas por los propietarios en tiempo real.</p>
      </header>

      <div className="solicitudes-list">
        {solicitudes.length > 0 ? (
          solicitudes.map((sol) => (
            <div key={sol.id} className="solicitud-card">
              
              <div className="solicitud-info-wrapper">
                <div className="solicitud-icon-box">
                  <FileText size={24} />
                </div>
                <div className="solicitud-details">
                  <h3>{sol.tipo}</h3>
                  <div className="solicitud-meta">
                    <span><User size={14} /> {sol.propietario}</span>
                    <span><Building size={14} /> {sol.inmueble}</span>
                    <span>📅 {sol.fecha}</span>
                  </div>
                </div>
              </div>

              <div className="solicitudes-actions">
                <button 
                  onClick={() => cambiarEstado(sol.id, 'Pendiente')}
                  className={`btn-estado btn-pendiente ${sol.estado === 'Pendiente' ? 'activo' : ''}`}
                >
                  <Clock size={14} /> Pendiente
                </button>

                <button 
                  onClick={() => cambiarEstado(sol.id, 'Aprobado')}
                  className={`btn-estado btn-aprobar ${sol.estado === 'Aprobado' ? 'activo' : ''}`}
                >
                  <CheckCircle size={14} /> Aprobar
                </button>

                <button 
                  onClick={() => cambiarEstado(sol.id, 'Rechazado')}
                  className={`btn-estado btn-rechazar ${sol.estado === 'Rechazado' ? 'activo' : ''}`}
                >
                  <XCircle size={14} /> Rechazar
                </button>
              </div>

            </div>
          ))
        ) : (
          <p className="solicitudes-empty">No hay solicitudes registradas.</p>
        )}
      </div>

    </div>
  );
}
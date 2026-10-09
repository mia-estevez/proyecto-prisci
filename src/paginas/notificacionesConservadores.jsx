import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, ArrowLeft, CheckCircle2, Trash2, AlertTriangle, Info, Clock, Building2 } from 'lucide-react';
import './notificacionesConservadores.css';

function NotificacionesConservadores() {
  const navigate = useNavigate();
  const [notificaciones, setNotificaciones] = useState([]);

  useEffect(() => {
    // Sincronización con localStorage específico para notificaciones de conservadores
    const notifGuardadas = JSON.parse(localStorage.getItem('notificaciones_conservador') || '[]');
    
    if (notifGuardadas.length === 0) {
      const iniciales = [
        {
          id: 1,
          titulo: 'Solicitud de Inspección Extraordinaria',
          emisor: 'Administración - Edificio Torres del Limay',
          mensaje: 'El consorcio solicita un relevamiento técnico urgente de la red de incendio antes del viernes.',
          fecha: '09/10/2026 - 08:30',
          leida: false,
          tipo: 'alerta',
          inmuebleId: 1
        },
        {
          id: 2,
          titulo: 'Vencimiento Próximo de Servicio',
          emisor: 'Sistema PRISCI (Automático)',
          mensaje: 'Los extintores de la Galería Comercial Centro alcanzan su fecha límite de revisión en 15 días.',
          fecha: '08/10/2026 - 11:00',
          leida: true,
          tipo: 'info',
          inmuebleId: 2
        }
      ];
      localStorage.setItem('notificaciones_conservador', JSON.stringify(iniciales));
      setNotificaciones(iniciales);
    } else {
      setNotificaciones(notifGuardadas);
    }
  }, []);

  const marcarComoLeida = (id) => {
    const actualizadas = notificaciones.map(n => n.id === id ? { ...n, leida: true } : n);
    setNotificaciones(actualizadas);
    localStorage.setItem('notificaciones_conservador', JSON.stringify(actualizadas));
  };

  const eliminarNotificacion = (id, e) => {
    e.stopPropagation();
    const actualizadas = notificaciones.filter(n => n.id !== id);
    setNotificaciones(actualizadas);
    localStorage.setItem('notificaciones_conservador', JSON.stringify(actualizadas));
  };

  const marcarTodasComoLeidas = () => {
    const actualizadas = notificaciones.map(n => ({ ...n, leida: true }));
    setNotificaciones(actualizadas);
    localStorage.setItem('notificaciones_conservador', JSON.stringify(actualizadas));
  };

  return (
    <div className="notif-conservador-container">

      {/* BREADCRUMB */}
      <div className="breadcrumb-bar">
        <button className="btn-back-link" onClick={() => navigate('/conservadores')}>
          <ArrowLeft size={16} /> Volver al panel principal
        </button>
      </div>

      <header className="ficha-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="title-group">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Bell size={28} color="#38bdf8" />
            <h1>Notificaciones del Conservador</h1>
          </div>
          <p style={{ color: '#94a3b8', marginTop: '5px' }}>Centro de avisos, solicitudes de inmuebles y alertas técnicas asignadas.</p>
        </div>

        {notificaciones.some(n => !n.leida) && (
          <button className="btn-marcar-todas" onClick={marcarTodasComoLeidas}>
            Marcar todas como leídas
          </button>
        )}
      </header>

      {/* BANDEJA DE NOTIFICACIONES */}
      <div className="card-panel" style={{ width: '100%', padding: '24px', marginTop: '20px' }}>
        <h3 style={{ marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>
          Bandeja de entrada ({notificaciones.filter(n => !n.leida).length} no leídas)
        </h3>

        {notificaciones.length > 0 ? (
          <div className="notif-list">
            {notificaciones.map((notif) => (
              <div 
                key={notif.id}
                onClick={() => {
                  marcarComoLeida(notif.id);
                  if (notif.inmuebleId) {
                    navigate(`/clientes/${notif.inmuebleId}`);
                  }
                }}
                className={`notif-item ${notif.leida ? 'leida' : 'no-leida'}`}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
                  <div style={{ marginTop: '2px' }}>
                    {notif.tipo === 'alerta' ? (
                      <AlertTriangle size={22} color="#f59e0b" />
                    ) : (
                      <Info size={22} color="#38bdf8" />
                    )}
                  </div>

                  <div>
                    <div className="notif-title-row">
                      <strong>{notif.titulo}</strong>
                      {!notif.leida && <span className="badge-nuevo">NUEVO</span>}
                    </div>
                    <span className="notif-emisor">{notif.emisor}</span>
                    <p className="notif-mensaje">{notif.mensaje}</p>
                    <span className="notif-fecha">
                      <Clock size={12} /> {notif.fecha} {notif.inmuebleId && '• Clic para ver inmueble'}
                    </span>
                  </div>
                </div>

                <div className="notif-actions">
                  {!notif.leida && (
                    <button 
                      title="Marcar como leída"
                      onClick={(e) => { e.stopPropagation(); marcarComoLeida(notif.id); }}
                      className="icon-btn-check"
                    >
                      <CheckCircle2 size={18} />
                    </button>
                  )}
                  <button 
                    title="Eliminar notificación"
                    onClick={(e) => eliminarNotificacion(notif.id, e)}
                    className="icon-btn-trash"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="empty-text">No tenés notificaciones en este momento.</p>
        )}
      </div>

    </div>
  );
}

export default NotificacionesConservadores;
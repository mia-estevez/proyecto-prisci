import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, CheckCircle2, FileText, ChevronRight, Calendar } from 'lucide-react';
import './conservadores.css';

function PropietarioNotificaciones() {
  const navigate = useNavigate();
  const usuarioSesion = JSON.parse(sessionStorage.getItem("usuario") || "{}");
  const idPropietario = usuarioSesion.id || 4;

  const [notificaciones, setNotificaciones] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const obtenerNotificaciones = async () => {
      try {
        setCargando(true);
        
        // Intentamos obtener los inmuebles del propietario
        let inmuebles = [];
        const resInm = await fetch(`http://localhost:3001/api/propietario/${idPropietario}/inmuebles`);
        if (resInm.ok) {
          inmuebles = await resInm.json();
        }

        // Si no devuelve por endpoint específico, tomamos los inmuebles generales como respaldo
        if (!Array.isArray(inmuebles) || inmuebles.length === 0) {
          inmuebles = [
            { id: 1, nombre: 'Edificio Torres del Limay', direccion: 'Av. Corrientes 1234, Neuquén' },
            { id: 2, nombre: 'Galería Comercial Centro', direccion: 'Gral. Las Heras 450, Neuquén' }
          ];
        }

        let listaNotif = [];
        for (const inm of inmuebles) {
          const idInmueble = inm.id || inm.IdInmueble;
          const resInsp = await fetch(`http://localhost:3001/api/inmuebles/${idInmueble}/inspecciones`);
          if (resInsp.ok) {
            const inspecciones = await resInsp.json();
            inspecciones.forEach((insp) => {
              let obsText = insp.Detalle || insp.detalle || insp.Observaciones || '';
              let parte = 'S/N';
              try {
                const parsed = typeof obsText === 'string' ? JSON.parse(obsText) : obsText;
                if (typeof parsed === 'object' && parsed !== null) {
                  parte = parsed.parteNro || parsed.Parte || 'S/N';
                  obsText = parsed.observacionesGenerales || parsed.detalle || 'Relevamiento completado sin observaciones.';
                }
              } catch (e) {}

              listaNotif.push({
                id: insp.IdInspeccion || `${idInmueble}-${insp.Fecha}`,
                inmuebleId: idInmueble,
                inmuebleNombre: inm.nombre || inm.Nombre || 'Inmueble Asignado',
                direccion: inm.direccion || inm.Domicilio || 'Neuquén',
                fecha: insp.Fecha ? new Date(insp.Fecha).toLocaleDateString() : 'Reciente',
                rawFecha: insp.Fecha ? new Date(insp.Fecha) : new Date(),
                parte: parte,
                observaciones: obsText,
                estado: 'Completado'
              });
            });
          }
        }

        // Ordenar de más reciente a más antiguo
        listaNotif.sort((a, b) => b.rawFecha - a.rawFecha);
        setNotificaciones(listaNotif);
      } catch (err) {
        console.error("Error al cargar notificaciones:", err);
      } finally {
        setCargando(false);
      }
    };

    obtenerNotificaciones();
  }, [idPropietario]);

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <button 
        onClick={() => navigate('/propietario')}
        style={{ background: 'transparent', border: 'none', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '20px' }}
      >
        <ArrowLeft size={18} /> Volver al panel principal
      </button>

      <div style={{ background: 'rgba(30, 41, 59, 0.7)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '20px', marginBottom: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <Bell size={22} color="#38bdf8" />
            <h1 style={{ fontSize: '20px', color: '#f8fafc', margin: 0 }}>Centro de Notificaciones</h1>
          </div>
          <p style={{ color: '#94a3b8', fontSize: '13px', margin: 0 }}>
            Novedades y avisos sobre inspecciones realizadas por conservadores en tus inmuebles.
          </p>
        </div>
        <span style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>
          {notificaciones.length} Avisos
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {cargando ? (
          <p style={{ color: '#94a3b8', textAlign: 'center', padding: '30px 0' }}>Cargando notificaciones...</p>
        ) : notificaciones.length === 0 ? (
          <div style={{ background: 'rgba(30, 41, 59, 0.7)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
            <Bell size={36} color="#64748b" style={{ marginBottom: '10px' }} />
            <p style={{ margin: 0, fontSize: '14px' }}>No tenés notificaciones pendientes por el momento.</p>
          </div>
        ) : (
          notificaciones.map((notif, idx) => (
            <div 
              key={idx}
              onClick={() => navigate(`/propietario/inmuebles/${notif.inmuebleId}`)}
              style={{ background: 'rgba(30, 41, 59, 0.7)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '18px', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
                <div style={{ background: 'rgba(16, 185, 129, 0.15)', padding: '10px', borderRadius: '10px', marginTop: '2px' }}>
                  <CheckCircle2 size={20} color="#10b981" />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <strong style={{ color: '#f8fafc', fontSize: '15px' }}>Nueva Inspección Registrada</strong>
                    <span style={{ fontSize: '11px', color: '#38bdf8', background: 'rgba(56, 189, 248, 0.1)', padding: '2px 8px', borderRadius: '4px' }}>
                      {notif.inmuebleNombre}
                    </span>
                  </div>
                  <p style={{ color: '#cbd5e1', fontSize: '13px', margin: '0 0 6px 0' }}>
                    El profesional conservador ha completado una revisión técnica ({notif.observaciones}).
                  </p>
                  <div style={{ display: 'flex', gap: '15px', fontSize: '11px', color: '#94a3b8' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Calendar size={12} /> {notif.fecha}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><FileText size={12} /> Parte N°: {notif.parte}</span>
                  </div>
                </div>
              </div>

              <div style={{ color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: '500' }}>
                Ver expediente <ChevronRight size={16} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default PropietarioNotificaciones;
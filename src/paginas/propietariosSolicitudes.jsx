import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, FileText, Building2, Calendar, CheckCircle2, Clock, XCircle, ArrowLeft } from 'lucide-react';
import './conservadores.css';

function PropietarioSolicitudes() {
  const navigate = useNavigate();
  const ID_PROPIETARIO = localStorage.getItem('usuarioId') || 1;

  const [solicitudes, setSolicitudes] = useState([]);
  const [inmuebles, setInmuebles] = useState([]);
  const [cargando, setCargando] = useState(true);
  
  // Estado para el Modal de Selección de Inmueble
  const [modalAbierto, setModalAbierto] = useState(false);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setCargando(true);
        // 1. Obtener inmuebles del propietario
        const resInm = await fetch(`http://localhost:3001/api/propietario/${ID_PROPIETARIO}/inmuebles`);
        const dataInm = resInm.ok ? await resInm.json() : [];
        setInmuebles(dataInm);

        // 2. Obtener solicitudes enviadas por este propietario (o general del sistema)
        const resSol = await fetch(`http://localhost:3001/api/propietario/${ID_PROPIETARIO}/solicitudes`);
        if (resSol.ok) {
          const dataSol = await resSol.json();
          setSolicitudes(dataSol);
        } else {
          // Datos de respaldo / pruebas en caso de que la API esté pendiente
          setSolicitudes([
            { id: 1, inmuebleNombre: 'Edificio Torres del Limay', motivo: 'Cambio de titularidad y actualización de planos', estado: 'Pendiente', fecha: '05/11/2026' },
            { id: 2, inmuebleNombre: 'Galería Comercial Centro', motivo: 'Modificación en cantidad de extintores y red de agua', estado: 'Aprobada', fecha: '20/10/2026' }
          ]);
        }
      } catch (error) {
        console.error("Error al cargar solicitudes:", error);
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, [ID_PROPIETARIO]);

  return (
    <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto' }}>
      
      <button 
        onClick={() => navigate('/propietario')}
        style={{ background: 'transparent', border: 'none', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '15px' }}
      >
        <ArrowLeft size={18} /> Volver a mis inmuebles
      </button>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', flexWrap: 'wrap', gap: '15px' }}>
        <div>
          <h1 style={{ fontSize: '24px', color: '#f8fafc', margin: '0 0 4px 0' }}>Mis Solicitudes a la Municipalidad</h1>
          <p style={{ color: '#94a3b8', fontSize: '13px', margin: 0 }}>Gestioná los requerimientos y modificaciones de información de tus inmuebles.</p>
        </div>

        <button 
          onClick={() => setModalAbierto(true)}
          style={{ background: '#0284c7', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '8px', fontWeight: '600', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Plus size={16} /> Solicitar cambio / Nueva solicitud
        </button>
      </div>

      {/* LISTADO DE SOLICITUDES */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {cargando ? (
          <p style={{ color: '#94a3b8', textAlign: 'center', padding: '30px' }}>Cargando solicitudes...</p>
        ) : solicitudes.length === 0 ? (
          <div style={{ background: 'rgba(30, 41, 59, 0.7)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
            No realizaste ninguna solicitud todavía.
          </div>
        ) : (
          solicitudes.map((sol, index) => {
            const esAprobada = sol.estado === 'Aprobada' || sol.estado === 'Aceptada';
            const esPendiente = sol.estado === 'Pendiente';

            return (
              <div 
                key={index}
                style={{ background: 'rgba(30, 41, 59, 0.7)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}
              >
                <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start', flex: 1, minWidth: '280px' }}>
                  <div style={{ background: 'rgba(56, 189, 248, 0.1)', padding: '10px', borderRadius: '10px', color: '#38bdf8' }}>
                    <FileText size={20} />
                  </div>
                  <div>
                    <strong style={{ color: '#f8fafc', fontSize: '15px', display: 'block', marginBottom: '2px' }}>{sol.inmuebleNombre || sol.NombreInmueble}</strong>
                    <p style={{ color: '#cbd5e1', fontSize: '13px', margin: '0 0 6px 0' }}>{sol.motivo || sol.Motivo}</p>
                    <span style={{ fontSize: '11px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={12} /> Fecha de envío: {sol.fecha || 'Reciente'}
                    </span>
                  </div>
                </div>

                <div>
                  <span style={{ 
                    fontSize: '12px', 
                    fontWeight: '600', 
                    padding: '6px 14px', 
                    borderRadius: '12px',
                    background: esAprobada ? 'rgba(16, 185, 129, 0.2)' : esPendiente ? 'rgba(245, 158, 11, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                    color: esAprobada ? '#10b981' : esPendiente ? '#f59e0b' : '#ef4444',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    width: 'fit-content'
                  }}>
                    {esAprobada && <CheckCircle2 size={14} />}
                    {esPendiente && <Clock size={14} />}
                    {!esAprobada && !esPendiente && <XCircle size={14} />}
                    {sol.estado}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* MODAL PARA SELECCIONAR INMUEBLE ANTES DE IR AL FORMULARIO */}
      {modalAbierto && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(15, 23, 42, 0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000, padding: '20px' }}>
          <div style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '25px', width: '100%', maxWidth: '450px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>
            <h3 style={{ color: '#f8fafc', margin: '0 0 8px 0', fontSize: '18px' }}>Seleccionar Inmueble</h3>
            <p style={{ color: '#94a3b8', fontSize: '13px', margin: '0 0 20px 0' }}>Elegí sobre qué inmueble deseás solicitar un cambio de información.</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '250px', overflowY: 'auto', marginBottom: '20px' }}>
              {inmuebles.map(inm => {
                const idInm = inm.IdInmueble || inm.id;
                const nombreInm = inm.Nombre || inm.nombre;
                const domicilioInm = inm.Domicilio || inm.domicilio;

                return (
                  <div 
                    key={idInm}
                    onClick={() => {
                      setModalAbierto(false);
                      navigate(`/propietario/solicitud/nuevo/${idInm}`);
                    }}
                    style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', transition: 'border-color 0.2s' }}
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = '#38bdf8'}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
                  >
                    <Building2 size={20} color="#38bdf8" />
                    <div>
                      <strong style={{ color: '#f8fafc', fontSize: '14px', display: 'block' }}>{nombreInm}</strong>
                      <span style={{ color: '#94a3b8', fontSize: '12px' }}>{domicilioInm}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ textAlign: 'right' }}>
              <button 
                onClick={() => setModalAbierto(false)}
                style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#cbd5e1', padding: '8px 16px', borderRadius: '6px', fontSize: '13px', cursor: 'pointer' }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default PropietarioSolicitudes;
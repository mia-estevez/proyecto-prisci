import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, AlertCircle, Download } from 'lucide-react';
import './clientes.css';

function PropietariosHistorial() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [inspecciones, setInspecciones] = useState([]);

  useEffect(() => {
    // Datos simulados de inspecciones del inmueble para el propietario
    setInspecciones([
      { fecha: '2026-10-09', parte: 'PR-2026-8728', desc: 'Revisión mensual de extintores y mangueras OK.', estado: 'ok' },
      { fecha: '2026-10-09', parte: 'PR-2026-3666', desc: 'Relevamiento completado con observaciones menores.', estado: 'alert' },
      { fecha: '2026-10-09', parte: 'PR-2026-4239', desc: 'Prueba de presión de red de incendio satisfactoria.', estado: 'ok' },
      { fecha: '2024-03-15', parte: 'S/N', desc: 'Sin observaciones en la prueba de presión.', estado: 'ok' }
    ]);
  }, [id]);

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <button 
        onClick={() => navigate(`/propietario/inmuebles/${id}`)}
        style={{ background: 'transparent', border: 'none', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '20px' }}
      >
        <ArrowLeft size={18} /> Volver a la ficha del inmueble
      </button>

      <div style={{ background: 'rgba(30, 41, 59, 0.7)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '20px', color: '#f8fafc', margin: '0 0 4px 0' }}>Historial completo de inspecciones</h1>
        <p style={{ color: '#94a3b8', fontSize: '13px', margin: 0 }}>Registro detallado y actas emitidas para este inmueble.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {inspecciones.map((insp, index) => (
          <div key={index} style={{ background: 'rgba(30, 41, 59, 0.7)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <div style={{ marginTop: '2px' }}>
                {insp.estado === 'ok' ? <CheckCircle2 size={18} color="#10b981" /> : <AlertCircle size={18} color="#ef4444" />}
              </div>
              <div>
                <strong style={{ color: '#f8fafc', fontSize: '14px', display: 'block', marginBottom: '2px' }}>
                  Fecha: {insp.fecha} — Parte N°: {insp.parte}
                </strong>
                <p style={{ color: '#94a3b8', fontSize: '12px', margin: 0 }}>{insp.desc}</p>
              </div>
            </div>
            <button style={{ background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.2)', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
              Descargar <Download size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PropietariosHistorial;
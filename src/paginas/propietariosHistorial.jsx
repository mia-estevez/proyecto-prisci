import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Download } from 'lucide-react';
import './clientes.css';

function PropietariosHistorial() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [inspecciones, setInspecciones] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const obtenerHistorialReal = async () => {
      try {
        setCargando(true);
        const res = await fetch(`http://localhost:3001/api/inmuebles/${id}/inspecciones`);
        if (res.ok) {
          setInspecciones(await res.json());
        }
      } catch (err) {
        console.error("Error al cargar historial:", err);
      } finally {
        setCargando(false);
      }
    };
    obtenerHistorialReal();
  }, [id]);

  const obtenerTextoDetalle = (item) => {
    const raw = item.Detalle || item.detalle || item.Observaciones || '';
    try {
      const parsed = JSON.parse(raw);
      if (typeof parsed === 'object' && parsed !== null) {
        return `Parte N°: ${parsed.parteNro || 'S/N'} — ${parsed.observacionesGenerales || 'Relevamiento completado.'}`;
      }
    } catch (e) {}
    return raw || 'Inspección técnica registrada.';
  };

  const handleDescargarInspeccion = (insp) => {
    const texto = obtenerTextoDetalle(insp);
    const fecha = insp.Fecha ? new Date(insp.Fecha).toLocaleDateString() : 'Fecha reciente';
    
    const contenido = `INFORME DE INSPECCIÓN - PRISCI\nFecha: ${fecha}\nDetalle: ${texto}\nEstado: REGISTRADO`;
    const blob = new Blob([contenido], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Inspeccion_Inmueble_${id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
        {cargando ? (
          <p style={{ color: '#94a3b8', textAlign: 'center' }}>Cargando historial...</p>
        ) : inspecciones.length === 0 ? (
          <p style={{ color: '#94a3b8', textAlign: 'center' }}>No hay inspecciones registradas.</p>
        ) : (
          inspecciones.map((insp, index) => (
            <div key={index} style={{ background: 'rgba(30, 41, 59, 0.7)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{ marginTop: '2px' }}>
                  <CheckCircle2 size={18} color="#10b981" />
                </div>
                <div>
                  <strong style={{ color: '#f8fafc', fontSize: '14px', display: 'block', marginBottom: '2px' }}>
                    Fecha: {insp.Fecha ? new Date(insp.Fecha).toLocaleDateString() : 'Reciente'}
                  </strong>
                  <p style={{ color: '#94a3b8', fontSize: '12px', margin: 0 }}>{obtenerTextoDetalle(insp)}</p>
                </div>
              </div>
              <button 
                onClick={() => handleDescargarInspeccion(insp)}
                style={{ background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.2)', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                Descargar <Download size={14} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default PropietariosHistorial;
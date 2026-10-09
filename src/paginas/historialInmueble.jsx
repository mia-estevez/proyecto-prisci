import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, FileText, Download, CheckCircle, AlertCircle, X, ShieldCheck, Paperclip, ExternalLink, Shield 
} from 'lucide-react';
import './clientes.css'; // Reutilizamos los estilos modernos de la plataforma

function HistorialInmueble() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [inmueble, setInmueble] = useState(null);
  const [inspecciones, setInspecciones] = useState([]);
  const [inspeccionSeleccionada, setInspeccionSeleccionada] = useState(null);
  const [cargando, setCargando] = useState(true);

  const DIRECCIONES_OFICIALES = {
    1: { nombre: 'Edificio Torres del Limay', domicilio: 'Av. Argentina 1234, Neuquén', tipo: 'Comercial' },
    2: { nombre: 'Galería Comercial Centro', domicilio: 'Gral. Las Heras 450, Neuquén', tipo: 'Residencial' }
  };

  useEffect(() => {
    const inmuebleId = id || 1;
    const idNum = Number(inmuebleId);
    const oficial = DIRECCIONES_OFICIALES[idNum] || DIRECCIONES_OFICIALES[1];

    // Recuperamos las inspecciones guardadas en localStorage para este inmueble
    const inspeccionesGuardadas = JSON.parse(localStorage.getItem(`inspecciones_inmueble_${idNum}`) || '[]');

    fetch(`http://localhost:3001/api/inmuebles/${inmuebleId}`)
      .then(res => res.json())
      .then(data => {
        setInmueble({
          ...data,
          Nombre: oficial.nombre,
          Domicilio: oficial.domicilio,
          Actividad: oficial.tipo
        });
        setInspecciones(inspeccionesGuardadas.length > 0 ? inspeccionesGuardadas : (data.inspecciones || []));
        setCargando(false);
      })
      .catch(err => {
        setInmueble({
          IdInmueble: idNum,
          Nombre: oficial.nombre,
          Domicilio: oficial.domicilio,
          Actividad: oficial.tipo
        });
        setInspecciones(inspeccionesGuardadas);
        setCargando(false);
      });
  }, [id]);

  const handleDescargarInspeccionPDF = (insp) => {
    const detalleRelevamiento = insp.relevamiento 
      ? Object.entries(insp.relevamiento).map(([k, v]) => `• ${k.toUpperCase()}: ${v.estado} ${v.obs ? `[Obs: ${v.obs}]` : ''}`).join('\n')
      : 'Sin detalle de relevamiento registrado.';

    const contenidoReporte = `ACTA DE INSPECCIÓN TÉCNICA - SEGURIDAD CONTRA INCENDIOS
==================================================
Fecha: ${insp.fecha || '09/10/2026'}
Parte N°: ${insp.parteNro || 'S/N'}
Inmueble: ${inmueble?.Nombre}
Domicilio: ${inmueble?.Domicilio}
Resultado: ${insp.resultado || 'Aprobado'}

RELEVAMIENTO GENERAL:
${detalleRelevamiento}

OBSERVACIONES GENERALES:
${insp.observaciones || 'Sin observaciones.'}
==================================================`;

    const blob = new Blob([contenidoReporte], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Inspeccion_${insp.parteNro || 'Reporte'}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (cargando) {
    return (
      <div className="clientes-page-container flex-center">
        <p className="loading-text">Cargando historial de inspecciones...</p>
      </div>
    );
  }

  return (
    <div className="clientes-page-container" style={{ padding: '30px' }}>

      {/* BREADCRUMB */}
      <div className="breadcrumb-bar" style={{ marginBottom: '20px' }}>
        <button className="btn-back-link" onClick={() => navigate(`/clientes/${id || 1}`)}>
          <ArrowLeft size={16} /> Volver al expediente ({inmueble?.Nombre})
        </button>
      </div>

      <header className="ficha-header" style={{ marginBottom: '25px' }}>
        <div className="title-group">
          <h1>Historial completo de inspecciones</h1>
          <p style={{ color: '#94a3b8', marginTop: '5px' }}>{inmueble?.Nombre} — {inmueble?.Domicilio}</p>
        </div>
      </header>

      {/* LISTADO COMPLETO */}
      <div className="card-panel" style={{ width: '100%', padding: '24px' }}>
        <h3 style={{ marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>
          Inspecciones registradas ({inspecciones.length})
        </h3>

        {inspecciones.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {inspecciones.map((insp, index) => (
              <div 
                key={index} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between', 
                  padding: '16px', 
                  background: 'rgba(255, 255, 255, 0.03)', 
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.06)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  {(insp.resultado || insp.Resultado) === 'Aprobado' ? (
                    <CheckCircle size={24} className="green-icon" />
                  ) : (
                    <AlertCircle size={24} className="red-icon" />
                  )}
                  <div>
                    <strong style={{ fontSize: '15px', color: '#f8fafc' }}>
                      Fecha: {insp.fecha} — Parte N°: {insp.parteNro || 'S/N'}
                    </strong>
                    <p style={{ color: '#94a3b8', fontSize: '13px', margin: '4px 0 0 0' }}>
                      {insp.observaciones || 'Sin observaciones generales.'}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button 
                    className="btn-action-view" 
                    style={{ padding: '6px 14px', background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', border: '1px solid #38bdf8', borderRadius: '6px', cursor: 'pointer' }}
                    onClick={() => setInspeccionSeleccionada(insp)}
                  >
                    Ver detalle
                  </button>
                  <button 
                    className="icon-btn-download" 
                    style={{ padding: '6px 12px', background: '#38bdf8', color: '#0f172a', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '500' }}
                    onClick={() => handleDescargarInspeccionPDF(insp)}
                  >
                    <Download size={16} /> Descargar
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: '#94a3b8', textAlign: 'center', padding: '40px 0' }}>No hay inspecciones registradas para este inmueble.</p>
        )}
      </div>

      {/* MODAL DETALLE */}
      {inspeccionSeleccionada && (
        <div className="modal-overlay" onClick={() => setInspeccionSeleccionada(null)}>
          <div className="modal-card-content modal-large" onClick={(e) => e.stopPropagation()}>
            <header className="modal-header">
              <div className="modal-header-title">
                <ShieldCheck size={20} color="#38bdf8" />
                <h3>Inspección del {inspeccionSeleccionada.fecha} (Parte N°: {inspeccionSeleccionada.parteNro || 'S/N'})</h3>
              </div>
              <button className="btn-close-modal" onClick={() => setInspeccionSeleccionada(null)}><X size={18} /></button>
            </header>
            
            <div className="modal-body modal-scrollable">
              <div className="modal-info-row">
                <span>Resultado:</span>
                <span className={`status-badge ${(inspeccionSeleccionada.resultado || '').includes('Aprobado') ? 'badge-ok' : 'badge-alert'}`}>
                  {inspeccionSeleccionada.resultado || 'Aprobado'}
                </span>
              </div>

              <div className="modal-info-block">
                <strong>Observaciones generales:</strong>
                <p>{inspeccionSeleccionada.observaciones || 'Sin observaciones.'}</p>
              </div>

              <div className="modal-info-block">
                <strong>Archivos adjuntos en esta inspección:</strong>
                {inspeccionSeleccionada.archivosAdjuntos && inspeccionSeleccionada.archivosAdjuntos.length > 0 ? (
                  <div className="modal-files-list">
                    {inspeccionSeleccionada.archivosAdjuntos.map((file, i) => (
                      <a key={i} href={file.url} target="_blank" rel="noopener noreferrer" className="modal-file-pill">
                        <Paperclip size={14} />
                        <span>{file.nombre}</span>
                        <ExternalLink size={12} />
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted">No se adjuntaron archivos en esta inspección.</p>
                )}
              </div>

              <div className="modal-info-row firmas-status-row">
                <span>Firmas registradas:</span>
                <div>
                  <span className={`badge-firma ${inspeccionSeleccionada.tieneFirmaCliente ? 'ok' : 'no'}`}>
                    Cliente: {inspeccionSeleccionada.tieneFirmaCliente ? 'Firmado ✓' : 'Pendiente'}
                  </span>
                  <span className={`badge-firma ${inspeccionSeleccionada.tieneFirmaProf ? 'ok' : 'no'}`}>
                    Profesional: {inspeccionSeleccionada.tieneFirmaProf ? 'Firmado ✓' : 'Pendiente'}
                  </span>
                </div>
              </div>
            </div>

            <footer className="modal-footer">
              <button className="btn-secondary" onClick={() => handleDescargarInspeccionPDF(inspeccionSeleccionada)}>
                <Download size={16} /> Descargar reporte en texto
              </button>
              <button className="btn-secondary" onClick={() => setInspeccionSeleccionada(null)}>Cerrar</button>
            </footer>
          </div>
        </div>
      )}

    </div>
  );
}

export default HistorialInmueble;
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Download, 
  CheckCircle, 
  AlertCircle, 
  Plus, 
  ArrowLeft,
  Flame,
  Shield,
  Building2,
  Bell,
  X,
  ShieldCheck,
  Paperclip,
  ExternalLink
} from 'lucide-react';
import './clientes.css';

function Clientes() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [inspeccionSeleccionada, setInspeccionSeleccionada] = useState(null);
  const [inmueble, setInmueble] = useState(null);
  const [cargando, setCargando] = useState(true);

  const DIRECCIONES_OFICIALES = {
    1: { nombre: 'Edificio Torres del Limay', domicilio: 'Av. Argentina 1234, Neuquén', tipo: 'Comercial', superficie: '1.250' },
    2: { nombre: 'Galería Comercial Centro', domicilio: 'Gral. Las Heras 450, Neuquén', tipo: 'Residencial', superficie: '1.200' }
  };

  useEffect(() => {
    const inmuebleId = id || 1;
    const idNum = Number(inmuebleId);
    const oficial = DIRECCIONES_OFICIALES[idNum] || DIRECCIONES_OFICIALES[1];

    const inspeccionesGuardadas = JSON.parse(localStorage.getItem(`inspecciones_inmueble_${idNum}`) || '[]');

    fetch(`http://localhost:3001/api/inmuebles/${inmuebleId}`)
      .then(res => res.json())
      .then(data => {
        setInmueble({
          ...data,
          Nombre: oficial.nombre,
          Domicilio: oficial.domicilio,
          Actividad: oficial.tipo,
          Superficie: oficial.superficie,
          inspecciones: inspeccionesGuardadas.length > 0 ? inspeccionesGuardadas : (data.inspecciones || [])
        });
        setCargando(false);
      })
      .catch(err => {
        setInmueble({
          IdInmueble: idNum,
          Nombre: oficial.nombre,
          Domicilio: oficial.domicilio,
          Actividad: oficial.tipo,
          Superficie: oficial.superficie,
          nombrePropietario: 'Juan',
          apellidoPropietario: 'Pérez',
          inspecciones: inspeccionesGuardadas
        });
        setCargando(false);
      });
  }, [id]);

  const handleVerDocumento = (tipo) => {
    alert(`Visualizando ${tipo} para ${inmueble?.Nombre}.`);
  };

  // DESCARGAR REPORTE COMPLETO EN FORMATO DE TEXTO FORMAL (.TXT)
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

FIRMAS REGISTRADAS:
- Cliente: ${insp.tieneFirmaCliente ? 'Firmado (OK)' : 'Pendiente'}
- Profesional: ${insp.tieneFirmaProf ? 'Firmado (OK)' : 'Pendiente'}
==================================================`;

    // Creamos el archivo con extensión .txt para que el sistema operativo lo abra sin problemas
    const blob = new Blob([contenidoReporte], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Inspeccion_${insp.parteNro || 'Reporte'}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDescargarDocumento = (nombreArchivo) => {
    const blob = new Blob([`Documento oficial: ${nombreArchivo}`], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${nombreArchivo}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (cargando) {
    return (
      <div className="clientes-page-container flex-center">
        <p className="loading-text">Cargando expediente técnico del inmueble...</p>
      </div>
    );
  }

  const ultimaInspeccion = inmueble?.inspecciones && inmueble.inspecciones.length > 0 
    ? inmueble.inspecciones[0] 
    : { 
        fecha: '09/10/2026', 
        parteNro: 'PR-2026-4239',
        resultado: 'Aprobado', 
        observaciones: 'Revisión mensual de extintores y mangueras OK',
        archivosAdjuntos: []
      };

  return (
    <div className="clientes-page-container">

      <div className="breadcrumb-bar">
        <button className="btn-back-link" onClick={() => navigate('/conservadores')}>
          <ArrowLeft size={16} /> Mapa de inmuebles
        </button>
        <span className="separator">›</span>
        <strong className="current-page">{inmueble?.Nombre}</strong>
      </div>

      <header className="ficha-header">
        <div className="title-group">
          <h1>{inmueble?.Nombre}</h1>
          <span className="badge-registrado">Registrado</span>
        </div>
      </header>

      <div className="ficha-original-grid">

        <div className="card-panel photo-card-area">
          <img 
            src="/edificio-real.jpg" 
            alt={inmueble?.Nombre} 
            className="building-img"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80';
            }}
          />
        </div>

        <div className="card-panel info-card-area">
          <h3>Información del inmueble</h3>
          <div className="info-group"><label>Dirección</label><p>{inmueble?.Domicilio}</p></div>
          <div className="info-group"><label>Tipo de inmueble</label><p>{inmueble?.Actividad}</p></div>
          <div className="info-group"><label>Titular / Consorcio</label><p>Juan Pérez</p></div>
          <div className="info-group"><label>Superficie</label><p>{inmueble?.Superficie} m²</p></div>
          <div className="info-group"><label>Año de construcción</label><p>2018</p></div>
          <div className="info-group"><label>Estado</label><div><span className="badge-activo">Activo</span></div></div>
        </div>

        <div className="card-panel docs-card-area">
          <h3>Documentación</h3>
          <div className="docs-list">
            <div className="doc-row">
              <div className="doc-info"><FileText size={18} className="doc-icon" /><span>Plano habilitado (PDF)</span></div>
              <div className="doc-actions-text">
                <button className="btn-action-view" onClick={() => handleVerDocumento('Plano')}>Ver</button>
                <button className="icon-btn-download" onClick={() => handleDescargarDocumento('Plano_Habilitado')}><Download size={16} /></button>
              </div>
            </div>

            <div className="doc-row">
              <div className="doc-info"><FileText size={18} className="doc-icon" /><span>Certificado de instalaciones</span></div>
              <div className="doc-actions-text">
                <button className="btn-action-view" onClick={() => handleVerDocumento('Certificado')}>Ver</button>
                <button className="icon-btn-download" onClick={() => handleDescargarDocumento('Certificado_Instalaciones')}><Download size={16} /></button>
              </div>
            </div>

            <div className="doc-row">
              <div className="doc-info"><FileText size={18} className="doc-icon" /><span>Última inspección ({ultimaInspeccion.fecha})</span></div>
              <div className="doc-actions-text">
                <button className="btn-action-view" onClick={() => setInspeccionSeleccionada(ultimaInspeccion)}>Ver</button>
                <button className="icon-btn-download" title="Descargar PDF" onClick={() => handleDescargarInspeccionPDF(ultimaInspeccion)}><Download size={16} /></button>
              </div>
            </div>
          </div>
        </div>

        <div className="col-right-stack">
          <div className="card-panel services-panel">
            <h3>Servicios asociados</h3>
            <div className="services-status-list">
              <div className="service-status-item"><div className="service-name"><Flame size={16} className="item-icon" /><span>Extintores</span></div><span className="badge-vigente">Vigente</span></div>
              <div className="service-status-item"><div className="service-name"><Shield size={16} className="item-icon" /><span>Red de incendio</span></div><span className="badge-vigente">Vigente</span></div>
              <div className="service-status-item"><div className="service-name"><Bell size={16} className="item-icon" /><span>Detección de humo</span></div><span className="badge-vigente">Vigente</span></div>
              <div className="service-status-item"><div className="service-name"><Building2 size={16} className="item-icon" /><span>Iluminación de emergencia</span></div><span className="badge-vigente">Vigente</span></div>
              <div className="service-status-item"><div className="service-name"><FileText size={16} className="item-icon" /><span>Señalización</span></div><span className="badge-vigente">Vigente</span></div>
            </div>
          </div>

          <div className="card-panel history-panel">
            <div className="panel-header-between">
              <h3>Historial de inspecciones</h3>
              <button className="link-action" onClick={() => navigate('/historial')}>Ver todos</button>
            </div>

            <div className="history-items-list">
              {inmueble?.inspecciones && inmueble.inspecciones.length > 0 ? (
                inmueble.inspecciones.map((insp, index) => (
                  <div key={index} className="history-item">
                    <div className="status-indicator">
                      {(insp.resultado || insp.Resultado) === 'Aprobado' ? (
                        <CheckCircle size={18} className="green-icon" />
                      ) : (
                        <AlertCircle size={18} className="red-icon" />
                      )}
                    </div>
                    <div className="history-data">
                      <strong>{insp.fecha}</strong>
                      <p>{insp.observaciones || 'Sin observaciones'}</p>
                    </div>
                    <button className="btn-link-view" onClick={() => setInspeccionSeleccionada(insp)}>Ver</button>
                  </div>
                ))
              ) : (
                <div className="history-item">
                  <CheckCircle size={18} className="green-icon" />
                  <div className="history-data">
                    <strong>09/10/2026</strong>
                    <p>Revisión mensual OK</p>
                  </div>
                  <button className="btn-link-view" onClick={() => setInspeccionSeleccionada({ fecha: '09/10/2026', resultado: 'Aprobado', observaciones: 'Revisión OK' })}>Ver</button>
                </div>
              )}
            </div>

            <button className="btn-primary-blue" onClick={() => navigate(`/inspecciones/${inmueble?.IdInmueble || id || 1}`)}>
              <Plus size={18} /> Cargar inspección
            </button>
          </div>
        </div>

      </div>

      {/* MODAL PARA VER DETALLES Y ABRIR ARCHIVOS ADJUNTOS REALES */}
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

              {/* ARCHIVOS ADJUNTOS CON APERTURA REAL */}
              <div className="modal-info-block">
                <strong>Archivos adjuntos en esta inspección:</strong>
                {inspeccionSeleccionada.archivosAdjuntos && inspeccionSeleccionada.archivosAdjuntos.length > 0 ? (
                  <div className="modal-files-list">
                    {inspeccionSeleccionada.archivosAdjuntos.map((file, i) => (
                      <a 
                        key={i} 
                        href={file.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="modal-file-pill"
                      >
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
                <Download size={16} /> Descargar reporte en PDF
              </button>
              <button className="btn-secondary" onClick={() => setInspeccionSeleccionada(null)}>Cerrar</button>
            </footer>
          </div>
        </div>
      )}

    </div>
  );
}

export default Clientes;
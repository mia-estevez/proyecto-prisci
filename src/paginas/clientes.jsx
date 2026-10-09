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
  ExternalLink,
  Edit,
  Trash2
} from 'lucide-react';
import { dispararNotificacionConservador } from '../utils/notificacionesHelper';
import './clientes.css';


function prepararInspeccion(insp) {
  let detalles = {};

  try {
    detalles =
      typeof insp.Observaciones === "string"
        ? JSON.parse(insp.Observaciones)
        : insp.Observaciones || {};
  } catch {
    detalles = {
      observacionesGenerales: insp.Observaciones || "",
    };
  }

  return {
    ...insp,
    fecha:
      insp.fecha ||
      insp.fechaFormat ||
      insp.Fecha ||
      "",
    resultado:
      insp.resultado ||
      insp.Resultado ||
      "Sin resultado",
    parteNro:
      insp.parteNro ||
      detalles.parteNro ||
      "S/N",
    observaciones:
      insp.observaciones ||
      detalles.observacionesGenerales ||
      "",
    relevamiento:
      insp.relevamiento ||
      detalles.relevamiento ||
      {},
    archivosAdjuntos:
      insp.archivosAdjuntos ||
      detalles.archivosAdjuntos ||
      [],
    tieneFirmaCliente:
      insp.tieneFirmaCliente ??
      Boolean(detalles.tieneFirmaCliente),
    tieneFirmaProf:
      insp.tieneFirmaProf ??
      Boolean(detalles.tieneFirmaProf),
  };
}


function Clientes() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [inspeccionSeleccionada, setInspeccionSeleccionada] = useState(null);
  const [inmueble, setInmueble] = useState(null);
  const [borradores, setBorradores] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const inmuebleId = id || 1;
    const idNum = Number(inmuebleId);
    
    const DIRECCIONES_OFICIALES = {
      1: { nombre: 'Edificio Torres del Limay', domicilio: 'Av. Argentina 1234, Neuquén', tipo: 'Comercial', superficie: '1.250', estado: 'Activo' },
      2: { nombre: 'Galería Comercial Centro', domicilio: 'Gral. Las Heras 450, Neuquén', tipo: 'Residencial', superficie: '1.200', estado: 'Inactivo' }
    };
    const oficial = DIRECCIONES_OFICIALES[idNum] || DIRECCIONES_OFICIALES[1];

    const estadosGuardados = JSON.parse(localStorage.getItem('estados_inmuebles') || '{}');
    if (!estadosGuardados[idNum]) {
      estadosGuardados[idNum] = oficial.estado;
      localStorage.setItem('estados_inmuebles', JSON.stringify(estadosGuardados));
    }
    const estadoActual = estadosGuardados[idNum];

    const inspeccionesGuardadas = JSON.parse(localStorage.getItem(`inspecciones_inmueble_${idNum}`) || '[]');
    const borradoresGuardados = JSON.parse(localStorage.getItem(`borradores_inmueble_${idNum}`) || '[]');
    setBorradores(borradoresGuardados);

    fetch(`http://localhost:3001/api/inmuebles/${inmuebleId}`)
      .then(res => res.json())
      .then(data => {
        setInmueble({
          ...data,
          Nombre: oficial.nombre,
          Domicilio: oficial.domicilio,
          Actividad: oficial.tipo,
          Superficie: oficial.superficie,
          Estado: estadoActual,
          inspecciones: (data.inspecciones || []).map(prepararInspeccion)
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
          Estado: estadoActual,
          nombrePropietario: 'Juan',
          apellidoPropietario: 'Pérez',
          inspecciones: []
        });
        setCargando(false);
      });
  }, [id]);

  const handleBorrarBorrador = (indexAEliminar, e) => {
    e.stopPropagation();
    if (window.confirm('¿Estás seguro de que deseas eliminar este borrador?')) {
      const idNum = Number(id || 1);
      const nuevosBorradores = borradores.filter((_, i) => i !== indexAEliminar);
      setBorradores(nuevosBorradores);
      localStorage.setItem(`borradores_inmueble_${idNum}`, JSON.stringify(nuevosBorradores));

      // DISPARAR NOTIFICACIÓN AUTOMÁTICA AL ELIMINAR BORRADOR
      dispararNotificacionConservador(
        'Borrador Eliminado',
        `Se eliminó un borrador de inspección para ${inmueble?.Nombre}.`,
        'alerta',
        idNum
      );
    }
  };

  const handleVerDocumento = (tipo) => {
    alert(`Visualizando ${tipo} para ${inmueble?.Nombre}.`);
  };

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

  const handleDescargarDocumento = (nombreArchivo) => {
    const blob = new Blob([`Documento oficial: ${nombreArchivo}`], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${nombreArchivo}.txt`;
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

      {/* GRILLA DE 3 COLUMNAS NIVELADAS */}
      <div style={{ display: 'grid', gridTemplateColumns: '300px 1.3fr 1fr', gap: '20px', alignItems: 'stretch' }}>

        {/* 1. PRIMERA COLUMNA */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%' }}>
          <div className="card-panel photo-card-area" style={{ margin: 0, flex: 1, display: 'flex' }}>
            <img 
              src="/edificio-real.jpg" 
              alt={inmueble?.Nombre} 
              className="building-img"
              style={{ objectFit: 'cover', width: '100%', height: '100%', minHeight: '380px' }}
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80';
              }}
            />
          </div>

          <div className="card-panel services-panel" style={{ margin: 0 }}>
            <h3>Servicios asociados</h3>
            <div className="services-status-list">
              <div className="service-status-item"><div className="service-name"><Flame size={16} className="item-icon" /><span>Extintores</span></div><span className="badge-vigente">Vigente</span></div>
              <div className="service-status-item"><div className="service-name"><Shield size={16} className="item-icon" /><span>Red de incendio</span></div><span className="badge-vigente">Vigente</span></div>
              <div className="service-status-item"><div className="service-name"><Bell size={16} className="item-icon" /><span>Detección de humo</span></div><span className="badge-vigente">Vigente</span></div>
              <div className="service-status-item"><div className="service-name"><Building2 size={16} className="item-icon" /><span>Iluminación de emergencia</span></div><span className="badge-vigente">Vigente</span></div>
              <div className="service-status-item"><div className="service-name"><FileText size={16} className="item-icon" /><span>Señalización</span></div><span className="badge-vigente">Vigente</span></div>
            </div>
          </div>
        </div>

        {/* 2. SEGUNDA COLUMNA */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%' }}>
          <div className="card-panel info-card-area" style={{ margin: 0, width: '100%' }}>
            <h3>Información del inmueble</h3>
            <div className="info-group"><label>Dirección</label><p>{inmueble?.Domicilio}</p></div>
            <div className="info-group"><label>Tipo de inmueble</label><p>{inmueble?.Actividad}</p></div>
            <div className="info-group"><label>Titular / Consorcio</label><p>Juan Pérez</p></div>
            <div className="info-group"><label>Superficie</label><p>{inmueble?.Superficie} m²</p></div>
            <div className="info-group"><label>Año de construcción</label><p>2018</p></div>
            <div className="info-group">
              <label>Estado</label>
              <div>
                <span style={{ 
                  padding: '2px 10px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: '600',
                  backgroundColor: inmueble?.Estado === 'Activo' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(148, 163, 184, 0.15)',
                  color: inmueble?.Estado === 'Activo' ? '#4ade80' : '#94a3b8',
                  border: `1px solid ${inmueble?.Estado === 'Activo' ? 'rgba(34, 197, 94, 0.3)' : 'rgba(148, 163, 184, 0.3)'}`
                }}>
                  {inmueble?.Estado || 'Activo'}
                </span>
              </div>
            </div>
          </div>

          <div className="card-panel docs-card-area" style={{ margin: 0, width: '100%', flex: 1 }}>
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
                  <button className="icon-btn-download" title="Descargar Reporte" onClick={() => handleDescargarInspeccionPDF(ultimaInspeccion)}><Download size={16} /></button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. TERCERA COLUMNA */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%' }}>
          {borradores.length > 0 && (
            <div className="card-panel history-panel" style={{ margin: 0, border: '1px dashed #38bdf8', width: '100%' }}>
              <div className="panel-header-between">
                <h3 style={{ color: '#38bdf8' }}>Borradores guardados ({borradores.length})</h3>
              </div>
              <div className="history-items-list">
                {borradores.map((borrador, index) => (
                  <div key={index} className="history-item" style={{ background: 'rgba(56, 189, 248, 0.05)' }}>
                    <div className="status-indicator"><Edit size={18} color="#38bdf8" /></div>
                    <div className="history-data">
                      <strong>{borrador.fecha} (Parte: {borrador.parteNro})</strong>
                      <p>{borrador.observaciones || 'Borrador sin observaciones'}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      <button className="btn-link-view" style={{ color: '#38bdf8' }} onClick={() => navigate(`/inspecciones/${inmueble?.IdInmueble || id || 1}?borrador=${index}`)}>Continuar</button>
                      <button title="Eliminar borrador" style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#ef4444', padding: '4px' }} onClick={(e) => handleBorrarBorrador(index, e)}><Trash2 size={16} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="card-panel history-panel" style={{ margin: 0, width: '100%', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div className="panel-header-between">
                <h3>Historial de inspecciones</h3>
                <button className="link-action" onClick={() => navigate(`/historial-inmueble/${inmueble?.IdInmueble || id || 1}`)}>Ver todos</button>
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
            </div>

            <button className="btn-primary-blue" style={{ marginTop: '15px' }} onClick={() => navigate(`/inspecciones/${inmueble?.IdInmueble || id || 1}`)}>
              <Plus size={18} /> Cargar inspección
            </button>
          </div>
        </div>

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

export default Clientes;
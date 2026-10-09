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
  ShieldCheck
} from 'lucide-react';
import './clientes.css';

function Clientes() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [inspeccionSeleccionada, setInspeccionSeleccionada] = useState(null);
  const [inmueble, setInmueble] = useState(null);
  const [cargando, setCargando] = useState(true);

  // DICCIONARIO OFICIAL UNIFICADO CON LAS DIRECCIONES REALES DE NEUQUÉN
  const DIRECCIONES_OFICIALES = {
    1: { nombre: 'Edificio Torres del Limay', domicilio: 'Av. Argentina 1234, Neuquén', tipo: 'Comercial', superficie: '1.250' },
    2: { nombre: 'Galería Comercial Centro', domicilio: 'Gral. Las Heras 450, Neuquén', tipo: 'Residencial', superficie: '1.200' }
  };

  useEffect(() => {
    const inmuebleId = id || 1;
    fetch(`http://localhost:3001/api/inmuebles/${inmuebleId}`)
      .then(res => res.json())
      .then(data => {
        // Combinamos los datos del backend con la dirección oficial unificada para evitar desfasajes
        const datosOficiales = DIRECCIONES_OFICIALES[Number(inmuebleId)] || {};
        setInmueble({
          ...data,
          Nombre: datosOficiales.nombre || data.Nombre || data.nombre,
          Domicilio: datosOficiales.domicilio || data.Domicilio || data.domicilio,
          Actividad: datosOficiales.tipo || data.Actividad || data.actividad,
          Superficie: datosOficiales.superficie || data.Superficie || data.superficie
        });
        setCargando(false);
      })
      .catch(err => {
        console.error("Error al obtener expediente:", err);
        // Respaldo inmediato si falla la API
        const idNum = Number(inmuebleId);
        const respaldo = DIRECCIONES_OFICIALES[idNum] || DIRECCIONES_OFICIALES[1];
        setInmueble({
          IdInmueble: idNum,
          Nombre: respaldo.nombre,
          Domicilio: respaldo.domicilio,
          Actividad: respaldo.tipo,
          Superficie: respaldo.superficie,
          nombrePropietario: 'Juan',
          apellidoPropietario: 'Pérez'
        });
        setCargando(false);
      });
  }, [id]);

  // FUNCIONES PARA VISUALIZAR Y DESCARGAR DOCUMENTOS
  const handleVerDocumento = (tipo, urlOriginal) => {
    if (urlOriginal) {
      window.open(urlOriginal, '_blank');
      return;
    }
    if (tipo === 'inspeccion' && inmueble?.inspecciones && inmueble.inspecciones.length > 0) {
      setInspeccionSeleccionada(inmueble.inspecciones[0]);
      return;
    }
    alert(`Visualizando ${tipo} para ${inmueble?.Nombre || 'Inmueble'}.`);
  };

  const handleDescargarDocumento = (nombreArchivo, url) => {
    const contenido = `Documento: ${nombreArchivo}\nInmueble: ${inmueble?.Nombre}\nDirección: ${inmueble?.Domicilio}\nFecha: ${new Date().toLocaleDateString()}`;
    const blob = new Blob([contenido], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${nombreArchivo.toLowerCase().replace(/\s+/g, '_')}.txt`;
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
    : { fechaFormat: '09/10/2026', Observaciones: 'Sin observaciones', Resultado: 'Aprobado' };

  return (
    <div className="clientes-page-container">

      {/* BREADCRUMB */}
      <div className="breadcrumb-bar">
        <button className="btn-back-link" onClick={() => navigate('/conservadores')}>
          <ArrowLeft size={16} /> Mapa de inmuebles
        </button>
        <span className="separator">›</span>
        <strong className="current-page">{inmueble?.Nombre || 'Inmueble'}</strong>
      </div>

      {/* ENCABEZADO */}
      <header className="ficha-header">
        <div className="title-group">
          <h1>{inmueble?.Nombre || 'Edificio Torres del Limay'}</h1>
          <span className="badge-registrado">Registrado</span>
        </div>
      </header>

      {/* ESTRUCTURA PRINCIPAL */}
      <div className="ficha-original-grid">

        {/* FOTO */}
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

        {/* INFORMACIÓN DEL INMUEBLE (DIRECCIÓN ACTUALIZADA) */}
        <div className="card-panel info-card-area">
          <h3>Información del inmueble</h3>

          <div className="info-group">
            <label>Dirección</label>
            <p>{inmueble?.Domicilio || 'Av. Argentina 1234, Neuquén'}</p>
          </div>

          <div className="info-group">
            <label>Tipo de inmueble</label>
            <p>{inmueble?.Actividad || 'Edificio residencial'}</p>
          </div>

          <div className="info-group">
            <label>Titular / Consorcio</label>
            <p>
              {inmueble?.nombrePropietario 
                ? `${inmueble.nombrePropietario} ${inmueble.apellidoPropietario || ''}`
                : 'Juan Pérez'}
            </p>
          </div>

          <div className="info-group">
            <label>Superficie</label>
            <p>{inmueble?.Superficie ? `${inmueble.Superficie} m²` : '1.250 m²'}</p>
          </div>

          <div className="info-group">
            <label>Año de construcción</label>
            <p>2018</p>
          </div>

          <div className="info-group">
            <label>Estado</label>
            <div>
              <span className="badge-activo">Activo</span>
            </div>
          </div>
        </div>

        {/* DOCUMENTACIÓN */}
        <div className="card-panel docs-card-area">
          <h3>Documentación</h3>
          
          <div className="docs-list">
            <div className="doc-row">
              <div className="doc-info">
                <FileText size={18} className="doc-icon" />
                <span>Plano habilitado (PDF)</span>
              </div>
              <div className="doc-actions-text">
                <button className="btn-action-view" onClick={() => handleVerDocumento('Plano habilitado', inmueble?.urlPlano)}>Ver</button>
                <button className="icon-btn-download" title="Descargar Plano" onClick={() => handleDescargarDocumento('Plano_Habilitado', inmueble?.urlPlano)}><Download size={16} /></button>
              </div>
            </div>

            <div className="doc-row">
              <div className="doc-info">
                <FileText size={18} className="doc-icon" />
                <span>Certificado de instalaciones</span>
              </div>
              <div className="doc-actions-text">
                <button className="btn-action-view" onClick={() => handleVerDocumento('Certificado de instalaciones', inmueble?.urlCertificado)}>Ver</button>
                <button className="icon-btn-download" title="Descargar Certificado" onClick={() => handleDescargarDocumento('Certificado_de_Instalaciones', inmueble?.urlCertificado)}><Download size={16} /></button>
              </div>
            </div>

            <div className="doc-row">
              <div className="doc-info">
                <FileText size={18} className="doc-icon" />
                <span>Última inspección ({ultimaInspeccion.fechaFormat || ultimaInspeccion.Fecha || '09/10/2026'})</span>
              </div>
              <div className="doc-actions-text">
                <button className="btn-action-view" onClick={() => setInspeccionSeleccionada(ultimaInspeccion)}>Ver</button>
                <button className="icon-btn-download" title="Descargar Inspección" onClick={() => handleDescargarDocumento(`Inspeccion_${ultimaInspeccion.fechaFormat || '09_10_2026'}`, ultimaInspeccion.urlInforme)}><Download size={16} /></button>
              </div>
            </div>
          </div>
        </div>

        {/* COLUMNA 3 */}
        <div className="col-right-stack">
          
          {/* SERVICIOS ASOCIADOS */}
          <div className="card-panel services-panel">
            <h3>Servicios asociados</h3>
            <div className="services-status-list">
              <div className="service-status-item">
                <div className="service-name"><Flame size={16} className="item-icon" /><span>Extintores</span></div>
                <span className="badge-vigente">Vigente</span>
              </div>
              <div className="service-status-item">
                <div className="service-name"><Shield size={16} className="item-icon" /><span>Red de incendio</span></div>
                <span className="badge-vigente">Vigente</span>
              </div>
              <div className="service-status-item">
                <div className="service-name"><Bell size={16} className="item-icon" /><span>Detección de humo</span></div>
                <span className="badge-vigente">Vigente</span>
              </div>
              <div className="service-status-item">
                <div className="service-name"><Building2 size={16} className="item-icon" /><span>Iluminación de emergencia</span></div>
                <span className="badge-vigente">Vigente</span>
              </div>
              <div className="service-status-item">
                <div className="service-name"><FileText size={16} className="item-icon" /><span>Señalización</span></div>
                <span className="badge-vigente">Vigente</span>
              </div>
            </div>
          </div>

          {/* HISTORIAL DE INSPECCIONES */}
          <div className="card-panel history-panel">
            <div className="panel-header-between">
              <h3>Historial de inspecciones</h3>
              <button className="link-action" onClick={() => navigate('/historial')}>Ver todos</button>
            </div>

            <div className="history-items-list">
              {inmueble?.inspecciones && inmueble.inspecciones.length > 0 ? (
                inmueble.inspecciones.slice(0, 3).map((insp) => (
                  <div key={insp.IdInspeccion} className="history-item">
                    <div className="status-indicator">
                      {insp.Resultado === 'Aprobado' || !insp.Observaciones ? (
                        <CheckCircle size={18} className="green-icon" />
                      ) : (
                        <AlertCircle size={18} className="red-icon" />
                      )}
                    </div>
                    <div className="history-data">
                      <strong>{insp.fechaFormat || insp.Fecha}</strong>
                      <p>{insp.Observaciones || 'Sin observaciones'}</p>
                    </div>
                    <button className="btn-link-view" onClick={() => setInspeccionSeleccionada(insp)}>Ver</button>
                  </div>
                ))
              ) : (
                <>
                  <div className="history-item">
                    <CheckCircle size={18} className="green-icon" />
                    <div className="history-data">
                      <strong>09/10/2026</strong>
                      <p>Revisión mensual de extintores y mangueras OK</p>
                    </div>
                    <button className="btn-link-view" onClick={() => setInspeccionSeleccionada({ fechaFormat: '09/10/2026', Resultado: 'Aprobado', Observaciones: 'Revisión mensual de extintores y mangueras OK' })}>Ver</button>
                  </div>
                  <div className="history-item">
                    <CheckCircle size={18} className="green-icon" />
                    <div className="history-data">
                      <strong>09/10/2026</strong>
                      <p>Parte N°: PR-2026-4239. Relevamiento completado.</p>
                    </div>
                    <button className="btn-link-view" onClick={() => setInspeccionSeleccionada({ fechaFormat: '09/10/2026', Resultado: 'Aprobado', Observaciones: 'Parte N°: PR-2026-4239. Relevamiento completado.' })}>Ver</button>
                  </div>
                  <div className="history-item">
                    <AlertCircle size={18} className="red-icon" />
                    <div className="history-data">
                      <strong>08/10/2026</strong>
                      <p>Rakata rakata</p>
                    </div>
                    <button className="btn-link-view" onClick={() => setInspeccionSeleccionada({ fechaFormat: '08/10/2026', Resultado: 'Con observaciones', Observaciones: 'Rakata rakata' })}>Ver</button>
                  </div>
                </>
              )}
            </div>

            <button className="btn-primary-blue" onClick={() => navigate(`/inspecciones/${inmueble?.IdInmueble || id || 1}`)}>
              <Plus size={18} /> Cargar inspección
            </button>
          </div>

        </div>

      </div>

      {/* MODAL DETALLE */}
      {inspeccionSeleccionada && (
        <div className="modal-overlay" onClick={() => setInspeccionSeleccionada(null)}>
          <div className="modal-card-content" onClick={(e) => e.stopPropagation()}>
            <header className="modal-header">
              <div className="modal-header-title">
                <ShieldCheck size={20} color="#38bdf8" />
                <h3>Inspección del {inspeccionSeleccionada.fechaFormat || inspeccionSeleccionada.Fecha}</h3>
              </div>
              <button className="btn-close-modal" onClick={() => setInspeccionSeleccionada(null)}><X size={18} /></button>
            </header>
            <div className="modal-body">
              <div className="modal-info-row">
                <span>Inmueble:</span>
                <strong>{inmueble?.Nombre} ({inmueble?.Domicilio})</strong>
              </div>
              <div className="modal-info-row">
                <span>Resultado:</span>
                <span className={`status-badge ${inspeccionSeleccionada.Resultado === 'Aprobado' ? 'badge-ok' : 'badge-alert'}`}>
                  {inspeccionSeleccionada.Resultado || 'Aprobado'}
                </span>
              </div>
              <div className="modal-info-block">
                <strong>Observaciones:</strong>
                <p>{inspeccionSeleccionada.Observaciones || 'Sin comentarios adicionales.'}</p>
              </div>
            </div>
            <footer className="modal-footer">
              <button className="btn-secondary" onClick={() => setInspeccionSeleccionada(null)}>Cerrar</button>
            </footer>
          </div>
        </div>
      )}

    </div>
  );
}

export default Clientes;
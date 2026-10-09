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

  useEffect(() => {
    const inmuebleId = id || 1;
    fetch(`http://localhost:3001/api/inmuebles/${inmuebleId}`)
      .then(res => res.json())
      .then(data => {
        setInmueble(data);
        setCargando(false);
      })
      .catch(err => {
        console.error("Error al obtener expediente:", err);
        setCargando(false);
      });
  }, [id]);

  if (cargando) {
    return (
      <div className="clientes-page-container flex-center">
        <p className="loading-text">Cargando expediente técnico del inmueble...</p>
      </div>
    );
  }

  return (
    <div className="clientes-page-container">

      {/* BREADCRUMB */}
      <div className="breadcrumb-bar">
        <button className="btn-back-link" onClick={() => navigate('/conservadores')}>
          <ArrowLeft size={16} /> Mapa de inmuebles
        </button>
        <span className="separator">›</span>
        <strong className="current-page">{inmueble?.Nombre || 'Edificio Torres del Limay'}</strong>
      </div>

      {/* ENCABEZADO CON TITULO Y BADGE */}
      <header className="ficha-header">
        <div className="title-group">
          <h1>{inmueble?.Nombre || 'Edificio Torres del Limay'}</h1>
          <span className="badge-registrado">Registrado</span>
        </div>
      </header>

      {/* ESTRUCTURA PRINCIPAL EN GRID MÁS COMPLEJO */}
      <div className="ficha-original-grid">

        {/* FOTO (COLUMNA 1, FILA 1) */}
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

        {/* INFORMACIÓN DEL INMUEBLE (COLUMNA 2, FILA 1) */}
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
                : 'Consorcio Torres del Limay'}
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

        {/* DOCUMENTACIÓN (ABARCA COLUMNA 1 Y 2, FILA 2) */}
        <div className="card-panel docs-card-area">
          <h3>Documentación</h3>
          
          <div className="docs-list">
            <div className="doc-row">
              <div className="doc-info">
                <FileText size={18} className="doc-icon" />
                <span>Plano habilitado (PDF)</span>
              </div>
              <div className="doc-actions-text">
                <button className="btn-action-view">Ver</button>
                <button className="icon-btn-download" title="Descargar"><Download size={16} /></button>
              </div>
            </div>

            <div className="doc-row">
              <div className="doc-info">
                <FileText size={18} className="doc-icon" />
                <span>Certificado de instalaciones</span>
              </div>
              <div className="doc-actions-text">
                <button className="btn-action-view">Ver</button>
                <button className="icon-btn-download" title="Descargar"><Download size={16} /></button>
              </div>
            </div>

            <div className="doc-row">
              <div className="doc-info">
                <FileText size={18} className="doc-icon" />
                <span>Última inspección (15/03/2024)</span>
              </div>
              <div className="doc-actions-text">
                <button className="btn-action-view">Ver</button>
                <button className="icon-btn-download" title="Descargar"><Download size={16} /></button>
              </div>
            </div>
          </div>
        </div>

        {/* COLUMNA 3 (SERVICIOS + HISTORIAL) */}
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
                      <strong>15/03/2024</strong>
                      <p>Sin observaciones</p>
                    </div>
                    <button className="btn-link-view" onClick={() => setInspeccionSeleccionada({ fechaFormat: '15/03/2024', Resultado: 'Aprobado', Observaciones: 'Sin observaciones' })}>Ver</button>
                  </div>
                  <div className="history-item">
                    <AlertCircle size={18} className="red-icon" />
                    <div className="history-data">
                      <strong>21/03/2023</strong>
                      <p>Observaciones</p>
                    </div>
                    <button className="btn-link-view" onClick={() => setInspeccionSeleccionada({ fechaFormat: '21/03/2023', Resultado: 'Con observaciones', Observaciones: 'Observaciones' })}>Ver</button>
                  </div>
                  <div className="history-item">
                    <CheckCircle size={18} className="green-icon" />
                    <div className="history-data">
                      <strong>10/02/2022</strong>
                      <p>Sin observaciones</p>
                    </div>
                    <button className="btn-link-view" onClick={() => setInspeccionSeleccionada({ fechaFormat: '10/02/2022', Resultado: 'Aprobado', Observaciones: 'Sin observaciones' })}>Ver</button>
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
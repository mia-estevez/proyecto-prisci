import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// Íconos vectoriales profesionales de Lucide React
import { 
  FileText, 
  Eye, 
  Download, 
  CheckCircle, 
  AlertCircle, 
  Plus, 
  ArrowLeft,
  Flame,
  Shield,
  Building2,
  Bell
} from 'lucide-react';
import './clientes.css';

function Clientes() {
  const { id } = useParams(); // Obtiene el ID del inmueble desde la URL
  const navigate = useNavigate();

  // Estado para inspección seleccionada y ver modal
  const [inspeccionSeleccionada, setInspeccionSeleccionada] = useState(null);

  // Función al hacer clic en "Ver"
  const abrirInspeccion = (inspeccion) => {
    setInspeccionSeleccionada(inspeccion);
  };

  // ESTADO: Datos del inmueble obtenidos del Backend
  const [inmueble, setInmueble] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    // Si no hay ID en los parámetros de la URL, por defecto consulta el 1 para pruebas
    const inmuebleId = id || 1;
    
    fetch(`http://localhost:3001/api/inmuebles/${inmuebleId}`)
      .then(res => res.json())
      .then(data => {
        setInmueble(data);
        setCargando(false);
      })
      .catch(err => {
        console.error("Error al obtener expediente del inmueble:", err);
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

      {/* BREADCRUMB / NAVEGACIÓN SUPERIOR */}
      <div className="breadcrumb-bar">
        <button className="btn-back-link" onClick={() => navigate('/conservadores')}>
          <ArrowLeft size={16} /> Mapa de inmuebles
        </button>
        <span className="separator">›</span>
        <strong className="current-page">{inmueble?.Nombre || 'Inmueble'}</strong>
      </div>

      {/* ENCABEZADO CON TITULO Y BADGE DE ESTADO */}
      <header className="ficha-header">
        <div className="title-group">
          <h1>{inmueble?.Nombre || 'Edificio Torres del Limay'}</h1>
          <span className="badge-registrado">Registrado</span>
        </div>
      </header>

      {/* REJILLA PRINCIPAL EN 3 COLUMNAS (FOTO 4) */}
      <div className="ficha-grid">

        {/* COLUMNA 1: FOTO DEL INMUEBLE Y DOCUMENTACIÓN */}
        <div className="col-left">
          
          {/* FOTO DEL EDIFICIO */}
          <div className="card-panel building-photo-card">
            <img 
              src="/edificio-real.jpg" 
              alt={inmueble?.Nombre} 
              className="building-img"
              onError={(e) => {
                // Fallback si no encuentra la imagen física
                e.target.src = 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80';
              }}
            />
          </div>

          {/* DOCUMENTACIÓN ADJUNTA */}
          <div className="card-panel docs-panel">
            <h3>Documentación</h3>
            
            <div className="docs-list">
              <div className="doc-item">
                <div className="doc-info">
                  <FileText size={18} className="doc-icon" />
                  <span>Plano habilitado (PDF)</span>
                </div>
                <div className="doc-actions">
                  <button className="icon-btn" title="Ver archivo"><Eye size={16} /></button>
                  <button className="icon-btn" title="Descargar"><Download size={16} /></button>
                </div>
              </div>

              <div className="doc-item">
                <div className="doc-info">
                  <FileText size={18} className="doc-icon" />
                  <span>Certificado de instalaciones</span>
                </div>
                <div className="doc-actions">
                  <button className="icon-btn" title="Ver archivo"><Eye size={16} /></button>
                  <button className="icon-btn" title="Descargar"><Download size={16} /></button>
                </div>
              </div>

              <div className="doc-item">
                <div className="doc-info">
                  <FileText size={18} className="doc-icon" />
                  <span>Última inspección (15/03/2024)</span>
                </div>
                <div className="doc-actions">
                  <button className="icon-btn" title="Ver archivo"><Eye size={16} /></button>
                  <button className="icon-btn" title="Descargar"><Download size={16} /></button>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* COLUMNA 2: INFORMACIÓN TÉCNICA DEL INMUEBLE */}
        <div className="col-center">
          <div className="card-panel info-panel">
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
                  ? `${inmueble.nombrePropietario} ${inmueble.apellidoPropietario}`
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
        </div>

        {/* COLUMNA 3: SERVICIOS ASOCIADOS E HISTORIAL */}
        <div className="col-right">
          
          {/* SERVICIOS ASOCIADOS */}
          <div className="card-panel services-panel">
            <h3>Servicios asociados</h3>

            <div className="services-status-list">
              <div className="service-status-item">
                <div className="service-name">
                  <Flame size={16} className="item-icon" />
                  <span>Extintores</span>
                </div>
                <span className="badge-vigente">Vigente</span>
              </div>

              <div className="service-status-item">
                <div className="service-name">
                  <Shield size={16} className="item-icon" />
                  <span>Red de incendio</span>
                </div>
                <span className="badge-vigente">Vigente</span>
              </div>

              <div className="service-status-item">
                <div className="service-name">
                  <Bell size={16} className="item-icon" />
                  <span>Detección de humo</span>
                </div>
                <span className="badge-vigente">Vigente</span>
              </div>

              <div className="service-status-item">
                <div className="service-name">
                  <Building2 size={16} className="item-icon" />
                  <span>Iluminación de emergencia</span>
                </div>
                <span className="badge-vigente">Vigente</span>
              </div>

              <div className="service-status-item">
                <div className="service-name">
                  <FileText size={16} className="item-icon" />
                  <span>Señalización</span>
                </div>
                <span className="badge-vigente">Vigente</span>
              </div>
            </div>
          </div>

          {/* HISTORIAL DE INSPECCIONES */}
          <div className="card-panel history-panel">
            <div className="panel-header-between">
              <h3>Historial de inspecciones</h3>
              <button className="link-action" onClick={() => navigate('/historial')}>
                Ver todos
              </button>
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
                      <strong>{insp.fechaFormat}</strong>
                      <p>{insp.Observaciones || 'Sin observaciones'}</p>
                    </div>
                    <button className="btn-link-view">Ver</button>
                  </div>
                ))
              ) : (
                /* Registros estáticos de respaldo idénticos a la Foto 4 */
                <>
                  <div className="history-item">
                    <CheckCircle size={18} className="green-icon" />
                    <div className="history-data">
                      <strong>15/03/2024</strong>
                      <p>Sin observaciones</p>
                    </div>
                    <button className="btn-link-view">Ver</button>
                  </div>

                  <div className="history-item">
                    <AlertCircle size={18} className="red-icon" />
                    <div className="history-data">
                      <strong>21/03/2023</strong>
                      <p>Observaciones</p>
                    </div>
                    <button className="btn-link-view">Ver</button>
                  </div>

                  <div className="history-item">
                    <CheckCircle size={18} className="green-icon" />
                    <div className="history-data">
                      <strong>10/02/2022</strong>
                      <p>Sin observaciones</p>
                    </div>
                    <button className="btn-link-view">Ver</button>
                  </div>
                </>
              )}
            </div>

            {/* BOTÓN PRINCIPAL PARA CARGAR INSPECCIÓN */}
            <button 
              className="btn-primary-blue"
              onClick={() => navigate(`/inspecciones/${inmueble?.IdInmueble || id || 1}`)}
            >
              <Plus size={18} /> Cargar inspección
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}

export default Clientes;
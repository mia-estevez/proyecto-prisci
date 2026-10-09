import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { 
  FileText, Calendar, Building, MapPin, Upload, 
  Edit3, Save, X, CheckCircle2, AlertCircle, HelpCircle, ArrowLeft
} from 'lucide-react';
import './inspecciones.css';

function Inspecciones() {
  const navigate = useNavigate();
  const { idInmueble } = useParams();
  const [searchParams] = useSearchParams();
  
  // Obtener el ID del inmueble desde los parámetros de la URL
  const inmuebleIdParam = idInmueble || searchParams.get('inmuebleId') || 1;

  // Estado del Inmueble desde la BD
  const [inmueble, setInmueble] = useState(null);
  const [cargando, setCargando] = useState(true);

  // Estado Formulario General
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [parteNro, setParteNro] = useState(`PR-2026-${Math.floor(1000 + Math.random() * 9000)}`);
  const [empresaCliente, setEmpresaCliente] = useState('');
  const [establecimiento, setEstablecimiento] = useState('');
  const [domicilio, setDomicilio] = useState('');
  const [localidad, setLocalidad] = useState('Neuquén');
  const [observacionesGenerales, setObservacionesGenerales] = useState('');

  // Estado Relevamiento General (ítems organizados por categorías)
  const [relevamiento, setRelevamiento] = useState({
    viasEscape: { estado: 'Correcto', obs: '' },
    lucesEmergencia: { estado: 'Correcto', obs: '' },
    deteccionIncendios: { estado: 'Correcto', obs: '' },
    instalacionFijaAgua: { estado: 'Correcto', obs: '' },
    matafuegos: { estado: 'Correcto', obs: '' },
    instalacionElectrica: { estado: 'Correcto', obs: '' },
    instalacionGas: { estado: 'Correcto', obs: '' },
    productosQuimicos: { estado: 'Correcto', obs: '' },
    ordenLimpia: { estado: 'Correcto', obs: '' },
  });

  // Archivos adjuntos
  const [archivos, setArchivos] = useState([]);

  // Cargar datos del inmueble desde la API
  useEffect(() => {
    if (inmuebleIdParam) {
      fetch(`http://localhost:3001/api/inmuebles/${inmuebleIdParam}`)
        .then(res => res.json())
        .then(data => {
          setInmueble(data);
          setEstablecimiento(data.Nombre || '');
          setDomicilio(data.Domicilio || '');
          setEmpresaCliente(
            data.nombrePropietario 
              ? `${data.nombrePropietario} ${data.apellidoPropietario || ''}`.trim() 
              : 'Cliente Consorcio'
          );
          setCargando(false);
        })
        .catch(err => {
          console.error("Error al cargar inmueble:", err);
          setCargando(false);
        });
    }
  }, [inmuebleIdParam]);

  const handleEstadoChange = (itemKey, nuevoEstado) => {
    setRelevamiento(prev => ({
      ...prev,
      [itemKey]: { ...prev[itemKey], estado: nuevoEstado }
    }));
  };

  const handleObsChange = (itemKey, texto) => {
    setRelevamiento(prev => ({
      ...prev,
      [itemKey]: { ...prev[itemKey], obs: texto }
    }));
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      setArchivos(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e, esBorrador = false) => {
    e.preventDefault();

    // Determinar resultado global
    const tieneObservaciones = Object.values(relevamiento).some(
      item => item.estado === 'Con observaciones'
    );
    const resultadoFinal = esBorrador 
      ? 'Pendiente' 
      : (tieneObservaciones ? 'Con observaciones' : 'Aprobado');

    const payload = {
      idInmueble: parseInt(inmuebleIdParam),
      idConservador: 1, // ID por defecto del usuario logueado
      fecha: fecha,
      resultado: resultadoFinal,
      observaciones: observacionesGenerales || `Parte N°: ${parteNro}. Relevamiento completado.`,
      detalles: relevamiento
    };

    try {
      const response = await fetch('http://localhost:3001/api/inspecciones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        alert(esBorrador ? 'Borrador guardado correctamente' : '¡Inspección guardada con éxito!');
        navigate(`/clientes/${inmuebleIdParam}`);
      } else {
        alert('Error al guardar la inspección');
      }
    } catch (error) {
      console.error('Error al conectar con la API:', error);
      alert('Error de conexión con el servidor');
    }
  };

  if (cargando) {
    return <div className="cargando-container">Cargando datos del inmueble...</div>;
  }

  return (
    <div className="cargar-inspeccion-container">
      
      {/* MIGA DE PAN */}
      <nav className="breadcrumb">
        <span onClick={() => navigate('/conservadores')}>Mapa de inmuebles</span> &gt; 
        <span onClick={() => navigate(`/clientes/${inmuebleIdParam}`)}> {inmueble?.Nombre || 'Inmueble'}</span> &gt; 
        <span className="active"> Cargar inspección</span>
      </nav>

      {/* ENCABEZADO */}
      <header className="page-title-header">
        <h1>Cargar inspección</h1>
        <p>Completá el relevamiento de las instalaciones de seguridad contra incendios.</p>
      </header>

      {/* TARJETA DE RESUMEN DEL INMUEBLE */}
      <div className="inmueble-card-header">
        <img 
          src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=400&q=80" 
          alt="Inmueble" 
          className="inmueble-thumb"
        />
        <div className="inmueble-card-info">
          <h2>{inmueble?.Nombre || 'Edificio Torres del Limay'}</h2>
          <p className="inmueble-direccion">{inmueble?.Domicilio || 'Av. Argentina 1234'}, Neuquén</p>
          <span className="inmueble-tag">{inmueble?.Actividad || 'Edificio residencial'}</span>
        </div>
      </div>

      <form onSubmit={(e) => handleSubmit(e, false)}>
        
        {/* SECCIÓN 1: DATOS GENERALES */}
        <section className="form-card-section">
          <div className="section-header">
            <FileText size={18} />
            <h3>Datos generales</h3>
          </div>

          <div className="form-grid-2col">
            <div className="form-group">
              <label>Fecha <span className="req">*</span></label>
              <div className="input-with-icon-right">
                <input 
                  type="date" 
                  value={fecha} 
                  onChange={(e) => setFecha(e.target.value)} 
                  required 
                />
              </div>
            </div>

            <div className="form-group">
              <label>Parte N° <span className="req">*</span></label>
              <input 
                type="text" 
                value={parteNro} 
                onChange={(e) => setParteNro(e.target.value)} 
                required 
              />
            </div>

            <div className="form-group">
              <label>Empresa / Cliente <span className="req">*</span></label>
              <input 
                type="text" 
                value={empresaCliente} 
                onChange={(e) => setEmpresaCliente(e.target.value)} 
                placeholder="Nombre de la empresa o cliente..." 
                required 
              />
            </div>

            <div className="form-group">
              <label>Establecimiento <span className="req">*</span></label>
              <input 
                type="text" 
                value={establecimiento} 
                onChange={(e) => setEstablecimiento(e.target.value)} 
                placeholder="Nombre del establecimiento..." 
                required 
              />
            </div>

            <div className="form-group">
              <label>Domicilio <span className="req">*</span></label>
              <input 
                type="text" 
                value={domicilio} 
                onChange={(e) => setDomicilio(e.target.value)} 
                placeholder="Dirección del inmueble..." 
                required 
              />
            </div>

            <div className="form-group">
              <label>Localidad <span className="req">*</span></label>
              <select value={localidad} onChange={(e) => setLocalidad(e.target.value)}>
                <option value="Neuquén">Neuquén</option>
                <option value="Plottier">Plottier</option>
                <option value="Cipolletti">Cipolletti</option>
                <option value="Centenario">Centenario</option>
              </select>
            </div>
          </div>
        </section>

        {/* SECCIÓN 2: RELEVAMIENTO GENERAL DEL ESTABLECIMIENTO */}
        <section className="form-card-section">
          <div className="section-header">
            <FileText size={18} />
            <h3>Relevamiento general del establecimiento</h3>
          </div>

          {/* EVACUACIÓN */}
          <div className="relevamiento-block">
            <h4 className="block-category-title">EVACUACIÓN</h4>
            
            {renderRelevamientoRow("Vías de escape *", "viasEscape")}
            {renderRelevamientoRow("Luces de emergencia *", "lucesEmergencia")}
          </div>

          {/* EXTINCIÓN Y DETECCIÓN */}
          <div className="relevamiento-block">
            <h4 className="block-category-title">EXTINCIÓN Y DETECCIÓN</h4>
            
            {renderRelevamientoRow("Detección de incendios *", "deteccionIncendios")}
            {renderRelevamientoRow("Instalación fija de agua *", "instalacionFijaAgua")}
            {renderRelevamientoRow("Matafuegos *", "matafuegos")}
          </div>

          {/* PREVENCIÓN */}
          <div className="relevamiento-block">
            <h4 className="block-category-title">PREVENCIÓN</h4>
            
            {renderRelevamientoRow("Instalación eléctrica *", "instalacionElectrica")}
            {renderRelevamientoRow("Instalación de gas *", "instalacionGas")}
            {renderRelevamientoRow("Productos químicos *", "productosQuimicos")}
            {renderRelevamientoRow("Orden y limpieza *", "ordenLimpia")}
          </div>

          {/* OBSERVACIONES GENERALES */}
          <div className="relevamiento-block">
            <h4 className="block-category-title">OBSERVACIONES GENERALES</h4>
            <div className="textarea-container">
              <textarea 
                rows="4" 
                maxLength="1000"
                placeholder="Escribí aquí las observaciones generales del establecimiento..."
                value={observacionesGenerales}
                onChange={(e) => setObservacionesGenerales(e.target.value)}
              />
              <span className="char-count">{observacionesGenerales.length}/1000</span>
            </div>
          </div>

          {/* ADJUNTAR ARCHIVOS */}
          <div className="file-upload-box">
            <div className="upload-info">
              <FileText size={28} />
              <div>
                <strong>Adjuntar fotos o documentos (opcional)</strong>
                <p>Arrastrá archivos aquí o seleccioná desde tu equipo</p>
                <small>Formatos: PDF, JPG, PNG (máx. 10 MB por archivo)</small>
              </div>
            </div>
            <label className="btn-upload-trigger">
              <Upload size={16} />
              <span>Seleccionar archivos</span>
              <input type="file" multiple onChange={handleFileChange} hidden />
            </label>
          </div>

          {/* FIRMAS */}
          <div className="firmas-grid">
            <div className="firma-box">
              <div className="firma-header">
                <Edit3 size={16} />
                <span>Firma del cliente</span>
              </div>
              <div className="firma-placeholder">
                Haz clic para me firmar o adjuntar firma...
              </div>
            </div>

            <div className="firma-box">
              <div className="firma-header">
                <Edit3 size={16} />
                <span>Firma del profesional</span>
              </div>
              <div className="firma-placeholder">
                Haz clic para me firmar o adjuntar firma...
              </div>
            </div>
          </div>
        </section>

        {/* BOTONES DE ACCIÓN BOTTOM */}
        <div className="form-actions-footer">
          <button 
            type="button" 
            className="btn-secondary"
            onClick={(e) => handleSubmit(e, true)}
          >
            <Save size={16} /> Guardar borrador
          </button>

          <button 
            type="button" 
            className="btn-secondary" 
            onClick={() => navigate(`/clientes/${inmuebleIdParam}`)}
          >
            Cancelar
          </button>

          <button type="submit" className="btn-primary-cyan">
            <CheckCircle2 size={16} /> Guardar inspección
          </button>
        </div>

      </form>
    </div>
  );

  // Helper para renderizar las filas de radio buttons
  function renderRelevamientoRow(label, key) {
    const itemData = relevamiento[key];

    return (
      <div className="relevamiento-row">
        <span className="item-label">{label}</span>
        
        <div className="radio-options-group">
          <label className={`radio-pill ${itemData.estado === 'Correcto' ? 'active-correct' : ''}`}>
            <input 
              type="radio" 
              name={`radio-${key}`} 
              checked={itemData.estado === 'Correcto'} 
              onChange={() => handleEstadoChange(key, 'Correcto')} 
            />
            <span>Correcto</span>
          </label>

          <label className={`radio-pill ${itemData.estado === 'Con observaciones' ? 'active-warning' : ''}`}>
            <input 
              type="radio" 
              name={`radio-${key}`} 
              checked={itemData.estado === 'Con observaciones'} 
              onChange={() => handleEstadoChange(key, 'Con observaciones')} 
            />
            <span>Con observaciones</span>
          </label>

          <label className={`radio-pill ${itemData.estado === 'No aplica' ? 'active-na' : ''}`}>
            <input 
              type="radio" 
              name={`radio-${key}`} 
              checked={itemData.estado === 'No aplica'} 
              onChange={() => handleEstadoChange(key, 'No aplica')} 
            />
            <span>No aplica</span>
          </label>
        </div>

        <input 
          type="text" 
          className="row-obs-input"
          placeholder="Observaciones..." 
          value={itemData.obs}
          onChange={(e) => handleObsChange(key, e.target.value)}
        />
      </div>
    );
  }
}

export default Inspecciones;
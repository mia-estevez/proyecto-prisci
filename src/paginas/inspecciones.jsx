import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { 
  FileText, Upload, Edit3, Save, X, CheckCircle2, AlertTriangle, ArrowLeft, Trash2 
} from 'lucide-react';
import './inspecciones.css';

function Inspecciones() {
  const navigate = useNavigate();
  const { idInmueble } = useParams();
  const [searchParams] = useSearchParams();
  
  const inmuebleIdParam = idInmueble || searchParams.get('inmuebleId') || 1;
  const borradorIndex = searchParams.get('borrador'); // Detecta si estamos abriendo un borrador guardado

  const [inmueble, setInmueble] = useState(null);
  const [cargando, setCargando] = useState(true);

  // Campos principales
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [parteNro, setParteNro] = useState(`PR-2026-${Math.floor(1000 + Math.random() * 9000)}`);
  const [empresaCliente, setEmpresaCliente] = useState('');
  const [establecimiento, setEstablecimiento] = useState('');
  const [domicilio, setDomicilio] = useState('');
  const [localidad, setLocalidad] = useState('Neuquén');
  const [observacionesGenerales, setObservacionesGenerales] = useState('');

  const DIRECCIONES_OFICIALES = {
    1: { nombre: 'Edificio Torres del Limay', domicilio: 'Av. Argentina 1234, Neuquén', tipo: 'Comercial' },
    2: { nombre: 'Galería Comercial Centro', domicilio: 'Gral. Las Heras 450, Neuquén', tipo: 'Residencial' }
  };

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

  const [archivos, setArchivos] = useState([]);

  const canvasClienteRef = useRef(null);
  const canvasProfRef = useRef(null);
  const [dibujandoCliente, setDibujandoCliente] = useState(false);
  const [dibujandoProf, setDibujandoProf] = useState(false);
  const [firmaClienteData, setFirmaClienteData] = useState(null);
  const [firmaProfData, setFirmaProfData] = useState(null);

  useEffect(() => {
    const idNum = Number(inmuebleIdParam);
    const oficial = DIRECCIONES_OFICIALES[idNum] || DIRECCIONES_OFICIALES[1];

    // Si pasaron un índice de borrador por URL, cargamos esos datos guardados previamente
    if (borradorIndex !== null && borradorIndex !== undefined) {
      const borradores = JSON.parse(localStorage.getItem(`borradores_inmueble_${idNum}`) || '[]');
      const borradorSeleccionado = borradores[parseInt(borradorIndex)];
      if (borradorSeleccionado) {
        setFecha(borradorSeleccionado.fecha || fecha);
        setParteNro(borradorSeleccionado.parteNro || parteNro);
        setEmpresaCliente(borradorSeleccionado.empresaCliente || 'Juan Pérez');
        setEstablecimiento(oficial.nombre);
        setDomicilio(oficial.domicilio);
        setLocalidad(borradorSeleccionado.localidad || 'Neuquén');
        setObservacionesGenerales(borradorSeleccionado.observaciones || '');
        if (borradorSeleccionado.relevamiento) {
          setRelevamiento(borradorSeleccionado.relevamiento);
        }
        if (borradorSeleccionado.archivosAdjuntos) {
          setArchivos(borradorSeleccionado.archivosAdjuntos);
        }
      }
    }

    fetch(`http://localhost:3001/api/inmuebles/${inmuebleIdParam}`)
      .then(res => res.json())
      .then(data => {
        setInmueble(data);
        if (borradorIndex === null) {
          setEstablecimiento(oficial.nombre || data.Nombre || '');
          setDomicilio(oficial.domicilio || data.Domicilio || '');
          setEmpresaCliente(data.nombrePropietario ? `${data.nombrePropietario} ${data.apellidoPropietario || ''}`.trim() : 'Juan Pérez');
        }
        setCargando(false);
      })
      .catch(err => {
        setInmueble({ Nombre: oficial.nombre, Domicilio: oficial.domicilio, Actividad: oficial.tipo });
        if (borradorIndex === null) {
          setEstablecimiento(oficial.nombre);
          setDomicilio(oficial.domicilio);
          setEmpresaCliente('Juan Pérez');
        }
        setCargando(false);
      });
  }, [inmuebleIdParam, borradorIndex]);

  const handleFileChange = (e) => {
    if (e.target.files) {
      const nuevos = Array.from(e.target.files).map(file => ({
        nombre: file.name,
        url: URL.createObjectURL(file),
        tipo: file.type
      }));
      setArchivos(prev => [...prev, ...nuevos]);
    }
  };

  const eliminarArchivo = (index) => {
    setArchivos(prev => prev.filter((_, i) => i !== index));
  };

  const iniciarDibujo = (e, setDibujando, canvasRef) => {
    setDibujando(true);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const dibujar = (e, dibujando, canvasRef) => {
    if (!dibujando) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const detenerDibujo = (setDibujando, canvasRef, setFirmaData) => {
    setDibujando(false);
    if (canvasRef.current) {
      setFirmaData(canvasRef.current.toDataURL());
    }
  };

  const limpiarCanvas = (canvasRef, setFirmaData) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setFirmaData(null);
  };

  // FUNCIÓN PARA GUARDAR (BORRADOR O INSPECCIÓN FINAL)
  const guardarInspeccion = (esBorrador) => {
    const idNum = parseInt(inmuebleIdParam);
    const tieneObs = Object.values(relevamiento).some(item => item.estado === 'Con observaciones');
    const resultadoFinal = esBorrador ? 'Borrador (Pendiente)' : (tieneObs ? 'Con observaciones' : 'Aprobado');

    const objetoInspeccion = {
      idInmueble: idNum,
      fecha: fecha,
      parteNro: parteNro,
      empresaCliente: empresaCliente,
      localidad: localidad,
      resultado: resultadoFinal,
      relevamiento: relevamiento,
      observaciones: observacionesGenerales || `Parte N°: ${parteNro}. Relevamiento completado.`,
      archivosAdjuntos: archivos,
      tieneFirmaCliente: !!firmaClienteData,
      tieneFirmaProf: !!firmaProfData
    };

    if (esBorrador) {
      // Guardar en la lista específica de borradores
      const borradoresPrevios = JSON.parse(localStorage.getItem(`borradores_inmueble_${idNum}`) || '[]');
      
      if (borradorIndex !== null && borradorIndex !== undefined) {
        // Si estábamos editando un borrador existente, lo actualizamos
        borradoresPrevios[parseInt(borradorIndex)] = objetoInspeccion;
      } else {
        // Si es nuevo, lo agregamos al principio
        borradoresPrevios.unshift(objetoInspeccion);
      }

      localStorage.setItem(`borradores_inmueble_${idNum}`, JSON.stringify(borradoresPrevios));
      alert('¡Borrador guardado correctamente!');
    } else {
      // Guardar como inspección definitiva en el historial de inspecciones
      const inspeccionesPrevias = JSON.parse(localStorage.getItem(`inspecciones_inmueble_${idNum}`) || '[]');
      localStorage.setItem(`inspecciones_inmueble_${idNum}`, JSON.stringify([objetoInspeccion, ...inspeccionesPrevias]));

      // Si venía de un borrador, lo removemos de borradores
      if (borradorIndex !== null && borradorIndex !== undefined) {
        const borradoresPrevios = JSON.parse(localStorage.getItem(`borradores_inmueble_${idNum}`) || '[]');
        borradoresPrevios.splice(parseInt(borradorIndex), 1);
        localStorage.setItem(`borradores_inmueble_${idNum}`, JSON.stringify(borradoresPrevios));
      }

      alert('¡Inspección guardada con éxito!');
    }

    navigate(`/clientes/${idNum}`);
  };

  if (cargando) return <div className="cargando-container">Cargando datos...</div>;

  return (
    <div className="cargar-inspeccion-container">
      <nav className="breadcrumb">
        <span onClick={() => navigate('/conservadores')}>Mapa de inmuebles</span> &gt; 
        <span onClick={() => navigate(`/clientes/${inmuebleIdParam}`)}> {establecimiento}</span> &gt; 
        <span className="active"> Cargar inspección</span>
      </nav>

      <header className="page-title-header">
        <h1>{borradorIndex !== null ? 'Editar borrador de inspección' : 'Cargar inspección'}</h1>
        <p>Completá o modificá el relevamiento de las instalaciones de seguridad contra incendios.</p>
      </header>

      <div className="inmueble-card-header">
        <img src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=400&q=80" alt="Inmueble" className="inmueble-thumb"/>
        <div className="inmueble-card-info">
          <h2>{establecimiento}</h2>
          <p className="inmueble-direccion">{domicilio}</p>
          <span className="inmueble-tag">{inmueble?.Actividad || 'Comercial'}</span>
        </div>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); guardarInspeccion(false); }}>
        <section className="form-card-section">
          <div className="section-header"><FileText size={18} /><h3>Datos generales</h3></div>
          <div className="form-grid-2col">
            <div className="form-group"><label>Fecha *</label><input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} required /></div>
            <div className="form-group"><label>Parte N° *</label><input type="text" value={parteNro} onChange={(e) => setParteNro(e.target.value)} required /></div>
            <div className="form-group"><label>Empresa / Cliente *</label><input type="text" value={empresaCliente} onChange={(e) => setEmpresaCliente(e.target.value)} required /></div>
            <div className="form-group"><label>Establecimiento *</label><input type="text" value={establecimiento} onChange={(e) => setEstablecimiento(e.target.value)} required /></div>
            <div className="form-group"><label>Domicilio *</label><input type="text" value={domicilio} onChange={(e) => setDomicilio(e.target.value)} required /></div>
            <div className="form-group"><label>Localidad *</label>
              <select value={localidad} onChange={(e) => setLocalidad(e.target.value)}>
                <option value="Neuquén">Neuquén</option>
                <option value="Plottier">Plottier</option>
                <option value="Cipolletti">Cipolletti</option>
              </select>
            </div>
          </div>
        </section>

        <section className="form-card-section">
          <div className="section-header"><FileText size={18} /><h3>Relevamiento general del establecimiento</h3></div>
          
          <div className="relevamiento-block">
            <h4 className="block-category-title">EVACUACIÓN</h4>
            {renderRow("Vías de escape *", "viasEscape")}
            {renderRow("Luces de emergencia *", "lucesEmergencia")}
          </div>

          <div className="relevamiento-block">
            <h4 className="block-category-title">EXTINCIÓN Y DETECCIÓN</h4>
            {renderRow("Detección de incendios *", "deteccionIncendios")}
            {renderRow("Instalación fija de agua *", "instalacionFijaAgua")}
            {renderRow("Matafuegos *", "matafuegos")}
          </div>

          <div className="relevamiento-block">
            <h4 className="block-category-title">PREVENCIÓN</h4>
            {renderRow("Instalación eléctrica *", "instalacionElectrica")}
            {renderRow("Instalación de gas *", "instalacionGas")}
            {renderRow("Productos químicos *", "productosQuimicos")}
            {renderRow("Orden y limpieza *", "ordenLimpia")}
          </div>

          <div className="relevamiento-block">
            <h4 className="block-category-title">OBSERVACIONES GENERALES</h4>
            <div className="textarea-container">
              <textarea rows="4" maxLength="1000" placeholder="Escribí las observaciones generales del establecimiento..." value={observacionesGenerales} onChange={(e) => setObservacionesGenerales(e.target.value)}/>
              <span className="char-count">{observacionesGenerales.length}/1000</span>
            </div>
          </div>

          <div className="file-upload-box">
            <div className="upload-info">
              <Upload size={24} />
              <div>
                <strong>Adjuntar fotos o documentos (opcional)</strong>
                <p>Arrastrá archivos aquí o seleccioná desde tu equipo</p>
              </div>
            </div>
            <label className="btn-upload-trigger">
              <span>Seleccionar archivos</span>
              <input type="file" multiple onChange={handleFileChange} hidden />
            </label>
          </div>

          {archivos.length > 0 && (
            <div className="files-list-container">
              {archivos.map((file, i) => (
                <div key={i} className="file-item-pill">
                  <span>📎 {file.nombre}</span>
                  <button type="button" onClick={() => eliminarArchivo(i)}><Trash2 size={14} /></button>
                </div>
              ))}
            </div>
          )}

          <div className="firmas-grid">
            <div className="firma-box">
              <div className="firma-header">
                <Edit3 size={16} /><span>Firma del cliente</span>
                <button type="button" className="btn-clear-sig" onClick={() => limpiarCanvas(canvasClienteRef, setFirmaClienteData)}>Limpiar</button>
              </div>
              <canvas ref={canvasClienteRef} width={350} height={100} className="canvas-pad"
                onMouseDown={(e) => iniciarDibujo(e, setDibujandoCliente, canvasClienteRef)}
                onMouseMove={(e) => dibujar(e, dibujandoCliente, canvasClienteRef)}
                onMouseUp={() => detenerDibujo(setDibujandoCliente, canvasClienteRef, setFirmaClienteData)}
              />
            </div>

            <div className="firma-box">
              <div className="firma-header">
                <Edit3 size={16} /><span>Firma del profesional</span>
                <button type="button" className="btn-clear-sig" onClick={() => limpiarCanvas(canvasProfRef, setFirmaProfData)}>Limpiar</button>
              </div>
              <canvas ref={canvasProfRef} width={350} height={100} className="canvas-pad"
                onMouseDown={(e) => iniciarDibujo(e, setDibujandoProf, canvasProfRef)}
                onMouseMove={(e) => dibujar(e, dibujandoProf, canvasProfRef)}
                onMouseUp={() => detenerDibujo(setDibujandoProf, canvasProfRef, setFirmaProfData)}
              />
            </div>
          </div>
        </section>

        <div className="form-actions-footer">
          <button type="button" className="btn-secondary" onClick={() => guardarInspeccion(true)}>Guardar borrador</button>
          <button type="button" className="btn-secondary" onClick={() => navigate(`/clientes/${inmuebleIdParam}`)}>Cancelar</button>
          <button type="submit" className="btn-primary-cyan">Guardar inspección</button>
        </div>
      </form>
    </div>
  );

  function renderRow(label, key) {
    const data = relevamiento[key];
    return (
      <div className="relevamiento-row">
        <span className="item-label">{label}</span>
        <div className="radio-options-group">
          {['Correcto', 'Con observaciones', 'No aplica'].map(st => (
            <label key={st} className={`radio-pill ${data.estado === st ? 'active-pill' : ''}`}>
              <input type="radio" name={key} checked={data.estado === st} onChange={() => setRelevamiento(p => ({...p, [key]: {...p[key], estado: st}}))} />
              <span>{st}</span>
            </label>
          ))}
        </div>
        <input type="text" className="row-obs-input" placeholder="Observaciones..." value={data.obs} onChange={(e) => setRelevamiento(p => ({...p, [key]: {...p[key], obs: e.target.value}}))} />
      </div>
    );
  }
}

export default Inspecciones;
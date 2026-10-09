import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Save, FileText, CheckCircle2, AlertCircle, Paperclip, Trash2 } from 'lucide-react';
import { dispararNotificacionConservador } from '../utils/notificacionesHelper';
import './clientes.css'; // Mantenemos la estética unificada

function Inspecciones() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const indexBorrador = searchParams.get('borrador');

  const inmuebleId = Number(id || 1);
  const DIRECCIONES_OFICIALES = {
    1: { nombre: 'Edificio Torres del Limay', domicilio: 'Av. Argentina 1234, Neuquén' },
    2: { nombre: 'Galería Comercial Centro', domicilio: 'Gral. Las Heras 450, Neuquén' }
  };
  const oficial = DIRECCIONES_OFICIALES[inmuebleId] || DIRECCIONES_OFICIALES[1];

  // Estados del formulario
  const [parteNro, setParteNro] = useState(`PR-2026-${Math.floor(1000 + Math.random() * 9000)}`);
  const [fecha, setFecha] = useState('2026-10-09');
  const [resultado, setResultado] = useState('Aprobado');
  const [observaciones, setObservaciones] = useState('');
  const [archivos, setArchivos] = useState([]);
  
  // Secciones de relevamiento técnico
  const [relevamiento, setRelevamiento] = useState({
    evacuacion: { estado: 'OK', obs: '' },
    extincion: { estado: 'OK', obs: '' },
    deteccion: { estado: 'OK', obs: '' },
    prevencionElectrica: { estado: 'OK', obs: '' },
    prevencionGas: { estado: 'OK', obs: '' },
    productosQuimicos: { estado: 'OK', obs: '' },
    ordenLimpieza: { estado: 'OK', obs: '' }
  });

  // Cargar borrador si se está editando uno existente
  useEffect(() => {
    if (indexBorrador !== null) {
      const borradoresGuardados = JSON.parse(localStorage.getItem(`borradores_inmueble_${inmuebleId}`) || '[]');
      const borradorAEditar = borradoresGuardados[Number(indexBorrador)];
      if (borradorAEditar) {
        setParteNro(borradorAEditar.parteNro || parteNro);
        setFecha(borradorAEditar.fecha || fecha);
        setResultado(borradorAEditar.resultado || resultado);
        setObservaciones(borradorAEditar.observaciones || '');
        setArchivos(borradorAEditar.archivosAdjuntos || []);
        if (borradorAEditar.relevamiento) {
          setRelevamiento(borradorAEditar.relevamiento);
        }
      }
    }
  }, [indexBorrador, inmuebleId]);

  const handleCambioRelevamiento = (seccion, campo, valor) => {
    setRelevamiento(prev => ({
      ...prev,
      [seccion]: { ...prev[seccion], [campo]: valor }
    }));
  };

  const handleAdjuntarArchivo = (e) => {
    const files = Array.from(e.target.files);
    const nuevosArchivos = files.map(file => ({
      nombre: file.name,
      url: URL.createObjectURL(file)
    }));
    setArchivos(prev => [...prev, ...nuevosArchivos]);
  };

  // Guardar como Borrador
  const handleGuardarBorrador = () => {
    const borradorData = {
      parteNro,
      fecha,
      resultado,
      observaciones,
      relevamiento,
      archivosAdjuntos: archivos,
      tieneFirmaCliente: true,
      tieneFirmaProf: true
    };

    const borradoresGuardados = JSON.parse(localStorage.getItem(`borradores_inmueble_${inmuebleId}`) || '[]');
    
    if (indexBorrador !== null) {
      borradoresGuardados[Number(indexBorrador)] = borradorData;
    } else {
      borradoresGuardados.push(borradorData);
    }

    localStorage.setItem(`borradores_inmueble_${inmuebleId}`, JSON.stringify(borradoresGuardados));

    // DISPARAR NOTIFICACIÓN AUTOMÁTICA
    dispararNotificacionConservador(
      'Borrador de Inspección Guardado',
      `Se guardó un borrador técnico (Parte N°: ${parteNro}) para ${oficial.nombre}.`,
      'info',
      inmuebleId
    );

    alert('Borrador guardado exitosamente.');
    navigate(`/clientes/${inmuebleId}`);
  };

  // Guardar / Finalizar Inspección Definitiva
  const handleGuardarInspeccionDefinitiva = (e) => {
    e.preventDefault();
    
    const nuevaInspeccion = {
      parteNro,
      fecha,
      resultado,
      observaciones,
      relevamiento,
      archivosAdjuntos: archivos,
      tieneFirmaCliente: true,
      tieneFirmaProf: true
    };

    // Guardar en inspecciones del inmueble
    const inspeccionesActuales = JSON.parse(localStorage.getItem(`inspecciones_inmueble_${inmuebleId}`) || '[]');
    const actualizadas = [nuevaInspeccion, ...inspeccionesActuales];
    localStorage.setItem(`inspecciones_inmueble_${inmuebleId}`, JSON.stringify(actualizadas));

    // Si venía de un borrador, eliminarlo de la lista de borradores
    if (indexBorrador !== null) {
      const borradoresGuardados = JSON.parse(localStorage.getItem(`borradores_inmueble_${inmuebleId}`) || '[]');
      const filtrados = borradoresGuardados.filter((_, i) => i !== Number(indexBorrador));
      localStorage.setItem(`borradores_inmueble_${inmuebleId}`, JSON.stringify(filtrados));
    }

    // DISPARAR NOTIFICACIÓN AUTOMÁTICA DE ÉXITO
    dispararNotificacionConservador(
      'Inspección Registrada',
      `Se completó exitosamente el acta de inspección (Parte N°: ${parteNro}) para ${oficial.nombre}.`,
      'exito',
      inmuebleId
    );

    alert('Inspección guardada y registrada correctamente.');
    navigate(`/clientes/${inmuebleId}`);
  };

  return (
    <div className="clientes-page-container" style={{ padding: '30px' }}>
      <div className="breadcrumb-bar" style={{ marginBottom: '20px' }}>
        <button className="btn-back-link" onClick={() => navigate(`/clientes/${inmuebleId}`)}>
          <ArrowLeft size={16} /> Volver al expediente ({oficial.nombre})
        </button>
      </div>

      <header className="ficha-header" style={{ marginBottom: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="title-group">
          <h1>{indexBorrador !== null ? 'Editar Borrador de Inspección' : 'Nueva Inspección Técnica'}</h1>
          <p style={{ color: '#94a3b8', marginTop: '5px' }}>{oficial.nombre} — {oficial.domicilio}</p>
        </div>
        <button 
          type="button" 
          onClick={handleGuardarBorrador}
          style={{ background: 'rgba(56, 189, 248, 0.1)', border: '1px solid #38bdf8', color: '#38bdf8', padding: '10px 18px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '500' }}
        >
          <Save size={18} /> Guardar borrador
        </button>
      </header>

      <form onSubmit={handleGuardarInspeccionDefinitiva} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* DATOS GENERALES */}
        <div className="card-panel" style={{ width: '100%', padding: '24px' }}>
          <h3 style={{ marginBottom: '15px' }}>Datos Generales del Parte</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '6px' }}>N° de Parte</label>
              <input type="text" value={parteNro} onChange={(e) => setParteNro(e.target.value)} required style={{ width: '100%', padding: '10px', background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '6px' }}>Fecha</label>
              <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} required style={{ width: '100%', padding: '10px', background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', color: '#94a3b8', marginBottom: '6px' }}>Resultado</label>
              <select value={resultado} onChange={(e) => setResultado(e.target.value)} style={{ width: '100%', padding: '10px', background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}>
                <option value="Aprobado">Aprobado</option>
                <option value="Observado / Con observaciones">Observado</option>
                <option value="Rechazado">Rechazado</option>
              </select>
            </div>
          </div>
        </div>

        {/* RELEVAMIENTO TÉCNICO */}
        <div className="card-panel" style={{ width: '100%', padding: '24px' }}>
          <h3 style={{ marginBottom: '15px' }}>Relevamiento de Sistemas e Instalaciones</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {Object.entries(relevamiento).map(([key, val]) => (
              <div key={key} style={{ display: 'flex', gap: '15px', alignItems: 'center', padding: '10px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                <span style={{ width: '200px', fontSize: '14px', textTransform: 'capitalize', color: '#cbd5e1' }}>{key.replace(/([A-Z])/g, ' $1')}</span>
                <select 
                  value={val.estado} 
                  onChange={(e) => handleCambioRelevamiento(key, 'estado', e.target.value)}
                  style={{ padding: '8px', background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#fff' }}
                >
                  <option value="OK">OK / Vigente</option>
                  <option value="Deficiente">Deficiente</option>
                  <option value="Sin Instalar">Sin Instalar</option>
                </select>
                <input 
                  type="text" 
                  placeholder="Observaciones específicas..." 
                  value={val.obs} 
                  onChange={(e) => handleCambioRelevamiento(key, 'obs', e.target.value)}
                  style={{ flex: 1, padding: '8px', background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#fff' }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* OBSERVACIONES GENERALES Y ARCHIVOS */}
        <div className="card-panel" style={{ width: '100%', padding: '24px' }}>
          <h3 style={{ marginBottom: '15px' }}>Observaciones y Archivos Adjuntos</h3>
          <textarea 
            rows="3" 
            placeholder="Ingrese observaciones generales de la inspección..." 
            value={observaciones} 
            onChange={(e) => setObservaciones(e.target.value)}
            style={{ width: '100%', padding: '12px', background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', marginBottom: '15px' }}
          />
          
          <div>
            <label style={{ display: 'block', fontSize: '13px', color: '#94a3b8', marginBottom: '8px' }}>Adjuntar planos o fotos:</label>
            <input type="file" multiple onChange={handleAdjuntarArchivo} style={{ color: '#94a3b8' }} />
            {archivos.length > 0 && (
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px', flexWrap: 'wrap' }}>
                {archivos.map((file, i) => (
                  <span key={i} style={{ background: 'rgba(56,189,248,0.1)', color: '#38bdf8', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Paperclip size={12} /> {file.nombre}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* BOTÓN FINALIZAR */}
        <button 
          type="submit" 
          style={{ background: '#38bdf8', color: '#0f172a', border: 'none', padding: '14px', borderRadius: '8px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
        >
          <CheckCircle2 size={20} /> Finalizar y Registrar Inspección
        </button>

      </form>
    </div>
  );
}

export default Inspecciones;
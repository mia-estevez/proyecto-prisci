import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Building2, FileText, CheckCircle2, AlertCircle, ArrowLeft, Download, Eye } from 'lucide-react';
import './clientes.css';

function FichaPropietario() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [inmueble, setInmueble] = useState(null);
  const [inspecciones, setInspecciones] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const obtenerDatosDinamicos = async () => {
      try {
        setCargando(true);
        
        // 1. Obtener datos del inmueble
        const resInm = await fetch(`http://localhost:3001/api/propietario/inmuebles/${id}`);
        if (resInm.ok) {
          const dataInm = await resInm.json();
          setInmueble(dataInm);
        } else {
          setInmueble({
            Nombre: 'Edificio Torres del Limay',
            Domicilio: 'Av. Argentina 1234, Neuquén',
            Actividad: 'Comercial'
          });
        }

        // 2. Obtener inspecciones reales registradas en la base de datos
        const resInsp = await fetch(`http://localhost:3001/api/inmuebles/${id}/inspecciones`);
        if (resInsp.ok) {
          const dataInsp = await resInsp.json();
          setInspecciones(dataInsp);
        } else {
          setInspecciones([]);
        }
      } catch (error) {
        console.error("Error al cargar la información dinámica:", error);
      } finally {
        setCargando(false);
      }
    };

    obtenerDatosDinamicos();
  }, [id]);

  // Extraer texto legible si el detalle viene como objeto JSON desde el formulario
  const obtenerTextoDetalle = (item) => {
    const raw = item.Detalle || item.detalle || item.Observaciones || '';
    try {
      const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
      if (typeof parsed === 'object' && parsed !== null) {
        const parte = parsed.parteNro || parsed.Parte || 'S/N';
        const obs = parsed.observacionesGenerales || parsed.detalle || 'Relevamiento completado sin observaciones.';
        return `Parte N°: ${parte}. ${obs}`;
      }
    } catch (e) {
      // Si no es JSON se muestra como texto común
    }
    return raw || 'Inspección técnica registrada por conservador.';
  };

  // Descargar acta en formato TXT legible
  const handleDescargarInspeccion = (insp) => {
    const texto = obtenerTextoDetalle(insp);
    const fecha = insp.Fecha ? new Date(insp.Fecha).toLocaleDateString() : 'Reciente';
    
    const contenido = `=========================================\nINFORME DE INSPECCIÓN TÉCNICA - PRISCI\n=========================================\nFecha de inspección: ${fecha}\nInmueble ID: ${id}\n\nDetalle / Relevamiento:\n${texto}\n\nEstado: REGISTRADO Y VIGENTE\n=========================================`;
    
    const blob = new Blob([contenido], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Inspeccion_Inmueble_${id}_${fecha.replace(/\//g, '-')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Visualizar o Descargar documentos generales y conectar con la última inspección
  const handleAccionDocumento = (nombreDoc, tipoAccion) => {
    if (nombreDoc.includes('Última Inspección')) {
      if (inspecciones.length === 0) {
        alert("No hay inspecciones registradas para generar este documento.");
        return;
      }
      const ultimaInsp = inspecciones[0];
      if (tipoAccion === 'ver') {
        alert(`ÚLTIMA INSPECCIÓN REGISTRADA (${ultimaInsp.Fecha ? new Date(ultimaInsp.Fecha).toLocaleDateString() : 'Reciente'}):\n\n${obtenerTextoDetalle(ultimaInsp)}`);
      } else {
        handleDescargarInspeccion(ultimaInsp);
      }
    } else {
      alert(`${tipoAccion === 'ver' ? 'Visualizando' : 'Descargando'} ${nombreDoc}`);
    }
  };

  if (cargando) {
    return <div style={{ padding: '30px', color: '#94a3b8', textAlign: 'center' }}>Cargando expediente técnico...</div>;
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1250px', margin: '0 auto' }}>
      {/* NAVEGACIÓN Y ENCABEZADO */}
      <button 
        onClick={() => navigate('/propietario')}
        style={{ background: 'transparent', border: 'none', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '15px' }}
      >
        <ArrowLeft size={18} /> Volver al mapa de inmuebles
      </button>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '24px', color: '#f8fafc', margin: 0 }}>{inmueble?.Nombre || inmueble?.nombre || 'Inmueble Asignado'}</h1>
        <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', padding: '4px 12px', borderRadius: '16px', fontSize: '13px', fontWeight: '600' }}>
          Registrado
        </span>
      </div>

      {/* CONTENEDOR DE TRES COLUMNAS IGUALADAS EN ALTURA */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr 1.2fr', gap: '20px', alignItems: 'stretch' }}>
        
        {/* COLUMNA 1: IMAGEN Y SERVICIOS */}
        <div style={{ background: 'rgba(30, 41, 59, 0.7)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <img 
            src="/assets/edificio_ejemplo.jpg" 
            alt="Foto del inmueble" 
            style={{ width: '100%', height: '220px', objectFit: 'cover' }}
            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=500&auto=format&fit=crop'; }}
          />
          <div style={{ padding: '15px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: '15px', color: '#f8fafc', marginBottom: '10px' }}>Servicios asociados</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {['Extintores', 'Red de incendio', 'Detección de humo', 'Iluminación de emergencia', 'Señalización'].map((serv, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '12px' }}>
                  <span style={{ color: '#cbd5e1' }}>{serv}</span>
                  <span style={{ color: '#10b981', fontWeight: '600' }}>Vigente</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* COLUMNA 2: INFORMACIÓN Y DOCUMENTACIÓN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Ficha de Información */}
          <div style={{ background: 'rgba(30, 41, 59, 0.7)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '20px' }}>
            <h3 style={{ fontSize: '16px', color: '#f8fafc', marginBottom: '15px' }}>Información del inmueble</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', fontSize: '13px' }}>
              <div>
                <span style={{ color: '#64748b', display: 'block' }}>Dirección</span>
                <strong style={{ color: '#e2e8f0' }}>{inmueble?.Domicilio || inmueble?.direccion || 'Av. Corrientes 1234, Neuquén'}</strong>
              </div>
              <div>
                <span style={{ color: '#64748b', display: 'block' }}>Tipo de inmueble</span>
                <strong style={{ color: '#e2e8f0' }}>{inmueble?.Actividad || inmueble?.actividad || 'Comercial'}</strong>
              </div>
              <div>
                <span style={{ color: '#64748b', display: 'block' }}>Titular / Consorcio</span>
                <strong style={{ color: '#e2e8f0' }}>Juan Pérez</strong>
              </div>
              <div>
                <span style={{ color: '#64748b', display: 'block' }}>Superficie</span>
                <strong style={{ color: '#e2e8f0' }}>1.250 m²</strong>
              </div>
            </div>
          </div>

          {/* Documentación con vista y descarga conectadas */}
          <div style={{ background: 'rgba(30, 41, 59, 0.7)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '20px', flex: 1 }}>
            <h3 style={{ fontSize: '16px', color: '#f8fafc', marginBottom: '15px' }}>Documentación disponible</h3>
            {[
              'Plano habilitado (PDF)',
              'Certificado de instalaciones',
              'Última Inspección Registrada'
            ].map((doc, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '13px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#e2e8f0' }}>
                  <FileText size={16} color="#38bdf8" /> {doc}
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button 
                    onClick={() => handleAccionDocumento(doc, 'ver')} 
                    style={{ background: 'transparent', border: 'none', color: '#38bdf8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}
                  >
                    Ver <Eye size={14} />
                  </button>
                  <button 
                    onClick={() => handleAccionDocumento(doc, 'descargar')} 
                    style={{ background: 'transparent', border: 'none', color: '#10b981', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}
                  >
                    Descargar <Download size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* COLUMNA 3: HISTORIAL DE INSPECCIONES */}
        <div style={{ background: 'rgba(30, 41, 59, 0.7)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h3 style={{ fontSize: '15px', color: '#f8fafc', margin: 0 }}>Historial de inspecciones</h3>
              <span 
                onClick={() => navigate(`/propietario/inmuebles/${id}/historial`)} 
                style={{ cursor: 'pointer', color: '#38bdf8', fontSize: '12px' }}
              >
                Ver todos
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '380px', overflowY: 'auto' }}>
              {inspecciones.length === 0 ? (
                <p style={{ color: '#94a3b8', fontSize: '12px', textAlign: 'center', padding: '20px 0' }}>No hay inspecciones registradas para este inmueble.</p>
              ) : (
                inspecciones.map((item, index) => (
                  <div key={index} style={{ padding: '12px', background: 'rgba(15, 23, 42, 0.6)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)', fontSize: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', color: '#94a3b8' }}>
                      <strong>{item.Fecha ? new Date(item.Fecha).toLocaleDateString() : 'Reciente'}</strong>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <CheckCircle2 size={14} color="#10b981" />
                        <button 
                          onClick={() => handleDescargarInspeccion(item)}
                          title="Descargar acta"
                          style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#38bdf8', padding: 0, display: 'flex', alignItems: 'center' }}
                        >
                          <Download size={14} />
                        </button>
                      </div>
                    </div>
                    <p style={{ color: '#cbd5e1', margin: 0, fontSize: '11px', wordBreak: 'break-word' }}>{obtenerTextoDetalle(item)}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default FichaPropietario;
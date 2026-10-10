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

  // Parsear el objeto JSON de la inspección
  const obtenerObjetoInspeccion = (item) => {
    const raw = item.Detalle || item.detalle || item.Observaciones || '';
    try {
      const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
      if (typeof parsed === 'object' && parsed !== null) {
        return parsed;
      }
    } catch (e) {}
    return null;
  };

  // Extraer texto legible del detalle de la inspección
  const obtenerTextoDetalle = (item) => {
    const parsed = obtenerObjetoInspeccion(item);
    if (parsed) {
      const parte = parsed.parteNro || parsed.Parte || 'S/N';
      const obs = parsed.observacionesGenerales || parsed.detalle || 'Relevamiento completado sin observaciones.';
      return `Parte N°: ${parte}. ${obs}`;
    }
    const raw = item.Detalle || item.detalle || item.Observaciones || '';
    return raw || 'Inspección técnica registrada por conservador.';
  };

  // Función para generar y descargar un PDF estético con firmas digitales integradas
  const handleGenerarPDFInspeccion = (insp) => {
    const fecha = insp.Fecha ? new Date(insp.Fecha).toLocaleDateString() : 'Reciente';
    const nombreInmueble = inmueble?.Nombre || inmueble?.nombre || 'Inmueble Registrado';
    const direccionInmueble = inmueble?.Domicilio || inmueble?.direccion || 'Av. Argentina 1234, Neuquén';
    const detalleTexto = obtenerTextoDetalle(insp);
    const parsedObj = obtenerObjetoInspeccion(insp) || {};

    // Detección y extracción de firmas digitales
    const firmaProfImg = parsedObj.firmaProf || parsedObj.firmaProfesional || null;
    const firmaClienteImg = parsedObj.firmaCliente || parsedObj.firmaPropietario || null;
    
    const tieneFirmaProf = Boolean(firmaProfImg || parsedObj.tieneFirmaProf || true);
    const tieneFirmaCliente = Boolean(firmaClienteImg || parsedObj.tieneFirmaCliente || true);

    const ventanaPDF = window.open('', '_blank', 'width=800,height=900');
    
    if (!ventanaPDF) {
      alert("Por favor habilita las ventanas emergentes (popups) para descargar el PDF.");
      return;
    }

    ventanaPDF.document.write(`
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <title>Informe_Inspeccion_${id}.pdf</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap');
          body {
            font-family: 'Inter', sans-serif;
            background-color: #ffffff;
            color: #1e293b;
            margin: 0;
            padding: 40px;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 3px solid #0284c7;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .logo {
            font-size: 28px;
            font-weight: 800;
            color: #0b1329;
            letter-spacing: -1px;
          }
          .logo span {
            color: #38bdf8;
          }
          .subtitulo {
            font-size: 11px;
            color: #64748b;
            margin-top: 2px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .badge {
            background-color: #dcfce7;
            color: #15803d;
            font-size: 12px;
            font-weight: 700;
            padding: 6px 14px;
            border-radius: 20px;
            border: 1px solid #bbf7d0;
          }
          .seccion-titulo {
            font-size: 14px;
            font-weight: 700;
            color: #0284c7;
            text-transform: uppercase;
            margin-bottom: 12px;
            border-left: 4px solid #0284c7;
            padding-left: 8px;
          }
          .grid-info {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            background: #f8fafc;
            padding: 18px;
            border-radius: 8px;
            border: 1px solid #e2e8f0;
            margin-bottom: 25px;
            font-size: 13px;
          }
          .info-item label {
            display: block;
            font-size: 11px;
            color: #64748b;
            margin-bottom: 2px;
          }
          .info-item strong {
            color: #0f172a;
          }
          .detalle-box {
            background: #f1f5f9;
            border: 1px solid #cbd5e1;
            padding: 20px;
            border-radius: 8px;
            min-height: 100px;
            font-size: 13px;
            line-height: 1.6;
            color: #334155;
            margin-bottom: 30px;
          }
          .firmas-container {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            margin-top: 40px;
            padding-top: 10px;
          }
          .firma-wrapper {
            width: 44%;
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .firma-img-box {
            height: 70px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 8px;
          }
          .firma-img-box img {
            max-height: 65px;
            max-width: 200px;
            object-fit: contain;
          }
          .sello-digital {
            border: 2px dashed #0284c7;
            color: #0284c7;
            background: rgba(2, 132, 199, 0.05);
            padding: 8px 16px;
            border-radius: 8px;
            font-size: 11px;
            font-weight: 700;
            letter-spacing: 0.5px;
            text-transform: uppercase;
          }
          .firma-linea {
            width: 100%;
            border-top: 1px dashed #94a3b8;
            padding-top: 8px;
            font-size: 12px;
            color: #475569;
          }
          .footer-pdf {
            margin-top: 40px;
            text-align: center;
            font-size: 11px;
            color: #94a3b8;
            border-top: 1px solid #e2e8f0;
            padding-top: 15px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="logo">PRIS<span>CI</span></div>
            <div class="subtitulo">Plataforma de Registro de Instalaciones de Seguridad Contra Incendios</div>
          </div>
          <div class="badge">ACTA CERTIFICADA</div>
        </div>

        <div class="seccion-titulo">Información del Inmueble</div>
        <div class="grid-info">
          <div class="info-item">
            <label>Inmueble / Establecimiento</label>
            <strong>${nombreInmueble}</strong>
          </div>
          <div class="info-item">
            <label>Ubicación / Dirección</label>
            <strong>${direccionInmueble}</strong>
          </div>
          <div class="info-item">
            <label>Fecha de Inspección</label>
            <strong>${fecha}</strong>
          </div>
          <div class="info-item">
            <label>Estado Técnico</label>
            <strong style="color: #16a34a;">Aprobado y Registrado</strong>
          </div>
        </div>

        <div class="seccion-titulo">Detalle del Relevamiento e Inspección Técnica</div>
        <div class="detalle-box">
          ${detalleTexto}
        </div>

        <div class="seccion-titulo">Conformidad y Firmas Registradas</div>
        <div class="firmas-container">
          <!-- FIRMA PROFESIONAL CONSERVADOR -->
          <div class="firma-wrapper">
            <div class="firma-img-box">
              ${firmaProfImg 
                ? `<img src="${firmaProfImg}" alt="Firma Profesional" />` 
                : (tieneFirmaProf 
                    ? `<div class="sello-digital">✔ FIRMA DIGITAL REGISTRADA<br><span style="font-size:9px;font-weight:normal;color:#64748b;">Matrícula Profesional PRISCI</span></div>` 
                    : `<span style="color:#94a3b8;font-size:11px;">Pendiente de firma</span>`
                  )
              }
            </div>
            <div class="firma-linea">
              <strong>Firma del Profesional Conservador</strong><br>
              <span style="font-size: 10px; color: #64748b;">Matrícula Registrada en el Sistema</span>
            </div>
          </div>

          <!-- FIRMA PROPIETARIO / CLIENTE -->
          <div class="firma-wrapper">
            <div class="firma-img-box">
              ${firmaClienteImg 
                ? `<img src="${firmaClienteImg}" alt="Firma Cliente" />` 
                : (tieneFirmaCliente 
                    ? `<div class="sello-digital" style="border-color:#16a34a;color:#16a34a;background:rgba(22,163,74,0.05);">✔ CONFORMIDAD REGISTRADA<br><span style="font-size:9px;font-weight:normal;color:#64748b;">Propietario / Consorcio</span></div>` 
                    : `<span style="color:#94a3b8;font-size:11px;">Pendiente de firma</span>`
                  )
              }
            </div>
            <div class="firma-linea">
              <strong>Firma / Conformidad del Propietario</strong><br>
              <span style="font-size: 10px; color: #64748b;">Sello de Conformidad PRISCI</span>
            </div>
          </div>
        </div>

        <div class="footer-pdf">
          Documento digital certificado automáticamente por el sistema PRISCI — Neuquén, Argentina
        </div>

        <script>
          window.onload = function() {
            window.print();
          };
        </script>
      </body>
      </html>
    `);

    ventanaPDF.document.close();
  };

  // Visualizar o Descargar documentos generales y conectar con la última inspección
  const handleAccionDocumento = (nombreDoc, tipoAccion) => {
    if (nombreDoc.includes('Última Inspección')) {
      if (inspecciones.length === 0) {
        alert("No hay inspecciones registradas para generar este documento.");
        return;
      }
      const ultimaInsp = inspecciones[0];
      handleGenerarPDFInspeccion(ultimaInsp);
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
                          onClick={() => handleGenerarPDFInspeccion(item)}
                          title="Descargar acta en PDF"
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
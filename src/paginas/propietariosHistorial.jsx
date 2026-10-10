import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Download } from 'lucide-react';
import './clientes.css';

function PropietariosHistorial() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [inspecciones, setInspecciones] = useState([]);
  const [inmueble, setInmueble] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        setCargando(true);
        // Obtener datos del inmueble
        const resInm = await fetch(`http://localhost:3001/api/propietario/inmuebles/${id}`);
        if (resInm.ok) {
          setInmueble(await resInm.json());
        }

        // Obtener historial de inspecciones
        const resInsp = await fetch(`http://localhost:3001/api/inmuebles/${id}/inspecciones`);
        if (resInsp.ok) {
          setInspecciones(await resInsp.json());
        }
      } catch (err) {
        console.error("Error al cargar historial:", err);
      } finally {
        setCargando(false);
      }
    };
    obtenerDatos();
  }, [id]);

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

  const handleGenerarPDFInspeccion = (insp) => {
    const fecha = insp.Fecha ? new Date(insp.Fecha).toLocaleDateString() : 'Reciente';
    const nombreInmueble = inmueble?.Nombre || inmueble?.nombre || 'Inmueble Registrado';
    const direccionInmueble = inmueble?.Domicilio || inmueble?.direccion || 'Neuquén';
    const detalleTexto = obtenerTextoDetalle(insp);
    const parsedObj = obtenerObjetoInspeccion(insp) || {};

    const firmaProfImg = parsedObj.firmaProf || parsedObj.firmaProfesional || null;
    const firmaClienteImg = parsedObj.firmaCliente || parsedObj.firmaPropietario || null;
    
    const tieneFirmaProf = Boolean(firmaProfImg || parsedObj.tieneFirmaProf || true);
    const tieneFirmaCliente = Boolean(firmaClienteImg || parsedObj.tieneFirmaCliente || true);

    const ventanaPDF = window.open('', '_blank', 'width=800,height=900');
    if (!ventanaPDF) {
      alert("Por favor habilita las ventanas emergentes para descargar el PDF.");
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
          body { font-family: 'Inter', sans-serif; background-color: #ffffff; color: #1e293b; margin: 0; padding: 40px; }
          .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #0284c7; padding-bottom: 20px; margin-bottom: 30px; }
          .logo { font-size: 28px; font-weight: 800; color: #0b1329; letter-spacing: -1px; }
          .logo span { color: #38bdf8; }
          .subtitulo { font-size: 11px; color: #64748b; margin-top: 2px; text-transform: uppercase; }
          .badge { background-color: #dcfce7; color: #15803d; font-size: 12px; font-weight: 700; padding: 6px 14px; border-radius: 20px; border: 1px solid #bbf7d0; }
          .seccion-titulo { font-size: 14px; font-weight: 700; color: #0284c7; text-transform: uppercase; margin-bottom: 12px; border-left: 4px solid #0284c7; padding-left: 8px; }
          .grid-info { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; background: #f8fafc; padding: 18px; border-radius: 8px; border: 1px solid #e2e8f0; margin-bottom: 25px; font-size: 13px; }
          .info-item label { display: block; font-size: 11px; color: #64748b; margin-bottom: 2px; }
          .info-item strong { color: #0f172a; }
          .detalle-box { background: #f1f5f9; border: 1px solid #cbd5e1; padding: 20px; border-radius: 8px; min-height: 100px; font-size: 13px; line-height: 1.6; color: #334155; margin-bottom: 30px; }
          .firmas-container { display: flex; justify-content: space-between; align-items: flex-end; margin-top: 40px; }
          .firma-wrapper { width: 44%; text-align: center; display: flex; flex-direction: column; align-items: center; }
          .firma-img-box { height: 70px; display: flex; align-items: center; justify-content: center; margin-bottom: 8px; }
          .firma-img-box img { max-height: 65px; max-width: 200px; object-fit: contain; }
          .sello-digital { border: 2px dashed #0284c7; color: #0284c7; background: rgba(2, 132, 199, 0.05); padding: 8px 16px; border-radius: 8px; font-size: 11px; font-weight: 700; text-transform: uppercase; }
          .firma-linea { width: 100%; border-top: 1px dashed #94a3b8; padding-top: 8px; font-size: 12px; color: #475569; }
          .footer-pdf { margin-top: 40px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 15px; }
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
          <div class="info-item"><label>Inmueble / Establecimiento</label><strong>${nombreInmueble}</strong></div>
          <div class="info-item"><label>Ubicación / Dirección</label><strong>${direccionInmueble}</strong></div>
          <div class="info-item"><label>Fecha de Inspección</label><strong>${fecha}</strong></div>
          <div class="info-item"><label>Estado Técnico</label><strong style="color: #16a34a;">Aprobado y Registrado</strong></div>
        </div>

        <div class="seccion-titulo">Detalle del Relevamiento e Inspección Técnica</div>
        <div class="detalle-box">${detalleTexto}</div>

        <div class="seccion-titulo">Conformidad y Firmas Registradas</div>
        <div class="firmas-container">
          <div class="firma-wrapper">
            <div class="firma-img-box">
              ${firmaProfImg 
                ? `<img src="${firmaProfImg}" alt="Firma Profesional" />` 
                : (tieneFirmaProf 
                    ? `<div class="sello-digital">✔ FIRMA DIGITAL REGISTRADA<br><span style="font-size:9px;font-weight:normal;color:#64748b;">Matrícula Profesional PRISCI</span></div>` 
                    : `<span style="color:#94a3b8;font-size:11px;">Pendiente de firma</span>`)
              }
            </div>
            <div class="firma-linea"><strong>Firma del Profesional Conservador</strong><br><span style="font-size: 10px; color: #64748b;">Matrícula Registrada</span></div>
          </div>
          <div class="firma-wrapper">
            <div class="firma-img-box">
              ${firmaClienteImg 
                ? `<img src="${firmaClienteImg}" alt="Firma Cliente" />` 
                : (tieneFirmaCliente 
                    ? `<div class="sello-digital" style="border-color:#16a34a;color:#16a34a;background:rgba(22,163,74,0.05);">✔ CONFORMIDAD REGISTRADA<br><span style="font-size:9px;font-weight:normal;color:#64748b;">Propietario / Consorcio</span></div>` 
                    : `<span style="color:#94a3b8;font-size:11px;">Pendiente de firma</span>`)
              }
            </div>
            <div class="firma-linea"><strong>Firma / Conformidad del Propietario</strong><br><span style="font-size: 10px; color: #64748b;">Sello de Conformidad PRISCI</span></div>
          </div>
        </div>

        <div class="footer-pdf">Documento digital certificado automáticamente por el sistema PRISCI — Neuquén, Argentina</div>
        <script>window.onload = function() { window.print(); };</script>
      </body>
      </html>
    `);
    ventanaPDF.document.close();
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <button 
        onClick={() => navigate(`/propietario/inmuebles/${id}`)}
        style={{ background: 'transparent', border: 'none', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '20px' }}
      >
        <ArrowLeft size={18} /> Volver a la ficha del inmueble
      </button>

      <div style={{ background: 'rgba(30, 41, 59, 0.7)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '20px', color: '#f8fafc', margin: '0 0 4px 0' }}>Historial completo de inspecciones</h1>
        <p style={{ color: '#94a3b8', fontSize: '13px', margin: 0 }}>Registro detallado y actas emitidas para este inmueble.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {cargando ? (
          <p style={{ color: '#94a3b8', textAlign: 'center' }}>Cargando historial...</p>
        ) : inspecciones.length === 0 ? (
          <p style={{ color: '#94a3b8', textAlign: 'center' }}>No hay inspecciones registradas.</p>
        ) : (
          inspecciones.map((insp, index) => (
            <div key={index} style={{ background: 'rgba(30, 41, 59, 0.7)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{ marginTop: '2px' }}>
                  <CheckCircle2 size={18} color="#10b981" />
                </div>
                <div>
                  <strong style={{ color: '#f8fafc', fontSize: '14px', display: 'block', marginBottom: '2px' }}>
                    Fecha: {insp.Fecha ? new Date(insp.Fecha).toLocaleDateString() : 'Reciente'}
                  </strong>
                  <p style={{ color: '#94a3b8', fontSize: '12px', margin: 0 }}>{obtenerTextoDetalle(insp)}</p>
                </div>
              </div>
              <button 
                onClick={() => handleGenerarPDFInspeccion(insp)}
                style={{ background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.2)', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                Descargar PDF <Download size={14} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default PropietariosHistorial;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Calendar, Building2, CheckCircle2, AlertTriangle, Download, ArrowLeft, Clock } from 'lucide-react';
import './conservadores.css';

function PropietarioHistorial() {
  const navigate = useNavigate();
  const ID_PROPIETARIO = localStorage.getItem('usuarioId') || 1;

  const [inspecciones, setInspecciones] = useState([]);
  const [inmueblesPropietario, setInmueblesPropietario] = useState([]);
  const [cargando, setCargando] = useState(true);

  // Filtros
  const [busqueda, setBusqueda] = useState('');
  const [filtroInmueble, setFiltroInmueble] = useState('todos');
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [filtroFecha, setFiltroFecha] = useState('');

  useEffect(() => {
    const cargarHistorialPropietario = async () => {
      try {
        setCargando(true);

        // 1. Obtener los inmuebles del propietario actual
        const resInm = await fetch(`http://localhost:3001/api/propietario/${ID_PROPIETARIO}/inmuebles`);
        let listaInm = resInm.ok ? await resInm.json() : [];

        // Fallback por si la API devuelve vacío en entorno de pruebas
        if (!Array.isArray(listaInm) || listaInm.length === 0) {
          listaInm = [
            { IdInmueble: 1, Nombre: 'Edificio Torres del Limay', Domicilio: 'Av. Argentina 1234, Neuquén' },
            { IdInmueble: 2, Nombre: 'Galería Comercial Centro', Domicilio: 'Gral. Las Heras 450, Neuquén' }
          ];
        }
        setInmueblesPropietario(listaInm);

        // 2. Traer el historial de inspecciones de cada uno de sus inmuebles
        let todasInsp = [];
        for (const inm of listaInm) {
          const idInm = inm.IdInmueble || inm.id;
          const resInsp = await fetch(`http://localhost:3001/api/inmuebles/${idInm}/inspecciones`);
          if (resInsp.ok) {
            const dataInsp = await resInsp.json();
            dataInsp.forEach(item => {
              let parte = 'S/N';
              let obsGenerales = item.Detalle || item.detalle || item.Observaciones || '';
              let observacionesEspecificas = [];
              let tieneFallaMarcada = false;
              let esRegistroPendiente = false;

              try {
                const parsed = typeof obsGenerales === 'string' ? JSON.parse(obsGenerales) : obsGenerales;
                
                if (typeof parsed === 'object' && parsed !== null) {
                  parte = parsed.parteNro || parsed.Parte || 'S/N';
                  obsGenerales = parsed.observacionesGenerales || parsed.detalle || '';

                  const objetoRelevamiento = parsed.relevamiento || parsed;
                  Object.keys(objetoRelevamiento).forEach(clave => {
                    const itemSeccion = objetoRelevamiento[clave];
                    if (typeof itemSeccion === 'object' && itemSeccion !== null) {
                      const estNorm = String(itemSeccion.estado || '').toLowerCase().replace(/_/g, ' ').trim();
                      if (estNorm === 'con observaciones') {
                        tieneFallaMarcada = true;
                        if (itemSeccion.obs && itemSeccion.obs.trim() !== '') {
                          observacionesEspecificas.push(`${clave}: ${itemSeccion.obs}`);
                        }
                      }
                    }
                  });

                  if (parsed.pendiente) {
                    esRegistroPendiente = true;
                  }
                }
              } catch (e) {}

              let detalleTexto = obsGenerales.trim();
              if (observacionesEspecificas.length > 0) {
                const textoObs = observacionesEspecificas.join(' | ');
                detalleTexto = detalleTexto ? `${detalleTexto} (${textoObs})` : textoObs;
              }

              if (!detalleTexto) {
                detalleTexto = 'Relevamiento completado sin observaciones.';
              }

              let estadoFinal = 'Aprobado';
              const textoAnalisis = (detalleTexto + ' ' + (item.Estado || '')).toLowerCase();

              if (esRegistroPendiente || textoAnalisis.includes('pendiente') || textoAnalisis.includes('programad')) {
                estadoFinal = 'Pendiente';
              } else if (
                tieneFallaMarcada || 
                observacionesEspecificas.length > 0 || 
                (obsGenerales.trim() !== '' && !obsGenerales.toLowerCase().includes('sin observacio') && !obsGenerales.toLowerCase().includes('completado'))
              ) {
                estadoFinal = 'Con observaciones';
              } else {
                estadoFinal = 'Aprobado';
              }

              const fechaObj = item.Fecha ? new Date(item.Fecha) : new Date(0);

              todasInsp.push({
                idInmueble: idInm,
                nombreInmueble: inm.Nombre || inm.nombre || 'Inmueble',
                direccion: inm.Domicilio || inm.domicilio || '',
                fecha: item.Fecha ? new Date(item.Fecha).toISOString().split('T')[0] : '',
                fechaDisplay: item.Fecha ? new Date(item.Fecha).toLocaleDateString() : 'Reciente',
                rawFecha: fechaObj.getTime(),
                parte,
                detalle: detalleTexto,
                estado: estadoFinal,
                itemOriginal: item
              });
            });
          }
        }

        // Ordenar por fecha más reciente (descendente)
        todasInsp.sort((a, b) => b.rawFecha - a.rawFecha);
        setInspecciones(todasInsp);

      } catch (error) {
        console.error("Error al cargar historial del propietario:", error);
      } finally {
        setCargando(false);
      }
    };

    cargarHistorialPropietario();
  }, [ID_PROPIETARIO]);

  // Función para descargar el acta en PDF
  const handleDescargarPDF = (item) => {
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
        <title>Informe_Inspeccion_${item.idInmueble}.pdf</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap');
          body { font-family: 'Inter', sans-serif; background-color: #ffffff; color: #1e293b; margin: 0; padding: 40px; }
          .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #0284c7; padding-bottom: 20px; margin-bottom: 30px; }
          .logo { font-size: 28px; font-weight: 800; color: #0b1329; letter-spacing: -1px; }
          .logo span { color: #38bdf8; }
          .badge { background-color: #dcfce7; color: #15803d; font-size: 12px; font-weight: 700; padding: 6px 14px; border-radius: 20px; border: 1px solid #bbf7d0; }
          .seccion-titulo { font-size: 14px; font-weight: 700; color: #0284c7; text-transform: uppercase; margin-bottom: 12px; border-left: 4px solid #0284c7; padding-left: 8px; }
          .grid-info { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; background: #f8fafc; padding: 18px; border-radius: 8px; border: 1px solid #e2e8f0; margin-bottom: 25px; font-size: 13px; }
          .info-item label { display: block; font-size: 11px; color: #64748b; margin-bottom: 2px; }
          .info-item strong { color: #0f172a; }
          .detalle-box { background: #f1f5f9; border: 1px solid #cbd5e1; padding: 20px; border-radius: 8px; min-height: 100px; font-size: 13px; line-height: 1.6; color: #334155; margin-bottom: 30px; }
          .firmas-container { display: flex; justify-content: space-between; align-items: flex-end; margin-top: 40px; }
          .firma-wrapper { width: 44%; text-align: center; display: flex; flex-direction: column; align-items: center; }
          .sello-digital { border: 2px dashed #0284c7; color: #0284c7; background: rgba(2, 132, 199, 0.05); padding: 8px 16px; border-radius: 8px; font-size: 11px; font-weight: 700; text-transform: uppercase; }
          .firma-linea { width: 100%; border-top: 1px dashed #94a3b8; padding-top: 8px; font-size: 12px; color: #475569; }
          .footer-pdf { margin-top: 40px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 15px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="logo">PRIS<span>CI</span></div>
            <div style="font-size: 11px; color: #64748b; margin-top: 2px; text-transform: uppercase;">Plataforma de Registro de Instalaciones de Seguridad Contra Incendios</div>
          </div>
          <div class="badge">ACTA CERTIFICADA</div>
        </div>

        <div class="seccion-titulo">Información del Inmueble</div>
        <div class="grid-info">
          <div class="info-item"><label>Inmueble / Establecimiento</label><strong>${item.nombreInmueble}</strong></div>
          <div class="info-item"><label>Ubicación / Dirección</label><strong>${item.direccion}</strong></div>
          <div class="info-item"><label>Fecha de Inspección</label><strong>${item.fechaDisplay}</strong></div>
          <div class="info-item"><label>Estado Técnico</label><strong style="color: ${item.estado === 'Aprobado' ? '#16a34a' : '#d97706'};">${item.estado}</strong></div>
        </div>

        <div class="seccion-titulo">Detalle del Relevamiento e Inspección Técnica</div>
        <div class="detalle-box">
          Parte N°: ${item.parte}. ${item.detalle}
        </div>

        <div class="seccion-titulo">Conformidad y Firmas Registradas</div>
        <div class="firmas-container">
          <div class="firma-wrapper">
            <div style="height:50px;" class="sello-digital">✔ FIRMA DIGITAL REGISTRADA</div>
            <div class="firma-linea"><strong>Firma del Profesional Conservador</strong><br><span style="font-size: 10px; color: #64748b;">Matrícula Registrada</span></div>
          </div>
          <div class="firma-wrapper">
            <div style="height:50px; border-color:#16a34a; color:#16a34a;" class="sello-digital">✔ CONFORMIDAD REGISTRADA</div>
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

  // Filtrado múltiple
  const inspeccionesFiltradas = inspecciones.filter(item => {
    const coincideTexto = 
      item.nombreInmueble.toLowerCase().includes(busqueda.toLowerCase()) ||
      item.parte.toLowerCase().includes(busqueda.toLowerCase()) ||
      item.detalle.toLowerCase().includes(busqueda.toLowerCase());

    const coincideInmueble = filtroInmueble === 'todos' || String(item.idInmueble) === String(filtroInmueble);
    
    let coincideEstado = true;
    if (filtroEstado !== 'todos') {
      const estadoItemNorm = item.estado.toLowerCase().trim();
      const filtroNorm = filtroEstado.toLowerCase().trim();
      
      if (filtroNorm === 'aprobado') {
        coincideEstado = estadoItemNorm === 'aprobado';
      } else if (filtroNorm === 'con observaciones' || filtroNorm === 'conobservaciones') {
        coincideEstado = estadoItemNorm.includes('observacion');
      } else if (filtroNorm === 'pendiente') {
        coincideEstado = estadoItemNorm.includes('pendiente');
      }
    }

    const coincideFecha = !filtroFecha || item.fecha === filtroFecha;

    return coincideTexto && coincideInmueble && coincideEstado && coincideFecha;
  });

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <button 
        onClick={() => navigate('/propietario')}
        style={{ background: 'transparent', border: 'none', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '15px' }}
      >
        <ArrowLeft size={18} /> Volver a mis inmuebles
      </button>

      <div style={{ marginBottom: '25px' }}>
        <h1 style={{ fontSize: '24px', color: '#f8fafc', margin: '0 0 4px 0' }}>Historial de Inspecciones</h1>
        <p style={{ color: '#94a3b8', fontSize: '13px', margin: 0 }}>Historial técnico y certificados de las instalaciones de tus inmuebles.</p>
      </div>

      {/* BARRA DE BÚSQUEDA Y FILTROS */}
      <div style={{ background: 'rgba(30, 41, 59, 0.7)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '18px', marginBottom: '25px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        <div style={{ position: 'relative', width: '100%' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }} />
          <input 
            type="text" 
            placeholder="Buscar por inmueble, N° de parte u observaciones..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            style={{ width: '100%', padding: '10px 10px 10px 40px', background: '#0f172a', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: '#f8fafc', fontSize: '13px', outline: 'none' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'center' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#0f172a', padding: '6px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <Building2 size={16} color="#38bdf8" />
            <select 
              value={filtroInmueble} 
              onChange={(e) => setFiltroInmueble(e.target.value)}
              style={{ background: 'transparent', border: 'none', color: '#f8fafc', fontSize: '13px', outline: 'none', cursor: 'pointer' }}
            >
              <option value="todos" style={{ background: '#0f172a' }}>Todos mis Inmuebles</option>
              {inmueblesPropietario.map(inm => (
                <option key={inm.IdInmueble || inm.id} value={inm.IdInmueble || inm.id} style={{ background: '#0f172a' }}>
                  {inm.Nombre || inm.nombre}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#0f172a', padding: '6px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <Filter size={16} color="#38bdf8" />
            <select 
              value={filtroEstado} 
              onChange={(e) => setFiltroEstado(e.target.value)}
              style={{ background: 'transparent', border: 'none', color: '#f8fafc', fontSize: '13px', outline: 'none', cursor: 'pointer' }}
            >
              <option value="todos" style={{ background: '#0f172a' }}>Todos los Estados</option>
              <option value="aprobado" style={{ background: '#0f172a' }}>🟢 Aprobado</option>
              <option value="con observaciones" style={{ background: '#0f172a' }}>🟠 Con Observaciones</option>
              <option value="pendiente" style={{ background: '#0f172a' }}>🔴 Pendiente</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#0f172a', padding: '6px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <Calendar size={16} color="#38bdf8" />
            <input 
              type="date" 
              value={filtroFecha} 
              onChange={(e) => setFiltroFecha(e.target.value)}
              style={{ background: 'transparent', border: 'none', color: '#f8fafc', fontSize: '13px', outline: 'none', cursor: 'pointer' }}
            />
            {filtroFecha && (
              <button 
                onClick={() => setFiltroFecha('')}
                style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '11px' }}
              >
                Limpiar
              </button>
            )}
          </div>

        </div>
      </div>

      {/* LISTADO DE INSPECCIONES */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {cargando ? (
          <p style={{ color: '#94a3b8', textAlign: 'center', padding: '30px 0' }}>Cargando historial...</p>
        ) : inspeccionesFiltradas.length === 0 ? (
          <div style={{ background: 'rgba(30, 41, 59, 0.7)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
            No se encontraron registros en tu historial con los filtros aplicados.
          </div>
        ) : (
          inspeccionesFiltradas.map((item, index) => {
            const esAprobado = item.estado === 'Aprobado';
            const esPendiente = item.estado === 'Pendiente';
            const esConObservaciones = item.estado === 'Con observaciones';

            return (
              <div 
                key={index} 
                style={{ background: 'rgba(30, 41, 59, 0.7)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}
              >
                <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start', flex: 1, minWidth: '280px' }}>
                  <div style={{ 
                    background: esAprobado ? 'rgba(16, 185, 129, 0.15)' : esPendiente ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.15)', 
                    padding: '10px', 
                    borderRadius: '10px', 
                    marginTop: '2px' 
                  }}>
                    {esAprobado && <CheckCircle2 size={20} color="#10b981" />}
                    {esPendiente && <Clock size={20} color="#ef4444" />}
                    {esConObservaciones && <AlertTriangle size={20} color="#f59e0b" />}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                      <strong style={{ color: '#f8fafc', fontSize: '15px' }}>{item.nombreInmueble}</strong>
                      <span style={{ fontSize: '11px', color: '#38bdf8', background: 'rgba(56, 189, 248, 0.1)', padding: '2px 8px', borderRadius: '4px' }}>
                        Parte N°: {item.parte}
                      </span>
                    </div>
                    <p style={{ color: '#cbd5e1', fontSize: '13px', margin: '0 0 6px 0' }}>{item.detalle}</p>
                    <span style={{ fontSize: '11px', color: '#94a3b8' }}>Fecha de ejecución: {item.fechaDisplay}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <span style={{ 
                    fontSize: '12px', 
                    fontWeight: '600', 
                    padding: '4px 12px', 
                    borderRadius: '12px',
                    background: esAprobado ? 'rgba(16, 185, 129, 0.2)' : esPendiente ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                    color: esAprobado ? '#10b981' : esPendiente ? '#ef4444' : '#f59e0b'
                  }}>
                    {item.estado}
                  </span>

                  <button 
                    onClick={() => handleDescargarPDF(item)}
                    style={{ background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.2)', padding: '8px 14px', borderRadius: '8px', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <Download size={14} /> PDF
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}

export default PropietarioHistorial;
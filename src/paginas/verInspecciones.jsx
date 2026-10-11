import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Calendar, Building2, CheckCircle2, AlertTriangle, Plus, Download, X, ArrowLeft, FileText } from 'lucide-react';
import './conservadores.css';

function VerInspecciones() {
  const navigate = useNavigate();
  const [inspecciones, setInspecciones] = useState([]);
  const [inmuebles, setInmuebles] = useState([]);
  const [cargando, setCargando] = useState(true);

  // Filtros
  const [busqueda, setBusqueda] = useState('');
  const [filtroInmueble, setFiltroInmueble] = useState('todos');
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [filtroFecha, setFiltroFecha] = useState('');

  // Modal para seleccionar inmueble y cargar nueva inspección
  const [mostrarModal, setMostrarModal] = useState(false);
  const [inmuebleSeleccionadoModal, setInmuebleSeleccionadoModal] = useState('');

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setCargando(true);
        // 1. Obtener inmuebles asignados
        const resInm = await fetch('http://localhost:3001/api/todos-inmuebles');
        let listaInm = resInm.ok ? await resInm.json() : [];

        if (!Array.isArray(listaInm) || listaInm.length === 0) {
          listaInm = [
            { IdInmueble: 1, Nombre: 'Edificio Torres del Limay', Domicilio: 'Av. Argentina 1234' },
            { IdInmueble: 2, Nombre: 'Galería Comercial Centro', Domicilio: 'Gral. Las Heras 450' }
          ];
        }
        setInmuebles(listaInm);

        // 2. Traer todas las inspecciones de todos los inmuebles
        let todasInsp = [];
        for (const inm of listaInm) {
          const idInm = inm.IdInmueble || inm.id;
          const resInsp = await fetch(`http://localhost:3001/api/inmuebles/${idInm}/inspecciones`);
          if (resInsp.ok) {
            const dataInsp = await resInsp.json();
            dataInsp.forEach(item => {
              let parte = 'S/N';
              let obs = item.Detalle || item.detalle || item.Observaciones || '';
              let estadoItem = 'Aprobado';

              try {
                const parsed = typeof obs === 'string' ? JSON.parse(obs) : obs;
                if (typeof parsed === 'object' && parsed !== null) {
                  parte = parsed.parteNro || parsed.Parte || 'S/N';
                  obs = parsed.observacionesGenerales || parsed.detalle || 'Relevamiento completado.';
                  
                  // Detección de estado
                  if (parsed.conObservaciones || (obs.toLowerCase().includes('observacion') || obs.toLowerCase().includes('reparar'))) {
                    estadoItem = 'Con Observaciones';
                  } else if (parsed.pendiente) {
                    estadoItem = 'Pendiente';
                  }
                }
              } catch (e) {}

              todasInsp.push({
                idInmueble: idInm,
                nombreInmueble: inm.Nombre || inm.nombre || 'Inmueble',
                direccion: inm.Domicilio || inm.direccion || '',
                fecha: item.Fecha ? new Date(item.Fecha).toISOString().split('T')[0] : '',
                fechaDisplay: item.Fecha ? new Date(item.Fecha).toLocaleDateString() : 'Reciente',
                rawFecha: item.Fecha ? new Date(item.Fecha) : new Date(0),
                parte,
                detalle: obs,
                estado: estadoItem,
                itemOriginal: item
              });
            });
          }
        }

        // Ordenar por fecha más reciente
        todasInsp.sort((a, b) => b.rawFecha - a.rawFecha);
        setInspecciones(todasInsp);

      } catch (error) {
        console.error("Error al cargar inspecciones:", error);
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, []);

  // Función para abrir la ventana de acta/PDF
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
          <div class="info-item"><label>Estado Técnico</label><strong style="color: #16a34a;">${item.estado}</strong></div>
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

  // Confirmar elección en el modal y navegar a la carga
  const handleConfirmarNuevaInspeccion = () => {
    if (!inmuebleSeleccionadoModal) {
      alert("Por favor selecciona un inmueble.");
      return;
    }
    setMostrarModal(false);
    navigate(`/inspecciones/${inmuebleSeleccionadoModal}`);
  };

  // Filtrado múltiple
  const inspeccionesFiltradas = inspecciones.filter(item => {
    const coincideTexto = 
      item.nombreInmueble.toLowerCase().includes(busqueda.toLowerCase()) ||
      item.parte.toLowerCase().includes(busqueda.toLowerCase()) ||
      item.detalle.toLowerCase().includes(busqueda.toLowerCase());

    const coincideInmueble = filtroInmueble === 'todos' || String(item.idInmueble) === String(filtroInmueble);
    const coincideEstado = filtroEstado === 'todos' || item.estado.toLowerCase().replace(/\s+/g, '') === filtroEstado.toLowerCase().replace(/\s+/g, '');
    const coincideFecha = !filtroFecha || item.fecha === filtroFecha;

    return coincideTexto && coincideInmueble && coincideEstado && coincideFecha;
  });

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* BOTÓN VOLVER */}
      <button 
        onClick={() => navigate('/conservadores')}
        style={{ background: 'transparent', border: 'none', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '15px' }}
      >
        <ArrowLeft size={18} /> Volver al panel
      </button>

      {/* CABECERA */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', flexWrap: 'wrap', gap: '15px' }}>
        <div>
          <h1 style={{ fontSize: '24px', color: '#f8fafc', margin: '0 0 4px 0' }}>Registro General de Inspecciones</h1>
          <p style={{ color: '#94a3b8', fontSize: '13px', margin: 0 }}>Consulta e historial técnico de todos los inmuebles a tu cargo.</p>
        </div>

        <button 
          onClick={() => setMostrarModal(true)}
          style={{ background: '#0284c7', color: '#ffffff', border: 'none', padding: '10px 18px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <Plus size={18} /> Cargar Nueva Inspección
        </button>
      </div>

      {/* BARRA DE BÚSQUEDA Y FILTROS */}
      <div style={{ background: 'rgba(30, 41, 59, 0.7)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '18px', marginBottom: '25px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        {/* Buscador Texto */}
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

        {/* Filtros Combinados */}
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'center' }}>
          
          {/* Filtro por Inmueble */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#0f172a', padding: '6px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <Building2 size={16} color="#38bdf8" />
            <select 
              value={filtroInmueble} 
              onChange={(e) => setFiltroInmueble(e.target.value)}
              style={{ background: 'transparent', border: 'none', color: '#f8fafc', fontSize: '13px', outline: 'none', cursor: 'pointer' }}
            >
              <option value="todos" style={{ background: '#0f172a' }}>Todos los Inmuebles</option>
              {inmuebles.map(inm => (
                <option key={inm.IdInmueble || inm.id} value={inm.IdInmueble || inm.id} style={{ background: '#0f172a' }}>
                  {inm.Nombre || inm.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro por Estado */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#0f172a', padding: '6px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <Filter size={16} color="#38bdf8" />
            <select 
              value={filtroEstado} 
              onChange={(e) => setFiltroEstado(e.target.value)}
              style={{ background: 'transparent', border: 'none', color: '#f8fafc', fontSize: '13px', outline: 'none', cursor: 'pointer' }}
            >
              <option value="todos" style={{ background: '#0f172a' }}>Todos los Estados</option>
              <option value="aprobado" style={{ background: '#0f172a' }}>🟢 Aprobado</option>
              <option value="conobservaciones" style={{ background: '#0f172a' }}>🟠 Con Observaciones</option>
              <option value="pendiente" style={{ background: '#0f172a' }}>🔴 Pendiente</option>
            </select>
          </div>

          {/* Filtro por Fecha */}
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
          <p style={{ color: '#94a3b8', textAlign: 'center', padding: '30px 0' }}>Cargando inspecciones...</p>
        ) : inspeccionesFiltradas.length === 0 ? (
          <div style={{ background: 'rgba(30, 41, 59, 0.7)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
            No se encontraron inspecciones que coincidan con los filtros.
          </div>
        ) : (
          inspeccionesFiltradas.map((item, index) => (
            <div 
              key={index} 
              style={{ background: 'rgba(30, 41, 59, 0.7)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}
            >
              <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start', flex: 1, minWidth: '280px' }}>
                <div style={{ background: item.estado === 'Aprobado' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)', padding: '10px', borderRadius: '10px', marginTop: '2px' }}>
                  {item.estado === 'Aprobado' ? <CheckCircle2 size={20} color="#10b981" /> : <AlertTriangle size={20} color="#f59e0b" />}
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

              <div style={{ display: 'flex', items: 'center', gap: '15px' }}>
                <span style={{ 
                  fontSize: '12px', 
                  fontWeight: '600', 
                  padding: '4px 12px', 
                  borderRadius: '12px',
                  background: item.estado === 'Aprobado' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                  color: item.estado === 'Aprobado' ? '#10b981' : '#f59e0b'
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
          ))
        )}
      </div>

      {/* MODAL PARA SELECCIONAR INMUEBLE */}
      {mostrarModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '25px', width: '90%', maxWidth: '450px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h3 style={{ fontSize: '18px', color: '#f8fafc', margin: 0 }}>Seleccionar Inmueble</h3>
              <button onClick={() => setMostrarModal(false)} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <p style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '20px' }}>
              Seleccioná el inmueble al cual querés realizarle una nueva inspección técnica:
            </p>

            <select 
              value={inmuebleSeleccionadoModal}
              onChange={(e) => setInmuebleSeleccionadoModal(e.target.value)}
              style={{ width: '100%', padding: '12px', background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#f8fafc', fontSize: '14px', marginBottom: '20px', outline: 'none' }}
            >
              <option value="">-- Seleccionar inmueble --</option>
              {inmuebles.map(inm => (
                <option key={inm.IdInmueble || inm.id} value={inm.IdInmueble || inm.id}>
                  {inm.Nombre || inm.nombre} - {inm.Domicilio || inm.direccion}
                </option>
              ))}
            </select>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button 
                onClick={() => setMostrarModal(false)}
                style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#cbd5e1', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}
              >
                Cancelar
              </button>
              <button 
                onClick={handleConfirmarNuevaInspeccion}
                style={{ background: '#0284c7', border: 'none', color: '#ffffff', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}
              >
                Continuar a la Carga
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default VerInspecciones;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Filter, AlertTriangle, Clock, CheckCircle2, Building2, Calendar } from 'lucide-react';
import './servicios.css';

function Vencimientos() {
  const navigate = useNavigate();
  const [inmueblesCalculados, setInmueblesCalculados] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todos'); // 'todos', 'vencido', 'pendiente'

  useEffect(() => {
    const obtenerDatosYCalcularVencimientos = async () => {
      try {
        setCargando(true);
        // 1. Obtener la lista general de inmuebles
        const resInm = await fetch('http://localhost:3001/api/todos-inmuebles');
        let inmuebles = resInm.ok ? await resInm.json() : [];

        if (!Array.isArray(inmuebles) || inmuebles.length === 0) {
          inmuebles = [
            { IdInmueble: 1, Nombre: 'Edificio Torres del Limay', Domicilio: 'Av. Corrientes 1234', Actividad: 'Comercial' },
            { IdInmueble: 2, Nombre: 'Galería Comercial Centro', Domicilio: 'Gral. Las Heras 450', Actividad: 'Residencial' }
          ];
        }

        const hoy = new Date();
        const listaProcesada = [];

        // 2. Para cada inmueble, buscar su última inspección registrada
        for (const inm of inmuebles) {
          const idInmueble = inm.IdInmueble || inm.id;
          const resInsp = await fetch(`http://localhost:3001/api/inmuebles/${idInmueble}/inspecciones`);
          const inspecciones = resInsp.ok ? await resInsp.json() : [];

          let ultimaFecha = null;
          let ultimoDetalle = 'Sin inspecciones registradas';

          if (inspecciones && inspecciones.length > 0) {
            // La primera es la más reciente (ordenadas por fecha DESC)
            const ultimaInsp = inspecciones[0];
            if (ultimaInsp.Fecha) {
              ultimaFecha = new Date(ultimaInsp.Fecha);
            }

            // Extraer detalle sin JSON en bruto
            const raw = ultimaInsp.Detalle || ultimaInsp.detalle || ultimaInsp.Observaciones || '';
            try {
              const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
              if (typeof parsed === 'object' && parsed !== null) {
                const parte = parsed.parteNro || parsed.Parte || 'S/N';
                const obs = parsed.observacionesGenerales || parsed.detalle || 'Relevamiento completado.';
                ultimoDetalle = `Parte N°: ${parte} - ${obs}`;
              } else {
                ultimoDetalle = raw;
              }
            } catch (e) {
              ultimoDetalle = raw || 'Inspección realizada.';
            }
          }

          // Calculate elapsed days
          let diasSinInspeccion = 999; // Si nunca se inspeccionó, asignamos valor alto
          if (ultimaFecha) {
            const diferenciaMs = hoy.getTime() - ultimaFecha.getTime();
            diasSinInspeccion = Math.floor(diferenciaMs / (1000 * 3600 * 24));
          }

          // Determinar estado según requerimiento
          let estado = 'vencido';
          let etiquetaEstado = 'Vencido (+90 días)';
          let colorBadge = '#ef4444'; // Rojo

          if (diasSinInspeccion >= 60 && diasSinInspeccion <= 90) {
            estado = 'pendiente';
            etiquetaEstado = 'Pendiente (60-90 días)';
            colorBadge = '#f59e0b'; // Amarillo / Naranja
          } else if (diasSinInspeccion < 60 && ultimaFecha !== null) {
            estado = 'vigente';
            etiquetaEstado = 'En Regla (<60 días)';
            colorBadge = '#10b981'; // Verde
          }

          listaProcesada.push({
            id: idInmueble,
            nombre: inm.Nombre || inm.nombre || 'Inmueble sin nombre',
            direccion: inm.Domicilio || inm.direccion || 'Sin dirección',
            actividad: inm.Actividad || inm.actividad || 'General',
            ultimaFechaStr: ultimaFecha ? ultimaFecha.toLocaleDateString() : 'Sin registros',
            diasSinInspeccion: diasSinInspeccion === 999 ? 'Sin inspección previa' : `${diasSinInspeccion} días`,
            diasNumero: diasSinInspeccion,
            ultimoDetalle,
            estado,
            etiquetaEstado,
            colorBadge
          });
        }

        // 3. Ordenar: los que llevan MÁS TIEMPO sin ser revisados aparecen PRIMERO
        listaProcesada.sort((a, b) => b.diasNumero - a.diasNumero);

        setInmueblesCalculados(listaProcesada);
      } catch (err) {
        console.error("Error calculando vencimientos:", err);
      } finally {
        setCargando(false);
      }
    };

    obtenerDatosYCalcularVencimientos();
  }, []);

  // Filtrado dinámico por búsqueda de texto y filtro de estado
  const inmueblesFiltrados = inmueblesCalculados.filter(item => {
    const coincideTexto = 
      item.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      item.direccion.toLowerCase().includes(busqueda.toLowerCase()) ||
      item.actividad.toLowerCase().includes(busqueda.toLowerCase());

    if (filtroEstado === 'todos') return coincideTexto;
    return coincideTexto && item.estado === filtroEstado;
  });

  return (
    <div style={{ padding: '20px', maxWidth: '1100px', margin: '0 auto' }}>
      {/* BOTÓN VOLVER */}
      <button 
        onClick={() => navigate('/conservadores')}
        style={{ background: 'transparent', border: 'none', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '20px' }}
      >
        <ArrowLeft size={18} /> Volver al panel de conservadores
      </button>

      {/* ENCABEZADO */}
      <div style={{ textAlign: 'center', marginBottom: '25px' }}>
        <h1 style={{ fontSize: '26px', color: '#f8fafc', marginBottom: '6px' }}>Estado de Inspecciones y Vencimientos</h1>
        <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0 }}>
          Priorización de inmuebles según el tiempo transcurrido desde su última inspección técnica.
        </p>
      </div>

      {/* BARRA DE BÚSQUEDA Y FILTROS */}
      <div style={{ background: 'rgba(30, 41, 59, 0.7)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '16px', marginBottom: '25px', display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
        
        {/* Buscador de texto */}
        <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }} />
          <input 
            type="text" 
            placeholder="Buscar por inmueble, dirección o actividad..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            style={{ width: '100%', padding: '10px 10px 10px 38px', background: '#0f172a', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: '#f8fafc', fontSize: '13px', outline: 'none' }}
          />
        </div>

        {/* Selector de Filtro por Estado */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Filter size={16} color="#38bdf8" />
          <span style={{ fontSize: '13px', color: '#cbd5e1' }}>Filtrar estado:</span>
          <select 
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            style={{ background: '#0f172a', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#f8fafc', padding: '8px 14px', borderRadius: '8px', fontSize: '13px', cursor: 'pointer', outline: 'none' }}
          >
            <option value="todos">Todos los Estados</option>
            <option value="vencido">🔴 Vencidos (+90 días)</option>
            <option value="pendiente">🟠 Pendientes (60-90 días)</option>
            <option value="vigente">🟢 Vigentes (&lt;60 días)</option>
          </select>
        </div>
      </div>

      {/* LISTA DE INMUEBLES PRIORIZADOS */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {cargando ? (
          <p style={{ color: '#94a3b8', textAlign: 'center', padding: '40px 0' }}>Calculando estados y vencimientos...</p>
        ) : inmueblesFiltrados.length === 0 ? (
          <div style={{ background: 'rgba(30, 41, 59, 0.7)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
            No se encontraron inmuebles que coincidan con los filtros seleccionados.
          </div>
        ) : (
          inmueblesFiltrados.map((item) => (
            <div 
              key={item.id}
              style={{ 
                background: 'rgba(30, 41, 59, 0.7)', 
                border: `1px solid ${item.estado === 'vencido' ? 'rgba(239, 68, 68, 0.3)' : item.estado === 'pendiente' ? 'rgba(245, 158, 11, 0.3)' : 'rgba(255,255,255,0.08)'}`, 
                borderRadius: '12px', 
                padding: '20px', 
                display: 'flex', 
                justify: 'space-between', 
                alignItems: 'center',
                gap: '20px',
                flexWrap: 'wrap'
              }}
            >
              {/* Información Principal del Inmueble */}
              <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start', flex: 1, minWidth: '280px' }}>
                <div style={{ background: 'rgba(56, 189, 248, 0.1)', padding: '12px', borderRadius: '10px', marginTop: '2px' }}>
                  <Building2 size={22} color="#38bdf8" />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                    <h3 style={{ fontSize: '16px', color: '#f8fafc', margin: 0 }}>{item.nombre}</h3>
                    <span style={{ fontSize: '11px', background: 'rgba(255,255,255,0.08)', color: '#94a3b8', padding: '2px 8px', borderRadius: '4px' }}>
                      {item.actividad}
                    </span>
                  </div>
                  <p style={{ color: '#94a3b8', fontSize: '13px', margin: '0 0 8px 0' }}>{item.direccion}</p>
                  
                  <div style={{ display: 'flex', gap: '15px', fontSize: '12px', color: '#cbd5e1' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Calendar size={14} color="#64748b" /> Última insp: <strong>{item.ultimaFechaStr}</strong>
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Clock size={14} color="#64748b" /> Tiempo transcurrido: <strong>{item.diasSinInspeccion}</strong>
                    </span>
                  </div>
                  
                  <p style={{ color: '#64748b', fontSize: '11px', margin: '8px 0 0 0', fontStyle: 'italic' }}>
                    {item.ultimoDetalle}
                  </p>
                </div>
              </div>

              {/* Badge de Estado y Botón de Acción */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px' }}>
                <span 
                  style={{ 
                    backgroundColor: `${item.colorBadge}20`, 
                    color: item.colorBadge, 
                    border: `1px solid ${item.colorBadge}50`, 
                    padding: '6px 14px', 
                    borderRadius: '20px', 
                    fontSize: '12px', 
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  {item.estado === 'vencido' && <AlertTriangle size={14} />}
                  {item.estado === 'pendiente' && <Clock size={14} />}
                  {item.estado === 'vigente' && <CheckCircle2 size={14} />}
                  {item.etiquetaEstado}
                </span>

                <button 
                  onClick={() => navigate(`/inspecciones/${item.id}`)}
                  style={{ 
                    background: '#0284c7', 
                    color: '#ffffff', 
                    border: 'none', 
                    padding: '8px 16px', 
                    borderRadius: '8px', 
                    fontSize: '12px', 
                    fontWeight: '600', 
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  + Realizar Inspección
                </button>
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Vencimientos;
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Building2, FileText, CheckCircle2, AlertCircle, ArrowLeft, Download } from 'lucide-react';
import './clientes.css'; // Mantenemos el mismo estilo visual elegante

function FichaPropietario() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [inmueble, setInmueble] = useState(null);
  const [inspecciones, setInspecciones] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const obtenerDatosPropiedad = async () => {
      try {
        setCargando(true);
        // Endpoint exclusivo para propietarios
        const resInm = await fetch(`http://localhost:3001/api/propietario/inmuebles/${id}`);
        if (resInm.ok) {
          const dataInm = await resInm.json();
          setInmueble(dataInm);
        }

        const resInsp = await fetch(`http://localhost:3001/api/propietario/inmuebles/${id}/inspecciones`);
        if (resInsp.ok) {
          const dataInsp = await resInsp.json();
          setInspecciones(dataInp);
        }
      } catch (error) {
        console.error("Error al cargar la información del inmueble:", error);
      } finally {
        setCargando(false);
      }
    };

    obtenerDatosPropiedad();
  }, [id]);

  if (cargando) {
    return <div style={{ padding: '30px', color: '#94a3b8', textAlign: 'center' }}>Cargando expediente técnico...</div>;
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* NAVEGACIÓN Y ENCABEZADO */}
      <button 
        onClick={() => navigate('/propietario')}
        style={{ background: 'transparent', border: 'none', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '15px' }}
      >
        <ArrowLeft size={18} /> Volver al mapa de inmuebles
      </button>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '24px', color: '#f8fafc', margin: 0 }}>{inmueble?.Nombre || 'Edificio Torres del Limay'}</h1>
        <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', padding: '4px 12px', borderRadius: '16px', fontSize: '13px', fontWeight: '600' }}>
          Registrado
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1.2fr', gap: '20px' }}>
        
        {/* COLUMNA 1: IMAGEN DEL INMUEBLE */}
        <div style={{ background: 'rgba(30, 41, 59, 0.7)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', overflow: 'hidden' }}>
          <img 
            src="/assets/edificio_ejemplo.jpg" 
            alt="Foto del inmueble" 
            style={{ width: '100%', height: '240px', objectFit: 'cover' }}
            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=500&auto=format&fit=crop'; }}
          />
          <div style={{ padding: '15px' }}>
            <h3 style={{ fontSize: '15px', color: '#f8fafc', marginBottom: '10px' }}>Servicios asociados</h3>
            {['Extintores', 'Red de incendio', 'Detección de humo', 'Iluminación de emergencia', 'Señalización'].map((serv, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '12px' }}>
                <span style={{ color: '#cbd5e1' }}>{serv}</span>
                <span style={{ color: '#10b981', fontWeight: '600' }}>Vigente</span>
              </div>
            ))}
          </div>
        </div>

        {/* COLUMNA 2: INFORMACIÓN DEL INMUEBLE Y DOCUMENTACIÓN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Ficha de Información */}
          <div style={{ background: 'rgba(30, 41, 59, 0.7)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '20px' }}>
            <h3 style={{ fontSize: '16px', color: '#f8fafc', marginBottom: '15px' }}>Información del inmueble</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', fontSize: '13px' }}>
              <div>
                <span style={{ color: '#64748b', display: 'block' }}>Dirección</span>
                <strong style={{ color: '#e2e8f0' }}>{inmueble?.Domicilio || 'Av. Argentina 1234, Neuquén'}</strong>
              </div>
              <div>
                <span style={{ color: '#64748b', display: 'block' }}>Tipo de inmueble</span>
                <strong style={{ color: '#e2e8f0' }}>{inmueble?.Actividad || 'Comercial'}</strong>
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

          {/* Documentación */}
          <div style={{ background: 'rgba(30, 41, 59, 0.7)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '20px' }}>
            <h3 style={{ fontSize: '16px', color: '#f8fafc', marginBottom: '15px' }}>Documentación disponible</h3>
            {[
              'Plano habilitado (PDF)',
              'Certificado de instalaciones',
              'Última Inspección Registrada'
            ].map((doc, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '13px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#e2e8f0' }}>
                  <FileText size={16} color="#38bdf8" /> {doc}
                </div>
                <button style={{ background: 'transparent', border: 'none', color: '#38bdf8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}>
                  Ver <Download size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* COLUMNA 3: HISTORIAL EXCLUSIVO DE INSPECCIONES (SIN BORRADORES NI BOTONES DE CARGA) */}
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

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { fecha: '09/10/2026', desc: 'Revisión mensual de extintores OK', estado: 'ok' },
                { fecha: '09/10/2026', desc: 'Parte N°: PR-2026-4230. Relevamiento completado.', estado: 'ok' },
                { fecha: '05/10/2026', desc: 'Parte N°: PR-2026-3666. Observación registrada.', estado: 'alert' }
              ].map((item, index) => (
                <div key={index} style={{ padding: '10px', background: 'rgba(15, 23, 42, 0.5)', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)', fontSize: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', color: '#94a3b8' }}>
                    <strong>{item.fecha}</strong>
                    {item.estado === 'ok' ? <CheckCircle2 size={14} color="#10b981" /> : <AlertCircle size={14} color="#ef4444" />}
                  </div>
                  <p style={{ color: '#cbd5e1', margin: 0, fontSize: '11px' }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default FichaPropietario;
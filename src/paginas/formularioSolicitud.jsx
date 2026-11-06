import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Send, Building2 } from 'lucide-react';
import './conservadores.css';

function FormularioSolicitud() {
  const navigate = useNavigate();
  const { idInmueble } = useParams();
  const ID_PROPIETARIO = localStorage.getItem('usuarioId') || 1;

  const [inmueble, setInmueble] = useState(null);
  const [motivo, setMotivo] = useState('');
  const [detalleCambios, setDetalleCambios] = useState('');
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    if (idInmueble) {
      fetch(`http://localhost:3001/api/propietario/inmuebles/${idInmueble}`)
        .then(res => res.json())
        .then(data => setInmueble(data))
        .catch(err => console.error("Error al obtener inmueble:", err));
    }
  }, [idInmueble]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!motivo.trim() || !detalleCambios.trim()) {
      alert("Por favor completá todos los campos.");
      return;
    }

    setEnviando(true);
    try {
      const respuesta = await fetch('http://localhost:3001/api/solicitudes-propietario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idPropietario: ID_PROPIETARIO,
          idInmueble: idInmueble,
          nombreInmueble: inmueble?.Nombre || inmueble?.nombre || 'Inmueble',
          motivo: motivo,
          detalle: detalleCambios,
          rol: 'propietario'
        })
      });

      if (respuesta.ok) {
        alert("¡Solicitud enviada a la municipalidad correctamente!");
        navigate('/propietario/solicitudes');
      } else {
        alert("Error al enviar la solicitud. Intentá nuevamente.");
      }
    } catch (error) {
      console.error("Error de red:", error);
      alert("Error de conexión con el servidor.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div style={{ padding: '30px', maxWidth: '800px', margin: '0 auto' }}>
      <button 
        onClick={() => navigate('/propietario/solicitudes')}
        style={{ background: 'transparent', border: 'none', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '15px' }}
      >
        <ArrowLeft size={18} /> Volver a solicitudes
      </button>

      <div style={{ background: 'rgba(30, 41, 59, 0.7)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '25px' }}>
        <h1 style={{ fontSize: '22px', color: '#f8fafc', margin: '0 0 6px 0' }}>Solicitud de Cambio de Información</h1>
        <p style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '20px' }}>Este requerimiento será derivado a la bandeja municipal para su revisión y aprobación.</p>

        {inmueble && (
          <div style={{ background: '#0f172a', padding: '12px 16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <Building2 size={22} color="#38bdf8" />
            <div>
              <span style={{ fontSize: '11px', color: '#94a3b8', display: 'block' }}>Inmueble seleccionado</span>
              <strong style={{ color: '#f8fafc', fontSize: '14px' }}>{inmueble.Nombre || inmueble.nombre}</strong> - <span style={{ color: '#cbd5e1', fontSize: '13px' }}>{inmueble.Domicilio || inmueble.domicilio}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', color: '#cbd5e1', marginBottom: '6px' }}>Motivo Principal de la Solicitud</label>
            <input 
              type="text" 
              placeholder="Ej. Actualización de datos catastrales o titularidad"
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              style={{ width: '100%', padding: '10px', background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#f8fafc', fontSize: '13px', outline: 'none' }}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', color: '#cbd5e1', marginBottom: '6px' }}>Detalle Específico de los Cambios Requeridos</label>
            <textarea 
              rows={5}
              placeholder="Describí detalladamente qué información querés modificar sobre el inmueble..."
              value={detalleCambios}
              onChange={(e) => setDetalleCambios(e.target.value)}
              style={{ width: '100%', padding: '10px', background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#f8fafc', fontSize: '13px', outline: 'none', resize: 'vertical' }}
              required
            />
          </div>

          <div style={{ textAlign: 'right', marginTop: '10px' }}>
            <button 
              type="submit"
              disabled={enviando}
              style={{ background: '#0284c7', color: '#fff', border: 'none', padding: '10px 22px', borderRadius: '8px', fontWeight: '600', fontSize: '13px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              <Send size={16} /> {enviando ? 'Enviando...' : 'Enviar solicitud a la Municipalidad'}
            </button>
          </div>
        </form>
      </div>

    </div>
  );
}

export default FormularioSolicitud;
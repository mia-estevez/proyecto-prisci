
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, CheckCircle2, FileText, ChevronRight, Calendar} from 'lucide-react';
import './conservadores.css';

const CLAVE_LEIDAS = 'notificaciones_propietario_leidas';

function obtenerLeidas() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_LEIDAS) || '[]');
  } catch {
    return [];
  }
}

function PropietarioNotificaciones() {
  const navigate = useNavigate();

  const usuarioSesion = JSON.parse(
    sessionStorage.getItem('usuario') || '{}'
  );

  const idPropietario = usuarioSesion.id || 4;

  const [notificaciones, setNotificaciones] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let cancelado = false;

    const obtenerNotificaciones = async () => {
      try {
        setCargando(true);

        // Obtener los inmuebles del propietario
        let inmuebles = [];

        const resInm = await fetch(
          `http://localhost:3001/api/propietario/${idPropietario}/inmuebles`
        );

        if (resInm.ok) {
          inmuebles = await resInm.json();
        }

        // Inmuebles de respaldo si el endpoint no devuelve datos
        if (!Array.isArray(inmuebles) || inmuebles.length === 0) {
          inmuebles = [
            {
              id: 1,
              nombre: 'Edificio Torres del Limay',
              direccion: 'Av. Corrientes 1234, Neuquén'
            },
            {
              id: 2,
              nombre: 'Galería Comercial Centro',
              direccion: 'Gral. Las Heras 450, Neuquén'
            }
          ];
        }

        const listaNotif = [];

        // Obtener las inspecciones de cada inmueble
        for (const inm of inmuebles) {
          const idInmueble = inm.id || inm.IdInmueble;

          if (!idInmueble) continue;

          const resInsp = await fetch(
            `http://localhost:3001/api/inmuebles/${idInmueble}/inspecciones`
          );

          if (resInsp.ok) {
            const inspecciones = await resInsp.json();

            if (!Array.isArray(inspecciones)) continue;

            inspecciones.forEach((insp) => {
              let obsText =
                insp.Detalle ||
                insp.detalle ||
                insp.Observaciones ||
                '';

              let parte = 'S/N';

              try {
                const parsed =
                  typeof obsText === 'string'
                    ? JSON.parse(obsText)
                    : obsText;

                if (typeof parsed === 'object' && parsed !== null) {
                  parte = parsed.parteNro || parsed.Parte || 'S/N';

                  obsText =
                    parsed.observacionesGenerales ||
                    parsed.detalle ||
                    'Relevamiento completado sin observaciones.';
                }
              } catch (e) {
                // Si las observaciones no son JSON, se conservan como texto.
              }

              const idInspeccion =
                insp.IdInspeccion ||
                insp.idInspeccion ||
                `${idInmueble}-${insp.Fecha}`;

              const fecha = insp.Fecha
                ? new Date(insp.Fecha)
                : new Date();

              listaNotif.push({
                id: `${idInmueble}-${idInspeccion}`,
                inmuebleId: idInmueble,
                inmuebleNombre:
                  inm.nombre ||
                  inm.Nombre ||
                  'Inmueble Asignado',
                direccion:
                  inm.direccion ||
                  inm.Domicilio ||
                  'Neuquén',
                fecha: insp.Fecha
                  ? new Date(insp.Fecha).toLocaleDateString()
                  : 'Reciente',
                rawFecha: fecha,
                parte: parte,
                observaciones: obsText,
                estado: 'Completado'
              });
            });
          }
        }

        // Ordenar de la inspección más reciente a la más antigua
        listaNotif.sort((a, b) => b.rawFecha - a.rawFecha);

        if (!cancelado) {
          const idsLeidos = obtenerLeidas();

          const listaConEstado = listaNotif.map((notif) => ({
            ...notif,
            leida: idsLeidos.includes(notif.id)
          }));

          setNotificaciones(listaConEstado);
        }
      } catch (err) {
        console.error('Error al cargar notificaciones:', err);
      } finally {
        if (!cancelado) {
          setCargando(false);
        }
      }
    };

    obtenerNotificaciones();

    return () => {
      cancelado = true;
    };
  }, [idPropietario]);

  // Guardar las notificaciones leídas
  const guardarLeidas = (actualizadas) => {
    const idsLeidos = actualizadas
      .filter((notif) => notif.leida)
      .map((notif) => notif.id);

    localStorage.setItem(
      CLAVE_LEIDAS,
      JSON.stringify(idsLeidos)
    );

    setNotificaciones(actualizadas);

    // Avisar al navbar que cambió el estado
    window.dispatchEvent(
      new Event('notificacionesActualizadas')
    );
  };

  // Marcar una notificación como leída
  const marcarComoLeida = (id) => {
    const actualizadas = notificaciones.map((notif) =>
      notif.id === id
        ? { ...notif, leida: true }
        : notif
    );

    guardarLeidas(actualizadas);
  };

  // Marcar todas como leídas
  const marcarTodasComoLeidas = () => {
    const actualizadas = notificaciones.map((notif) => ({
      ...notif,
      leida: true
    }));

    guardarLeidas(actualizadas);
  };

  const pendientes = notificaciones.filter(
    (notif) => !notif.leida
  ).length;

  return (
    <div
      style={{
        padding: '20px',
        maxWidth: '1000px',
        margin: '0 auto'
      }}
    >
      {/* Botón para volver */}
      <button
        onClick={() => navigate('/propietario')}
        style={{
          background: 'transparent',
          border: 'none',
          color: '#38bdf8',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          cursor: 'pointer',
          marginBottom: '20px'
        }}
      >
        <ArrowLeft size={18} />
        Volver al panel principal
      </button>

      {/* Encabezado */}
      <div
        style={{
          background: 'rgba(30, 41, 59, 0.7)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '25px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '15px',
          flexWrap: 'wrap'
        }}
      >
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '4px'
            }}
          >
            <Bell size={22} color="#38bdf8" />

            <h1
              style={{
                fontSize: '20px',
                color: '#f8fafc',
                margin: 0
              }}
            >
              Centro de Notificaciones
            </h1>
          </div>

          <p
            style={{
              color: '#94a3b8',
              fontSize: '13px',
              margin: 0
            }}
          >
            Novedades y avisos sobre inspecciones realizadas
            por conservadores en tus inmuebles.
          </p>
        </div>

        <span
          style={{
            background: 'rgba(56, 189, 248, 0.15)',
            color: '#38bdf8',
            padding: '6px 14px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: '600'
          }}
        >
          {notificaciones.length} Avisos
        </span>
      </div>

      {/* Acciones de notificaciones */}
      {pendientes > 0 && !cargando && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            marginBottom: '15px'
          }}
        >
          <button
            type="button"
            onClick={marcarTodasComoLeidas}
            style={{
              background: 'transparent',
              border: '1px solid rgba(56, 189, 248, 0.5)',
              color: '#38bdf8',
              borderRadius: '8px',
              padding: '8px 12px',
              cursor: 'pointer'
            }}
          >
            Marcar todas como leídas
          </button>
        </div>
      )}

      {/* Lista de notificaciones */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}
      >
        {cargando ? (
          <p
            style={{
              color: '#94a3b8',
              textAlign: 'center',
              padding: '30px 0'
            }}
          >
            Cargando notificaciones...
          </p>
        ) : notificaciones.length === 0 ? (
          <div
            style={{
              background: 'rgba(30, 41, 59, 0.7)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '12px',
              padding: '40px',
              textAlign: 'center',
              color: '#94a3b8'
            }}
          >
            <Bell
              size={36}
              color="#64748b"
              style={{ marginBottom: '10px' }}
            />

            <p style={{ margin: 0, fontSize: '14px' }}>
              No tenés notificaciones pendientes por el momento.
            </p>
          </div>
        ) : (
          notificaciones.map((notif) => (
            <div
              key={notif.id}
              onClick={() => {
                marcarComoLeida(notif.id);
                navigate(`/propietario/inmuebles/${notif.inmuebleId}`);
              }}
              style={{
                background: notif.leida
                  ? 'rgba(30, 41, 59, 0.45)'
                  : 'rgba(30, 41, 59, 0.7)',
                border: notif.leida
                  ? '1px solid rgba(255,255,255,0.08)'
                  : '1px solid rgba(56, 189, 248, 0.45)',
                borderRadius: '10px',
                padding: '18px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '15px'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  gap: '15px',
                  alignItems: 'flex-start'
                }}
              >
                <div
                  style={{
                    background: 'rgba(16, 185, 129, 0.15)',
                    padding: '10px',
                    borderRadius: '10px',
                    marginTop: '2px'
                  }}
                >
                  <CheckCircle2 size={20} color="#10b981" />
                </div>

                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '4px',
                      flexWrap: 'wrap'
                    }}
                  >
                    <strong
                      style={{
                        color: '#f8fafc',
                        fontSize: '15px'
                      }}
                    >
                      Nueva Inspección Registrada
                    </strong>

                    <span
                      style={{
                        fontSize: '11px',
                        color: '#38bdf8',
                        background: 'rgba(56, 189, 248, 0.1)',
                        padding: '2px 8px',
                        borderRadius: '4px'
                      }}
                    >
                      {notif.inmuebleNombre}
                    </span>

                    {!notif.leida && (
                      <span
                        style={{
                          fontSize: '10px',
                          color: '#f87171',
                          fontWeight: '600'
                        }}
                      >
                        NUEVA
                      </span>
                    )}
                  </div>

                  <p
                    style={{
                      color: '#cbd5e1',
                      fontSize: '13px',
                      margin: '0 0 6px 0'
                    }}
                  >
                    El profesional conservador ha completado
                    una revisión técnica ({notif.observaciones}).
                  </p>

                  <div
                    style={{
                      display: 'flex',
                      gap: '15px',
                      fontSize: '11px',
                      color: '#94a3b8',
                      flexWrap: 'wrap'
                    }}
                  >
                    <span
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <Calendar size={12} />
                      {notif.fecha}
                    </span>

                    <span
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <FileText size={12} />
                      Parte N°: {notif.parte}
                    </span>
                  </div>
                </div>
              </div>

              <div
                style={{
                  color: '#38bdf8',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '12px',
                  fontWeight: '500',
                  flexShrink: 0
                }}
              >
                Ver expediente
                <ChevronRight size={16} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default PropietarioNotificaciones;

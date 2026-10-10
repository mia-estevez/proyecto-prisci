
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  Building2,
  Users,
  ClipboardCheck,
  FileText,
  ArrowLeft,
} from "lucide-react";
import "./notificaciones.css";

const CLAVE_NOTIFICACIONES = "notificaciones_municipal";

function obtenerNotificaciones() {
  try {
    return JSON.parse(
      localStorage.getItem(CLAVE_NOTIFICACIONES) || "[]"
    );
  } catch {
    return [];
  }
}

export default function Notificaciones() {
  const navigate = useNavigate();
  const [notificaciones, setNotificaciones] = useState(
    obtenerNotificaciones
  );

  useEffect(() => {
    localStorage.setItem(
      CLAVE_NOTIFICACIONES,
      JSON.stringify(notificaciones)
    );

    window.dispatchEvent(
      new Event("notificacionesActualizadas")
    );
  }, [notificaciones]);

  const marcarComoLeida = (id) => {
    setNotificaciones((actuales) =>
      actuales.map((notificacion) =>
        notificacion.id === id
          ? { ...notificacion, leida: true }
          : notificacion
      )
    );
  };

  const marcarTodasComoLeidas = () => {
    setNotificaciones((actuales) =>
      actuales.map((notificacion) => ({
        ...notificacion,
        leida: true,
      }))
    );
  };

  const eliminarNotificacion = (id) => {
    setNotificaciones((actuales) =>
      actuales.filter((notificacion) => notificacion.id !== id)
    );
  };

  const eliminarTodas = () => {
    setNotificaciones([]);
  };

  const noLeidas = notificaciones.filter(
    (notificacion) => !notificacion.leida
  ).length;

  const obtenerIcono = (tipo) => {
    switch (tipo) {
      case "inmueble":
        return <Building2 size={22} />;

      case "profesional":
        return <Users size={22} />;

      case "inspeccion":
        return <ClipboardCheck size={22} />;

      default:
        return <FileText size={22} />;
    }
  };

  return (
    <div className="notificaciones-container">
      <div className="notificaciones-encabezado">
        <button
          className="notificaciones-volver"
          onClick={() => navigate(-1)}
          aria-label="Volver"
        >
          <ArrowLeft size={20} />
        </button>

        <div className="notificaciones-titulo">
          <h2>
            <Bell size={24} />
            Notificaciones
          </h2>

          <p>
            Municipalidad
            {noLeidas > 0 &&
              ` · ${noLeidas} sin leer`}
          </p>
        </div>
      </div>

      <div className="notificaciones-acciones">
        {noLeidas > 0 && (
          <button onClick={marcarTodasComoLeidas}>
            <CheckCheck size={17} />
            Marcar todas como leídas
          </button>
        )}

        {notificaciones.length > 0 && (
          <button onClick={eliminarTodas}>
            <Trash2 size={17} />
            Eliminar todas
          </button>
        )}
      </div>

      {notificaciones.length === 0 ? (
        <div className="notificaciones-vacio">
          <Bell size={42} />
          <h3>No hay notificaciones aún</h3>
          <p>
            Cuando haya novedades en el sistema,
            aparecerán acá.
          </p>
        </div>
      ) : (
        <div className="notificaciones-lista">
          {notificaciones.map((notificacion) => (
            <article
              key={notificacion.id}
              className={`notificacion-card ${
                !notificacion.leida
                  ? "notificacion-no-leida"
                  : ""
              }`}
            >
              <div className="notificacion-icono">
                {obtenerIcono(notificacion.tipo)}
              </div>

              <div className="notificacion-contenido">
                <div className="notificacion-titulo-fila">
                  <h3>{notificacion.titulo}</h3>

                  {!notificacion.leida && (
                    <span className="notificacion-etiqueta">
                      Nueva
                    </span>
                  )}
                </div>

                <p>{notificacion.mensaje}</p>

                <span className="notificacion-fecha">
                  {notificacion.fecha || ""}
                </span>
              </div>

              <div className="notificacion-botones">
                {!notificacion.leida && (
                  <button
                    title="Marcar como leída"
                    aria-label="Marcar como leída"
                    onClick={() =>
                      marcarComoLeida(notificacion.id)
                    }
                  >
                    <Check size={18} />
                  </button>
                )}

                <button
                  title="Eliminar notificación"
                  aria-label="Eliminar notificación"
                  onClick={() =>
                    eliminarNotificacion(notificacion.id)
                  }
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

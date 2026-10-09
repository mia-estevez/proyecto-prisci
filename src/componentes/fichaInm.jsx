
import { useEffect, useState } from "react";
import "./fichaInm.css";

const API = "http://localhost:3001/api";

function FichaInmueble({ inmueble, rol, onCerrar, onGuardar }) {
  const esMunicipal = rol === "municipal";
  const esProfesional = rol === "profesional";

  // ID real del inmueble en MySQL.
  const idInmueble =
    inmueble?.IdInmueble ?? inmueble?.id ?? inmueble?.idReal;

  const [datos, setDatos] = useState({
    nombre: "",
    direccion: "",
    tipo: "Sin especificar",
    superficie: "",
    pisos: "",
    actividad: "",
    ultimaInspeccion: "Sin inspecciones",
  });

  const [instalaciones, setInstalaciones] = useState([]);
  const [observaciones, setObservaciones] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);

  // Cargar los datos generales y los datos técnicos desde MySQL.
  useEffect(() => {
    if (!inmueble || !idInmueble) {
      setCargando(false);
      setMensaje("No se pudo identificar el inmueble.");
      return;
    }

    const controlador = new AbortController();

    async function cargarFicha() {
      setCargando(true);
      setMensaje("");

      setDatos({
        nombre:
          inmueble.Nombre ??
          inmueble.nombre ??
          "",
        direccion:
          inmueble.Domicilio ??
          inmueble.direccion ??
          inmueble.domicilio ??
          "",
        tipo:
          inmueble.Actividad ??
          inmueble.tipoInmueble ??
          inmueble.tipo ??
          "Sin especificar",
        superficie: inmueble.Superficie ?? inmueble.superficie ?? "",
        pisos: inmueble.Pisos ?? inmueble.pisos ?? "",
        actividad: inmueble.Actividad ?? inmueble.actividad ?? "",
        ultimaInspeccion:
          inmueble.ultimaInspeccion ?? "Sin inspecciones",
      });

      try {
        const [resInstalaciones, resObservaciones] = await Promise.all([
          fetch(
            `${API}/inmuebles/${idInmueble}/instalaciones`,
            { signal: controlador.signal }
          ),
          fetch(
            `${API}/inmuebles/${idInmueble}/observaciones`,
            { signal: controlador.signal }
          ),
        ]);

        if (!resInstalaciones.ok) {
          throw new Error("No se pudieron cargar las instalaciones.");
        }

        if (!resObservaciones.ok) {
          throw new Error("No se pudieron cargar las observaciones.");
        }

        const instalacionesDB = await resInstalaciones.json();
        const observacionesDB = await resObservaciones.json();

        setInstalaciones(
          instalacionesDB.map((item) => ({
            id: item.IdInstalacion,
            nombre: item.Nombre,
            estado: item.Estado,
            vencimiento: item.Vencimiento || "",
          }))
        );

        setObservaciones(observacionesDB.observaciones || "");
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Error al cargar la ficha:", error);
          setMensaje(
            error.message || "No se pudieron cargar los datos."
          );
        }
      } finally {
        if (!controlador.signal.aborted) {
          setCargando(false);
        }
      }
    }

    cargarFicha();

    return () => controlador.abort();
  }, [idInmueble]);

  const actualizarDato = (campo, valor) => {
    setDatos((anterior) => ({
      ...anterior,
      [campo]: valor,
    }));
  };

  const actualizarInstalacion = (indice, campo, valor) => {
    setInstalaciones((anteriores) =>
      anteriores.map((instalacion, i) =>
        i === indice
          ? { ...instalacion, [campo]: valor }
          : instalacion
      )
    );
  };

  const obtenerEstado = (instalacion) => {
    if (instalacion.vencimiento) {
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);

      const fechaVencimiento = new Date(
        `${instalacion.vencimiento}T00:00:00`
      );

      if (fechaVencimiento < hoy) {
        return "Vencido";
      }
    }

    return instalacion.estado;
  };

  // Guardar instalaciones y observaciones en MySQL.
  const guardarCambios = async () => {
    if (!idInmueble) {
      setMensaje("No se encontró el ID del inmueble.");
      return;
    }

    setGuardando(true);
    setMensaje("");

    try {
      if (esProfesional) {
        const [resInstalaciones, resObservaciones] = await Promise.all([
          fetch(`${API}/inmuebles/${idInmueble}/instalaciones`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              instalaciones: instalaciones.map((item) => ({
                IdInstalacion: item.id,
                Nombre: item.nombre,
                Estado: item.estado,
                Vencimiento: item.vencimiento || null,
              })),
            }),
          }),

          fetch(`${API}/inmuebles/${idInmueble}/observaciones`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ observaciones }),
          }),
        ]);

        const resultadoInstalaciones = await resInstalaciones.json();
        const resultadoObservaciones = await resObservaciones.json();

        if (!resInstalaciones.ok) {
          throw new Error(
            resultadoInstalaciones.mensaje ||
              "No se pudieron guardar las instalaciones."
          );
        }

        if (!resObservaciones.ok) {
          throw new Error(
            resultadoObservaciones.mensaje ||
              "No se pudieron guardar las observaciones."
          );
        }

        // Actualizar el estado local con la respuesta del backend.
        setInstalaciones(
          resultadoInstalaciones.instalaciones.map((item) => ({
            id: item.IdInstalacion,
            nombre: item.Nombre,
            estado: item.Estado,
            vencimiento: item.Vencimiento || "",
          }))
        );

        setMensaje("¡Cambios guardados correctamente en la base de datos!");
      } else if (esMunicipal && onGuardar) {
        // Mantener el comportamiento anterior de Municipal.
        await onGuardar({
          ...datos,
          instalaciones,
          observaciones,
          id: idInmueble,
        });

        setMensaje("Cambios enviados correctamente.");
      } else {
        setMensaje("Este rol no tiene permiso para guardar cambios.");
      }
    } catch (error) {
      console.error("Error al guardar la ficha:", error);
      setMensaje(
        error.message ||
          "No se pudieron guardar los cambios. Revisá la conexión."
      );
    } finally {
      setGuardando(false);
    }
  };

  const descargarFicha = () => {
    window.print();
  };

  if (!inmueble) return null;

  return (
    <div className="ficha-overlay" onClick={onCerrar}>
      <section
        className="ficha-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ficha-titulo"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="ficha-header">
          <div>
            <span className="ficha-etiqueta">
              PRISCI · REGISTRO DE INMUEBLES
            </span>

            <h2 id="ficha-titulo">Ficha del inmueble</h2>

            <p>
              Consulta y gestión de información de seguridad contra
              incendios.
            </p>
          </div>

          <button
            className="ficha-cerrar"
            onClick={onCerrar}
            aria-label="Cerrar ficha"
            title="Cerrar"
          >
            ×
          </button>
        </header>

        <div className="ficha-contenido">
          {/* DATOS GENERALES */}
          <section className="ficha-seccion">
            <div className="ficha-seccion-titulo">
              <h3>1. Datos generales</h3>
              <span>
                {esMunicipal ? "Editable por Municipal" : "Solo lectura"}
              </span>
            </div>

            <div className="ficha-form-grid">
              <label className="ficha-campo">
                Nombre del inmueble
                <input
                  value={datos.nombre}
                  onChange={(e) =>
                    actualizarDato("nombre", e.target.value)
                  }
                  readOnly={!esMunicipal}
                />
              </label>

              <label className="ficha-campo">
                Domicilio
                <input
                  value={datos.direccion}
                  onChange={(e) =>
                    actualizarDato("direccion", e.target.value)
                  }
                  readOnly={!esMunicipal}
                />
              </label>

              <label className="ficha-campo">
                Tipo de inmueble
                <input
                  value={datos.tipo}
                  onChange={(e) =>
                    actualizarDato("tipo", e.target.value)
                  }
                  readOnly={!esMunicipal}
                />
              </label>

              <label className="ficha-campo">
                Actividad
                <input
                  value={datos.actividad}
                  onChange={(e) =>
                    actualizarDato("actividad", e.target.value)
                  }
                  readOnly={!esMunicipal}
                />
              </label>

              <label className="ficha-campo">
                Superficie (m²)
                <input
                  value={datos.superficie}
                  onChange={(e) =>
                    actualizarDato("superficie", e.target.value)
                  }
                  readOnly={!esMunicipal}
                  placeholder="Sin datos"
                />
              </label>

              <label className="ficha-campo">
                Cantidad de pisos
                <input
                  value={datos.pisos}
                  onChange={(e) =>
                    actualizarDato("pisos", e.target.value)
                  }
                  readOnly={!esMunicipal}
                  placeholder="Sin datos"
                />
              </label>
            </div>
          </section>

          {/* INSTALACIONES */}
          <section className="ficha-seccion">
            <div className="ficha-seccion-titulo">
              <h3>2. Instalaciones contra incendios</h3>
              <span>
                {esProfesional
                  ? "Editable por Conservador"
                  : "Solo lectura"}
              </span>
            </div>

            {cargando ? (
              <p>Cargando instalaciones...</p>
            ) : (
              <div className="ficha-tabla-contenedor">
                <table className="ficha-tabla">
                  <thead>
                    <tr>
                      <th>Instalación</th>
                      <th>Estado</th>
                      <th>Vencimiento</th>
                    </tr>
                  </thead>

                  <tbody>
                    {instalaciones.map((instalacion, indice) => (
                      <tr key={instalacion.id}>
                        <td>{instalacion.nombre}</td>

                        <td>
                          {esProfesional ? (
                            <select
                              value={instalacion.estado}
                              onChange={(e) =>
                                actualizarInstalacion(
                                  indice,
                                  "estado",
                                  e.target.value
                                )
                              }
                            >
                              <option value="Vigente">Vigente</option>
                              <option value="Pendiente de revisión">
                                Pendiente de revisión
                              </option>
                              <option value="Vencido">Vencido</option>
                              <option value="No aplica">No aplica</option>
                            </select>
                          ) : (
                            <span
                              className={`ficha-estado ${
                                obtenerEstado(instalacion) === "Vigente"
                                  ? "estado-vigente"
                                  : "estado-pendiente"
                              }`}
                            >
                              {obtenerEstado(instalacion)}
                            </span>
                          )}
                        </td>

                        <td>
                          {esProfesional ? (
                            <input
                              type="date"
                              value={instalacion.vencimiento}
                              onChange={(e) =>
                                actualizarInstalacion(
                                  indice,
                                  "vencimiento",
                                  e.target.value
                                )
                              }
                            />
                          ) : (
                            instalacion.vencimiento || "No especificado"
                          )}
                        </td>
                      </tr>
                    ))}

                    {!instalaciones.length && !cargando && (
                      <tr>
                        <td colSpan="3">
                          No hay instalaciones registradas.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* OBSERVACIONES */}
          <section className="ficha-seccion">
            <div className="ficha-seccion-titulo">
              <h3>3. Observaciones</h3>
              <span>
                {esProfesional ? "Editable por Conservador" : "Solo lectura"}
              </span>
            </div>

            <textarea
              className="ficha-observaciones"
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              readOnly={!esProfesional}
              rows={4}
              placeholder="Ingresá las observaciones del inmueble..."
            />
          </section>

          {/* DOCUMENTACIÓN */}
          <section className="ficha-seccion">
            <div className="ficha-seccion-titulo">
              <h3>4. Documentación adjunta</h3>
            </div>

            <div className="ficha-documentos">
              <div className="ficha-documento">
                <div className="ficha-documento-icono">PDF</div>
                <div>
                  <strong>Documentación del inmueble</strong>
                  <p>
                    Los documentos se mostrarán aquí cuando estén
                    cargados en el sistema.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ÚLTIMA ACTUALIZACIÓN */}
          <div className="ficha-actualizacion">
            <span>Última inspección registrada</span>
            <strong>{datos.ultimaInspeccion}</strong>
          </div>

          {mensaje && (
            <p className="ficha-mensaje" role="status">
              {mensaje}
            </p>
          )}
        </div>

        <footer className="ficha-footer">
          <button
            className="ficha-btn ficha-btn-secundario"
            onClick={onCerrar}
            disabled={guardando}
          >
            Cerrar
          </button>

          <button
            className="ficha-btn ficha-btn-secundario"
            onClick={descargarFicha}
          >
            Descargar / imprimir PDF
          </button>

          {(esMunicipal || esProfesional) && (
            <button
              className="ficha-btn ficha-btn-principal"
              onClick={guardarCambios}
              disabled={cargando || guardando}
            >
              {guardando ? "Guardando..." : "Guardar cambios"}
            </button>
          )}
        </footer>
      </section>
    </div>
  );
}

export default FichaInmueble;

import { useEffect, useMemo, useState } from "react";
import './SolicitudesRegistro.css'; 

const solicitudesIniciales = [
  {
    id: 1,
    nombre: "Martín",
    apellido: "López",
    email: "martin.lopez@mail.com",
    telefono: "299 123 4567",
    rol: "Profesional / Conservador",
    fecha: "09/10/2026",
    estado: "Pendiente",
    motivo:
      "Quiero darme de alta en el sistema para gestionar las inspecciones de los inmuebles que tengo a cargo y poder cargar los informes correspondientes.",
  },
  {
    id: 2,
    nombre: "Sofía",
    apellido: "Ramírez",
    email: "sofia.ramirez@gmail.com",
    telefono: "299 987 6543",
    rol: "Propietario",
    fecha: "08/10/2026",
    estado: "Pendiente",
    motivo:
      "Solicito acceso para administrar mis inmuebles y consultar su información.",
  },
  {
    id: 3,
    nombre: "Lucas",
    apellido: "Fernández",
    email: "lucas.fernandez@gmail.com",
    telefono: "299 456 7890",
    rol: "Bomberos",
    fecha: "07/10/2026",
    estado: "Pendiente",
    motivo:
      "Necesito acceder al sistema para consultar información relacionada con las inspecciones.",
  },
  {
    id: 4,
    nombre: "Carla",
    apellido: "Méndez",
    email: "carla.mendez@gmail.com",
    telefono: "299 321 6540",
    rol: "Profesional / Conservador",
    fecha: "06/10/2026",
    estado: "Aceptada",
    motivo:
      "Solicito acceso para registrar y consultar los informes de inspección.",
  },
  {
    id: 5,
    nombre: "Diego",
    apellido: "Torres",
    email: "diego.torres@gmail.com",
    telefono: "299 111 2233",
    rol: "Propietario",
    fecha: "04/10/2026",
    estado: "Rechazada",
    motivo:
      "Quiero consultar los inmuebles que figuran a mi nombre.",
  },
  {
    id: 6,
    nombre: "Valentina",
    apellido: "Ruiz",
    email: "valentina.ruiz@gmail.com",
    telefono: "299 555 6677",
    rol: "Profesional / Conservador",
    fecha: "03/10/2026",
    estado: "Pendiente",
    motivo:
      "Solicito una cuenta para gestionar inspecciones y cargar informes.",
  },
  {
    id: 7,
    nombre: "Gonzalo",
    apellido: "Pérez",
    email: "gonzalo.perez@gmail.com",
    telefono: "299 222 3344",
    rol: "Bomberos",
    fecha: "01/10/2026",
    estado: "Aceptada",
    motivo:
      "Necesito ingresar para consultar los registros de seguridad.",
  },
  {
    id: 8,
    nombre: "Agustina",
    apellido: "Soto",
    email: "agustina.soto@gmail.com",
    telefono: "299 888 7766",
    rol: "Profesional / Conservador",
    fecha: "28/09/2026",
    estado: "Rechazada",
    motivo:
      "Quiero registrarme para poder gestionar mis datos profesionales.",
  },
  ...Array.from({ length: 12 }, (_, i) => ({
    id: i + 9,
    nombre: [
      "Lucía", "Mateo", "Camila", "Joaquín",
      "Martina", "Tomás", "Julieta", "Benjamín",
      "Micaela", "Franco", "Florencia", "Nicolás",
    ][i],
    apellido: [
      "García", "Moreno", "Castro", "Díaz",
      "Acosta", "Herrera", "Navarro", "Medina",
      "Suárez", "Rojas", "Vega", "Molina",
    ][i],
    email: `solicitud${i + 9}@mail.com`,
    telefono: `299 400 ${String(1000 + i)}`,
    rol: [
      "Propietario",
      "Profesional / Conservador",
      "Bomberos",
    ][i % 3],
    fecha: `${String(27 - i).padStart(2, "0")}/09/2026`,
    estado: i % 3 === 0 ? "Pendiente" : i % 3 === 1 ? "Aceptada" : "Rechazada",
    motivo: "Solicitud de acceso al sistema municipal PRISCI.",
  })),
];

const CLAVE_ALMACENAMIENTO = "prisci_solicitudes_registro";

function leerSolicitudes() {
  try {
    const guardadas = localStorage.getItem(CLAVE_ALMACENAMIENTO);
    return guardadas ? JSON.parse(guardadas) : solicitudesIniciales;
  } catch {
    return solicitudesIniciales;
  }
}

function Icono({ tipo, size = 22 }) {
  const comunes = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };

  const dibujos = {
    documento: (
      <>
        <rect x="4" y="3" width="16" height="18" rx="2" />
        <path d="M8 8h8M8 12h8M8 16h5" />
      </>
    ),
    reloj: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    aceptar: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="m8 12 3 3 5-6" />
      </>
    ),
    rechazar: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="m9 9 6 6m0-6-6 6" />
      </>
    ),
    buscar: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m16 16 5 5" />
      </>
    ),
    persona: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21v-2a8 8 0 0 1 16 0v2" />
      </>
    ),
    puntos: (
      <>
        <circle cx="12" cy="5" r="1" />
        <circle cx="12" cy="12" r="1" />
        <circle cx="12" cy="19" r="1" />
      </>
    ),
    izquierda: <path d="m15 18-6-6 6-6" />,
    derecha: <path d="m9 18 6-6-6-6" />,
    cerrar: <path d="m18 6-12 12M6 6l12 12" />,
    flecha: <path d="m7 10 5 5 5-5" />,
  };

  return <svg {...comunes}>{dibujos[tipo]}</svg>;
}

function EstadoEtiqueta({ estado }) {
  const clases = {
    Pendiente: "sr-badge-pendiente",
    Aceptada: "sr-badge-aceptada",
    Rechazada: "sr-badge-rechazada",
  };

  return (
    <span className={`sr-badge ${clases[estado]}`}>
      {estado}
    </span>
  );
}

export default function SolicitudesRegistro() {
  const [solicitudes, setSolicitudes] = useState(leerSolicitudes);
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("Todos");
  const [filtroRol, setFiltroRol] = useState("Todos");
  const [pagina, setPagina] = useState(1);
  const [seleccionadaId, setSeleccionadaId] = useState(1);
  const [menuAbierto, setMenuAbierto] = useState(null);
  const [mensaje, setMensaje] = useState("");

  const porPagina = 8;

  useEffect(() => {
    try {
      localStorage.setItem(
        CLAVE_ALMACENAMIENTO,
        JSON.stringify(solicitudes)
      );
    } catch {
      setMensaje("No se pudieron guardar los cambios en este navegador.");
    }
  }, [solicitudes]);

  const conteos = useMemo(() => ({
    Pendiente: solicitudes.filter((s) => s.estado === "Pendiente").length,
    Aceptada: solicitudes.filter((s) => s.estado === "Aceptada").length,
    Rechazada: solicitudes.filter((s) => s.estado === "Rechazada").length,
  }), [solicitudes]);

  const filtradas = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();

    return solicitudes.filter((s) => {
      const contenido = [
        s.nombre,
        s.apellido,
        s.email,
        s.telefono,
      ].join(" ").toLowerCase();

      return (
        (!texto || contenido.includes(texto)) &&
        (filtroEstado === "Todos" || s.estado === filtroEstado) &&
        (filtroRol === "Todos" || s.rol === filtroRol)
      );
    });
  }, [solicitudes, busqueda, filtroEstado, filtroRol]);

  const totalPaginas = Math.max(1, Math.ceil(filtradas.length / porPagina));
  const paginaActual = Math.min(pagina, totalPaginas);
  const inicio = (paginaActual - 1) * porPagina;
  const visibles = filtradas.slice(inicio, inicio + porPagina);

  const seleccionada =
    solicitudes.find((s) => s.id === seleccionadaId) || null;

  function actualizarEstado(id, nuevoEstado) {
    const solicitud = solicitudes.find((s) => s.id === id);

    if (!solicitud) return;

    if (
      nuevoEstado !== "Pendiente" &&
      solicitud.estado === nuevoEstado
    ) {
      setMensaje(`La solicitud ya está ${nuevoEstado.toLowerCase()}.`);
      return;
    }

    setSolicitudes((actuales) =>
      actuales.map((s) =>
        s.id === id ? { ...s, estado: nuevoEstado } : s
      )
    );

    setMensaje(
      `Solicitud de ${solicitud.nombre} ${solicitud.apellido}: ${nuevoEstado.toLowerCase()}.`
    );
    setMenuAbierto(null);
  }

  function cambiarFiltro(callback, valor) {
    callback(valor);
    setPagina(1);
  }

  return (
    <div className="solicitudes-registro">
      <header className="sr-titulo">
        <div className="sr-titulo-icono">
          <Icono tipo="documento" size={35} />
        </div>
        <div>
          <h1>Solicitudes de registro</h1>
          <p>Gestión de solicitudes de acceso al sistema.</p>
        </div>
      </header>

      <div className="sr-contenido">
        <section className="sr-columna-principal">
          <div className="sr-estadisticas">
            <article className="sr-stat sr-stat-pendiente">
              <Icono tipo="reloj" size={34} />
              <div>
                <span>Pendientes</span>
                <strong>{conteos.Pendiente}</strong>
              </div>
            </article>

            <article className="sr-stat sr-stat-aceptada">
              <Icono tipo="aceptar" size={34} />
              <div>
                <span>Aceptadas</span>
                <strong>{conteos.Aceptada}</strong>
              </div>
            </article>

            <article className="sr-stat sr-stat-rechazada">
              <Icono tipo="rechazar" size={34} />
              <div>
                <span>Rechazadas</span>
                <strong>{conteos.Rechazada}</strong>
              </div>
            </article>
          </div>

          <div className="sr-filtros">
            <label className="sr-buscador">
              <Icono tipo="buscar" size={25} />
              <input
                type="search"
                placeholder="Buscar por nombre, apellido, email o teléfono..."
                value={busqueda}
                onChange={(e) =>
                  cambiarFiltro(setBusqueda, e.target.value)
                }
              />
            </label>

            <label className="sr-filtro-select">
              <span>Estado</span>
              <div>
                <select
                  value={filtroEstado}
                  onChange={(e) =>
                    cambiarFiltro(setFiltroEstado, e.target.value)
                  }
                >
                  <option>Todos</option>
                  <option>Pendiente</option>
                  <option>Aceptada</option>
                  <option>Rechazada</option>
                </select>
                <Icono tipo="flecha" size={17} />
              </div>
            </label>

            <label className="sr-filtro-select">
              <span>Rol solicitado</span>
              <div>
                <select
                  value={filtroRol}
                  onChange={(e) =>
                    cambiarFiltro(setFiltroRol, e.target.value)
                  }
                >
                  <option>Todos</option>
                  <option>Profesional / Conservador</option>
                  <option>Propietario</option>
                  <option>Bomberos</option>
                </select>
                <Icono tipo="flecha" size={17} />
              </div>
            </label>
          </div>

          <div className="sr-tabla-contenedor">
            <table className="sr-tabla">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Contacto</th>
                  <th>Rol solicitado</th>
                  <th>Fecha</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {visibles.map((s) => (
                  <tr
                    key={s.id}
                    className={seleccionadaId === s.id ? "sr-fila-activa" : ""}
                  >
                    <td className="sr-nombre">
                      {s.nombre} {s.apellido}
                    </td>

                    <td className="sr-contacto">
                      <span>{s.email}</span>
                      <span>{s.telefono}</span>
                    </td>

                    <td>
                      <span className={`sr-rol sr-rol-${s.rol === "Propietario" ? "propietario" : s.rol === "Bomberos" ? "bomberos" : "profesional"}`}>
                        {s.rol === "Profesional / Conservador"
                          ? "Profesional"
                          : s.rol}
                      </span>
                    </td>

                    <td className="sr-fecha">{s.fecha}</td>
                    <td><EstadoEtiqueta estado={s.estado} /></td>

                    <td>
                      <div className="sr-acciones-fila">
                        <button
                          className="sr-ver"
                          onClick={() => setSeleccionadaId(s.id)}
                          type="button"
                        >
                          Ver
                        </button>

                        <div className="sr-menu-wrapper">
                          <button
                            className="sr-menu-boton"
                            type="button"
                            aria-label="Más acciones"
                            aria-expanded={menuAbierto === s.id}
                            onClick={() =>
                              setMenuAbierto(menuAbierto === s.id ? null : s.id)
                            }
                          >
                            <Icono tipo="puntos" size={20} />
                          </button>

                          {menuAbierto === s.id && (
                            <div className="sr-menu-desplegable">
                              <button
                                type="button"
                                onClick={() => actualizarEstado(s.id, "Aceptada")}
                              >
                                Aceptar solicitud
                              </button>
                              <button
                                type="button"
                                onClick={() => actualizarEstado(s.id, "Rechazada")}
                              >
                                Rechazar solicitud
                              </button>
                              <button
                                type="button"
                                onClick={() => actualizarEstado(s.id, "Pendiente")}
                              >
                                Marcar como pendiente
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}

                {visibles.length === 0 && (
                  <tr>
                    <td colSpan="6" className="sr-sin-resultados">
                      No se encontraron solicitudes.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <div className="sr-paginacion">
              <span>
                Mostrando {filtradas.length ? inicio + 1 : 0}
                {"–"}
                {Math.min(inicio + porPagina, filtradas.length)}
                {" "}de {filtradas.length} solicitudes
              </span>

              <div>
                <button
                  type="button"
                  aria-label="Página anterior"
                  disabled={paginaActual === 1}
                  onClick={() => setPagina((p) => Math.max(1, p - 1))}
                >
                  <Icono tipo="izquierda" size={19} />
                </button>

                {Array.from({ length: totalPaginas }, (_, i) => i + 1)
                  .filter((n) => n <= 3 || n === paginaActual)
                  .filter((n, i, arr) => arr.indexOf(n) === i)
                  .map((n) => (
                    <button
                      type="button"
                      key={n}
                      className={paginaActual === n ? "sr-pagina-activa" : ""}
                      onClick={() => setPagina(n)}
                    >
                      {n}
                    </button>
                  ))}

                <button
                  type="button"
                  aria-label="Página siguiente"
                  disabled={paginaActual === totalPaginas}
                  onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
                >
                  <Icono tipo="derecha" size={19} />
                </button>
              </div>
            </div>
          </div>
        </section>

        <aside className="sr-detalle">
          <div className="sr-detalle-cabecera">
            <h2>Detalle de la solicitud</h2>
            <button
              type="button"
              aria-label="Cerrar detalle"
              onClick={() => setSeleccionadaId(null)}
            >
              <Icono tipo="cerrar" size={21} />
            </button>
          </div>

          {seleccionada ? (
            <>
              <div className="sr-persona">
                <div className="sr-avatar">
                  <Icono tipo="persona" size={33} />
                </div>

                <div className="sr-persona-info">
                  <h3>{seleccionada.nombre} {seleccionada.apellido}</h3>
                  <span>Solicitada el {seleccionada.fecha}</span>
                </div>

                <EstadoEtiqueta estado={seleccionada.estado} />
              </div>

              <div className="sr-detalle-seccion">
                <h3>Información personal</h3>
                <p><strong>Nombre:</strong> {seleccionada.nombre}</p>
                <p><strong>Apellido:</strong> {seleccionada.apellido}</p>
                <p><strong>Teléfono:</strong> {seleccionada.telefono}</p>
                <p className="sr-email-detalle">
                  <strong>Correo electrónico:</strong> {seleccionada.email}
                </p>
              </div>

              <div className="sr-detalle-seccion">
                <h3>Rol solicitado</h3>
                <span className="sr-rol sr-rol-profesional">
                  {seleccionada.rol}
                </span>
              </div>

              <div className="sr-detalle-seccion sr-motivo">
                <h3>Motivo de la solicitud</h3>
                <p>{seleccionada.motivo}</p>
              </div>

              <div className="sr-acciones-detalle">
                <h3>Acciones</h3>

                <button
                  type="button"
                  className="sr-accion-aceptar"
                  onClick={() => actualizarEstado(seleccionada.id, "Aceptada")}
                >
                  <Icono tipo="aceptar" size={18} />
                  Aceptar solicitud
                </button>

                <button
                  type="button"
                  className="sr-accion-rechazar"
                  onClick={() => actualizarEstado(seleccionada.id, "Rechazada")}
                >
                  <Icono tipo="rechazar" size={18} />
                  Rechazar solicitud
                </button>

                <button
                  type="button"
                  className="sr-accion-pendiente"
                  onClick={() => actualizarEstado(seleccionada.id, "Pendiente")}
                >
                  <Icono tipo="reloj" size={18} />
                  Marcar como pendiente
                </button>
              </div>
            </>
          ) : (
            <div className="sr-detalle-vacio">
              <Icono tipo="documento" size={35} />
              <p>Seleccioná una solicitud para ver sus detalles.</p>
              <button type="button" onClick={() => setSeleccionadaId(filtradas[0]?.id ?? null)}>
                Volver al detalle
              </button>
            </div>
          )}
        </aside>
      </div>

      {mensaje && (
        <div className="sr-mensaje" role="status">
          <span>{mensaje}</span>
          <button type="button" onClick={() => setMensaje("")} aria-label="Cerrar mensaje">
            <Icono tipo="cerrar" size={17} />
          </button>
        </div>
      )}
    </div>
  );
}
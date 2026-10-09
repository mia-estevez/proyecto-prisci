import { useMemo, useState } from "react";
import "./PaginaMunicipal.css";

const inmueblesIniciales = [
  {
    id: 1,
    nombre: "Edificio Torres del Limay",
    direccion: "Av. Argentina 1234, Neuquén",
    tipo: "Edificio residencial",
    categoria: "residencial",
    imagen:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: 2,
    nombre: "Consorcio Los Teros",
    direccion: "Calle San Martín 567, Neuquén",
    tipo: "Edificio residencial",
    categoria: "residencial",
    imagen:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: 3,
    nombre: "Hotel del Comahue",
    direccion: "Av. Olascoaga 890, Neuquén",
    tipo: "Hotel",
    categoria: "hotel",
    imagen:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: 4,
    nombre: "Centro Médico Neuquén",
    direccion: "Calle Roca 345, Neuquén",
    tipo: "Centro de salud",
    categoria: "salud",
    imagen:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: 5,
    nombre: "Supermercado La Anónima",
    direccion: "Av. Argentina 2200, Neuquén",
    tipo: "Local comercial",
    categoria: "comercial",
    imagen:
      "https://images.unsplash.com/photo-1604719312566-8912e9c8a213?auto=format&fit=crop&w=300&q=80",
  },
];

const estadisticas = [
  {
    titulo: "Inmuebles registrados",
    valor: "156",
    porcentaje: "12%",
    icono: "building",
  },
  {
    titulo: "Profesionales registrados",
    valor: "48",
    porcentaje: "8%",
    icono: "users",
  },
  {
    titulo: "Conservadores registrados",
    valor: "36",
    porcentaje: "5%",
    icono: "briefcase",
  },
  {
    titulo: "Inspecciones este mes",
    valor: "28",
    porcentaje: "16%",
    icono: "clipboard",
  },
];

function Icono({ nombre, size = 28 }) {
  const atributos = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };

  const dibujos = {
    building: (
      <>
        <rect x="3" y="3" width="7" height="18" rx="1" />
        <rect x="14" y="8" width="7" height="13" rx="1" />
        <path d="M6 7h1M6 11h1M6 15h1M6 19h1" />
        <path d="M17 12h1M17 16h1M17 19h1" />
      </>
    ),
    users: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    ),
    briefcase: (
      <>
        <rect x="3" y="7" width="18" height="14" rx="2" />
        <path d="M8 7V4h8v3M3 12h18M10 12v2h4v-2" />
      </>
    ),
    clipboard: (
      <>
        <rect x="5" y="4" width="14" height="18" rx="2" />
        <path d="M9 4V2h6v2M8 12l2 2 5-5M8 18h8" />
      </>
    ),
    map: (
      <>
        <path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3z" />
        <path d="M9 3v15M15 6v15" />
      </>
    ),
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </>
    ),
    filter: (
      <path d="M4 4h16l-6 7v6l-4 3v-9z" />
    ),
    arrow: <path d="m9 18 6-6-6-6" />,
    plus: <path d="M12 5v14M5 12h14" />,
    chevron: <path d="m7 10 5 5 5-5" />,
    locate: (
      <>
        <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
        <circle cx="12" cy="12" r="7" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
  };

  return <svg {...atributos}>{dibujos[nombre] || null}</svg>;
}

function FechaActual() {
  const fecha = new Intl.DateTimeFormat("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "America/Argentina/Buenos_Aires",
  }).format(new Date());

  return fecha.charAt(0).toUpperCase() + fecha.slice(1);
}

export default function PaginaMunicipal() {
  const [busqueda, setBusqueda] = useState("");
  const [filtroAbierto, setFiltroAbierto] = useState(false);
  const [categoria, setCategoria] = useState("todos");
  const [inmuebleSeleccionado, setInmuebleSeleccionado] =
    useState(null);
  const [zoom, setZoom] = useState(1);

  const inmueblesFiltrados = useMemo(() => {
    const texto = busqueda.toLowerCase().trim();

    return inmueblesIniciales.filter((inmueble) => {
      const coincideTexto =
        inmueble.nombre.toLowerCase().includes(texto) ||
        inmueble.direccion.toLowerCase().includes(texto) ||
        inmueble.tipo.toLowerCase().includes(texto);

      const coincideCategoria =
        categoria === "todos" || inmueble.categoria === categoria;

      return coincideTexto && coincideCategoria;
    });
  }, [busqueda, categoria]);

  const posiciones = [
    { x: 25, y: 25 },
    { x: 40, y: 33 },
    { x: 52, y: 18 },
    { x: 58, y: 48 },
    { x: 32, y: 55 },
    { x: 65, y: 60 },
    { x: 45, y: 72 },
    { x: 75, y: 70 },
    { x: 82, y: 42 },
    { x: 18, y: 43 },
    { x: 35, y: 80 },
    { x: 60, y: 85 },
    { x: 70, y: 30 },
    { x: 50, y: 55 },
    { x: 85, y: 80 },
    { x: 28, y: 15 },
  ];

  return (
    <main className="municipal-dashboard">
      {/* Presentación del panel */}
      <section className="municipal-welcome">
        <div>
          <h1>¡Hola, María!</h1>
          <p>Gestioná y supervisá toda la información del sistema.</p>
        </div>

        <span className="municipal-date">
          <FechaActual />
        </span>
      </section>

      {/* Tarjetas de estadísticas */}
      <section
        className="municipal-stats"
        aria-label="Estadísticas generales"
      >
        {estadisticas.map((estadistica) => (
          <article className="municipal-stat-card" key={estadistica.titulo}>
            <div className="municipal-stat-icon">
              <Icono nombre={estadistica.icono} size={38} />
            </div>

            <div className="municipal-stat-info">
              <strong>{estadistica.valor}</strong>
              <span>{estadistica.titulo}</span>
            </div>

            <div className="municipal-stat-growth">
              <strong>↑ {estadistica.porcentaje}</strong>
              <span>respecto al mes anterior</span>
            </div>
          </article>
        ))}
      </section>

      {/* Mapa y listado lateral */}
      <section className="municipal-main-grid">
        <article className="municipal-map-panel">
          <div className="municipal-panel-heading">
            <div className="municipal-heading-icon">
              <Icono nombre="map" size={31} />
            </div>

            <div>
              <h2>Mapa de mis inmuebles</h2>
              <p>
                Visualizá la ubicación de todos los inmuebles con
                instalaciones de seguridad contra incendios.
              </p>
            </div>
          </div>

          {/* Buscador y filtros */}
          <div className="municipal-map-toolbar">
            <label className="municipal-search">
              <Icono nombre="search" size={26} />

              <input
                type="search"
                placeholder="Buscar por dirección, cliente o nombre de inmueble..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                aria-label="Buscar inmuebles"
              />
            </label>

            <div className="municipal-filter-wrapper">
              <button
                type="button"
                className={`municipal-filter-button ${
                  filtroAbierto ? "is-active" : ""
                }`}
                onClick={() => setFiltroAbierto(!filtroAbierto)}
                aria-expanded={filtroAbierto}
              >
                <Icono nombre="filter" size={25} />
                <span>Filtros</span>
                <Icono nombre="chevron" size={18} />
              </button>

              {filtroAbierto && (
                <div className="municipal-filter-menu">
                  <label htmlFor="municipal-category">
                    Tipo de inmueble
                  </label>

                  <select
                    id="municipal-category"
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value)}
                  >
                    <option value="todos">Todos los tipos</option>
                    <option value="residencial">Residencial</option>
                    <option value="hotel">Hotel</option>
                    <option value="salud">Centro de salud</option>
                    <option value="comercial">Comercial</option>
                  </select>

                  <button
                    type="button"
                    onClick={() => {
                      setCategoria("todos");
                      setBusqueda("");
                    }}
                  >
                    Limpiar filtros
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mapa */}
          <div className="municipal-map">
            <div
              className="municipal-map-canvas"
              style={{ transform: `scale(${zoom})` }}
            >
              <iframe
                title="Mapa de Neuquén"
                src="https://www.openstreetmap.org/export/embed.html?bbox=-68.10%2C-38.99%2C-68.00%2C-38.93&layer=mapnik"
                loading="lazy"
                className="municipal-map-iframe"
              />

              <div className="municipal-map-shade" />

              <span className="municipal-map-label label-parque">
                PARQUE
                <br />
                CENTRAL
              </span>

              <span className="municipal-map-label label-neuquen">
                Neuquén
              </span>

              <span className="municipal-map-label label-barrio">
                BARRIO
                <br />
                SANTA GENOVEVA
              </span>

              <span className="municipal-map-label label-confluencia">
                BARRIO
                <br />
                CONFLUENCIA
              </span>

              <span className="municipal-rio-label">Río Limay</span>

              {posiciones.map((posicion, indice) => (
                <button
                  type="button"
                  key={indice}
                  className="municipal-map-marker"
                  style={{
                    left: `${posicion.x}%`,
                    top: `${posicion.y}%`,
                  }}
                  title={`Inmueble registrado ${indice + 1}`}
                  aria-label={`Seleccionar inmueble ${indice + 1}`}
                  onClick={() =>
                    setInmuebleSeleccionado(
                      inmueblesFiltrados[indice % Math.max(inmueblesFiltrados.length, 1)] ||
                        null
                    )
                  }
                >
                  <Icono nombre="building" size={19} />
                </button>
              ))}
            </div>

            {/* Controles de zoom */}
            <div className="municipal-map-controls">
              <button
                type="button"
                aria-label="Acercar mapa"
                onClick={() => setZoom((actual) => Math.min(actual + 0.1, 1.5))}
              >
                +
              </button>

              <button
                type="button"
                aria-label="Alejar mapa"
                onClick={() => setZoom((actual) => Math.max(actual - 0.1, 1))}
              >
                −
              </button>

              <button
                type="button"
                aria-label="Restablecer mapa"
                onClick={() => setZoom(1)}
              >
                <Icono nombre="locate" size={23} />
              </button>
            </div>

            {/* Referencias */}
            <div className="municipal-map-legend">
              <div>
                <span className="municipal-legend-dot red">
                  <Icono nombre="building" size={15} />
                </span>
                <span>Inmueble registrado</span>
              </div>

              <div>
                <span className="municipal-legend-dot blue">
                  <Icono nombre="building" size={15} />
                </span>
                <span>Inmueble seleccionado</span>
              </div>
            </div>

            {inmuebleSeleccionado && (
              <div className="municipal-map-selection">
                <button
                  type="button"
                  onClick={() => setInmuebleSeleccionado(null)}
                  aria-label="Cerrar información"
                >
                  ×
                </button>
                <strong>{inmuebleSeleccionado.nombre}</strong>
                <span>{inmuebleSeleccionado.direccion}</span>
              </div>
            )}
          </div>
        </article>

        {/* Últimos inmuebles */}
        <aside className="municipal-recent-panel">
          <div className="municipal-recent-heading">
            <Icono nombre="building" size={28} />
            <h2>Últimos inmuebles registrados</h2>
            <button
              type="button"
              onClick={() => {
                setBusqueda("");
                setCategoria("todos");
              }}
            >
              Ver todos
            </button>
          </div>

          <div className="municipal-recent-list">
            {inmueblesFiltrados.map((inmueble) => (
              <button
                type="button"
                className={`municipal-property ${
                  inmuebleSeleccionado?.id === inmueble.id
                    ? "is-selected"
                    : ""
                }`}
                key={inmueble.id}
                onClick={() => setInmuebleSeleccionado(inmueble)}
              >
                <img
                  src={inmueble.imagen}
                  alt=""
                  className="municipal-property-image"
                  loading="lazy"
                />

                <span className="municipal-property-info">
                  <strong>{inmueble.nombre}</strong>
                  <span>{inmueble.direccion}</span>
                  <span>{inmueble.tipo}</span>
                </span>

                <span className="municipal-property-arrow">
                  <Icono nombre="arrow" size={21} />
                </span>
              </button>
            ))}

            {inmueblesFiltrados.length === 0 && (
              <p className="municipal-empty">
                No se encontraron inmuebles con esos filtros.
              </p>
            )}
          </div>

          <button
            type="button"
            className="municipal-add-button"
            onClick={() =>
              window.dispatchEvent(new CustomEvent("prisci:agregar-inmueble"))
            }
          >
            <Icono nombre="plus" size={22} />
            <span>Agregar inmueble</span>
          </button>
        </aside>
      </section>
    </main>
  );
}
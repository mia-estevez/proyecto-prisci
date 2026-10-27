import { useMemo, useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import 'leaflet/dist/leaflet.css';
import "./PaginaMunicipal.css";

const inmueblesIniciales = [
  {
    id: 1,
    idReal: 1,
    nombre: "Edificio Torres del Limay",
    direccion: "Av. Argentina 1234, Neuquén",
    tipo: "Edificio residencial",
    categoria: "residencial",
    latitudValida: -38.9516,
    longitudValida: -68.0591,
    imagen:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: 2,
    idReal: 2,
    nombre: "Consorcio Los Teros",
    direccion: "Calle San Martín 567, Neuquén",
    tipo: "Edificio residencial",
    categoria: "residencial",
    latitudValida: -38.9560,
    longitudValida: -68.0650,
    imagen:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: 3,
    idReal: 3,
    nombre: "Hotel del Comahue",
    direccion: "Av. Olascoaga 890, Neuquén",
    tipo: "Hotel",
    categoria: "hotel",
    latitudValida: -38.9450,
    longitudValida: -68.0530,
    imagen:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: 4,
    idReal: 4,
    nombre: "Centro Médico Neuquén",
    direccion: "Calle Roca 345, Neuquén",
    tipo: "Centro de salud",
    categoria: "salud",
    latitudValida: -38.9480,
    longitudValida: -68.0700,
    imagen:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: 5,
    idReal: 5,
    nombre: "Supermercado La Anónima",
    direccion: "Av. Argentina 2200, Neuquén",
    tipo: "Local comercial",
    categoria: "comercial",
    latitudValida: -38.9620,
    longitudValida: -68.0450,
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

const CENTRO_NEUQUEN = [-38.9516, -68.0591];

const crearIcono = (colorHex) => {
  const svg = `
    <svg width="32" height="44" viewBox="0 0 24 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 0C5.37 0 0 5.37 0 12C0 21 12 36 12 36C12 36 24 21 24 12C24 5.37 18.63 0 12 0ZM12 16C9.79 16 8 14.21 8 12C8 9.79 9.79 8 12 8C14.21 8 16 9.79 16 12C16 14.21 14.21 16 12 16Z" fill="${colorHex}" stroke="#0f172a" stroke-width="1.5"/>
    </svg>
  `;
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: svg,
    iconSize: [32, 44],
    iconAnchor: [16, 44],
    popupAnchor: [0, -42]
  });
};

const iconoRojo = crearIcono('#ef4444');
const iconoAzul = crearIcono('#38bdf8');

function ControladorMapa({ inmuebles, inmuebleSeleccionado }) {
  const map = useMap();

  useEffect(() => {
    map.invalidateSize();

    if (inmuebleSeleccionado) {
      map.flyTo(
        [inmuebleSeleccionado.latitudValida, inmuebleSeleccionado.longitudValida], 
        16, 
        { duration: 1.2 }
      );
    } else if (inmuebles.length > 0) {
      const puntos = inmuebles.map(item => [item.latitudValida, item.longitudValida]);
      const bounds = L.latLngBounds(puntos);
      map.fitBounds(bounds, { padding: [60, 60] });
    }
  }, [inmuebles, inmuebleSeleccionado, map]);

  return null;
}

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
    filter: <path d="M4 4h16l-6 7v6l-4 3v-9z" />,
    arrow: <path d="m9 18 6-6-6-6" />,
    plus: <path d="M12 5v14M5 12h14" />,
    chevron: <path d="m7 10 5 5 5-5" />,
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
  const [inmuebleSeleccionado, setInmuebleSeleccionado] = useState(null);

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
        <article className="municipal-map-panel" style={{ display: 'flex', flexDirection: 'column' }}>
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

          {/* Mapa Leaflet Corregido con Altura Fija Forzada */}
          <div style={{ height: "420px", width: "100%", position: "relative", borderRadius: "8px", overflow: "hidden", marginTop: "10px" }}>
            <MapContainer 
              center={CENTRO_NEUQUEN} 
              zoom={13} 
              style={{ height: "420px", width: "100%", borderRadius: "8px" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; OpenStreetMap contributors'
              />

              <ControladorMapa 
                inmuebles={inmueblesFiltrados} 
                inmuebleSeleccionado={inmuebleSeleccionado} 
              />
              
              {inmueblesFiltrados.map((item) => {
                const idItem = item.idReal;
                const esSeleccionado = inmuebleSeleccionado?.idReal === idItem;

                return (
                  <Marker
                    key={`marker-${idItem}`}
                    position={[item.latitudValida, item.longitudValida]}
                    icon={esSeleccionado ? iconoAzul : iconoRojo}
                    eventHandlers={{
                      click: () => setInmuebleSeleccionado(item),
                    }}
                  >
                    <Popup>
                      <div className="popup-container" style={{ padding: '5px' }}>
                        <strong style={{ fontSize: '14px', color: '#0f172a' }}>{item.nombre}</strong>
                        <p style={{ fontSize: '12px', margin: '4px 0', color: '#334155' }}>{item.direccion}</p>
                        <span className="popup-tag" style={{ fontSize: '10px', background: '#e2e8f0', padding: '2px 6px', borderRadius: '4px', display: 'inline-block', marginBottom: '8px' }}>
                          {item.tipo}
                        </span>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
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
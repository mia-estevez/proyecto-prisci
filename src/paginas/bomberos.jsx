
import { useState } from "react";
import "./bomberos.css";
import FichaInm from "../componentes/fichaInm.jsx";

// Inmuebles de prueba
const inmueblesPrueba = [
  {
    id: 1,
    nombre: "Edificio Los Aromos",
    direccion: "Av. San Martín 450",
    tipo: "Edificio residencial",
    estado: "Aprobado",
    actualizacion: "05/10/2026",
    imagen:
      "https://placehold.co/600x350/e8edf2/334155?text=Edificio+Los+Aromos",
  },
  {
    id: 2,
    nombre: "Centro Comercial del Sur",
    direccion: "Belgrano 820",
    tipo: "Local comercial",
    estado: "Pendiente",
    actualizacion: "02/10/2026",
    imagen:
      "https://placehold.co/600x350/e8edf2/334155?text=Centro+Comercial",
  },
  {
    id: 3,
    nombre: "Escuela N.º 25",
    direccion: "Rivadavia 1200",
    tipo: "Establecimiento educativo",
    estado: "Aprobado",
    actualizacion: "28/09/2026",
    imagen:
      "https://placehold.co/600x350/e8edf2/334155?text=Escuela+25",
  },
];

function Bomberos() {
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("Todos");

  // Inmueble cuyo detalle se muestra en el panel
  const [inmuebleSeleccionado, setInmuebleSeleccionado] = useState(null);

  // Controla la apertura de la ficha completa
  const [fichaAbierta, setFichaAbierta] = useState(false);

  // Filtrar inmuebles por nombre, dirección y estado
  const inmueblesFiltrados = inmueblesPrueba.filter((inmueble) => {
    const coincideBusqueda =
      inmueble.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      inmueble.direccion.toLowerCase().includes(busqueda.toLowerCase());

    const coincideEstado =
      filtroEstado === "Todos" || inmueble.estado === filtroEstado;

    return coincideBusqueda && coincideEstado;
  });

  // Seleccionar un inmueble solo muestra sus detalles
  function seleccionarInmueble(inmueble) {
    setInmuebleSeleccionado(inmueble);
    setFichaAbierta(false);
  }

  // Abrir la ficha completa al presionar el botón
  function abrirFicha() {
    setFichaAbierta(true);
  }

  // Cerrar la ficha y volver al detalle
  function cerrarFicha() {
    setFichaAbierta(false);
  }

  return (
    <section className="bomberos-pagina">
      {/* ENCABEZADO */}
      <header className="bomberos-encabezado">
        <div>
          <h1>Mapa de inmuebles registrados</h1>
          <p>
            Consultá los inmuebles registrados y revisá sus fichas.
          </p>
        </div>
      </header>

      {/* BUSCADOR Y FILTRO */}
      <div className="bomberos-herramientas">
        <input
          type="search"
          placeholder="Buscar por nombre o dirección..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />

        <select
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
        >
          <option value="Todos">Todos los estados</option>
          <option value="Aprobado">Aprobado</option>
          <option value="Pendiente">Pendiente</option>
        </select>
      </div>

      {/* MAPA Y PANEL LATERAL */}
      <div className="bomberos-contenido">
        {/* MAPA */}
        <div className="bomberos-mapa">
          <div className="bomberos-mapa-mensaje">
            <i className="bi bi-map"></i>
            <h2>Mapa de inmuebles</h2>
            <p>Mapa de Pili</p>
          </div>
        </div>

        {/* PANEL DE DETALLES Y LISTADO */}
        <aside className="bomberos-panel">
          {inmuebleSeleccionado ? (
            <div className="bomberos-detalle">
              {/* Volver al listado */}
              <button
                className="bomberos-volver"
                onClick={() => setInmuebleSeleccionado(null)}
              >
                <i className="bi bi-arrow-left"></i> Volver al listado
              </button>

              {/* Imagen del inmueble */}
              <img
                className="bomberos-foto"
                src={inmuebleSeleccionado.imagen}
                alt={inmuebleSeleccionado.nombre}
              />

              <h2>{inmuebleSeleccionado.nombre}</h2>

              <p>
                <i className="bi bi-geo-alt"></i>{" "}
                {inmuebleSeleccionado.direccion}
              </p>

              {/* Tipo de inmueble */}
              <div className="bomberos-dato">
                <span>Tipo de inmueble</span>
                <strong>{inmuebleSeleccionado.tipo}</strong>
              </div>

              {/* Estado */}
              <div className="bomberos-dato">
                <span>Estado</span>
                <strong
                  className={
                    inmuebleSeleccionado.estado === "Aprobado"
                      ? "estado-aprobado"
                      : "estado-pendiente"
                  }
                >
                  {inmuebleSeleccionado.estado}
                </strong>
              </div>

              {/* Última actualización */}
              <div className="bomberos-dato">
                <span>Última actualización</span>
                <strong>{inmuebleSeleccionado.actualizacion}</strong>
              </div>

              {/* ABRIR FICHA COMPLETA */}
              <button
                className="bomberos-descargar"
                onClick={abrirFicha}
              >
                <i className="bi bi-download"></i> Ficha
              </button>
            </div>
          ) : (
            <>
              <h2>Inmuebles registrados</h2>

              <p className="bomberos-cantidad">
                {inmueblesFiltrados.length} inmuebles encontrados
              </p>

              <div className="bomberos-listado">
                {inmueblesFiltrados.map((inmueble) => (
                  <button
                    key={inmueble.id}
                    className="bomberos-inmueble"
                    onClick={() => seleccionarInmueble(inmueble)}
                  >
                    <span className="bomberos-inmueble-icono">
                      <i className="bi bi-building"></i>
                    </span>

                    <span className="bomberos-inmueble-info">
                      <strong>{inmueble.nombre}</strong>
                      <small>{inmueble.direccion}</small>
                      <small>{inmueble.tipo}</small>
                    </span>

                    <i className="bi bi-chevron-right"></i>
                  </button>
                ))}

                {inmueblesFiltrados.length === 0 && (
                  <p className="bomberos-sin-resultados">
                    No se encontraron inmuebles.
                  </p>
                )}
              </div>
            </>
          )}
        </aside>
      </div>

      {/* MODAL DE LA FICHA COMPLETA */}
      {fichaAbierta && inmuebleSeleccionado && (
        <FichaInm
          inmueble={inmuebleSeleccionado}
          rol="bomberos"
          onCerrar={cerrarFicha}
        />
      )}
    </section>
  );
}

export default Bomberos;

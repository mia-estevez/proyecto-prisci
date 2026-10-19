import React, { useState, useMemo } from "react";
import './Historial.css';

const registrosIniciales = [
  { fechaHora: "19/08/2025 11:05", usuario: "Pedro López", rol: "Municipalidad", accion: "Registró inmueble", detalle: "Se registró un nuevo inmueble", inmueble: "Edificio Torres del Limay", ip: "192.168.1.10" },
  { fechaHora: "19/08/2025 10:23", usuario: "Juan Pérez", rol: "Profesional", accion: "Cargó inspección", detalle: "N° Parte R0103-000256", inmueble: "Edificio Torres del Limay", ip: "192.168.1.1" },
  { fechaHora: "18/08/2025 16:45", usuario: "María Gómez", rol: "Profesional", accion: "Editó inspección", detalle: "Se modificaron observaciones", inmueble: "Consorcio Los Tilos", ip: "192.168.1.5" },
  { fechaHora: "15/08/2025 09:12", usuario: "Ana Ruiz", rol: "Profesional", accion: "Generó informe", detalle: "Informe de inspecciones PDF", inmueble: "Hotel del Comahue", ip: "192.168.1.8" },
  { fechaHora: "14/08/2025 14:20", usuario: "Pedro López", rol: "Municipalidad", accion: "Modificó usuario", detalle: "Se actualizó el rol", inmueble: "Carlos Díaz", ip: "192.168.1.10" },
  { fechaHora: "12/08/2025 11:30", usuario: "Juan Pérez", rol: "Profesional", accion: "Cargó inspección", detalle: "Revisión extintores piso 2", inmueble: "Consorcio Los Tilos", ip: "192.168.1.1" },
  { fechaHora: "10/08/2025 08:45", usuario: "María Gómez", rol: "Profesional", accion: "Generó informe", detalle: "Certificado de cobertura anual", inmueble: "Centro Médico Neuquén", ip: "192.168.1.5" }
];

export default function Historial() {
  // Estados para los filtros
  const [busqueda, setBusqueda] = useState("");
  const [usuarioFiltro, setUsuarioFiltro] = useState("Todos");
  const [accionFiltro, setAccionFiltro] = useState("Todas");
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);

  const elementosPorPagina = 5;

  // Extraer opciones únicas dinámicas para los combos
  const listaUsuarios = ["Todos", ...new Set(registrosIniciales.map(r => r.usuario))];
  const listaAcciones = ["Todas", ...new Set(registrosIniciales.map(r => r.accion))];

  // Función auxiliar para parsear fechas DD/MM/YYYY
  const parsearFecha = (strFecha) => {
    if (!strFecha) return null;
    const [fechaPart] = strFecha.split(" ");
    const [dia, mes, anio] = fechaPart.split("/");
    return new Date(anio, mes - 1, dia);
  };

  // Filtrado de registros en tiempo real
  const registrosFiltrados = useMemo(() => {
    return registrosIniciales.filter(item => {
      // 1. Buscador texto libre
      const textoBuscado = busqueda.toLowerCase().trim();
      const coincideBusqueda =
        !textoBuscado ||
        item.usuario.toLowerCase().includes(textoBuscado) ||
        item.accion.toLowerCase().includes(textoBuscado) ||
        item.detalle.toLowerCase().includes(textoBuscado) ||
        item.inmueble.toLowerCase().includes(textoBuscado);

      // 2. Filtro Usuario
      const coincideUsuario = usuarioFiltro === "Todos" || item.usuario === usuarioFiltro;

      // 3. Filtro Acción
      const coincideAccion = accionFiltro === "Todas" || item.accion === accionFiltro;

      // 4. Rango de Fechas
      const fechaItem = parsearFecha(item.fechaHora);
      const fDesde = fechaDesde ? new Date(fechaDesde + "T00:00:00") : null;
      const fHasta = fechaHasta ? new Date(fechaHasta + "T23:59:59") : null;

      const coincideFechaDesde = !fDesde || (fechaItem && fechaItem >= fDesde);
      const coincideFechaHasta = !fHasta || (fechaItem && fechaItem <= fHasta);

      return (
        coincideBusqueda &&
        coincideUsuario &&
        coincideAccion &&
        coincideFechaDesde &&
        coincideFechaHasta
      );
    });
  }, [busqueda, usuarioFiltro, accionFiltro, fechaDesde, fechaHasta]);

  // Paginación
  const totalPaginas = Math.ceil(registrosFiltrados.length / elementosPorPagina) || 1;
  const indiceInicio = (paginaActual - 1) * elementosPorPagina;
  const registrosPaginados = registrosFiltrados.slice(indiceInicio, indiceInicio + elementosPorPagina);

  // Limpiar filtros
  const limpiarFiltros = () => {
    setBusqueda("");
    setUsuarioFiltro("Todos");
    setAccionFiltro("Todas");
    setFechaDesde("");
    setFechaHasta("");
    setPaginaActual(1);
  };

  return (
    <section className="prisci-page">
      <p className="breadcrumb">⌂ Historial</p>
      <h1>Historial</h1>
      <p className="subtitle">
        Registro de acciones realizadas en el sistema.
      </p>

      <section className="panel">
        <div className="toolbar">
          {/* BUSCADOR */}
          <input
            type="text"
            className="control search"
            placeholder="Buscar por usuario, acción o inmueble..."
            value={busqueda}
            onChange={(e) => {
              setBusqueda(e.target.value);
              setPaginaActual(1);
            }}
          />

          {/* SELECTOR USUARIO */}
          <label className="field compact-field">
            <span>Usuario</span>
            <select
              className="control"
              value={usuarioFiltro}
              onChange={(e) => {
                setUsuarioFiltro(e.target.value);
                setPaginaActual(1);
              }}
            >
              {listaUsuarios.map(u => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </label>

          {/* SELECTOR ACCIÓN */}
          <label className="field compact-field">
            <span>Acción</span>
            <select
              className="control"
              value={accionFiltro}
              onChange={(e) => {
                setAccionFiltro(e.target.value);
                setPaginaActual(1);
              }}
            >
              {listaAcciones.map(a => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </label>

          {/* FECHA DESDE */}
          <label className="field compact-field">
            <span>Fecha desde</span>
            <input
              type="date"
              className="control"
              value={fechaDesde}
              onChange={(e) => {
                setFechaDesde(e.target.value);
                setPaginaActual(1);
              }}
            />
          </label>

          {/* FECHA HASTA */}
          <label className="field compact-field">
            <span>Fecha hasta</span>
            <input
              type="date"
              className="control"
              value={fechaHasta}
              onChange={(e) => {
                setFechaHasta(e.target.value);
                setPaginaActual(1);
              }}
            />
          </label>

          {/* BOTÓN LIMPIAR */}
          <button className="btn secondary" type="button" onClick={limpiarFiltros}>
            Limpiar
          </button>
        </div>

        {/* TABLA DE RESULTADOS */}
        <div className="table-wrap">
          <table className="data-table history-table">
            <thead>
              <tr>
                <th>Fecha y hora</th>
                <th>Usuario</th>
                <th>Rol</th>
                <th>Acción</th>
                <th>Detalle</th>
                <th>Inmueble</th>
                <th>IP</th>
              </tr>
            </thead>
            <tbody>
              {registrosPaginados.length > 0 ? (
                registrosPaginados.map((item, index) => (
                  <tr key={index}>
                    <td>{item.fechaHora}</td>
                    <td>{item.usuario}</td>
                    <td>{item.rol}</td>
                    <td>{item.accion}</td>
                    <td>{item.detalle}</td>
                    <td>{item.inmueble}</td>
                    <td>{item.ip}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center", padding: "20px" }}>
                    No se encontraron registros que coincidan con los filtros.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PIE DE TABLA Y PAGINACIÓN */}
        <div className="table-footer">
          <span>
            Mostrando {registrosFiltrados.length === 0 ? 0 : indiceInicio + 1} a{" "}
            {Math.min(indiceInicio + elementosPorPagina, registrosFiltrados.length)} de{" "}
            {registrosFiltrados.length} resultados
          </span>

          <div className="pagination">
            <button
              type="button"
              disabled={paginaActual === 1}
              onClick={() => setPaginaActual(prev => prev - 1)}
            >
              ‹
            </button>

            {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(num => (
              <button
                type="button"
                key={num}
                className={num === paginaActual ? "current" : ""}
                onClick={() => setPaginaActual(num)}
              >
                {num}
              </button>
            ))}

            <button
              type="button"
              disabled={paginaActual === totalPaginas || totalPaginas === 0}
              onClick={() => setPaginaActual(prev => prev + 1)}
            >
              ›
            </button>
          </div>
        </div>
      </section>
    </section>
  );
}
import React, { useState, useMemo } from "react";
import "./Usuarios.css";

const usuariosIniciales = [
  { id: 1, nombre: "Juan Pérez", dni: "12345678", email: "juan.perez@email.com", rol: "Profesional", estado: "Activo", ultimoAcceso: "19/08/2026 10:23" },
  { id: 2, nombre: "María Gómez", dni: "23456789", email: "maria.gomez@email.com", rol: "Profesional", estado: "Activo", ultimoAcceso: "18/08/2026 08:15" },
  { id: 3, nombre: "Carlos Díaz", dni: "34567890", email: "carlos.diaz@email.com", rol: "Profesional", estado: "Inactivo", ultimoAcceso: "10/07/2026 09:12" },
  { id: 4, nombre: "Ana Ruiz", dni: "45678901", email: "ana.ruiz@email.com", rol: "Profesional", estado: "Activo", ultimoAcceso: "10/07/2026 08:30" },
  { id: 5, nombre: "Pedro López", dni: "56789012", email: "pedro.lopez@email.com", rol: "Municipalidad", estado: "Activo", ultimoAcceso: "13/08/2026 11:20" },
  { id: 6, nombre: "Sofía Ramírez", dni: "67890123", email: "sofia.ramirez@email.com", rol: "Propietario", estado: "Inactivo", ultimoAcceso: "01/08/2026 14:10" },
  { id: 7, nombre: "Lucas Fernández", dni: "78901234", email: "lucas.fernandez@email.com", rol: "Bomberos", estado: "Activo", ultimoAcceso: "05/08/2026 16:45" }
];

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState(usuariosIniciales);
  const [busqueda, setBusqueda] = useState("");
  const [rolFiltro, setRolFiltro] = useState("Todos");
  const [estadoFiltro, setEstadoFiltro] = useState("Todos");
  const [paginaActual, setPaginaActual] = useState(1);

  // Estados para el Modal de Edición
  const [usuarioEditando, setUsuarioEditando] = useState(null);

  const elementosPorPagina = 5;

  const rolesDisponibles = ["Todos", ...new Set(usuarios.map(u => u.rol))];
  const estadosDisponibles = ["Todos", "Activo", "Inactivo"];

  // Filtrado de usuarios
  const usuariosFiltrados = useMemo(() => {
    return usuarios.filter(u => {
      const texto = busqueda.toLowerCase().trim();
      const coincideBusqueda =
        !texto ||
        u.nombre.toLowerCase().includes(texto) ||
        u.email.toLowerCase().includes(texto) ||
        u.dni.includes(texto);

      const coincideRol = rolFiltro === "Todos" || u.rol === rolFiltro;
      const coincideEstado = estadoFiltro === "Todos" || u.estado === estadoFiltro;

      return coincideBusqueda && coincideRol && coincideEstado;
    });
  }, [usuarios, busqueda, rolFiltro, estadoFiltro]);

  const totalPaginas = Math.ceil(usuariosFiltrados.length / elementosPorPagina) || 1;
  const indiceInicio = (paginaActual - 1) * elementosPorPagina;
  const usuariosPaginados = usuariosFiltrados.slice(indiceInicio, indiceInicio + elementosPorPagina);

  const limpiarFiltros = () => {
    setBusqueda("");
    setRolFiltro("Todos");
    setEstadoFiltro("Todos");
    setPaginaActual(1);
  };

  // FUNCIÓN ELIMINAR
  const eliminarUsuario = (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
      setUsuarios(usuarios.filter(u => u.id !== id));
    }
  };

  // FUNCIÓN GUARDAR EDICIÓN
  const guardarEdicion = (e) => {
    e.preventDefault();
    setUsuarios(usuarios.map(u => u.id === usuarioEditando.id ? usuarioEditando : u));
    setUsuarioEditando(null); // Cierra el modal
  };

  return (
    <section className="prisci-page">
      <p className="breadcrumb">⌂ Usuarios</p>

      <div className="title-row">
        <div className="title-row-info">
          <h1>Usuarios</h1>
          <p className="subtitle">Administre los usuarios del sistema.</p>
        </div>
        <button type="button" className="btn primary">
          + Nuevo usuario
        </button>
      </div>

      <section className="panel">
        <div className="toolbar">
          <input
            type="text"
            className="control search"
            placeholder="Buscar por nombre, email o DNI..."
            value={busqueda}
            onChange={(e) => {
              setBusqueda(e.target.value);
              setPaginaActual(1);
            }}
          />

          <label className="field compact-field">
            <span>Rol</span>
            <select
              className="control"
              value={rolFiltro}
              onChange={(e) => {
                setRolFiltro(e.target.value);
                setPaginaActual(1);
              }}
            >
              {rolesDisponibles.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </label>

          <label className="field compact-field">
            <span>Estado</span>
            <select
              className="control"
              value={estadoFiltro}
              onChange={(e) => {
                setEstadoFiltro(e.target.value);
                setPaginaActual(1);
              }}
            >
              {estadosDisponibles.map(e => (
                <option key={e} value={e}>{e}</option>
              ))}
            </select>
          </label>

          <button type="button" className="btn secondary" onClick={limpiarFiltros}>
            Limpiar
          </button>
        </div>

        {/* TABLA */}
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>DNI</th>
                <th>Correo electrónico</th>
                <th>Rol</th>
                <th>Estado</th>
                <th>Último acceso</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuariosPaginados.length > 0 ? (
                usuariosPaginados.map(usuario => (
                  <tr key={usuario.id}>
                    <td><strong>{usuario.nombre}</strong></td>
                    <td>{usuario.dni}</td>
                    <td>{usuario.email}</td>
                    <td>{usuario.rol}</td>
                    <td>
                      <span className={`status ${usuario.estado === "Activo" ? "green" : "yellow"}`}>
                        {usuario.estado}
                      </span>
                    </td>
                    <td>{usuario.ultimoAcceso}</td>
                    <td>
                      <button 
                        type="button" 
                        className="table-button btn-editar"
                        onClick={() => setUsuarioEditando(usuario)}
                      >
                        Editar
                      </button>
                      <button 
                        type="button" 
                        className="table-button btn-eliminar"
                        onClick={() => eliminarUsuario(usuario.id)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center", padding: "20px" }}>
                    No se encontraron usuarios que coincidan con los filtros.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PIE DE TABLA */}
        <div className="table-footer">
          <span>
            Mostrando {usuariosFiltrados.length === 0 ? 0 : indiceInicio + 1} a{" "}
            {Math.min(indiceInicio + elementosPorPagina, usuariosFiltrados.length)} de{" "}
            {usuariosFiltrados.length} resultados
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

      {/* MODAL DE EDICIÓN */}
      {usuarioEditando && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
          backgroundColor: "rgba(0,0,0,0.6)", display: "flex", justifyContent: "center",
          alignItems: "center", zIndex: 1000
        }}>
          <div style={{
            background: "#0d1b3e", border: "1px solid rgba(255,255,255,0.1)",
            padding: "24px", borderRadius: "12px", width: "400px", maxWidth: "90%"
          }}>
            <h2 style={{ color: "#fff", marginBottom: "16px", fontSize: "18px" }}>Editar Usuario</h2>
            
            <form onSubmit={guardarEdicion} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <label className="field">
                <span>Nombre</span>
                <input
                  type="text"
                  className="control"
                  value={usuarioEditando.nombre}
                  onChange={(e) => setUsuarioEditando({...usuarioEditando, nombre: e.target.value})}
                  required
                />
              </label>

              <label className="field">
                <span>DNI</span>
                <input
                  type="text"
                  className="control"
                  value={usuarioEditando.dni}
                  onChange={(e) => setUsuarioEditando({...usuarioEditando, dni: e.target.value})}
                  required
                />
              </label>

              <label className="field">
                <span>Correo Electrónico</span>
                <input
                  type="email"
                  className="control"
                  value={usuarioEditando.email}
                  onChange={(e) => setUsuarioEditando({...usuarioEditando, email: e.target.value})}
                  required
                />
              </label>

              <label className="field">
                <span>Rol</span>
                <select
                  className="control"
                  value={usuarioEditando.rol}
                  onChange={(e) => setUsuarioEditando({...usuarioEditando, rol: e.target.value})}
                >
                  <option value="Profesional">Profesional</option>
                  <option value="Municipalidad">Municipalidad</option>
                  <option value="Propietario">Propietario</option>
                  <option value="Bomberos">Bomberos</option>
                </select>
              </label>

              <label className="field">
                <span>Estado</span>
                <select
                  className="control"
                  value={usuarioEditando.estado}
                  onChange={(e) => setUsuarioEditando({...usuarioEditando, estado: e.target.value})}
                >
                  <option value="Activo">Activo</option>
                  <option value="Inactivo">Inactivo</option>
                </select>
              </label>

              <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                <button type="submit" className="btn primary" style={{ flex: 1 }}>Guardar</button>
                <button type="button" className="btn secondary" style={{ flex: 1 }} onClick={() => setUsuarioEditando(null)}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
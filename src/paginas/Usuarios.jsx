import React, { useState, useEffect } from "react";
import "./Usuarios.css";

const USUARIOS_INICIALES = [
  { id: 1, nombre: "Juan Pérez", dni: "12345678", email: "juan.perez@email.com", rol: "Profesional", estado: "Activo", ultimoAcceso: "19/08/2026 10:23" },
  { id: 2, nombre: "María Gómez", dni: "23456789", email: "maria.gomez@email.com", rol: "Profesional", estado: "Activo", ultimoAcceso: "18/08/2026 08:15" },
  { id: 3, nombre: "Carlos Díaz", dni: "34567890", email: "carlos.diaz@email.com", rol: "Profesional", estado: "Inactivo", ultimoAcceso: "10/07/2026 09:12" },
  { id: 4, nombre: "Ana Ruiz", dni: "45678901", email: "ana.ruiz@email.com", rol: "Profesional", estado: "Activo", ultimoAcceso: "10/07/2026 08:30" },
  { id: 5, nombre: "Pedro López", dni: "56789012", email: "pedro.lopez@email.com", rol: "Municipalidad", estado: "Activo", ultimoAcceso: "13/08/2026 11:20" },
  { id: 6, nombre: "Laura Martínez", dni: "67890123", email: "laura.m@email.com", rol: "Bomberos", estado: "Activo", ultimoAcceso: "12/08/2026 14:05" },
  { id: 7, nombre: "Santiago Rodríguez", dni: "78901234", email: "santiago.r@email.com", rol: "Propietario", estado: "Activo", ultimoAcceso: "05/08/2026 16:40" },
];

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState(() => {
    const guardados = localStorage.getItem("prisci_usuarios");
    return guardados ? JSON.parse(guardados) : USUARIOS_INICIALES;
  });

  // Filtros
  const [busqueda, setBusqueda] = useState("");
  const [rolFiltro, setRolFiltro] = useState("Todos");
  const [estadoFiltro, setEstadoFiltro] = useState("Todos");

  // Paginado
  const [paginaActual, setPaginaActual] = useState(1);
  const elementosPorPagina = 5;

  // Modal para agregar / editar usuario
  const [modalAbierto, setModalAbierto] = useState(false);
  const [usuarioEditar, setUsuarioEditar] = useState(null);
  const [formData, setFormData] = useState({
    nombre: "",
    dni: "",
    email: "",
    rol: "Profesional",
    estado: "Activo"
  });

  useEffect(() => {
    localStorage.setItem("prisci_usuarios", JSON.stringify(usuarios));
  }, [usuarios]);

  // Aplicar filtros en tiempo real
  const usuariosFiltrados = usuarios.filter(u => {
    const coincideBusqueda = 
      u.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      u.email.toLowerCase().includes(busqueda.toLowerCase()) ||
      u.dni.includes(busqueda);
    
    const coincideRol = rolFiltro === "Todos" || u.rol === rolFiltro;
    const coincideEstado = estadoFiltro === "Todos" || u.estado === estadoFiltro;

    return coincideBusqueda && coincideRol && coincideEstado;
  });

  // Paginación
  const totalPaginas = Math.ceil(usuariosFiltrados.length / elementosPorPagina) || 1;
  const indiceInicio = (paginaActual - 1) * elementosPorPagina;
  const usuariosPaginados = usuariosFiltrados.slice(indiceInicio, indiceInicio + elementosPorPagina);

  const limpiarFiltros = () => {
    setBusqueda("");
    setRolFiltro("Todos");
    setEstadoFiltro("Todos");
    setPaginaActual(1);
  };

  const abrirModalNuevo = () => {
    setUsuarioEditar(null);
    setFormData({ nombre: "", dni: "", email: "", rol: "Profesional", estado: "Activo" });
    setModalAbierto(true);
  };

  const abrirModalEditar = (usuario) => {
    setUsuarioEditar(usuario);
    setFormData({
      nombre: usuario.nombre,
      dni: usuario.dni,
      email: usuario.email,
      rol: usuario.rol,
      estado: usuario.estado
    });
    setModalAbierto(true);
  };

  const guardarUsuario = (e) => {
    e.preventDefault();
    if (usuarioEditar) {
      setUsuarios(prev => prev.map(u => u.id === usuarioEditar.id ? { ...u, ...formData } : u));
    } else {
      const nuevo = {
        id: Date.now(),
        ...formData,
        ultimoAcceso: "Recién ingresado"
      };
      setUsuarios(prev => [nuevo, ...prev]);
    }
    setModalAbierto(false);
  };

  const eliminarUsuario = (id) => {
    if (window.confirm("¿Está seguro de que desea eliminar este usuario?")) {
      setUsuarios(prev => prev.filter(u => u.id !== id));
    }
  };

  return (
    <section className="prisci-page">
      <p className="breadcrumb">⌂ Usuarios</p>
      <h1>Usuarios</h1>
      <p className="subtitle">Administre los usuarios del sistema.</p>

      <div className="top-action-bar">
        <button className="btn primary" onClick={abrirModalNuevo}>
          + Nuevo usuario
        </button>
      </div>

      <div className="panel users-panel">
        {/* FILTROS Y BÚSQUEDA */}
        <div className="filters-container">
          <div className="search-box">
            <input
              type="text"
              className="control"
              placeholder="Buscar por nombre, email o DNI..."
              value={busqueda}
              onChange={(e) => { setBusqueda(e.target.value); setPaginaActual(1); }}
            />
          </div>

          <div className="filters-grid">
            <div className="filter-group">
              <label>Rol</label>
              <select 
                className="control" 
                value={rolFiltro} 
                onChange={(e) => { setRolFiltro(e.target.value); setPaginaActual(1); }}
              >
                <option value="Todos">Todos</option>
                <option value="Municipalidad">Municipalidad</option>
                <option value="Profesional">Profesional</option>
                <option value="Bomberos">Bomberos</option>
                <option value="Propietario">Propietario</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Estado</label>
              <select 
                className="control" 
                value={estadoFiltro} 
                onChange={(e) => { setEstadoFiltro(e.target.value); setPaginaActual(1); }}
              >
                <option value="Todos">Todos</option>
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
              </select>
            </div>

            <div className="filter-actions">
              <button className="btn secondary" onClick={limpiarFiltros}>Limpiar</button>
            </div>
          </div>
        </div>

        {/* TABLA DE USUARIOS */}
        <div className="table-responsive">
          <table className="users-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>DNI</th>
                <th>Correo electrónico</th>
                <th>Rol</th>
                <th>Estado</th>
                <th>Último acceso</th>
                <th style={{ textAlign: "center" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuariosPaginados.length > 0 ? (
                usuariosPaginados.map((u) => (
                  <tr key={u.id}>
                    <td><strong>{u.nombre}</strong></td>
                    <td>{u.dni}</td>
                    <td>{u.email}</td>
                    <td><span className="badge-rol">{u.rol}</span></td>
                    <td>
                      <span className={`status-pill ${u.estado.toLowerCase()}`}>
                        {u.estado}
                      </span>
                    </td>
                    <td>{u.ultimoAcceso}</td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn-icon edit" title="Editar" onClick={() => abrirModalEditar(u)}>
                          ✏️
                        </button>
                        <button className="btn-icon delete" title="Eliminar" onClick={() => eliminarUsuario(u.id)}>
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center", padding: "20px", color: "#8ca7c3" }}>
                    No se encontraron usuarios con los filtros aplicados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PIE Y PAGINADO */}
        <div className="table-footer">
          <span className="results-count">
            Mostrando {usuariosPaginados.length} de {usuariosFiltrados.length} resultados
          </span>

          <div className="pagination">
            <button 
              className="page-btn" 
              disabled={paginaActual === 1}
              onClick={() => setPaginaActual(prev => prev - 1)}
            >
              ‹
            </button>
            {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(num => (
              <button
                key={num}
                className={`page-btn ${paginaActual === num ? "active" : ""}`}
                onClick={() => setPaginaActual(num)}
              >
                {num}
              </button>
            ))}
            <button 
              className="page-btn" 
              disabled={paginaActual === totalPaginas}
              onClick={() => setPaginaActual(prev => prev + 1)}
            >
              ›
            </button>
          </div>
        </div>
      </div>

      {/* MODAL PARA CREAR / EDITAR */}
      {modalAbierto && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h3>{usuarioEditar ? "Editar usuario" : "Agregar nuevo usuario"}</h3>
            <form onSubmit={guardarUsuario}>
              <div className="modal-field">
                <label>Nombre y Apellido</label>
                <input 
                  type="text" 
                  className="control" 
                  required 
                  value={formData.nombre} 
                  onChange={e => setFormData({ ...formData, nombre: e.target.value })} 
                />
              </div>
              <div className="modal-field">
                <label>DNI</label>
                <input 
                  type="text" 
                  className="control" 
                  required 
                  value={formData.dni} 
                  onChange={e => setFormData({ ...formData, dni: e.target.value })} 
                />
              </div>
              <div className="modal-field">
                <label>Correo Electrónico</label>
                <input 
                  type="email" 
                  className="control" 
                  required 
                  value={formData.email} 
                  onChange={e => setFormData({ ...formData, email: e.target.value })} 
                />
              </div>
              <div className="modal-field">
                <label>Rol</label>
                <select 
                  className="control" 
                  value={formData.rol} 
                  onChange={e => setFormData({ ...formData, rol: e.target.value })}
                >
                  <option value="Municipalidad">Municipalidad</option>
                  <option value="Profesional">Profesional</option>
                  <option value="Bomberos">Bomberos</option>
                  <option value="Propietario">Propietario</option>
                </select>
              </div>
              <div className="modal-field">
                <label>Estado</label>
                <select 
                  className="control" 
                  value={formData.estado} 
                  onChange={e => setFormData({ ...formData, estado: e.target.value })}
                >
                  <option value="Activo">Activo</option>
                  <option value="Inactivo">Inactivo</option>
                </select>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn secondary" onClick={() => setModalAbierto(false)}>Cancelar</button>
                <button type="submit" className="btn primary">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
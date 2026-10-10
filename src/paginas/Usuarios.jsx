
import React from "react";

const usuarios = [
  ["Juan Pérez", "12345678", "juan.perez@email.com", "Profesional", "Activo", "19/08/2025 10:23"],
  ["María Gómez", "23456789", "maria.gomez@email.com", "Profesional", "Activo", "18/08/2025 08:15"],
  ["Carlos Díaz", "34567890", "carlos.diaz@email.com", "Profesional", "Inactivo", "10/07/2025 09:12"],
  ["Ana Ruiz", "45678901", "ana.ruiz@email.com", "Profesional", "Activo", "10/07/2025 08:30"],
  ["Pedro López", "56789012", "pedro.lopez@email.com", "Municipalidad", "Activo", "13/08/2025 11:20"]
];

export default function Usuarios() {
  return (
    <section className="prisci-page">
      <p className="breadcrumb">⌂ Usuarios</p>

      <div className="title-row">
        <div>
          <h1>Usuarios</h1>
          <p className="subtitle">Administrá los usuarios del sistema.</p>
        </div>
        <button className="btn primary" type="button">
          + Nuevo usuario
        </button>
      </div>

      <section className="panel">
        <div className="toolbar">
          <input
            className="control search"
            placeholder="Buscar por nombre, email o DNI..."
          />
          <Select label="Rol" options={["Todos", "Profesional", "Municipalidad"]} />
          <Select label="Estado" options={["Todos", "Activo", "Inactivo"]} />
          <button className="btn outline" type="button">Filtros</button>
          <button className="btn secondary" type="button">Limpiar</button>
        </div>

        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>DNI</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Estado</th>
                <th>Último acceso</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario) => (
                <tr key={usuario[0]}>
                  <td>{usuario[0]}</td>
                  <td>{usuario[1]}</td>
                  <td>{usuario[2]}</td>
                  <td>{usuario[3]}</td>
                  <td>
                    <span className={`status ${usuario[4] === "Activo" ? "green" : "yellow"}`}>
                      {usuario[4]}
                    </span>
                  </td>
                  <td>{usuario[5]}</td>
                  <td>
                    <button className="table-button" type="button" title="Editar">✎</button>
                    <button className="table-button" type="button" title="Más opciones">⋮</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="table-footer">
          <span>Mostrando 5 de 18 resultados</span>
          <Pagination />
        </div>
      </section>
    </section>
  );
}

function Select({ label, options }) {
  return (
    <label className="field compact-field">
      <span>{label}</span>
      <select className="control" defaultValue={options[0]}>
        {options.map(item => <option key={item}>{item}</option>)}
      </select>
    </label>
  );
}

function Pagination() {
  return (
    <div className="pagination">
      <button type="button">‹</button>
      {[1, 2, 3, 4].map(numero => (
        <button
          type="button"
          className={numero === 1 ? "current" : ""}
          key={numero}
        >
          {numero}
        </button>
      ))}
      <button type="button">›</button>
    </div>
  );
}


import React from "react";

const registros = [
  ["19/08/2025 11:05", "Pedro López", "Municipalidad", "Registró inmueble", "Se registró un nuevo inmueble", "Edificio Torres del Limay", "192.168.1.10"],
  ["19/08/2025 10:23", "Juan Pérez", "Profesional", "Cargó inspección", "N° Parte R0103-000256", "Edificio Torres del Limay", "192.168.1.1"],
  ["18/08/2025 16:45", "María Gómez", "Profesional", "Editó inspección", "Se modificaron observaciones", "Consorcio Los Tilos", "192.168.1.5"],
  ["15/08/2025 09:12", "Ana Ruiz", "Profesional", "Generó informe", "Informe de inspecciones PDF", "Hotel del Comahue", "192.168.1.8"],
  ["14/08/2025 14:20", "Pedro López", "Municipalidad", "Modificó usuario", "Se actualizó el rol", "Carlos Díaz", "192.168.1.10"]
];

export default function Historial() {
  return (
    <section className="prisci-page">
      <p className="breadcrumb">⌂ Historial</p>
      <h1>Historial</h1>
      <p className="subtitle">
        Registro de acciones realizadas en el sistema.
      </p>

      <section className="panel">
        <div className="toolbar">
          <input
            className="control search"
            placeholder="Buscar por usuario, acción o inmueble..."
          />
          <Select label="Usuario" options={["Todos", "Pedro López", "Juan Pérez", "María Gómez", "Ana Ruiz"]} />
          <Select label="Acción" options={["Todas", "Registró inmueble", "Cargó inspección", "Editó inspección", "Generó informe"]} />
          <Field label="Fecha desde" type="date" />
          <Field label="Fecha hasta" type="date" />
          <button className="btn outline" type="button">Filtros</button>
          <button className="btn secondary" type="button">Limpiar</button>
        </div>

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
              {registros.map((registro, index) => (
                <tr key={index}>
                  {registro.map((dato, columna) => (
                    <td key={columna}>{dato}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="table-footer">
          <span>Mostrando 5 de 50 resultados</span>
          <Pagination />
        </div>
      </section>
    </section>
  );
}

function Field({ label, type = "text" }) {
  return (
    <label className="field compact-field">
      <span>{label}</span>
      <input className="control" type={type} />
    </label>
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
      {[1, 2, 3, 4, 5].map(numero => (
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

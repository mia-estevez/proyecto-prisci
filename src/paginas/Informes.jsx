
import React from "react";

const tipos = [
  ["Inspecciones", "Listado y detalle de inspecciones realizadas."],
  ["Inmuebles", "Listado de inmuebles registrados."],
  ["Profesionales", "Listado de profesionales habilitados."],
  ["Servicios por vencer", "Inmuebles con servicios próximos a vencer."],
  ["Estadísticas generales", "Resumen de actividad del sistema."]
];

export default function Reportes() {
  return (
    <section className="prisci-page">
      <p className="breadcrumb">⌂ Informes</p>
      <h1>Informes</h1>
      <p className="subtitle">
        Generá reportes y estadísticas del sistema.
      </p>

      <div className="panel report-tabs">
        <button className="tab active" type="button">Generar informe</button>
        <button className="tab" type="button">Informes generados</button>
        <button className="tab" type="button">Estadísticas</button>
      </div>

      <div className="reports-layout">
        <section className="panel">
          <h3>Tipo de informe</h3>
          {tipos.map(([nombre, descripcion], index) => (
            <label className="report-type" key={nombre}>
              <input
                type="radio"
                name="tipoInforme"
                defaultChecked={index === 0}
              />
              <span>
                <strong>{nombre}</strong>
                <small>{descripcion}</small>
              </span>
            </label>
          ))}
        </section>

        <section className="panel">
          <h3>Filtros del informe</h3>
          <div className="form-grid">
            <Field label="Fecha desde" type="date" />
            <Field label="Fecha hasta" type="date" />
            <Select label="Estado" options={["Todos", "Pendiente", "Aprobada", "Observada", "Rechazada"]} />
            <Select label="Tipo de instalación" options={["Todos", "Contra incendios", "Eléctrica", "Gas", "Agua"]} />
            <Select label="Profesional" options={["Todos", "Juan Pérez", "María Gómez", "Luis Fernández"]} />
            <Select label="Localidad" options={["Neuquén", "Plottier", "Centenario"]} />
          </div>

          <h3 className="section-heading">Formato de salida</h3>
          <div className="radio-inline">
            <label><input type="radio" name="formato" defaultChecked /> PDF</label>
            <label><input type="radio" name="formato" /> Excel</label>
          </div>
        </section>

        <section className="panel preview-panel">
          <h3>Vista previa</h3>
          <div className="preview">
            <span className="preview-icon">▤</span>
            <p>
              Se generará un informe de inspecciones según los filtros
              seleccionados.
            </p>
          </div>
          <button className="btn primary full" type="button">
            Generar informe
          </button>
        </section>
      </div>
    </section>
  );
}

function Field({ label, type = "text" }) {
  return (
    <label className="field">
      <span>{label}</span>
      <input className="control" type={type} />
    </label>
  );
}

function Select({ label, options }) {
  return (
    <label className="field">
      <span>{label}</span>
      <select className="control" defaultValue={options[0]}>
        {options.map(item => <option key={item}>{item}</option>)}
      </select>
    </label>
  );
}

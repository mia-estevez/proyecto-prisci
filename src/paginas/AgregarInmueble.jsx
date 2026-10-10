import React from "react";


export default function AgregarInmueble() {
  return (
    <section className="prisci-page">
      <p className="breadcrumb">⌂ Inmuebles › Agregar inmueble</p>
      <h1>Agregar inmueble</h1>
      <p className="subtitle">
        Complete la información del inmueble para registrarlo en el sistema.
      </p>

      <div className="form-layout">
        <section className="panel">
          <h3>Datos del inmueble</h3>
          <div className="form-grid">
            <Field label="Nombre del edificio / establecimiento" placeholder="Ej. Edificio Torres del Limay" required />
            <Select label="Tipo de inmueble" options={["Vivienda", "Edificio", "Local comercial", "Otro"]} />
            <Field label="Dirección" placeholder="Calle" required />
            <Field label="Altura" placeholder="Ej. 123" />
            <Select label="Localidad" options={["Neuquén", "Plottier", "Centenario"]} />
            <Select label="Barrio" options={["Centro", "Santa Genoveva", "Confluencia", "Otro"]} />
            <Field label="Partida / Nomenclatura" placeholder="Ej. 12345" />
            <Field label="Superficie (m²)" placeholder="Ej. 500" />
            <Select label="Uso / Actividad principal" options={["Residencial", "Comercial", "Industrial", "Institucional"]} />
          </div>

          <h3 className="section-heading">
            Datos del propietario / responsable
          </h3>
          <div className="form-grid">
            <Field label="Nombre o razón social" placeholder="Ej. Consorcio Los Tilos" required />
            <Field label="CUIT / DNI" placeholder="Ej. 30-12345678-9" required />
            <Field label="Teléfono" placeholder="Ej. 299 1234567" />
            <Field label="Email" placeholder="contacto@empresa.com" type="email" />
          </div>
        </section>

        <div className="side-stack">
          <section className="panel">
            <h3>Ubicación en el mapa</h3>
            <input className="control" placeholder="Buscar dirección..." />
            <div className="map-placeholder">
              <span className="map-pin">📍</span>
              <button className="btn primary map-button" type="button">
                Marcar ubicación
              </button>
            </div>
          </section>

          <section className="panel">
            <h3>Imagen del inmueble (opcional)</h3>
            <label className="upload-box">
              <strong>Seleccionar imagen</strong>
              <small>Formatos JPG o PNG (máx. 5 MB)</small>
              <input type="file" accept="image/png,image/jpeg" />
            </label>
          </section>

          <div className="actions">
            <button className="btn secondary" type="button">Cancelar</button>
            <button className="btn primary" type="button">
              Registrar inmueble
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({ label, placeholder, type = "text", required }) {
  return (
    <label className="field">
      <span>{label}{required ? " *" : ""}</span>
      <input
        className="control"
        type={type}
        placeholder={placeholder}
        required={required}
      />
    </label>
  );
}

function Select({ label, options }) {
  return (
    <label className="field">
      <span>{label}</span>
      <select className="control" defaultValue="">
        <option value="" disabled>Seleccione...</option>
        {options.map(item => <option key={item}>{item}</option>)}
      </select>
    </label>
  );
}

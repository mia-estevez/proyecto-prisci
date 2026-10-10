
import React from "react";

const especialidades = [
  "Instalaciones contra incendios",
  "Extintores y matafuegos",
  "Instalación eléctrica",
  "Instalación fija de agua",
  "Instalación de gas",
  "Planes de evacuación",
  "Detección y alarmas",
  "Otras"
];

export default function AgregarProfesional() {
  return (
    <section className="prisci-page">
      <p className="breadcrumb">⌂ Profesionales › Agregar profesional</p>
      <h1>Agregar profesional</h1>
      <p className="subtitle">
        Complete los datos del profesional para registrarlo en el sistema.
      </p>

      <div className="form-layout">
        <section className="panel">
          <h3>Datos personales</h3>
          <div className="form-grid">
            <Field label="Nombre" placeholder="Ej. Juan" required />
            <Field label="Apellido" placeholder="Ej. Pérez" required />
            <Field label="DNI" placeholder="Ej. 12345678" required />
            <Field label="Matrícula profesional" placeholder="Ej. RP103" required />
            <Field label="CUIT" placeholder="20-12345678-9" required />
            <Field label="Teléfono" placeholder="299 1234567" required />
            <Field label="Email" placeholder="juan@email.com" type="email" required />
          </div>

          <h3 className="section-heading">Especialidades</h3>
          <div className="checkbox-grid">
            {especialidades.map(item => (
              <label className="check-option" key={item}>
                <input type="checkbox" />
                {item}
              </label>
            ))}
          </div>
        </section>

        <div className="side-stack">
          <section className="panel">
            <h3>Documentación</h3>
            {[
              "Título profesional",
              "Matrícula",
              "Seguro de responsabilidad civil"
            ].map(item => (
              <label className="document-upload" key={item}>
                <strong>{item}</strong>
                <input type="file" accept=".pdf,.jpg,.jpeg,.png" />
                <small>PDF o imagen (máx. 5 MB)</small>
              </label>
            ))}
          </section>

          <section className="panel">
            <h3>Estado del profesional</h3>
            <label className="check-option">
              <input type="checkbox" defaultChecked />
              Activo
            </label>
            <small>El profesional podrá acceder al sistema.</small>
          </section>

          <div className="actions">
            <button className="btn secondary" type="button">Cancelar</button>
            <button className="btn primary" type="button">
              Registrar profesional
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

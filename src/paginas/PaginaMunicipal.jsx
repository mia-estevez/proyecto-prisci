import React from 'react';

function PaginaMunicipal() {
  return (
    <div className="container py-4">
      {/* Barra Superior: Notificación y Buscador */}
      <header className="d-flex align-items-center justify-content-between p-3 mb-4 bg-light rounded shadow-sm">
        <div className="d-flex align-items-center gap-3">
          <button className="btn btn-outline-secondary rounded-circle" type="button">
            <i className="bi bi-bell">🔔</i>
          </button>
        </div>

        <div className="input-group w-50">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar en el portal municipal..."
          />
          <button className="btn btn-primary" type="button">
            🔍
          </button>
        </div>
      </header>

      {/* Bloque Principal: Mapa Municipal */}
      <section className="mb-4">
        <div 
          className="border border-2 rounded p-5 text-center bg-white shadow-sm d-flex justify-content-center align-items-center"
          style={{ minHeight: '350px' }}
        >
          <div className="text-muted">
            <h2 className="fw-bold text-dark mb-2">MAPA MUNICIPAL</h2>
            <p>Visor interactivo de la ciudad y dependencias</p>
          </div>
        </div>
      </section>

      {/* Sección Inferior: Tarjetas de Categorías */}
      <section className="row g-4">
        <div className="col-md-6">
          <div className="card h-100 shadow-sm border-2">
            <div className="card-body p-4 text-center">
              <h3 className="card-title fw-bold text-uppercase">Conservadores</h3>
              <p className="card-text text-muted mt-2">
                Consulta de registro, normativas y expedientes.
              </p>
              <button className="btn btn-outline-primary mt-3">Ingresar</button>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card h-100 shadow-sm border-2">
            <div className="card-body p-4 text-center">
              <h3 className="card-title fw-bold text-uppercase">Inmuebles</h3>
              <p className="card-text text-muted mt-2">
                Catastro, habilitaciones y gestión tributaria.
              </p>
              <button className="btn btn-outline-primary mt-3">Ingresar</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default PaginaMunicipal;
import React from 'react';

import './PaginaMunicipal.css';

function PaginaMunicipal() {
  return (
    <div className="contenedor-principal">
      

      {/* 2. Contenedor de Layout Principal */}
      <main className="layout-principal">
        
        {/* Sección Izquierda: Mapa Municipal */}
        <section className="tarjeta seccion-mapa">
          <h2>Mapa Municipal de Neuquén</h2>
          <p>Visualización interactiva de la ciudad para gestión de inspecciones urbanas.</p>
          
          <div className="mapa-contenedor">
            <span className="mapa-texto">MAPA MUNICIPAL</span>
            <img 
              src="https://via.placeholder.com/800x400/1e1e2e/e3e5e?text=Visualizaci%C3%B3n+del+Mapa" 
              alt="Placeholder Mapa" 
              className="mapa-img"
            />
          </div>
        </section>

        {/* Sección Derecha: Panel de Control */}
        <aside className="tarjeta panel-lateral">
          <div className="panel-header">
            <div className="panel-buscador">
              <button type="button" onClick={() => alert('Notificaciones')} className="btn-notificacion">
                🔔
              </button>
              <input type="text" placeholder="Buscar..." className="input-buscar" />
              <button type="button" className="btn-buscar">Q</button>
            </div>
          </div>
          
          <p>Accedé a los módulos técnicos de PRISCI.</p>

          <div className="panel-botones">
            <button type="button" className="btn-lateral btn-inspecciones">
              Gestión de Inspecciones
            </button>
            <button type="button" className="btn-lateral btn-herramientas">
              Catálogo de Herramientas
            </button>
            <button type="button" className="btn-lateral btn-reportes">
              Reportes Urbanos
            </button>
            
            <div className="elementos-referencia">
              <p className="elementos-titulo">Elementos:</p>
              <p>- Conservadores</p>
              <p>- Inmuebles</p>
            </div>
          </div>
        </aside>
      </main>

     
    </div>
  );
}

export default PaginaMunicipal;
import React from 'react';

function PaginaMunicipal() {
  return (
    <div className="contenedor-principal">
      
      {/* 1. Header de Navegación */}
      <nav className="header-muni">
        <div className="logo-muni">Neuquén Capital</div>
        <div className="nav-links">
          <span>La ciudad</span>
          <span>Trámites</span>
          <span>La Muni</span>
          <span className="link-activo">PRISCI Tools</span>
        </div>
      </nav>

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
              📋 Gestión de Inspecciones
            </button>
            <button type="button" className="btn-lateral btn-herramientas">
              🛠️ Catálogo de Herramientas
            </button>
            <button type="button" className="btn-lateral btn-reportes">
              📊 Reportes Urbanos
            </button>
            
            <div className="elementos-referencia">
              <p className="elementos-titulo">Elementos:</p>
              <p>- Conservadores</p>
              <p>- Inmuebles</p>
            </div>
          </div>
        </aside>
      </main>

      {/* 3. Pie de Página */}
      <footer className="footer-muni">
        <p>Municipalidad de PRISCI | 0800-MUNI-PRISCI | Neuquén | 2026</p>
        <div>
          <p>© 2026 - Todos los derechos reservados.</p>
        </div>
      </footer>

    </div>
  );
}

export default PaginaMunicipal;
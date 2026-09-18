import React from 'react';

function PaginaConservador() {
  return (
        
    <div className="contenedor-principal">
        
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

    </div>
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
            <button type="button" className="btn-lateral btn-clientes">
              Clientes
            </button>
            
          </div>
        </aside>

      );
}

export default PaginaConservador;
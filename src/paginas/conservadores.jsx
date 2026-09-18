import React from 'react';
import "./conservadores.css";

function Conservadores() {
  return (
    <div className="contenedor-principal">
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
        
        <p>Accedé a los registros de tus clientes.</p>

        <div className="panel-botones">
          <button type="button" className="btn-lateral btn-cliente1">
            Cliente1
          </button>
          <button type="button" className="btn-lateral btn-cliente2">
            Cliente2
          </button>
          <button type="button" className="btn-lateral btn-cliente3">
            Cliente3
          </button>
        </div>
      </aside>
    </div>
  );
}

// ⚠️ IMPORTANTE: 'Conservadores' debe empezar con mayúscula
export default Conservadores;
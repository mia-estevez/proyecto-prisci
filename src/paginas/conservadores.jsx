import React from 'react';
import { Link } from "react-router-dom";
import "./conservadores.css";

function Conservadores() {
  return (
    <div className="contenedor-principal">
        <main className="layout-principal">
        <section className="tarjeta seccion-mapa">
          <h2>Mapa Municipal de Neuquén</h2>
          <p>Visualización interactiva de la ciudad para gestión de inspecciones urbanas.</p>
          
          <div className="mapa-contenedor">
            <span className="mapa-texto">MAPA MUNICIPAL</span>
            <img 
              src="" 
              alt="Mapa" 
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
            <Link className="nav-link" to="/clientes">Cliente 1</Link>
            <Link className="nav-link" to="/clientes">Cliente 2</Link>
            <Link className="nav-link" to="/clientes">Cliente 3</Link>
            <Link className="nav-link" to="/clientes">Cliente 4</Link>
            <Link className="nav-link" to="/clientes">Cliente 5</Link>
          </div>
        </aside>
      </main>
    </div>
  );
}

export default Conservadores;
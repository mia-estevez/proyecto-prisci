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
      );
}

export default PaginaConservador;
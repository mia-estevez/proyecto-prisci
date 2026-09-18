import React from 'react';

function Clientes() {
  return (
    
    <div className="contenedor-principal">
        <main className="layout-principal">
            <h2>Nombre de cliente</h2>
                <div className="contenido-cliente">
                    <p>Sistemas:</p>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi cumque est impedit praesentium quia ad aliquid fugiat hic quisquam veniam quae iusto aperiam reiciendis dicta, amet porro autem, ipsum facere?</p>
                    
                    <p>inspecciones:</p>
                    <ul>
                        <li>inspección 1</li>
                        <li>inspección 2</li>
                        <li>inspección 3</li>
                    </ul>
                    
                    {/*<Link className="nav-link" to="/inspeccion">Cargar inspección</Link>*/}
                </div>
      </main>
    </div>
  );
}

export default Clientes;
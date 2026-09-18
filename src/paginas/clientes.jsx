import React from 'react';
import { Link } from 'react-router-dom';
import "./clientes.css";

function Clientes() {
  return (
    <div className="caja-principal">
      <main className="capa-principal">
        <div className="tarjeta cliente-card">
          
          <div className="cliente-header">
            <span className="badge-categoria">Empresa de Seguridad Contra Incendios</span>
            <h2>Servicios de Protección y Prevención</h2>
            <p className="subtitulo-inmueble">Inmueble: Consorcio Edificio Av. Argentina 450</p>
          </div>

          <hr className="divisor" />

          <div className="cliente-seccion">
            <h3>Sistemas e Instalaciones Registradas</h3>
            <p className="texto-descripcion">
              Registro técnico de la red de extinción, detectores de humo, nido de mangueras, bombas de agua y señalización de emergencia en cumplimiento con las ordenanzas municipales.
            </p>
          </div>

          <div className="cliente-seccion">
            <h3>Historial de Inspecciones</h3>
            <div className="inspecciones-lista">
              
              <div className="inspeccion-item">
                <div className="inspeccion-info">
                  <strong>Inspección General del Sistema Extintor</strong>
                  <p>Estado: Aprobado — Verificación de presión y carga de matafuegos</p>
                </div>
              </div>

              <div className="inspeccion-item">
                <div className="inspeccion-info">
                  <strong>Prueba de Bombas y Red Hidrante</strong>
                  <p>Estado: Pendiente — Control de mangueras y presión de agua</p>
                </div>
              </div>

              <div className="inspeccion-item">
                <div className="inspeccion-info">
                  <strong>Sistema de Alarma y Detección de Humo</strong>
                  <p>Estado: Aprobado — Inspección anual de sensores y sirenas</p>
                </div>
              </div>

            </div>
          </div>

          <div className="cliente-footer">
            <Link to="/conservadores" className="btn-accion-primario">Cargar nueva inspección</Link>
            <Link to="/conservadores" className="btn-volver">Volver a Conservadores</Link>
          </div>

        </div>
      </main>
    </div>
  );
}

export default Clientes;
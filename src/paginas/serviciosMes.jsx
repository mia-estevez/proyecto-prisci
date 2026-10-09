import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Search, Filter, ArrowLeft, Wrench } from 'lucide-react';
import './servicios.css';

function ServiciosMes() {
  const navigate = useNavigate();
  const [servicios, setServicios] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/api/servicios/mes')
      .then(res => res.json())
      .then(data => setServicios(data));
  }, []);

  return (
    <div className="layout-dashboard">
      <main className="dashboard-content full-width">
        <button className="btn-back" onClick={() => navigate('/conservadores')}>
          <ArrowLeft size={16} /> Volver al inicio
        </button>

        <h1>Servicios de este mes</h1>
        <p className="subtext">Estos son los {servicios.length} servicios programados para el mes actual.</p>

        <div className="search-container-bar">
          <div className="input-with-icon">
            <Search size={18} />
            <input type="text" placeholder="Buscar por nombre del inmueble o tipo de servicio..." />
          </div>
          <button className="btn-filter-secondary"><Filter size={16} /> Filtros</button>
        </div>

        <div className="services-table-list">
          {servicios.map((item) => (
            <div key={item.IdInmueble} className="service-card-row" onClick={() => navigate(`/clientes/${item.IdInmueble}`)}>
              <img src="/building-placeholder.jpg" alt={item.inmuebleNombre} className="service-img" />
              <div className="col-info">
                <strong>{item.inmuebleNombre}</strong>
                <p>{item.Domicilio}</p>
                <span className="type-label">{item.Actividad}</span>
              </div>
              <div className="col-service">
                <span className="label-title">Tipo de servicio</span>
                <div className="service-icon-box">
                  <Wrench size={16} className="red-icon" />
                  <span>{item.tipoServicio || 'Mantenimiento General'}</span>
                </div>
              </div>
              <div className="col-date">
                <span className="label-title">Fecha programada</span>
                <div className="date-box">
                  <Calendar size={16} />
                  <span>{item.Fecha}</span>
                </div>
              </div>
              <div className="col-status">
                <span className="status-badge-yellow">{item.estado || 'Pendiente'}</span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default ServiciosMes;
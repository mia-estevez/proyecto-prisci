import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Íconos vectoriales profesionales de Lucide React
import { Calendar, Search, Filter, ArrowLeft, Wrench } from 'lucide-react';
import './servicios.css';

function ServiciosMes() {
  const navigate = useNavigate();

  // ESTADO: Almacena el listado de servicios devueltos por el Backend Node.js
  const [servicios, setServicios] = useState([]);
  
  // ESTADO: Maneja el texto ingresado en el buscador
  const [busqueda, setBusqueda] = useState('');

  // EFECTO: Consulta a la API REST los servicios programados para el mes actual
  useEffect(() => {
    fetch('http://localhost:3001/api/servicios/mes')
      .then(res => res.json())
      .then(data => setServicios(data))
      .catch(err => console.error("Error al cargar servicios del mes:", err));
  }, []);

  // FILTRADO DINÁMICO: Filtra por nombre del inmueble o por tipo de servicio
  const serviciosFiltrados = servicios.filter(item =>
    item.inmuebleNombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
    item.tipoServicio?.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="servicios-page-container">
      
      {/* BOTÓN DE RETORNO AL DASHBOARD PRINCIPAL */}
      <button className="btn-back" onClick={() => navigate('/conservadores')}>
        <ArrowLeft size={16} /> Volver al inicio
      </button>

      {/* ENCABEZADO DE LA VISTA */}
      <header className="page-header">
        <h1>Servicios de este mes</h1>
        <p className="subtext">
          Estos son los {servicios.length} servicios programados para el mes actual.
        </p>
      </header>

      {/* BARRA DE BÚSQUEDA Y FILTRADO */}
      <div className="search-container-bar">
        <div className="input-with-icon">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Buscar por nombre del inmueble o tipo de servicio..." 
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
        <button className="btn-filter-secondary">
          <Filter size={16} /> Filtros
        </button>
      </div>

      {/* TARJETAS DE SERVICIOS (LISTADO ESTILO FOTO 2) */}
      <div className="services-table-list">
        {serviciosFiltrados.length === 0 ? (
          <p className="empty-msg">No hay servicios programados para este mes.</p>
        ) : (
          serviciosFiltrados.map((item) => (
            <div 
              key={item.IdInmueble} 
              className="service-card-row" 
              onClick={() => navigate(`/clientes/${item.IdInmueble}`)}
            >
              {/* VISTA PREVIA DEL INMUEBLE */}
              <div className="col-info">
                <strong>{item.inmuebleNombre}</strong>
                <p>{item.Domicilio}</p>
                <span className="type-label">{item.Actividad}</span>
              </div>

              {/* TIPO DE SERVICIO CON ÍCONO PROFESIONAL */}
              <div className="col-service">
                <span className="label-title">Tipo de servicio</span>
                <div className="service-icon-box">
                  <Wrench size={16} className="red-icon" color="#ef4444" />
                  <span>{item.tipoServicio || 'Revisión General'}</span>
                </div>
              </div>

              {/* FECHA PROGRAMADA */}
              <div className="col-date">
                <span className="label-title">Fecha programada</span>
                <div className="date-box">
                  <Calendar size={16} color="#94a3b8" />
                  <span>{item.Fecha}</span>
                </div>
              </div>

              {/* ESTADO / BADGE */}
              <div className="col-status">
                <span className="status-badge-yellow">{item.estado || 'Pendiente'}</span>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}

export default ServiciosMes;
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Íconos vectoriales profesionales de Lucide React (sin emojis)
import { Calendar, Search, Filter, ArrowLeft, AlertTriangle } from 'lucide-react';
import './servicios.css';

function Vencimientos() {
  const navigate = useNavigate();

  // ESTADO: Almacena el listado de servicios por vencer devueltos por el backend
  const [vencimientos, setVencimientos] = useState([]);
  
  // ESTADO: Texto ingresado en el campo de búsqueda
  const [busqueda, setBusqueda] = useState('');

  // EFECTO: Consulta los servicios próximos a vencer desde la API REST Node.js
  useEffect(() => {
    fetch('http://localhost:3001/api/servicios/vencimientos')
      .then(res => res.json())
      .then(data => setVencimientos(data))
      .catch(err => console.error("Error al cargar servicios por vencer:", err));
  }, []);

  // FILTRADO DINÁMICO: Filtra los resultados en tiempo real por inmueble o tipo de servicio
  const vencimientosFiltrados = vencimientos.filter(item =>
    item.inmuebleNombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
    item.tipoServicio?.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="servicios-page-container">
      
      {/* BOTÓN DE RETORNO AL INICIO / DASHBOARD */}
      <button className="btn-back" onClick={() => navigate('/conservadores')}>
        <ArrowLeft size={16} /> Volver al inicio
      </button>

      {/* ENCABEZADO DE LA VISTA */}
      <header className="page-header">
        <h1>Servicios por vencer</h1>
        <p className="subtext">
          Estos son los {vencimientos.length} servicios próximos a vencer que requieren tu atención.
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

      {/* LISTADO DE SERVICIOS PRÓXIMOS A VENCER (ESTILO FOTO 3) */}
      <div className="services-table-list">
        {vencimientosFiltrados.length === 0 ? (
          <p className="empty-msg">No hay servicios próximos a vencer en los próximos 30 días.</p>
        ) : (
          vencimientosFiltrados.map((item) => (
            <div 
              key={item.IdInmueble} 
              className="service-card-row warning-border-row" 
              onClick={() => navigate(`/clientes/${item.IdInmueble}`)}
            >
              {/* DATOS DEL INMUEBLE */}
              <div className="col-info">
                <strong>{item.inmuebleNombre}</strong>
                <p>{item.Domicilio}</p>
                <span className="type-label">{item.Actividad}</span>
              </div>

              {/* TIPO DE SERVICIO CON ÍCONO DE ADVERTENCIA */}
              <div className="col-service">
                <span className="label-title">Tipo de servicio</span>
                <div className="service-icon-box">
                  <AlertTriangle size={16} color="#ef4444" />
                  <span>{item.tipoServicio || 'Revisión de seguridad'}</span>
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

              {/* BADGE / BOTÓN DE DÍAS RESTANTES (ESTILO ROJO MUNICIPAL) */}
              <div className="col-status">
                <span className="status-badge-red">
                  Vence en {item.diasRestantes ?? 2} días
                </span>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}

export default Vencimientos;
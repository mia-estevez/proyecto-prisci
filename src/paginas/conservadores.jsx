import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
// Importamos componentes de React-Leaflet para el mapa gratuito de OpenStreetMap
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Home, Users, ClipboardList, Clock, Bell, Search, Filter, ChevronRight, LogOut, Flame, ShieldCheck } from 'lucide-react';
import './conservadores.css';
// Importamos los íconos profesionales de Lucide React (vectoriales, sin emojis)
import { 
  Home, 
  Users, 
  ClipboardList, 
  Clock, 
  Bell, 
  Search, 
  Filter, 
  ChevronRight, 
  LogOut, 
  Flame, 
  ShieldCheck 
} from 'lucide-react';
// Estilos necesarios para que Leaflet renderice el mapa correctamente
import 'leaflet/dist/leaflet.css';
import './conservadores.css';



// Coordenadas geográficas centradas en Neuquén Capital
const CENTRO_NEUQUEN = [-38.9516, -68.0591];

// Definición de íconos personalizados para el mapa (Rojo = Registrado, Azul = Seleccionado)
const iconoRojo = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const iconoAzul = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});


function Conservadores() {
  const navigate = useNavigate();

  // ESTADOS (REACT HOOKS)
  // 1. Estado para almacenar el resumen numérico de las tarjetas superiores
  const [resumen, setResumen] = useState({ inmuebles: 0, clientes: 0, servicios: 0, vencimientos: 0 });
  
  // 2. Estado para almacenar el listado completo de inmuebles desde MySQL
  const [inmuebles, setInmuebles] = useState([]);
  
  // 3. Estado para el filtro de texto del buscador
  const [busqueda, setBusqueda] = useState('');
  
  // 4. Estado para saber qué inmueble cliqueó el usuario en el mapa
  const [inmuebleSeleccionado, setInmuebleSeleccionado] = useState(null);

  // EFECTO PRINCIPAL: Se ejecuta una sola vez al cargar el componente en pantalla
  useEffect(() => {
    // Petición HTTP al backend para traer los conteos calculados
    fetch('http://localhost:3001/api/conservador/resumen')
      .then(res => res.json())
      .then(data => setResumen(data))
      .catch(err => console.error("Error al obtener resumen:", err));

    // Petición HTTP al backend para obtener los inmuebles registrados
    fetch('http://localhost:3001/api/inmuebles')
      .then(res => res.json())
      .then(data => setInmuebles(data))
      .catch(err => console.error("Error al obtener inmuebles:", err));
  }, []);

  // FILTRADO DINÁMICO: Filtra el arreglo según el texto escrito en el buscador
  const inmueblesFiltrados = inmuebles.filter(item =>
    item.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
    item.direccion?.toLowerCase().includes(busqueda.toLowerCase())
  );


  return (
    <div className="layout-dashboard">
      
      {/* MENÚ LATERAL IZQUIERDO (SIDEBAR)         */}

      <aside className="sidebar">
        {/* Identificación del sistema e Isologotipo */}
        <div className="sidebar-brand">
          <Flame className="brand-icon" size={28} />
          <div className="brand-text">
            <h2>PRISCI</h2>
            <span>Conservador / Profesional</span>
          </div>
        </div>

        {/* Opciones de Navegación del Sistema */}
        <nav className="sidebar-menu">
          <button className="menu-item active">
            <Home size={18} /> Inicio
          </button>
          <button className="menu-item" onClick={() => navigate('/clientes')}>
            <Users size={18} /> Mis clientes
          </button>
          <button className="menu-item" onClick={() => navigate('/historial')}>
            <Clock size={18} /> Historial
          </button>
        </nav>

        {/* Botón de salida para cerrar sesión */}
        <div className="sidebar-footer">
          <button className="btn-logout-sidebar" onClick={() => navigate('/login')}>
            <LogOut size={18} /> Cerrar sesión
          </button>
        </div>
      </aside>
  );
}

export default Conservadores;
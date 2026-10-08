import { Link } from "react-router-dom";
import "./menu.css";

function Menu() {
  return (
    <aside className="menu">

      <Link to="/" className="menu-link active">
        <i className="bi bi-map"></i>
        Mapa de inmuebles
      </Link>

      <Link to="/agregar-inmueble" className="menu-link">
        <i className="bi bi-building-add"></i>
        Agregar inmueble
      </Link>

      <Link to="/profesionales" className="menu-link">
        <i className="bi bi-person-plus"></i>
        Agregar profesionales
      </Link>

      <Link to="/inspecciones" className="menu-link">
        <i className="bi bi-clipboard-check"></i>
        Ver inspecciones
      </Link>

      <Link to="/reportes" className="menu-link">
        <i className="bi bi-bar-chart"></i>
        Reportes
      </Link>

      <Link to="/usuarios" className="menu-link">
        <i className="bi bi-people"></i>
        Usuarios
      </Link>

      <Link to="/historial" className="menu-link">
        <i className="bi bi-clock-history"></i>
        Historial
      </Link>

      <Link to="/logout" className="menu-logout">
        <i className="bi bi-box-arrow-right"></i>
        Cerrar sesión
      </Link>

    </aside>
  );
}

export default Menu;
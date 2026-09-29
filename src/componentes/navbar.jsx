import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">

      <div className="navbar-logo">
        <h1>
          <span className="logo-blanco">PRIS</span>
          <span className="logo-azul">CI</span>
        </h1>
      </div>

      <div className="navbar-title">
        <p>Plataforma de Registro de Instalaciones</p>
        <p>de Seguridad Contra Incendios</p>
      </div>

      <div className="navbar-actions">

        <Link to="/notificaciones" className="navbar-icon">
          🔔
        </Link>

        <Link to="/bomberos" className="navbar-role">
          👷
          <span>Usuario</span>
          <span className="navbar-arrow">▼</span>
        </Link>

        <Link to="/perfil" className="navbar-profile">
          👤
        </Link>

      </div>

    </nav>
  );
}

export default Navbar;
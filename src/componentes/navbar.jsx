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
    <nav className="navbar navbar-expand-lg">
      <div className="container">

        {/* LOGO EN TEXTO */}
        <Link className="logo-muni" to="/">
          Neuquén Capital
        </Link>

        {/* ENLACES DE NAVEGACIÓN */}
        <div className="navbar-nav">
          <Link className="nav-link" to="/">
            INICIO
          </Link>

          <Link className="nav-link" to="/inmuebles">
            INMUEBLES
          </Link>

          <Link className="nav-link" to="/conservadores">
            CONSERVADORES
          </Link>

          <Link className="nav-link" to="/propietarios">
            PROPIETARIOS
          </Link>

          <Link className="nav-link" to="/bomberos">
            BOMBEROS
          </Link>

          <Link className="btn-logout" to="/login">
            CERRAR SESIÓN
          </Link>
        </div>

      </div>

    </nav>
  );
}

export default Navbar;
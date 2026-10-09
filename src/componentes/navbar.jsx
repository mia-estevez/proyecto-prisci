import { Link } from "react-router-dom";
import "./navbar.css";

function Navbar({ usuario }) {
  console.log("Usuario recibido en Navbar:", usuario);
  
  const roles = {
    1: "Municipal",
    2: "Bomberos",
    3: "Profesional",
    4: "Propietario"
  };

  const iconosRol = {
    1: "bi-building",
    2: "bi-fire",
    3: "bi-cone-striped",
    4: "bi-house"
  };

  const nombreCompleto = usuario
    ? `${usuario.nombre || ""} ${usuario.apellido || ""}`.trim()
    : "Usuario";

  const nombreRol = usuario
    ? roles[Number(usuario.idRol)] || "Usuario"
    : "Usuario";

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
        <Link
          to="/notificaciones"
          className="navbar-icon"
          aria-label="Notificaciones"
        >
          <i className="bi bi-bell navbar-bell-icon"></i>
          <span className="navbar-notificacion"></span>
        </Link>

        <div className="navbar-role">
          <i className="bi bi-person-workspace navbar-role-icon"></i>

          <div className="navbar-user-info">
            <span className="navbar-user-name">{nombreCompleto}</span>
            <span className="navbar-user-role">{nombreRol}</span>
          </div>

          <i className="bi bi-chevron-down navbar-arrow"></i>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
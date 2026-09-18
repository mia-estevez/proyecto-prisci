import { Link } from "react-router-dom";
import "./navbar.css";

function Navbar() {
  return (
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
import { Link } from "react-router-dom";
import "./navbar.css";

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">

        <div className="logo-muni">Neuquén Capital</div>

        <div className="navbar-nav">
          <Link className="nav-link" to="/">
            Inicio
          </Link>

          <Link className="nav-link" to="/inmuebles">
            Inmuebles
          </Link>

          <Link className="nav-link" to="/conservadores">
            Conservadores
          </Link>

          <Link className="nav-link" to="/propietarios">
            Propietarios
          </Link>

          <Link className="nav-link" to="/bomberos">
            Bomberos
          </Link>

          <Link className="nav-link" to="/login">
            Cerrar Sesión
          </Link>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;
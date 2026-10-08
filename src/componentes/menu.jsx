import { Link, useLocation } from "react-router-dom";
import "./menu.css";

function Menu( {rol}) {
    const location = useLocation();

    if (rol == "municipal") {
        
        return (
            <aside className="menu">

            <Link to="/" className={location.pathname === "/" ? "menu-link active" : "menu-link"}>
                <i className="bi bi-map"></i>
                Mapa de inmuebles
            </Link>

            <Link to="/agregar-inmueble" className={location.pathname === "/agregar-inmueble" ? "menu-link active" : "menu-link"}>
                <i className="bi bi-building-add"></i>
                Agregar inmueble
            </Link>

            <Link to="/profesionales" className={location.pathname === "/profesionales" ? "menu-link active" : "menu-link"}>
                <i className="bi bi-person-plus"></i>
                Agregar profesionales
            </Link>

            <Link to="/inspecciones" className={location.pathname === "/inspecciones" ? "menu-link active" : "menu-link"}>
                <i className="bi bi-clipboard-check"></i>
                Ver inspecciones
            </Link>

            <Link to="/reportes" className={location.pathname === "/reportes" ? "menu-link active" : "menu-link"}>
                <i className="bi bi-bar-chart"></i>
                Reportes
            </Link>

            <Link to="/usuarios" className={location.pathname === "/usuarios" ? "menu-link active" : "menu-link"}>
                <i className="bi bi-people"></i>
                Usuarios
            </Link>

            <Link to="/historial" className={location.pathname === "/historial" ? "menu-link active" : "menu-link"}>
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

    if (rol == "bomberos") {
        
        return(
            <aside className="menu">
                <Link to="/" className={location.pathname === "/" ? "menu-link active" : "menu-link"}>
                    <i className="bi bi-map"></i>
                    Mapa de inmuebles
                </Link>

                <Link to="/logout" className="menu-logout">
                    <i className="bi bi-box-arrow-right"></i>
                    Cerrar sesión
                </Link>
            
            </aside>
        );
    }

    if (rol == "profesional") {
        return (
            <aside className="menu">
                <Link to="/" className={location.pathname === "/" ? "menu-link active" : "menu-link"}>
                    <i className="bi bi-map"></i>
                    Mapa de inmuebles
                </Link>

                <Link to="/servicios" className={location.pathname === "/servicios" ? "menu-link active" : "menu-link"}>
                    <i className="bi bi-briefcase"></i>
                    Mis servicios
                </Link>

                <Link to="/inspecciones" className={location.pathname === "/inspecciones" ? "menu-link active" : "menu-link"}>
                    <i className="bi bi-clipboard-check"></i>
                    Ver inspecciones
                </Link>

                <Link to="/logout" className="menu-logout">
                    <i className="bi bi-box-arrow-right"></i>
                    Cerrar sesión
                </Link>
            </aside>
        )
    }

    if (rol == "propietario") {
        return (
            <aside className="menu">

                <Link to="/" className={location.pathname === "/" ? "menu-link active" : "menu-link"}>
                    <i className="bi bi-map"></i>
                    Mapa de inmuebles
                </Link>

                <Link to="/inspecciones" className={location.pathname === "/inspecciones" ? "menu-link active" : "menu-link"}>
                    <i className="bi bi-clipboard-check"></i>
                    Ver inspecciones
                </Link>

                <Link to="/logout" className="menu-logout">
                    <i className="bi bi-box-arrow-right"></i>
                    Cerrar sesión
                </Link>

            </aside>
        )
    }
}

export default Menu;
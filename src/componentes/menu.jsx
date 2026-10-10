import { Link, useLocation } from "react-router-dom";
import "./menu.css";

function Menu({ rol, onCerrarSesion }) {
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

            
            <Link to="/solicitudes-registro" className={location.pathname === "/solicitudes-registro" ? "menu-link active": "menu-link"}>
                <i className="bi bi-person-lines-fill"></i>
                Solicitudes de Registro
            </Link>


            <Link to="/historial" className={location.pathname === "/historial" ? "menu-link active" : "menu-link"}>
                <i className="bi bi-clock-history"></i>
                Historial
            </Link>

            <button type="button" className="menu-logout" onClick={onCerrarSesion}>
                <i className="bi bi-box-arrow-right"></i>
                Cerrar sesión
            </button>

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

                <button type="button" className="menu-logout" onClick={onCerrarSesion}>
                    <i className="bi bi-box-arrow-right"></i>
                    Cerrar sesión
                </button>
            
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

                <button type="button" className="menu-logout" onClick={onCerrarSesion}>
                    <i className="bi bi-box-arrow-right"></i>
                    Cerrar sesión
                </button>
            </aside>
        )
    }

    if (rol == "propietario") {
        return (
            <aside className="menu">

                <Link to="/" className={location.pathname === "/" ? "menu-link active": "menu-link"}>
                    <i className="bi bi-map"></i>
                    Mapa de inmuebles
                </Link>

                <Link to="/propietario/todos-inmuebles" className={location.pathname === "/propietario/todos-inmuebles" || location.pathname.startsWith("/propietario/inmuebles") ? "menu-link active": "menu-link"}>
                    <i className="bi bi-building"></i>
                    Mis inmuebles
                </Link>

                <Link to="/inspecciones" className={location.pathname === "/inspecciones" ? "menu-link active" : "menu-link"}>
                    <i className="bi bi-clock-history"></i>
                    Historial
                </Link>

                <button type="button" className="menu-logout" onClick={onCerrarSesion}>
                    <i className="bi bi-box-arrow-right"></i>
                    Cerrar sesión 
                </button>

            </aside>
        )
    }
}

export default Menu;
import './App.css';
import { BrowserRouter, Route, Routes, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { useState } from 'react';

import PaginaMunicipal from './paginas/PaginaMunicipal';
import Navbar from "./componentes/navbar";
import Footer from "./componentes/footer";
import Menu from "./componentes/menu";
import Login from "./paginas/login";
import Notificaciones from "./paginas/notificaciones";
import Conservadores from "./paginas/conservadores";
import Clientes from "./paginas/clientes";
import Inspecciones from "./paginas/inspecciones";
import NotificacionesConservadores from "./paginas/notificacionesConservadores";
import ServiciosMes from './paginas/serviciosMes';
import Vencimientos from './paginas/vencimientos';
import HistorialInmueble from './paginas/historialInmueble';
import TodosInmuebles from './paginas/todosInmuebles';
import Bomberos from './paginas/bomberos';
import Propietarios from './paginas/propietarios';
import AgregarInmueble from './paginas/AgregarInmueble';
import FichaPropietarios from './paginas/fichaPropietarios';
import PropietariosTodosInmuebles from './paginas/propietariosTodosInmuebles';
import PropietariosHistorial from './paginas/propietariosHistorial';
import PropietarioNotificaciones from './paginas/propietarioNotificaciones';
import AgregarInmueble from './paginas/AgregarInmueble';
import AgregarProfesionales from './paginas/AgregarProfesionales';
import Informes from './paginas/Informes';

function Contenido() {
  const location = useLocation();
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState(() => {
    const usuarioGuardado = sessionStorage.getItem("usuario");

    if (usuarioGuardado) {
      try {
        return JSON.parse(usuarioGuardado);
      } catch (e) {
        console.error("Error al parsear usuario:", e);
        sessionStorage.removeItem("usuario");
      }
    }

    // Forzamos un usuario municipal predeterminado temporalmente
    return { id: 1, name: "María González", email: "municipal@prisci.com", idRol: 1 };
  });

  const esLogin = location.pathname === "/login";
  
  if (!usuario && !esLogin) {
    return <Navigate to="/login" replace />;
  }

  if (usuario && esLogin) {
    return <Navigate to="/" replace />;
  }

  const roles = {
    1: "municipal",
    2: "profesional",
    3: "propietario",
    4: "bomberos"
  };

  const idRolUsuario = usuario?.idRol || usuario?.IdRol || 1;
  const rol = roles[idRolUsuario] || "municipal";

  function iniciarSesion(datosUsuario) {
    sessionStorage.setItem("usuario", JSON.stringify(datosUsuario));
    setUsuario(datosUsuario);
    navigate("/");
  }

  function cerrarSesion() {
    sessionStorage.removeItem("usuario");
    setUsuario(null);
    navigate("/login");
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", backgroundColor: "#0b1329" }}>
      
      {/* NAVBAR SUPERIOR */}
      {!esLogin && usuario && <Navbar usuario={usuario} />}

      <div style={{ display: "flex", flex: 1, width: "100%", minHeight: 0 }}>
        
        {/* MENÚ LATERAL (SIDEBAR) */}
        {!esLogin && (
          <Menu rol={rol} onCerrarSesion={cerrarSesion} />
        )}

        {/* CONTENIDO PRINCIPAL */}
        <main style={{
          flex: 1,
          padding: esLogin ? "0" : "20px",
          boxSizing: "border-box",
          overflowY: "auto"
        }}>
          <Routes>
            {/* RUTA INICIAL DINÁMICA SEGÚN ROL */}
            <Route
              path="/"
              element={
                rol === "municipal" ? (
                  <PaginaMunicipal />
                ) : rol === "bomberos" ? (
                  <Bomberos />
                ) : rol === "profesional" ? (
                  <Conservadores />
                ) : rol === "propietario" ? (
                  <Propietarios />
                ) : (
                  <PaginaMunicipal />
                )
              }
            />

            {/* LOGIN */}
            <Route path="/login" element={<Login onLogin={iniciarSesion} />} />
            <Route path="/notificaciones" element={<Notificaciones />} />
            <Route path="/bomberos" element={<Bomberos />} />
            <Route path="/pagina-municipal" element={<PaginaMunicipal />} />
            <Route path="/conservadores" element={<Conservadores />} />
            <Route path="/clientes" element={<Clientes />} />
            <Route path="/clientes/:id" element={<Clientes />} />
            <Route path="/inspecciones" element={<Inspecciones />} />
            <Route path="/inspecciones/:idInmueble" element={<Inspecciones />} />
            <Route path="/notificacionesConservadores" element={<NotificacionesConservadores />} />
            <Route path="/servicios-mes" element={<ServiciosMes />} />
            <Route path="/vencimientos" element={<Vencimientos />} />
            <Route path="/historial-inmueble/:id" element={<HistorialInmueble />} />
            <Route path="/todos-inmuebles" element={<TodosInmuebles />} />
            <Route path="/agregar-inmueble" element={<AgregarInmueble />} />
            <Route path="/propietario" element={<Propietarios />} />
            <Route path="/propietario/inmuebles/:id" element={<FichaPropietarios />} />
            <Route path="/propietario/todos-inmuebles" element={<PropietariosTodosInmuebles />} />
            <Route path="/propietario/inmuebles/:id/historial" element={<PropietariosHistorial />} />
            <Route path="/propietario/notificaciones" element={<PropietarioNotificaciones />} />
            <Route path='/historial-inmueble/:id' element={<HistorialInmueble />} />
            <Route path='/todos-inmuebles' element={<TodosInmuebles />} />
            <Route path='/agregar-inmueble' element={<AgregarInmueble />} />
            <Route path='/profesionales' element={<AgregarProfesionales />} />
            <Route path='/reportes' element={<Informes />} />
          </Routes>
        </main>
      </div>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Contenido />
    </BrowserRouter>
  );
}

export default App;
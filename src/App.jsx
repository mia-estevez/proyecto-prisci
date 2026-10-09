import './App.css';
import { BrowserRouter, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
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
      }
    }
    // Usuario por defecto para pruebas de desarrollo
    return { id: 1, nombre: "Juan", apellido: "Pérez", idRol: 1 };
  });

  const esLogin = location.pathname === "/login";

  const roles = {
    1: "municipal",
    2: "bomberos",
    3: "profesional",
    4: "propietario"
  };

  const rol = usuario ? (roles[usuario.idRol] || "municipal") : "municipal";

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
            <Route
              path="/"
              element={<PaginaMunicipal />}
            />
            <Route
              path="/login"
              element={<Login onLogin={iniciarSesion} />}
            />
            <Route path="/notificaciones" element={<Notificaciones />} />
            <Route path="/conservadores" element={<Conservadores />} />
            <Route path="/clientes" element={<Clientes />} />
            <Route path="/clientes/:id" element={<Clientes />} />
            <Route path="/inspecciones" element={<Inspecciones />} />
            <Route path="/inspecciones/:idInmueble" element={<Inspecciones />} />
            <Route path="/notificacionesConservadores" element={<NotificacionesConservadores />} />
            <Route path="/servicios-mes" element={<ServiciosMes />} />
            <Route path="/vencimientos" element={<Vencimientos />} />
            <Route path='/historial-inmueble/:id' element={<HistorialInmueble />} />
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
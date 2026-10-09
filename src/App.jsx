import './App.css';
import { BrowserRouter, Route, Routes, useLocation, useNavigate} from 'react-router-dom';
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

function Contenido() {
  const location = useLocation();
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState(() => {
    const usuarioGuardado = sessionStorage.getItem("usuario");

    return usuarioGuardado
      ? JSON.parse(usuarioGuardado)
      : null;
  });

  const esLogin = location.pathname === "/login" || (!usuario && location.pathname === "/");
  console.log("Ruta actual:", location.pathname);
  console.log("¿Es login?:", esLogin);
  

  const roles = {
    1: "municipal",
    2: "bomberos",
    3: "profesional",
    4: "propietario"
  };

  const rol = usuario ? roles[usuario.idRol] : null;

  function iniciarSesion(datosUsuario) {
    sessionStorage.setItem(
      "usuario",
      JSON.stringify(datosUsuario)
    );

    setUsuario(datosUsuario);
    navigate("/");
  }

  function cerrarSesion() {
    console.log("Cerrando sesión...");
    sessionStorage.removeItem("usuario");
    setUsuario(null);
    navigate("/login");
  }

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      minHeight: "100vh"
    }}>
      {!esLogin && usuario && <Navbar />}

      {!esLogin && usuario && (<Menu rol={rol} onCerrarSesion={cerrarSesion}/>)}

      <main style={{
        flex: 1,
        padding: esLogin ? "0" : "40px 20px",
        minHeight: esLogin ? "0" : "400px",
        display: "flex",
        flexDirection: "column"
      }}>
        <Routes>
          
          <Route
            path="/"
            element={
              usuario
                ? <PaginaMunicipal />
                : <Login onLogin={iniciarSesion} />
            }
          />


          <Route
            path="/login"
            element={
              usuario
                ? <PaginaMunicipal />
                : <Login onLogin={iniciarSesion} />
            }
          />

          <Route
            path="/notificaciones"
            element={<Notificaciones />}
          />

          <Route
            path="/conservadores"
            element={<Conservadores />}
          />

          <Route
            path="/clientes"
            element={<Clientes />}
          />

          <Route
            path="/inspecciones"
            element={<Inspecciones />}
          />

          <Route
            path="/notificacionesConservadores"
            element={<NotificacionesConservadores />}
          />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          width: '100%'
        }}
      >
        <div
          style={{
            display: 'flex',
            flex: '1',
            minHeight: 0,
            width: '100%',
            alignItems: 'stretch'
          }}
        >
          <Menu rol="municipal" />

          <main
            style={{
              flex: '1',
              minWidth: 0,
              minHeight: '400px',
              padding: 0,
              margin: 0,
              boxSizing: 'border-box'
            }}
          >
            <Routes>
              <Route path="/" element={<PaginaMunicipal />} />
              <Route path="/login" element={<Login />} />
              <Route path="/notificaciones" element={<Notificaciones />} />
              <Route path="/conservadores" element={<Conservadores />} />
              <Route path="/clientes" element={<Clientes />} />
              <Route path="/inspecciones" element={<Inspecciones />} />
              <Route
                path="/notificacionesConservadores"
                element={<NotificacionesConservadores />}
              />
              <Route path="/servicios-mes" element={<ServiciosMes />} />
              <Route path="/vencimientos" element={<Vencimientos />} />
            </Routes>
          </main>
        </div>
      </div>
      <Contenido />
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <Menu rol="municipal" />
        {/* El contenedor main asegura que el texto quede centrado y visible entre el nav y el footer */}
        <main style={{ flex: '1', padding: '40px 20px', minHeight: '400px' }}>
          <Routes>
            <Route path="/" element={<PaginaMunicipal />} />
            <Route path="/login" element={<Login />} />
            <Route path="/notificaciones" element={<Notificaciones />} />
            <Route path="/conservadores" element={<Conservadores />} />
            <Route path="/clientes" element={<Clientes />} />
            <Route path="/clientes/:id" element={<Clientes />} />
            <Route path="/inspecciones" element={<Inspecciones />} />          
            <Route path="/notificacionesConservadores" element={<NotificacionesConservadores />} />
            <Route path="/servicios-mes" element={<ServiciosMes />} />
            <Route path="/vencimientos" element={<Vencimientos />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;

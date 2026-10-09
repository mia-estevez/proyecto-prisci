import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
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

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
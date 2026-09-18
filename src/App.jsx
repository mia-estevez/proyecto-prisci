import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import PaginaMunicipal from './paginas/PaginaMunicipal';
import Navbar from "./componentes/navbar";
import Footer from "./componentes/footer";
import Login from "./paginas/login";
import Notificaciones from "./paginas/notificaciones";
import Conservadores from "./paginas/conservadores";
import Clientes from "./paginas/clientes";
import Inspecciones from "./paginas/inspecciones";

function App() {
  return (
    <BrowserRouter>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        {/* El contenedor main asegura que el texto quede centrado y visible entre el nav y el footer */}
        <main style={{ flex: '1', padding: '40px 20px', minHeight: '400px' }}>
          <Routes>
            <Route path="/" element={<PaginaMunicipal />} />
            <Route path="/login" element={<Login />} />
            <Route path="/notificaciones" element={<Notificaciones />} />
            <Route path="/conservadores" element={<Conservadores />} />
            <Route path="/clientes" element={<Clientes />} />
            <Route path="/inspecciones" element={<Inspecciones />} />          
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
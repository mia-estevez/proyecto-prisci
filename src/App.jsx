import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import PaginaMunicipal from './paginas/PaginaMunicipal'
import PaginaConservador from './paginas/PaginaConservador'
import Navbar from "./componentes/navbar";
import Footer from "./componentes/footer";

function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />

        <Routes>
          <Route path="/" element={<PaginaMunicipal />} />
          <Route path="/" element={<PaginaConservador />}/>
        </Routes>

        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;

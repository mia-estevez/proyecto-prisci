import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import PaginaMunicipal from './paginas/PaginaMunicipal'

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PaginaMunicipal />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App

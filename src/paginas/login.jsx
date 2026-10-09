import React, { useState } from "react";
import "./login.css";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);

  async function iniciarSesion(evento) {
    evento.preventDefault();
    setMensaje("");
    setCargando(true);

    try {
      const respuesta = await fetch("http://localhost:3001/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          contrasena
        })
      });

      const datos = await respuesta.json();
      console.log("Datos del usuario:", datos.usuario);

      if (!respuesta.ok) {
        setMensaje(datos.mensaje || "No se pudo iniciar sesión");
        return;
      }

      // Guardar los datos básicos del usuario
      setMensaje("¡Inicio de sesión exitoso!");

      setTimeout(() => {
        onLogin(datos.usuario);
      }, 1000);

    } catch (error) {
      console.error("Error al conectar con el servidor:", error);
      setMensaje("No se pudo conectar con el servidor.");
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="login-container">
      <div className="login-box">

        <div className="login-header">
          <h1>
            PRI<span>SCI</span>
          </h1>

          <p>Plataforma de Registro de Instalaciones</p>
          <p>de Seguridad Contra Incendios</p>
        </div>

        <hr />

        <div className="login-title">
          <h2>Iniciar sesión</h2>
          <p>Ingresá tus credenciales para continuar.</p>
        </div>

        <form onSubmit={iniciarSesion}>
          <div className="login-field">
            <label htmlFor="email">Correo electrónico</label>
            <div className="login-input">
              <i className="bi bi-envelope"></i>
              <input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(evento) => setEmail(evento.target.value)}
                required
              />
            </div>
          </div>

          <div className="login-field">
            <label htmlFor="contrasena">Contraseña</label>
            <div className="login-input">
              <i className="bi bi-lock"></i>
              <input
                id="contrasena"
                type="password"
                placeholder="Tu contraseña"
                value={contrasena}
                onChange={(evento) => setContrasena(evento.target.value)}
                required
              />
            </div>
          </div>

          <p className="forgot-password">
            ¿Olvidaste tu contraseña?
          </p>

          <button type="submit" disabled={cargando}>
            {cargando ? "Ingresando..." : "Iniciar sesión"}
          </button>

          {mensaje && (
            <p role="status" aria-live="polite">
              {mensaje}
            </p>
          )}

          <div className="login-divider">
            <span></span>
            <p>o</p>
            <span></span>
          </div>

          <p className="login-register">
            ¿No tenés una cuenta?
            <a href="#"> Pedir registro</a>
          </p>
        </form>

      </div>
    </div>
  );
}

export default Login;

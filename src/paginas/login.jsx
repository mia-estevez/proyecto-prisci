import React from "react";
import "./login.css";

function Login() {
  return (
    <div className="login-container">
      <div className="login-box">
            <h1>Iniciar sesión</h1>

            <form>
            <div>
                <label>Correo electrónico</label>
                <input type="email" />
            </div>

            <div>
                <label>Contraseña</label>
                <input type="password" />
            </div>

            <button type="submit">Ingresar</button>
            
            <p className="forgot-password">
                ¿Olvidaste tu contraseña?
            </p>
            </form>
      </div>
    </div>
  );
}

export default Login;
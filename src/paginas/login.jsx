import React, { useState } from "react";
import "./login.css";
import "./solicitudRegistro.css";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);
  const [mostrarSolicitud, setMostrarSolicitud] = useState(false);

  const [solicitud, setSolicitud] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
    email: "",
    motivo: "",
    rol: ""
  });

  function actualizarSolicitud(evento) {
    const { name, value } = evento.target;
    setSolicitud((anterior) => ({
      ...anterior,
      [name]: value
    }));
  }

  async function iniciarSesion(evento) {
    evento.preventDefault();
    setMensaje("");
    setCargando(true);

    try {
      const respuesta = await fetch(
        "http://localhost:3001/api/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email,
            contrasena
          })
        }
      );

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        setMensaje(datos.mensaje || "No se pudo iniciar sesión");
        return;
      }

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

  function enviarSolicitud(evento) {
    evento.preventDefault();
    alert("El formulario todavía no está conectado al sistema.");
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

          <button type="submit" disabled={cargando}>
            {cargando ? "Ingresando..." : "Iniciar sesión"}
          </button>

          {mensaje && (
            <p role="status" aria-live="polite" style={{ marginTop: '10px', color: '#f87171', fontSize: '13px' }}>
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
            <a
              href="#solicitar-registro"
              onClick={(evento) => {
                evento.preventDefault();
                setMostrarSolicitud(true);
              }}
            >
              Pedir registro
            </a>
          </p>
        </form>
      </div>

      {mostrarSolicitud && (
        <div
          className="solicitud-modal-overlay"
          onMouseDown={(evento) => {
            if (evento.target === evento.currentTarget) {
              setMostrarSolicitud(false);
            }
          }}
        >
          <div className="solicitud-modal" role="dialog" aria-modal="true" aria-labelledby="solicitud-titulo">
            <div className="solicitud-modal-header">
              <div>
                <h2 id="solicitud-titulo">Solicitar registro</h2>
                <p>Completá tus datos para solicitar el alta en PRISCI.</p>
              </div>
              <button
                type="button"
                className="solicitud-cerrar"
                aria-label="Cerrar ventana"
                onClick={() => setMostrarSolicitud(false)}
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            <form onSubmit={enviarSolicitud}>
              <div className="solicitud-modal-body">
                <div className="solicitud-campos-grid">
                  <div className="solicitud-field">
                    <label htmlFor="sol-nombre">Nombre</label>
                    <input
                      id="sol-nombre"
                      name="nombre"
                      type="text"
                      placeholder="Tu nombre"
                      value={solicitud.nombre}
                      onChange={actualizarSolicitud}
                      required
                    />
                  </div>

                  <div className="solicitud-field">
                    <label htmlFor="sol-apellido">Apellido</label>
                    <input
                      id="sol-apellido"
                      name="apellido"
                      type="text"
                      placeholder="Tu apellido"
                      value={solicitud.apellido}
                      onChange={actualizarSolicitud}
                      required
                    />
                  </div>

                  <div className="solicitud-field">
                    <label htmlFor="sol-telefono">Teléfono</label>
                    <input
                      id="sol-telefono"
                      name="telefono"
                      type="tel"
                      placeholder="Tu teléfono"
                      value={solicitud.telefono}
                      onChange={actualizarSolicitud}
                      required
                    />
                  </div>

                  <div className="solicitud-field">
                    <label htmlFor="sol-email">Correo electrónico</label>
                    <input
                      id="sol-email"
                      name="email"
                      type="email"
                      placeholder="tu@email.com"
                      value={solicitud.email}
                      onChange={actualizarSolicitud}
                      required
                    />
                  </div>
                </div>

                <div className="solicitud-field">
                  <label htmlFor="sol-motivo">Motivo de la solicitud</label>
                  <textarea
                    id="sol-motivo"
                    name="motivo"
                    placeholder="Contanos por qué querés darte de alta..."
                    value={solicitud.motivo}
                    onChange={actualizarSolicitud}
                    rows={3}
                    required
                  />
                </div>

                <div className="solicitud-field">
                  <label htmlFor="sol-rol">Rol solicitado</label>
                  <select
                    id="sol-rol"
                    name="rol"
                    value={solicitud.rol}
                    onChange={actualizarSolicitud}
                    required
                  >
                    <option value="">Seleccioná un rol</option>
                    <option value="profesional">Profesional / Conservador</option>
                    <option value="propietario">Propietario</option>
                    <option value="bomberos">Bomberos</option>
                  </select>
                </div>

                <div className="solicitud-modal-aviso">
                  <i className="bi bi-info-circle"></i>
                  <p>Municipalidad revisará tu solicitud y se comunicará con vos por fuera del sistema. Enviar el formulario no crea una cuenta.</p>
                </div>
              </div>

              <div className="solicitud-modal-footer">
                <button
                  type="button"
                  className="solicitud-btn-cancelar"
                  onClick={() => setMostrarSolicitud(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="solicitud-btn-enviar">
                  Enviar solicitud
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;
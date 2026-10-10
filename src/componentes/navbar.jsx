
import { Link } from "react-router-dom";
import "./navbar.css";
import React, { useState, useEffect } from "react";

function Navbar({ usuario }) {
  const rolesPorId = {
    1: "municipal",
    2: "bomberos",
    3: "profesional",
    4: "propietario",
  };

  const roles = {
    municipal: "Municipal",
    bomberos: "Bomberos",
    profesional: "Profesional",
    conservador: "Profesional",
    propietario: "Propietario",
  };

  const iconosRol = {
    municipal: "bi-person-vcard",
    bomberos: "bi-fire",
    profesional: "bi-people",
    conservador: "bi-people",
    propietario: "bi-building",
  };

  const rolTexto = String(
    usuario?.rol ?? usuario?.RolNombre ?? ""
  )
    .trim()
    .toLowerCase();

  const idRol = Number(
    usuario?.idRol ?? usuario?.IdRol
  );

  const rol = roles[rolTexto]
    ? rolTexto
    : rolesPorId[idRol];

  const nombreCompleto = usuario
    ? `${usuario.nombre || ""} ${usuario.apellido || ""}`.trim()
    : "";

  const nombreRol = roles[rol] || "Usuario";
  const iconoRol = iconosRol[rol] || "bi-person";

  const rutaNotificaciones = {
    municipal: "/notificaciones",
    profesional: "/notificacionesConservadores",
    conservador: "/notificacionesConservadores",
    propietario: "/propietario/notificaciones",
  };

  const mostrarCampanita = rol !== "bomberos";
  const ruta = rutaNotificaciones[rol];

  const [tieneNoLeidas, setTieneNoLeidas] = useState(false);

  useEffect(() => {
    let cancelado = false;

    const revisarNotificaciones = async () => {
      const rolActual = String(
        usuario?.rol ?? usuario?.RolNombre ?? ""
      )
        .trim()
        .toLowerCase();

      const idRolActual = Number(
        usuario?.idRol ?? usuario?.IdRol
      );

      const esProfesional =
        ["profesional", "conservador"].includes(rolActual) ||
        idRolActual === 3;

      const esPropietario =
        rolActual === "propietario" || idRolActual === 4;

      const esMunicipal =
        rolActual === "municipal" || idRolActual === 1;

      // MUNICIPALIDAD
      if (esMunicipal) {
        try {
          const guardadas = JSON.parse(
            localStorage.getItem("notificaciones_municipal") || "[]"
          );

          if (!cancelado) {
            setTieneNoLeidas(
              guardadas.some((notificacion) => !notificacion.leida)
            );
          }
        } catch {
          if (!cancelado) setTieneNoLeidas(false);
        }

        return;
      }

      // PROFESIONAL / CONSERVADOR
      if (esProfesional) {
        try {
          const guardadas = JSON.parse(
            localStorage.getItem("notificaciones_conservador") || "[]"
          );

          if (!cancelado) {
            setTieneNoLeidas(
              guardadas.some((notificacion) => !notificacion.leida)
            );
          }
        } catch {
          if (!cancelado) setTieneNoLeidas(false);
        }

        return;
      }

      // PROPIETARIO
      if (esPropietario) {
        try {
          const sesion = JSON.parse(
            sessionStorage.getItem("usuario") || "{}"
          );

          const idPropietario = sesion.id;

          if (!idPropietario) {
            if (!cancelado) setTieneNoLeidas(false);
            return;
          }

          const respuestaInmuebles = await fetch(
            `http://localhost:3001/api/propietario/${idPropietario}/inmuebles`
          );

          if (!respuestaInmuebles.ok) {
            throw new Error("No se pudieron cargar los inmuebles");
          }

          const inmuebles = await respuestaInmuebles.json();

          const leidas = JSON.parse(
            localStorage.getItem("notificaciones_propietario_leidas") || "[]"
          );

          const idsLeidas = new Set(leidas.map(String));
          let hayNoLeidas = false;

          for (const inmueble of inmuebles) {
            const idInmueble =
              inmueble.id ?? inmueble.IdInmueble;

            if (!idInmueble) continue;

            const respuestaInspecciones = await fetch(
              `http://localhost:3001/api/inmuebles/${idInmueble}/inspecciones`
            );

            if (!respuestaInspecciones.ok) continue;

            const inspecciones = await respuestaInspecciones.json();

            for (const inspeccion of inspecciones) {
              const idInspeccion =
                inspeccion.IdInspeccion ??
                inspeccion.idInspeccion ??
                `${idInmueble}-${inspeccion.Fecha}`;

              const idNotificacion = `${idInmueble}-${idInspeccion}`;

              if (!idsLeidas.has(String(idNotificacion))) {
                hayNoLeidas = true;
                break;
              }
            }

            if (hayNoLeidas) break;
          }

          if (!cancelado) setTieneNoLeidas(hayNoLeidas);
        } catch (error) {
          console.error(
            "Error al revisar las notificaciones del propietario:",
            error
          );

          if (!cancelado) setTieneNoLeidas(false);
        }

        return;
      }

      if (!cancelado) setTieneNoLeidas(false);
    };

    revisarNotificaciones();

    const actualizar = () => revisarNotificaciones();

    window.addEventListener("notificacionesActualizadas", actualizar);
    window.addEventListener("storage", actualizar);

    const intervalo = setInterval(revisarNotificaciones, 15000);

    return () => {
      cancelado = true;
      clearInterval(intervalo);
      window.removeEventListener("notificacionesActualizadas", actualizar);
      window.removeEventListener("storage", actualizar);
    };
  }, [usuario, rol]);

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <h1>
          <span className="logo-blanco">PRIS</span>
          <span className="logo-azul">CI</span>
        </h1>
      </div>

      <div className="navbar-title">
        <p>Plataforma de Registro de Instalaciones</p>
        <p>de Seguridad Contra Incendios</p>
      </div>

      <div className="navbar-actions">
        {mostrarCampanita && ruta && (
          <Link
            to={ruta}
            className="navbar-icon"
            aria-label="Notificaciones"
          >
            <i className="bi bi-bell navbar-bell-icon"></i>

            {tieneNoLeidas && (
              <span className="navbar-notificacion"></span>
            )}
          </Link>
        )}

        <div className="navbar-role">
          <i className={`bi ${iconoRol} navbar-role-icon`}></i>

          <div className="navbar-user-info">
            <span className="navbar-user-name">
              {nombreCompleto || "Usuario"}
            </span>

            <span className="navbar-user-role">
              {nombreRol}
            </span>
          </div>

          <i className="bi bi-chevron-down navbar-arrow"></i>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

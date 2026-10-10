import React, { useEffect, useMemo, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./agregarinmueble.css";

const CENTRO_NEUQUEN = [-38.9516, -68.0591];

const pinIcon = L.divIcon({
  className: "prisci-custom-pin",
  html: '<span class="prisci-pin-dot"></span>',
  iconSize: [28, 36],
  iconAnchor: [14, 34],
});

const FORM_INICIAL = {
  nombre: "",
  tipo: "",
  calle: "",
  altura: "",
  localidad: "Neuquén",
  barrio: "",
  partida: "",
  superficie: "",
  uso: "",
  propietario: "",
  cuitDni: "",
  telefono: "",
  email: "",
  conservadorId: "",
};

const TIPOS_INMUEBLE = [
  "Vivienda",
  "Edificio",
  "Local comercial",
  "Otro",
];

const LOCALIDADES = ["Neuquén", "Plottier", "Centenario"];

const BARRIOS = [
  "Centro",
  "Santa Genoveva",
  "Confluencia",
  "Otro",
];

const USOS = [
  "Residencial",
  "Comercial",
  "Industrial",
  "Institucional",
];

export default function AgregarInmueble() {
  const [form, setForm] = useState(FORM_INICIAL);
  const [coordenadas, setCoordenadas] = useState(null);
  const [direccionEncontrada, setDireccionEncontrada] = useState("");
  const [buscando, setBuscando] = useState(false);
  const [imagen, setImagen] = useState(null);
  const [conservadores, setConservadores] = useState([]);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  const direccion = useMemo(() => {
    return [
      form.calle.trim(),
      form.altura.trim(),
      form.barrio.trim(),
      form.localidad.trim(),
      "Neuquén, Argentina",
    ]
      .filter(Boolean)
      .join(", ");
  }, [
    form.calle,
    form.altura,
    form.barrio,
    form.localidad,
  ]);

  function actualizar(campo, valor) {
    setForm((actual) => ({
      ...actual,
      [campo]: valor,
    }));

    setError("");
    setMensaje("");

    if (
      ["calle", "altura", "barrio", "localidad"].includes(campo)
    ) {
      setCoordenadas(null);
      setDireccionEncontrada("");
    }
  }

  // Búsqueda automática de dirección y coordenadas.
  useEffect(() => {
    if (!form.calle.trim() || !form.altura.trim()) {
      setCoordenadas(null);
      setDireccionEncontrada("");
      setBuscando(false);
      return;
    }

    let cancelado = false;

    const temporizador = setTimeout(async () => {
      setBuscando(true);

      try {
        const consulta = [
          `${form.altura} ${form.calle}`,
          form.barrio,
          form.localidad,
          "Neuquén",
          "Argentina",
        ]
          .filter(Boolean)
          .join(", ");

        const parametros = new URLSearchParams({
          q: consulta,
          format: "jsonv2",
          limit: "1",
          countrycodes: "ar",
        });

        const respuesta = await fetch(
          `https://nominatim.openstreetmap.org/search?${parametros}`
        );

        if (!respuesta.ok) {
          throw new Error("No se pudo consultar el mapa.");
        }

        const resultados = await respuesta.json();

        if (cancelado) return;

        if (resultados.length === 0) {
          setCoordenadas(null);
          setDireccionEncontrada("");
          setError(
            "No encontramos esa dirección. Revisá los datos o marcá el punto manualmente en el mapa."
          );
          return;
        }

        const resultado = resultados[0];

        setCoordenadas([
          Number(resultado.lat),
          Number(resultado.lon),
        ]);

        setDireccionEncontrada(resultado.display_name);
        setError("");
      } catch (err) {
        if (!cancelado) {
          setCoordenadas(null);
          setDireccionEncontrada("");
          setError(
            "No se pudo buscar la dirección. Podés marcar el punto manualmente en el mapa."
          );
        }
      } finally {
        if (!cancelado) {
          setBuscando(false);
        }
      }
    }, 1000);

    return () => {
      cancelado = true;
      clearTimeout(temporizador);
    };
  }, [
    direccion,
    form.calle,
    form.altura,
    form.barrio,
    form.localidad,
  ]);

  // Preparado para conectar con el guardado real en el próximo paso.
  function registrarInmueble(event) {
    event.preventDefault();
    setError("");
    setMensaje("");

    if (!coordenadas) {
      setError(
        "Primero ubicá el inmueble en el mapa. Completá la dirección o marcá el punto manualmente."
      );
      return;
    }

    if (
      imagen &&
      !["image/jpeg", "image/png"].includes(imagen.type)
    ) {
      setError("La imagen debe estar en formato JPG o PNG.");
      return;
    }

    if (imagen && imagen.size > 5 * 1024 * 1024) {
      setError("La imagen no puede superar los 5 MB.");
      return;
    }

    const nuevoInmueble = {
      ...form,
      direccion,
      latitud: coordenadas[0],
      longitud: coordenadas[1],
      ubicacion: {
        lat: coordenadas[0],
        lng: coordenadas[1],
      },
      direccionGeocodificada: direccionEncontrada,
      conservadorId: form.conservadorId || null,
      imagen,
    };

    // Por ahora no guarda en la base de datos.
    // En el siguiente paso conectaremos este objeto
    // con la conexión existente de PRISCI.
    console.log("Inmueble preparado para registrar:", nuevoInmueble);

    setMensaje(
      "Los datos están completos y la ubicación fue identificada. Falta conectar el guardado de PRISCI."
    );
  }

  function marcarUbicacion(punto) {
    setCoordenadas(punto);
    setDireccionEncontrada("Ubicación marcada manualmente");
    setError("");
    setMensaje("");
  }

  function cancelar() {
    setForm(FORM_INICIAL);
    setCoordenadas(null);
    setDireccionEncontrada("");
    setImagen(null);
    setError("");
    setMensaje("");
  }

  return (
    <section className="prisci-page">
      <p className="breadcrumb">
        ⌂ Inmuebles › Agregar inmueble
      </p>

      <h1>Agregar inmueble</h1>

      <p className="subtitle">
        Complete la información del inmueble para registrarlo en el sistema.
      </p>

      <form onSubmit={registrarInmueble}>
        <div className="form-layout">
          <section className="panel">
            <h3>Datos del inmueble</h3>

            <div className="form-grid">
              <Field
                label="Nombre del edificio / establecimiento"
                placeholder="Ej. Edificio Torres del Limay"
                value={form.nombre}
                onChange={(v) => actualizar("nombre", v)}
                required
              />

              <Select
                label="Tipo de inmueble"
                value={form.tipo}
                options={TIPOS_INMUEBLE}
                onChange={(v) => actualizar("tipo", v)}
                required
              />

              <Field
                label="Dirección"
                placeholder="Ej. Avenida Argentina"
                value={form.calle}
                onChange={(v) => actualizar("calle", v)}
                required
              />

              <Field
                label="Altura"
                placeholder="Ej. 123"
                value={form.altura}
                onChange={(v) => actualizar("altura", v)}
                required
              />

              <Select
                label="Localidad"
                value={form.localidad}
                options={LOCALIDADES}
                onChange={(v) => actualizar("localidad", v)}
                required
              />

              <Select
                label="Barrio"
                value={form.barrio}
                options={BARRIOS}
                onChange={(v) => actualizar("barrio", v)}
              />

              <Field
                label="Partida / Nomenclatura"
                placeholder="Ej. 12345"
                value={form.partida}
                onChange={(v) => actualizar("partida", v)}
              />

              <Field
                label="Superficie (m²)"
                placeholder="Ej. 500"
                type="number"
                value={form.superficie}
                onChange={(v) => actualizar("superficie", v)}
              />

              <Select
                label="Uso / Actividad principal"
                value={form.uso}
                options={USOS}
                onChange={(v) => actualizar("uso", v)}
              />
            </div>

            <h3 className="section-heading">
              Datos del propietario / responsable
            </h3>

            <div className="form-grid">
              <Field
                label="Nombre o razón social"
                placeholder="Ej. Consorcio Los Tilos"
                value={form.propietario}
                onChange={(v) => actualizar("propietario", v)}
                required
              />

              <Field
                label="CUIT / DNI"
                placeholder="Ej. 30-12345678-9"
                value={form.cuitDni}
                onChange={(v) => actualizar("cuitDni", v)}
                required
              />

              <Field
                label="Teléfono"
                placeholder="Ej. 299 1234567"
                value={form.telefono}
                onChange={(v) => actualizar("telefono", v)}
              />

              <Field
                label="Email"
                placeholder="contacto@empresa.com"
                type="email"
                value={form.email}
                onChange={(v) => actualizar("email", v)}
              />
            </div>

            <h3 className="section-heading">
              Asignación al conservador
            </h3>

            <div className="form-grid">
              <label className="field">
                <span>Conservador responsable</span>

                <select
                  className="control"
                  value={form.conservadorId}
                  onChange={(e) =>
                    actualizar("conservadorId", e.target.value)
                  }
                >
                  <option value="">
                    Seleccione un conservador...
                  </option>

                  {conservadores.map((conservador) => (
                    <option
                      key={conservador.id}
                      value={conservador.id}
                    >
                      {conservador.nombre ||
                        conservador.name ||
                        conservador.email}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <p className="map-help">
              La lista se conectará con los conservadores registrados en PRISCI.
            </p>
          </section>

          <div className="side-stack">
            <section className="panel">
              <h3>Ubicación en el mapa</h3>

              <input
                className="control"
                value={direccion}
                readOnly
                placeholder="Completá la dirección..."
                aria-label="Dirección del inmueble"
              />

              <p className="map-status" aria-live="polite">
                {buscando
                  ? "Buscando dirección..."
                  : coordenadas
                    ? "✓ Ubicación marcada"
                    : "Completá la calle y la altura para ubicar el inmueble."}
              </p>

              <div className="map-real">
                <MapContainer
                  center={coordenadas || CENTRO_NEUQUEN}
                  zoom={coordenadas ? 17 : 13}
                  scrollWheelZoom
                  className="prisci-leaflet"
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />

                  <MapaActualizador coordenadas={coordenadas} />

                  <SelectorPunto onSeleccionar={marcarUbicacion} />

                  {coordenadas && (
                    <Marker
                      position={coordenadas}
                      icon={pinIcon}
                    />
                  )}
                </MapContainer>
              </div>

              <p className="map-help">
                El pin se coloca automáticamente cuando se encuentra la
                dirección. También podés hacer clic en el mapa para moverlo.
              </p>

              {coordenadas && (
                <p className="coordinates">
                  Latitud: {coordenadas[0].toFixed(6)}
                  {" · "}
                  Longitud: {coordenadas[1].toFixed(6)}
                </p>
              )}
            </section>

            <section className="panel">
              <h3>Imagen del inmueble (opcional)</h3>

              <label
                className="upload-box"
                htmlFor="imagen-inmueble"
              >
                <strong>
                  {imagen
                    ? imagen.name
                    : "Seleccionar imagen"}
                </strong>

                <small>Formatos JPG o PNG (máx. 5 MB)</small>

                <input
                  id="imagen-inmueble"
                  type="file"
                  accept="image/png,image/jpeg"
                  onChange={(e) =>
                    setImagen(e.target.files?.[0] || null)
                  }
                />
              </label>
            </section>

            {error && (
              <div className="form-message error" role="alert">
                {error}
              </div>
            )}

            {mensaje && (
              <div className="form-message success" role="status">
                {mensaje}
              </div>
            )}

            <div className="actions">
              <button
                className="btn secondary"
                type="button"
                onClick={cancelar}
              >
                Cancelar
              </button>

              <button className="btn primary" type="submit">
                Registrar inmueble
              </button>
            </div>
          </div>
        </div>
      </form>
    </section>
  );
}

function Field({
  label,
  placeholder,
  type = "text",
  required = false,
  value,
  onChange,
}) {
  return (
    <label className="field">
      <span>
        {label}{required ? " *" : ""}
      </span>

      <input
        className="control"
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        min={type === "number" ? 0 : undefined}
      />
    </label>
  );
}

function Select({
  label,
  options,
  value,
  onChange,
  required = false,
}) {
  return (
    <label className="field">
      <span>
        {label}{required ? " *" : ""}
      </span>

      <select
        className="control"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
      >
        <option value="" disabled>
          Seleccione...
        </option>

        {options.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
    </label>
  );
}

function MapaActualizador({ coordenadas }) {
  const map = useMap();

  useEffect(() => {
    if (coordenadas) {
      map.flyTo(coordenadas, 17, { duration: 0.8 });
    }
  }, [coordenadas, map]);

  return null;
}

function SelectorPunto({ onSeleccionar }) {
  useMapEvents({
    click(event) {
      onSeleccionar([
        event.latlng.lat,
        event.latlng.lng,
      ]);
    },
  });

  return null;
}
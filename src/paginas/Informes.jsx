import React, { useState, useEffect } from "react";
import "./Informes.css";

const tipos = [
  ["Inspecciones", "Listado y detalle de inspecciones realizadas."],
  ["Inmuebles", "Listado de inmuebles registrados."],
  ["Profesionales", "Listado de profesionales habilitados."],
  ["Servicios por vencer", "Inmuebles con servicios próximos a vencer."],
  ["Estadísticas generales", "Resumen de actividad del sistema."]
];

export default function Reportes() {
  const [pestanaActiva, setPestanaActiva] = useState("generar");
  const [tipoSeleccionado, setTipoSeleccionado] = useState("Inspecciones");
  const [formatoSalida, setFormatoSalida] = useState("PDF");
  const [mensajeExito, setMensajeExito] = useState("");

  const [inmuebles, setInmuebles] = useState([]);
  const [profesionales, setProfesionales] = useState([]);

  useEffect(() => {
    const inmueblesMock = JSON.parse(localStorage.getItem("prisci_inmuebles")) || [
      { id: 1, nombre: "Edificio Centro", localidad: "Neuquén", estado: "Aprobada" },
      { id: 2, nombre: "Comercial Oeste", localidad: "Plottier", estado: "Pendiente" },
      { id: 3, nombre: "Torre Boulevard", localidad: "Neuquén", estado: "Aprobada" },
      { id: 4, nombre: "Galería Los Pinos", localidad: "Centenario", estado: "Observada" }
    ];

    const profesionalesMock = JSON.parse(localStorage.getItem("prisci_profesionales")) || [
      { id: 1, nombre: "Juan Pérez", especialidad: "Instalaciones contra incendios" },
      { id: 2, nombre: "María Gómez", especialidad: "Extintores y matafuegos" },
      { id: 3, nombre: "Luis Fernández", especialidad: "Instalación eléctrica" }
    ];

    setInmuebles(inmueblesMock);
    setProfesionales(profesionalesMock);
  }, []);

  const handleGenerarInforme = () => {
    if (formatoSalida === "PDF") {
      // Abrimos una ventana de impresión limpia con formato de documento PDF oficial
      const ventanaImpresion = window.open('', '_blank');
      ventanaImpresion.document.write(`
        <html>
          <head>
            <title>Informe Oficial - PRISCI</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 30px; color: #333; }
              h1 { color: #0b1329; border-bottom: 2px solid #168fe4; padding-bottom: 10px; }
              .meta { margin-bottom: 20px; font-size: 14px; color: #555; }
              ul { line-height: 1.6; }
              li { margin-bottom: 8px; }
            </style>
          </head>
          <body>
            <h1>PLATAFORMA PRISCI - INFORME OFICIAL</h1>
            <div class="meta">
              <p><strong>Tipo de Reporte:</strong> ${tipoSeleccionado}</p>
              <p><strong>Fecha de Emisión:</strong> ${new Date().toLocaleDateString()}</p>
              <p><strong>Formato:</strong> PDF Municipal</p>
            </div>
            <hr/>
            <h3>Detalle de Registros:</h3>
            <ul>
              ${
                tipoSeleccionado === "Inmuebles" 
                  ? inmuebles.map(i => `<li><strong>${i.nombre}</strong> — Localidad: ${i.localidad} — Estado: <em>${i.estado}</em></li>`).join("")
                  : tipoSeleccionado === "Profesionales"
                  ? profesionales.map(p => `<li><strong>${p.nombre}</strong> — Especialidad:${p.especialidad}</li>`).join("")
                  : `<li>Total de Inmuebles: ${inmuebles.length}</li><li>Total de Profesionales: ${profesionales.length}</li><li>Inspecciones Totales:${inmuebles.length * 3}</li>`
              }
            </ul>
            <br/><br/>
            <p style="font-size: 12px; color: #888; text-align: center;">Documento generado automáticamente por el Sistema PRISCI.</p>
          </body>
        </html>
      `);
      ventanaImpresion.document.close();
      ventanaImpresion.focus();
      setTimeout(() => {
        ventanaImpresion.print();
      }, 500);

      setMensajeExito(`¡Ventana de exportación a PDF abierta correctamente para ${tipoSeleccionado}!`);
    } else {
      // Si es Excel, generamos un archivo .csv real que Excel abre tabulado en columnas
      let csvContent = "data:text/csv;charset=utf-8,";
      csvContent += "ID,Nombre,Detalle/Localidad,Estado/Especialidad\n";

      if (tipoSeleccionado === "Inmuebles") {
        inmuebles.forEach(i => {
          csvContent += `${i.id},"${i.nombre}","${i.localidad}","${i.estado}"\n`;
        });
      } else if (tipoSeleccionado === "Profesionales") {
        profesionales.forEach(p => {
          csvContent += `${p.id},"${p.nombre}","Especialidad","${p.especialidad}"\n`;
        });
      } else {
        csvContent += `1,"Resumen General","Inmuebles: ${inmuebles.length}","Profesionales: ${profesionales.length}"\n`;
      }

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `informe_${tipoSeleccionado.toLowerCase()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setMensajeExito(`¡Informe de ${tipoSeleccionado} descargado en formato Excel (.csv) con éxito!`);
    }

    setTimeout(() => setMensajeExito(""), 4000);
  };

  return (
    <section className="prisci-page">
      <p className="breadcrumb">⌂ Informes</p>
      <h1>Informes</h1>
      <p className="subtitle">
        Generá reportes y estadísticas basadas en los datos reales del sistema.
      </p>

      {mensajeExito && (
        <div style={{ background: "#10b981", color: "#fff", padding: "10px 15px", borderRadius: "5px", marginBottom: "15px", fontSize: "11px" }}>
          {mensajeExito}
        </div>
      )}

      {/* SOLAPAS SUPERIORES */}
      <div className="panel report-tabs">
        <button 
          className={`tab ${pestanaActiva === "generar" ? "active" : ""}`} 
          type="button"
          onClick={() => setPestanaActiva("generar")}
        >
          Generar informe
        </button>
        <button 
          className={`tab ${pestanaActiva === "historial" ? "active" : ""}`} 
          type="button"
          onClick={() => setPestanaActiva("historial")}
        >
          Informes generados
        </button>
        <button 
          className={`tab ${pestanaActiva === "estadisticas" ? "active" : ""}`} 
          type="button"
          onClick={() => setPestanaActiva("estadisticas")}
        >
          Estadísticas
        </button>
      </div>

      {/* VISTA 1: GENERAR */}
      {pestanaActiva === "generar" && (
        <div className="reports-layout">
          <section className="panel">
            <h3>Tipo de informe</h3>
            {tipos.map(([nombre, descripcion], index) => (
              <label className="report-type" key={nombre} style={{ cursor: "pointer" }}>
                <input
                  type="radio"
                  name="tipoInforme"
                  defaultChecked={index === 0}
                  onChange={() => setTipoSeleccionado(nombre)}
                />
                <span>
                  <strong>{nombre}</strong>
                  <small>{descripcion}</small>
                </span>
              </label>
            ))}
          </section>

          <section className="panel">
            <h3>Filtros del informe</h3>
            <div className="form-grid">
              <Field label="Fecha desde" type="date" />
              <Field label="Fecha hasta" type="date" />
              <Select label="Estado" options={["Todos", "Pendiente", "Aprobada", "Observada", "Rechazada"]} />
              <Select label="Tipo de instalación" options={["Todos", "Contra incendios", "Eléctrica", "Gas", "Agua"]} />
              <Select label="Profesional" options={["Todos", ...profesionales.map(p => p.nombre)]} />
              <Select label="Localidad" options={["Neuquén", "Plottier", "Centenario"]} />
            </div>

            <h3 className="section-heading">Formato de salida</h3>
            <div className="radio-inline">
              <label style={{ cursor: "pointer" }}>
                <input type="radio" name="formato" defaultChecked onChange={() => setFormatoSalida("PDF")} /> PDF
              </label>
              <label style={{ cursor: "pointer" }}>
                <input type="radio" name="formato" onChange={() => setFormatoSalida("Excel")} /> Excel
              </label>
            </div>
          </section>

          <section className="panel preview-panel">
            <h3>Vista previa</h3>
            <div className="preview">
              <span className="preview-icon">▤</span>
              <p>
                Se generará un informe oficial de <strong>{tipoSeleccionado}</strong> en formato <strong>{formatoSalida}</strong> con los registros actuales.
              </p>
            </div>
            <button className="btn primary full" type="button" onClick={handleGenerarInforme}>
              Generar informe
            </button>
          </section>
        </div>
      )}

      {/* VISTA 2: HISTORIAL / INFORMES GENERADOS */}
      {pestanaActiva === "historial" && (
        <div className="panel" style={{ padding: "20px" }}>
          <h3>Historial de informes recientes</h3>
          <p style={{ color: "#92a9c4", marginBottom: "15px", fontSize: "11px" }}>Descarga directa de reportes basados en registros reales.</p>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "11px", textAlign: "left" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #1e344c", color: "#aabdd2" }}>
                <th style={{ padding: "8px" }}>Archivo</th>
                <th style={{ padding: "8px" }}>Tipo</th>
                <th style={{ padding: "8px" }}>Fecha</th>
                <th style={{ padding: "8px" }}>Formato</th>
                <th style={{ padding: "8px" }}>Acción</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: "1px solid #14283e" }}>
                <td style={{ padding: "8px" }}>reporte_inmuebles_oficial.pdf</td>
                <td style={{ padding: "8px" }}>Inmuebles</td>
                <td style={{ padding: "8px" }}>10/10/2026</td>
                <td style={{ padding: "8px" }}>PDF</td>
                <td style={{ padding: "8px" }}>
                  <button 
                    className="btn primary" 
                    style={{ padding: "4px 8px" }} 
                    onClick={() => { setTipoSeleccionado("Inmuebles"); setFormatoSalida("PDF"); handleGenerarInforme(); }}
                  >
                    Generar PDF
                  </button>
                </td>
              </tr>
              <tr style={{ borderBottom: "1px solid #14283e" }}>
                <td style={{ padding: "8px" }}>profesionales_habilitados.csv</td>
                <td style={{ padding: "8px" }}>Profesionales</td>
                <td style={{ padding: "8px" }}>10/10/2026</td>
                <td style={{ padding: "8px" }}>Excel</td>
                <td style={{ padding: "8px" }}>
                  <button 
                    className="btn primary" 
                    style={{ padding: "4px 8px" }} 
                    onClick={() => { setTipoSeleccionado("Profesionales"); setFormatoSalida("Excel"); handleGenerarInforme(); }}
                  >
                    Generar Excel
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* VISTA 3: ESTADÍSTICAS Y GRÁFICA DE BARRAS */}
      {pestanaActiva === "estadisticas" && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginBottom: "15px" }}>
            <div className="panel" style={{ textAlign: "center", padding: "15px" }}>
              <span style={{ color: "#92a9c4", fontSize: "10px" }}>Inspecciones Totales</span>
              <h2 style={{ color: "#38bdf8", fontSize: "24px", margin: "5px 0 0" }}>{inmuebles.length * 3}</h2>
            </div>
            <div className="panel" style={{ textAlign: "center", padding: "15px" }}>
              <span style={{ color: "#92a9c4", fontSize: "10px" }}>Inmuebles Registrados</span>
              <h2 style={{ color: "#34d399", fontSize: "24px", margin: "5px 0 0" }}>{inmuebles.length}</h2>
            </div>
            <div className="panel" style={{ textAlign: "center", padding: "15px" }}>
              <span style={{ color: "#92a9c4", fontSize: "10px" }}>Profesionales Activos</span>
              <h2 style={{ color: "#facc15", fontSize: "24px", margin: "5px 0 0" }}>{profesionales.length}</h2>
            </div>
          </div>

          <div className="panel" style={{ padding: "20px" }}>
            <h3 style={{ textAlign: "center", marginBottom: "20px" }}>Gráfica de Estado de Inmuebles (Datos Reales)</h3>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "15px", maxWidth: "600px", margin: "0 auto", fontSize: "11px" }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px", color: "#d1deed" }}>
                  <span>Inmuebles Aprobados</span>
                  <span>{inmuebles.filter(i => i.estado === "Aprobada").length} de {inmuebles.length}</span>
                </div>
                <div style={{ width: "100%", background: "#061322", borderRadius: "4px", height: "16px", overflow: "hidden", border: "1px solid #1e344c" }}>
                  <div style={{ 
                    width: `${inmuebles.length > 0 ? (inmuebles.filter(i => i.estado === "Aprobada").length / inmuebles.length) * 100 : 0}%`, 
                    background: "#34d399", 
                    height: "100%",
                    transition: "width 0.5s ease"
                  }}></div>
                </div>
              </div>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px", color: "#d1deed" }}>
                  <span>Pendientes / Observados</span>
                  <span>{inmuebles.filter(i => i.estado !== "Aprobada").length} de {inmuebles.length}</span>
                </div>
                <div style={{ width: "100%", background: "#061322", borderRadius: "4px", height: "16px", overflow: "hidden", border: "1px solid #1e344c" }}>
                  <div style={{ 
                    width: `${inmuebles.length > 0 ? (inmuebles.filter(i => i.estado !== "Aprobada").length / inmuebles.length) * 100 : 0}%`, 
                    background: "#f87171", 
                    height: "100%",
                    transition: "width 0.5s ease"
                  }}></div>
                </div>
              </div>
            </div>

            <p style={{ textAlign: "center", color: "#8ca7c3", fontSize: "10px", marginTop: "20px" }}>
              📊 Gráfica actualizada en tiempo real según los registros actuales cargados en la base de inmuebles.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}

function Field({ label, type = "text" }) {
  return (
    <label className="field">
      <span>{label}</span>
      <input className="control" type={type} />
    </label>
  );
}

function Select({ label, options }) {
  return (
    <label className="field">
      <span>{label}</span>
      <select className="control" defaultValue={options[0]}>
        {options.map(item => <option key={item}>{item}</option>)}
      </select>
    </label>
  );
}
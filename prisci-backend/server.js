<<<<<<< HEAD
// Importación de módulos principales
=======
// server.js
>>>>>>> 4196a602867e7104e779591907fb7cb3273e9f79
const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
<<<<<<< HEAD

// Middlewares necesarios para recibir JSON y permitir peticiones desde React (CORS)
app.use(cors());
app.use(express.json());

// ==========================================
// RUTAS DE LA API REST (PRISCI MUNICIPAL)
// ==========================================

// 1. MÉTRICAS DEL DASHBOARD PARA EL CONSERVADOR
app.get('/api/conservador/:idConservador/resumen', async (req, res) => {
  const { idConservador } = req.params;
  try {
    // Cuenta inmuebles donde este conservador realizó inspecciones
    const [[{ totalInmuebles }]] = await db.query(
      'SELECT COUNT(DISTINCT IdInmueble) AS totalInmuebles FROM Inspeccion WHERE IdConservador = ?', 
      [idConservador]
    );

    // Cuenta clientes (propietarios) vinculados a sus inmuebles
    const [[{ totalClientes }]] = await db.query(
      `SELECT COUNT(DISTINCT i.IdPropietario) AS totalClientes 
       FROM Inspeccion insp 
       JOIN Inmueble i ON insp.IdInmueble = i.IdInmueble 
       WHERE insp.IdConservador = ?`, 
      [idConservador]
    );

    // Cuenta servicios e inspecciones programadas para el mes actual
    const [[{ serviciosMes }]] = await db.query(
      `SELECT COUNT(*) AS serviciosMes 
       FROM Inspeccion 
       WHERE IdConservador = ? AND MONTH(Fecha) = MONTH(CURRENT_DATE()) AND YEAR(Fecha) = YEAR(CURRENT_DATE())`, 
      [idConservador]
    );

    // Cuenta servicios con observaciones o pendientes de vencimiento
    const [[{ vencimientos }]] = await db.query(
      `SELECT COUNT(*) AS vencimientos 
       FROM Inspeccion 
       WHERE IdConservador = ? AND (Resultado = 'Observaciones' OR Resultado = 'Pendiente')`, 
      [idConservador]
    );
=======
app.use(cors());
app.use(express.json());

// métricas del dashboard (que están arriba del mapa)
app.get('/api/conservador/resumen', async (req, res) => {
  try {
    const [[{ totalInmuebles }]] = await db.query('SELECT COUNT(*) AS totalInmuebles FROM Inmueble');
    const [[{ totalClientes }]] = await db.query('SELECT COUNT(DISTINCT IdPropietario) AS totalClientes FROM Inmueble');
    const [[{ serviciosMes }]] = await db.query('SELECT COUNT(*) AS serviciosMes FROM Inspeccion WHERE MONTH(Fecha) = MONTH(CURRENT_DATE()) AND YEAR(Fecha) = YEAR(CURRENT_DATE())');
    const [[{ vencimientos }]] = await db.query('SELECT COUNT(*) AS vencimientos FROM Inspeccion WHERE Resultado = "Observaciones" OR Resultado = "Pendiente"');
>>>>>>> 4196a602867e7104e779591907fb7cb3273e9f79

    res.json({
      inmuebles: totalInmuebles,
      clientes: totalClientes,
      servicios: serviciosMes,
      vencimientos: vencimientos
    });
  } catch (error) {
<<<<<<< HEAD
    console.error('Error en /resumen:', error);
=======
>>>>>>> 4196a602867e7104e779591907fb7cb3273e9f79
    res.status(500).json({ error: error.message });
  }
});

<<<<<<< HEAD
// 2. LISTA DE INMUEBLES ASIGNADOS AL CONSERVADOR (Para el mapa y lista lateral)
app.get('/api/conservador/:idConservador/inmuebles', async (req, res) => {
  const { idConservador } = req.params;
  try {
    const [rows] = await db.query(`
      SELECT DISTINCT
=======
// servicios de este mes
app.get('/api/servicios/mes', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        i.IdInmueble,
        i.Nombre AS inmuebleNombre,
        i.Domicilio,
        i.Actividad,
        insp.Fecha,
        insp.Resultado AS estado,
        insp.Observaciones AS tipoServicio
      FROM Inspeccion insp
      JOIN Inmueble i ON insp.IdInmueble = i.IdInmueble
      WHERE MONTH(insp.Fecha) = MONTH(CURRENT_DATE())
      ORDER BY insp.Fecha ASC
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// servicios por vencer
app.get('/api/servicios/vencimientos', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        i.IdInmueble,
        i.Nombre AS inmuebleNombre,
        i.Domicilio,
        i.Actividad,
        insp.Fecha,
        DATEDIFF(insp.Fecha, CURRENT_DATE()) AS diasRestantes
      FROM Inspeccion insp
      JOIN Inmueble i ON insp.IdInmueble = i.IdInmueble
      WHERE insp.Resultado = 'Pendiente' OR DATEDIFF(insp.Fecha, CURRENT_DATE()) BETWEEN 0 AND 30
      ORDER BY insp.Fecha ASC
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// OBTENER TODOS LOS INMUEBLES (Para la vista Conservadores)
app.get('/api/inmuebles', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
>>>>>>> 4196a602867e7104e779591907fb7cb3273e9f79
        i.IdInmueble AS id,
        i.Nombre AS nombre,
        i.Domicilio AS direccion,
        i.Actividad AS tipoInmueble,
        i.NomenclaturaCatastral,
<<<<<<< HEAD
        i.Superficie
      FROM Inmueble i
      JOIN Inspeccion insp ON i.IdInmueble = insp.IdInmueble
      WHERE insp.IdConservador = ?
    `, [idConservador]);

    res.json(rows);
  } catch (error) {
    console.error('Error en /inmuebles:', error);
    res.status(500).json({ error: error.message });
  }
});

// 3. DETALLE DE UN INMUEBLE CON HISTORIAL DE INSPECCIONES
app.get('/api/inmuebles/:id', async (req, res) => {
  const { id } = req.params;
  try {
=======
        i.Superficie,
        i.CantMatafuego,
        i.RedAgua,
        i.EstadoSistema,
        p.IdPropietario,
        u.Nombre AS nombrePropietario,
        u.Apellido AS apellidoPropietario
      FROM Inmueble i
      JOIN Propietario p ON i.IdPropietario = p.IdPropietario
      JOIN Usuarios u ON p.IdUsu = u.IdUsu
    `);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener inmuebles' });
  }
});

// OBTENER DETALLE DE UN INMUEBLE Y SUS INSPECCIONES (Para la vista Clientes)
app.get('/api/inmuebles/:id', async (req, res) => {
  const { id } = req.params;
  try {
    // Obtener datos del inmueble
>>>>>>> 4196a602867e7104e779591907fb7cb3273e9f79
    const [inmuebles] = await db.query(`
      SELECT 
        i.*,
        u.Nombre AS nombrePropietario,
        u.Apellido AS apellidoPropietario
      FROM Inmueble i
      JOIN Propietario p ON i.IdPropietario = p.IdPropietario
      JOIN Usuarios u ON p.IdUsu = u.IdUsu
      WHERE i.IdInmueble = ?
    `, [id]);

    if (inmuebles.length === 0) {
      return res.status(404).json({ mensaje: 'Inmueble no encontrado' });
    }

<<<<<<< HEAD
    const [inspecciones] = await db.query(`
      SELECT 
        IdInspeccion,
        DATE_FORMAT(Fecha, '%d/%m/%Y') AS fecha,
=======
    // Obtener historial de inspecciones del inmueble
    const [inspecciones] = await db.query(`
      SELECT 
        IdInspeccion,
        DATE_FORMAT(Fecha, '%Y-%m-%d') AS fecha,
>>>>>>> 4196a602867e7104e779591907fb7cb3273e9f79
        Resultado,
        Observaciones
      FROM Inspeccion
      WHERE IdInmueble = ?
      ORDER BY Fecha DESC
    `, [id]);

<<<<<<< HEAD
    res.json({
      ...inmuebles[0],
      inspecciones: inspecciones
    });
  } catch (error) {
    console.error('Error en /inmuebles/:id:', error);
    res.status(500).json({ error: error.message });
  }
});

// 4. SERVICIOS PROGRAMADOS PARA ESTE MES
app.get('/api/servicios/mes', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        i.IdInmueble,
        i.Nombre AS inmuebleNombre,
        i.Domicilio,
        i.Actividad,
        DATE_FORMAT(insp.Fecha, '%d/%m/%Y') AS Fecha,
        insp.Resultado AS estado,
        insp.Observaciones AS tipoServicio
      FROM Inspeccion insp
      JOIN Inmueble i ON insp.IdInmueble = i.IdInmueble
      WHERE MONTH(insp.Fecha) = MONTH(CURRENT_DATE())
      ORDER BY insp.Fecha ASC
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error en /servicios/mes:', error);
    res.status(500).json({ error: error.message });
  }
});

// 5. SERVICIOS PRÓXIMOS A VENCER
app.get('/api/servicios/vencimientos', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        i.IdInmueble,
        i.Nombre AS inmuebleNombre,
        i.Domicilio,
        i.Actividad,
        DATE_FORMAT(insp.Fecha, '%d/%m/%Y') AS Fecha,
        DATEDIFF(insp.Fecha, CURRENT_DATE()) AS diasRestantes
      FROM Inspeccion insp
      JOIN Inmueble i ON insp.IdInmueble = i.IdInmueble
      WHERE insp.Resultado = 'Pendiente' OR DATEDIFF(insp.Fecha, CURRENT_DATE()) BETWEEN 0 AND 30
      ORDER BY insp.Fecha ASC
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error en /servicios/vencimientos:', error);
    res.status(500).json({ error: error.message });
  }
});

// Arrancamos el servidor en el puerto 3001
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Servidor backend de PRISCI corriendo en http://localhost:${PORT}`);
=======
    const detalleInmueble = {
      ...inmuebles[0],
      inspecciones: inspecciones
    };

    res.json(detalleInmueble);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al obtener detalle del inmueble' });
  }
});

// REGISTRAR UNA NUEVA INSPECCIÓN
app.post('/api/inspecciones', async (req, res) => {
  const { fecha, resultado, observaciones, idInmueble, idConservador } = req.body;
  try {
    const [result] = await db.query(`
      INSERT INTO Inspeccion (Fecha, Resultado, Observaciones, IdInmueble, IdConservador)
      VALUES (?, ?, ?, ?, ?)
    `, [fecha, resultado, observaciones, idInmueble, idConservador]);

    res.status(201).json({ mensaje: 'Inspección registrada con éxito', idInspeccion: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al guardar la inspección' });
  }
});

// Iniciar servidor
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
>>>>>>> 4196a602867e7104e779591907fb7cb3273e9f79
});
// server.js
const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// OBTENER TODOS LOS INMUEBLES (Para la vista Conservadores)
app.get('/api/inmuebles', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        i.IdInmueble AS id,
        i.Nombre AS nombre,
        i.Domicilio AS direccion,
        i.Actividad AS tipoInmueble,
        i.NomenclaturaCatastral,
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

    // Obtener historial de inspecciones del inmueble
    const [inspecciones] = await db.query(`
      SELECT 
        IdInspeccion,
        DATE_FORMAT(Fecha, '%Y-%m-%d') AS fecha,
        Resultado,
        Observaciones
      FROM Inspeccion
      WHERE IdInmueble = ?
      ORDER BY Fecha DESC
    `, [id]);

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
});
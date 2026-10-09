const express = require('express');
const cors = require('cors');
const db = require('./db'); // Conexión a la BD de MySQL (prisci_db)

const app = express();
app.use(cors());
app.use(express.json());

// 1. MÉTRICAS DEL DASHBOARD DEL CONSERVADOR
app.get('/api/conservador/:id/resumen', async (req, res) => {
  const { id } = req.params;
  try {
    // Total de inmuebles vinculados al conservador
    const [[{ totalInmuebles }]] = await db.query(
      'SELECT COUNT(DISTINCT IdInmueble) AS totalInmuebles FROM Inspeccion WHERE IdConservador = ?',
      [id]
    );

    // Total de propietarios/clientes vinculados
    const [[{ totalClientes }]] = await db.query(
      `SELECT COUNT(DISTINCT i.IdPropietario) AS totalClientes
       FROM Inspeccion insp
       JOIN Inmueble i ON insp.IdInmueble = i.IdInmueble
       WHERE insp.IdConservador = ?`,
      [id]
    );

    // Servicios/inspecciones del mes actual
    const [[{ serviciosMes }]] = await db.query(
      `SELECT COUNT(*) AS serviciosMes
       FROM Inspeccion
       WHERE IdConservador = ? AND MONTH(Fecha) = MONTH(CURRENT_DATE()) AND YEAR(Fecha) = YEAR(CURRENT_DATE())`,
      [id]
    );

    // Vencimientos en los próximos 30 días
    const [[{ vencimientos }]] = await db.query(
      `SELECT COUNT(*) AS vencimientos
       FROM Inspeccion
       WHERE IdConservador = ? AND Fecha >= CURRENT_DATE() AND Fecha <= DATE_ADD(CURRENT_DATE(), INTERVAL 30 DAY)`,
      [id]
    );

    res.json({
      inmuebles: totalInmuebles || 0,
      clientes: totalClientes || 0,
      servicios: serviciosMes || 0,
      vencimientos: vencimientos || 0
    });
  } catch (error) {
    console.error('Error en /api/conservador/:id/resumen:', error);
    res.status(500).json({ error: error.message });
  }
});

// 2. LISTA DE INMUEBLES ASIGNADOS AL CONSERVADOR
app.get('/api/conservador/:id/inmuebles', async (req, res) => {
  const { id } = req.params;
  try {
    const [inmuebles] = await db.query(
      `SELECT DISTINCT 
        i.IdInmueble as id,
        i.Nombre as nombre,
        i.Domicilio as direccion,
        i.Actividad as tipoInmueble,
        -38.9516 AS latitud,
        -68.0591 AS longitud
       FROM Inspeccion insp
       JOIN Inmueble i ON insp.IdInmueble = i.IdInmueble
       WHERE insp.IdConservador = ?`,
      [id]
    );
    res.json(inmuebles);
  } catch (error) {
    console.error('Error en /api/conservador/:id/inmuebles:', error);
    res.status(500).json({ error: error.message });
  }
});

// 3. SERVICIOS DE ESTE MES
app.get('/api/servicios/mes', async (req, res) => {
  try {
    const [servicios] = await db.query(`
      SELECT 
        i.IdInmueble,
        i.Nombre AS inmuebleNombre,
        i.Domicilio,
        i.Actividad,
        insp.Resultado AS tipoServicio,
        DATE_FORMAT(insp.Fecha, '%d/%m/%Y') AS Fecha,
        insp.Resultado AS estado
      FROM Inspeccion insp
      JOIN Inmueble i ON insp.IdInmueble = i.IdInmueble
      WHERE MONTH(insp.Fecha) = MONTH(CURRENT_DATE()) AND YEAR(insp.Fecha) = YEAR(CURRENT_DATE())
    `);
    res.json(servicios);
  } catch (error) {
    console.error('Error en /api/servicios/mes:', error);
    res.status(500).json({ error: error.message });
  }
});

// 4. SERVICIOS POR VENCER (PRÓXIMOS 30 DÍAS)
app.get('/api/servicios/vencimientos', async (req, res) => {
  try {
    const [vencimientos] = await db.query(`
      SELECT 
        i.IdInmueble,
        i.Nombre AS inmuebleNombre,
        i.Domicilio,
        i.Actividad,
        insp.Observaciones AS tipoServicio,
        DATE_FORMAT(insp.Fecha, '%d/%m/%Y') AS Fecha,
        DATEDIFF(insp.Fecha, CURRENT_DATE()) AS diasRestantes
      FROM Inspeccion insp
      JOIN Inmueble i ON insp.IdInmueble = i.IdInmueble
      WHERE insp.Fecha >= CURRENT_DATE()
    `);
    res.json(vencimientos);
  } catch (error) {
    console.error('Error en /api/servicios/vencimientos:', error);
    res.status(500).json({ error: error.message });
  }
});

// 5. EXPEDIENTE COMPLETO DEL INMUEBLE (FICHA)
app.get('/api/inmuebles/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [inmuebles] = await db.query(`
      SELECT 
        i.*,
        u.Nombre AS nombrePropietario,
        u.Apellido AS apellidoPropietario
      FROM Inmueble i
      LEFT JOIN Propietario p ON i.IdPropietario = p.IdPropietario
      LEFT JOIN Usuarios u ON p.IdUsu = u.IdUsu
      WHERE i.IdInmueble = ?
    `, [id]);

    if (inmuebles.length === 0) {
      return res.status(404).json({ mensaje: 'Inmueble no encontrado' });
    }

    const [inspecciones] = await db.query(`
      SELECT 
        IdInspeccion,
        DATE_FORMAT(Fecha, '%d/%m/%Y') AS fechaFormat,
        Resultado,
        Observaciones
      FROM Inspeccion
      WHERE IdInmueble = ?
      ORDER BY Fecha DESC
    `, [id]);

    res.json({
      ...inmuebles[0],
      inspecciones: inspecciones
    });
  } catch (error) {
    console.error('Error en /api/inmuebles/:id:', error);
    res.status(500).json({ error: error.message });
  }
});

// 6. GUARDAR NUEVA INSPECCIÓN
app.post('/api/inspecciones', async (req, res) => {
  const { idInmueble, idConservador, fecha, resultado, observaciones } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO Inspeccion (IdInmueble, IdConservador, Fecha, Resultado, Observaciones) VALUES (?, ?, ?, ?, ?)',
      [idInmueble, idConservador || 1, fecha, resultado, observaciones]
    );

    res.json({ 
      mensaje: 'Inspección guardada correctamente', 
      idInspeccion: result.insertId 
    });
  } catch (error) {
    console.error('Error en POST /api/inspecciones:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});
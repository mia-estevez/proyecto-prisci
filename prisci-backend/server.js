const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt'); // Si usás bcrypt para las contraseñas
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// 1. MÉTRICAS DEL DASHBOARD DEL CONSERVADOR
app.get('/api/conservador/:id/resumen', async (req, res) => {
  const { id } = req.params;
  try {
    const [[{ totalInmuebles }]] = await db.query(
      'SELECT COUNT(DISTINCT IdInmueble) AS totalInmuebles FROM Inspeccion WHERE IdConservador = ?',
      [id]
    );

    const [[{ totalClientes }]] = await db.query(
      `SELECT COUNT(DISTINCT i.IdPropietario) AS totalClientes
       FROM Inspeccion insp
       JOIN Inmueble i ON insp.IdInmueble = i.IdInmueble
       WHERE insp.IdConservador = ?`,
      [id]
    );

    const [[{ serviciosMes }]] = await db.query(
      `SELECT COUNT(*) AS serviciosMes
       FROM Inspeccion
       WHERE IdConservador = ? AND MONTH(Fecha) = MONTH(CURRENT_DATE()) AND YEAR(Fecha) = YEAR(CURRENT_DATE())`,
      [id]
    );

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

// Ejemplo del Endpoint en Node.js / Express
app.get('/api/conservador/:id/inmuebles', async (req, res) => {
  const { id } = req.params;
  try {
    const query = `
      SELECT 
        i.IdInmueble,
        i.Nombre,
        i.Domicilio,
        i.Actividad,
        i.Latitud,
        i.Longitud,
        p.Nombre AS nombrePropietario
      FROM inmuebles i
      INNER JOIN conservador_inmuebles ci ON i.IdInmueble = ci.IdInmueble
      LEFT JOIN propietarios p ON i.IdPropietario = p.IdPropietario
      WHERE ci.IdConservador = ?
    `;
    const [rows] = await db.execute(query, [id]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener inmuebles" });
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

// 6. REGISTRAR NUEVA INSPECCIÓN
app.post('/api/inspecciones', async (req, res) => {
  const { idInmueble, idConservador, fecha, resultado, observaciones } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO Inspeccion (IdInmueble, IdConservador, Fecha, Resultado, Observaciones) VALUES (?, ?, ?, ?, ?)',
      [idInmueble, idConservador || 1, fecha, resultado, observaciones]
    );

    res.status(201).json({ 
      mensaje: 'Inspección guardada correctamente', 
      idInspeccion: result.insertId 
    });
  } catch (error) {
    console.error('Error en POST /api/inspecciones:', error);
    res.status(500).json({ error: error.message });
  }
});

// 7. INICIAR SESIÓN
app.post('/api/login', async (req, res) => {
  const { email, contrasena } = req.body;

  if (!email || !contrasena) {
    return res.status(400).json({ mensaje: 'Ingresá tu correo y contraseña' });
  }

  try {
    const [usuarios] = await db.query(`
      SELECT IdUsu, Nombre, Apellido, Email, Contrasena, IdRol
      FROM Usuarios
      WHERE Email = ?
    `, [email]);

    if (usuarios.length === 0) {
      return res.status(401).json({ mensaje: 'Correo o contraseña incorrectos' });
    }

    const usuario = usuarios[0];
    const contrasenaValida = await bcrypt.compare(contrasena, usuario.Contrasena);

    if (!contrasenaValida) {
      return res.status(401).json({ mensaje: 'Correo o contraseña incorrectos' });
    }

    res.json({
      mensaje: 'Inicio de sesión exitoso',
      usuario: {
        id: usuario.IdUsu,
        nombre: usuario.Nombre,
        apellido: usuario.Apellido,
        email: usuario.Email,
        idRol: usuario.IdRol
      }
    });
  } catch (error) {
    console.error('Error en el login:', error);
    res.status(500).json({ mensaje: 'Error al iniciar sesión' });
  }
});

// 8. REGISTRAR USUARIO DE PRUEBA
app.post('/api/registro-prueba', async (req, res) => {
  const { nombre, apellido, dni, email, contrasena, telefono } = req.body;

  if (!nombre || !apellido || !dni || !email || !contrasena) {
    return res.status(400).json({ mensaje: 'Completá todos los campos obligatorios' });
  }

  try {
    const [existentes] = await db.query('SELECT IdUsu FROM Usuarios WHERE Email = ?', [email]);

    if (existentes.length > 0) {
      return res.status(409).json({ mensaje: 'Ese correo ya está registrado' });
    }

    const hash = await bcrypt.hash(contrasena, 10);

    const [resultado] = await db.query(`
      INSERT INTO Usuarios (Nombre, Apellido, Dni, Email, Contrasena, Telefono, IdRol)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [nombre, apellido, dni, email, hash, telefono || null, 1]);

    res.status(201).json({
      mensaje: 'Usuario creado correctamente',
      idUsuario: resultado.insertId
    });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ mensaje: 'Error al registrar el usuario' });
  }
});

// PUERTO Y ARRANQUE
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});

const express = require('express');
const cors = require('cors');
const db = require('./db');
const bcrypt = require('bcrypt');

const app = express();

app.use(cors());
app.use(express.json());

// OBTENER TODOS LOS INMUEBLES
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
    res.status(500).json({
      mensaje: 'Error al obtener inmuebles'
    });
  }
});

// OBTENER DETALLE DE UN INMUEBLE Y SUS INSPECCIONES
app.get('/api/inmuebles/:id', async (req, res) => {
  const { id } = req.params;

  try {
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
      return res.status(404).json({
        mensaje: 'Inmueble no encontrado'
      });
    }

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

    res.json({
      ...inmuebles[0],
      inspecciones
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensaje: 'Error al obtener detalle del inmueble'
    });
  }
});

// REGISTRAR UNA NUEVA INSPECCIÓN
app.post('/api/inspecciones', async (req, res) => {
  const {
    fecha,
    resultado,
    observaciones,
    idInmueble,
    idConservador
  } = req.body;

  try {
    const [result] = await db.query(`
      INSERT INTO Inspeccion
        (Fecha, Resultado, Observaciones, IdInmueble, IdConservador)
      VALUES (?, ?, ?, ?, ?)
    `, [
      fecha,
      resultado,
      observaciones,
      idInmueble,
      idConservador
    ]);

    res.status(201).json({
      mensaje: 'Inspección registrada con éxito',
      idInspeccion: result.insertId
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensaje: 'Error al guardar la inspección'
    });
  }
});

// INICIAR SESIÓN
app.post('/api/login', async (req, res) => {
  const { email, contrasena } = req.body;

  if (!email || !contrasena) {
    return res.status(400).json({
      mensaje: 'Ingresá tu correo y contraseña'
    });
  }

  try {
    const [usuarios] = await db.query(`
      SELECT IdUsu, Nombre, Apellido, Email, Contrasena, IdRol
      FROM Usuarios
      WHERE Email = ?
    `, [email]);

    if (usuarios.length === 0) {
      return res.status(401).json({
        mensaje: 'Correo o contraseña incorrectos'
      });
    }

    const usuario = usuarios[0];

    const contrasenaValida = await bcrypt.compare(
      contrasena,
      usuario.Contrasena
    );

    if (!contrasenaValida) {
      return res.status(401).json({
        mensaje: 'Correo o contraseña incorrectos'
      });
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

    res.status(500).json({
      mensaje: 'Error al iniciar sesión'
    });
  }
});

// REGISTRAR USUARIO DE PRUEBA
app.post('/api/registro-prueba', async (req, res) => {
  const {
    nombre,
    apellido,
    dni,
    email,
    contrasena,
    telefono
  } = req.body;

  if (!nombre || !apellido || !dni || !email || !contrasena) {
    return res.status(400).json({
      mensaje: 'Completá todos los campos obligatorios'
    });
  }

  try {
    const [existentes] = await db.query(
      'SELECT IdUsu FROM Usuarios WHERE Email = ?',
      [email]
    );

    if (existentes.length > 0) {
      return res.status(409).json({
        mensaje: 'Ese correo ya está registrado'
      });
    }

    const hash = await bcrypt.hash(contrasena, 10);

    const [resultado] = await db.query(`
      INSERT INTO Usuarios
        (Nombre, Apellido, Dni, Email, Contrasena, Telefono, IdRol)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
      nombre,
      apellido,
      dni,
      email,
      hash,
      telefono || null,
      1
    ]);

    res.status(201).json({
      mensaje: 'Usuario municipal creado correctamente',
      idUsuario: resultado.insertId
    });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({
      mensaje: 'Error al registrar el usuario'
    });
  }
});

// INICIAR SERVIDOR
const PORT = 3001;

app.listen(PORT, () => {
  console.log(
    `Servidor backend corriendo en http://localhost:${PORT}`
  );
});


const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const db = require('./db');

const app = express();

app.use(cors());
app.use(express.json());

// ======================================================
// FUNCIONES AUXILIARES
// ======================================================

// Comprueba que el inmueble exista.
async function existeInmueble(id) {
  const [filas] = await db.query(
    'SELECT IdInmueble FROM Inmueble WHERE IdInmueble = ?',
    [id]
  );

  return filas.length > 0;
}

// Crea las instalaciones iniciales si todavía no existen.
// No modifica las instalaciones que ya fueron guardadas.
async function inicializarInstalaciones(idInmueble) {
  const instalacionesIniciales = [
    {
      nombre: 'Extintores',
      estado: 'Vigente',
      vencimiento: '2026-12-15'
    },
    {
      nombre: 'Hidrantes',
      estado: 'Pendiente de revisión',
      vencimiento: null
    },
    {
      nombre: 'Detectores de humo',
      estado: 'Vigente',
      vencimiento: '2027-02-10'
    },
    {
      nombre: 'Señalización de emergencia',
      estado: 'Vigente',
      vencimiento: null
    }
  ];

  for (const instalacion of instalacionesIniciales) {
    const [existentes] = await db.query(
      `SELECT IdInstalacion
       FROM InstalacionInmueble
       WHERE IdInmueble = ? AND Nombre = ?
       LIMIT 1`,
      [idInmueble, instalacion.nombre]
    );

    if (existentes.length === 0) {
      await db.query(
        `INSERT INTO InstalacionInmueble
         (IdInmueble, Nombre, Estado, Vencimiento)
         VALUES (?, ?, ?, ?)`,
        [
          idInmueble,
          instalacion.nombre,
          instalacion.estado,
          instalacion.vencimiento
        ]
      );
    }
  }
}

// ======================================================
// 1. MÉTRICAS DEL DASHBOARD DEL CONSERVADOR
// ======================================================

app.get('/api/conservador/:id/resumen', async (req, res) => {
  const { id } = req.params;

  try {
    const [[{ totalInmuebles }]] = await db.query(
      `SELECT COUNT(DISTINCT IdInmueble) AS totalInmuebles
       FROM Inspeccion
       WHERE IdConservador = ?`,
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
       WHERE IdConservador = ?
       AND MONTH(Fecha) = MONTH(CURRENT_DATE())
       AND YEAR(Fecha) = YEAR(CURRENT_DATE())`,
      [id]
    );

    const [[{ vencimientos }]] = await db.query(
      `SELECT COUNT(*) AS vencimientos
       FROM Inspeccion
       WHERE IdConservador = ?
       AND Fecha >= CURRENT_DATE()
       AND Fecha <= DATE_ADD(CURRENT_DATE(), INTERVAL 30 DAY)`,
      [id]
    );

    res.json({
      inmuebles: totalInmuebles || 0,
      clientes: totalClientes || 0,
      servicios: serviciosMes || 0,
      vencimientos: vencimientos || 0
    });
  } catch (error) {
    console.error('Error al obtener el resumen:', error);
    res.status(500).json({
      mensaje: 'Error al obtener las métricas del conservador'
    });
  }
});

// ======================================================
// 2. INMUEBLES ASIGNADOS AL CONSERVADOR
// ======================================================

app.get('/api/conservador/:id/inmuebles', async (req, res) => {
  const { id } = req.params;

  try {
    const [inmuebles] = await db.query(
      `SELECT DISTINCT
         i.IdInmueble AS id,
         i.Nombre AS nombre,
         i.Domicilio AS direccion,
         i.Actividad AS tipoInmueble,
         i.Superficie AS superficie,
         i.CantMatafuego AS cantidadMatafuegos,
         i.RedAgua AS redAgua,
         i.EstadoSistema AS estadoSistema,
         i.IdPropietario AS idPropietario,
         -38.9516 AS latitud,
         -68.0591 AS longitud
       FROM Inspeccion insp
       JOIN Inmueble i ON insp.IdInmueble = i.IdInmueble
       WHERE insp.IdConservador = ?`,
      [id]
    );

    res.json(inmuebles);
  } catch (error) {
    console.error('Error al obtener inmuebles del conservador:', error);
    res.status(500).json({
      mensaje: 'Error al obtener los inmuebles asignados'
    });
  }
});

// ======================================================
// 3. SERVICIOS DE ESTE MES
// ======================================================

app.get('/api/servicios/mes', async (req, res) => {
  try {
    const [servicios] = await db.query(
      `SELECT
         i.IdInmueble,
         i.Nombre AS inmuebleNombre,
         i.Domicilio,
         i.Actividad,
         insp.Resultado AS tipoServicio,
         DATE_FORMAT(insp.Fecha, '%d/%m/%Y') AS Fecha,
         insp.Resultado AS estado
       FROM Inspeccion insp
       JOIN Inmueble i ON insp.IdInmueble = i.IdInmueble
       WHERE MONTH(insp.Fecha) = MONTH(CURRENT_DATE())
       AND YEAR(insp.Fecha) = YEAR(CURRENT_DATE())`
    );

    res.json(servicios);
  } catch (error) {
    console.error('Error al obtener servicios del mes:', error);
    res.status(500).json({
      mensaje: 'Error al obtener los servicios'
    });
  }
});

// ======================================================
// 4. SERVICIOS POR VENCER
// ======================================================

app.get('/api/servicios/vencimientos', async (req, res) => {
  try {
    const [vencimientos] = await db.query(
      `SELECT
         i.IdInmueble,
         i.Nombre AS inmuebleNombre,
         i.Domicilio,
         i.Actividad,
         insp.Observaciones AS tipoServicio,
         DATE_FORMAT(insp.Fecha, '%d/%m/%Y') AS Fecha,
         DATEDIFF(insp.Fecha, CURRENT_DATE()) AS diasRestantes
       FROM Inspeccion insp
       JOIN Inmueble i ON insp.IdInmueble = i.IdInmueble
       WHERE insp.Fecha >= CURRENT_DATE()`
    );

    res.json(vencimientos);
  } catch (error) {
    console.error('Error al obtener vencimientos:', error);
    res.status(500).json({
      mensaje: 'Error al obtener los vencimientos'
    });
  }
});

// ======================================================
// 5. EXPEDIENTE COMPLETO DEL INMUEBLE
// ======================================================

app.get('/api/inmuebles/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [inmuebles] = await db.query(
      `SELECT
         i.*,
         u.Nombre AS nombrePropietario,
         u.Apellido AS apellidoPropietario
       FROM Inmueble i
       LEFT JOIN Propietario p
         ON i.IdPropietario = p.IdPropietario
       LEFT JOIN Usuarios u
         ON p.IdUsu = u.IdUsu
       WHERE i.IdInmueble = ?`,
      [id]
    );

    if (inmuebles.length === 0) {
      return res.status(404).json({
        mensaje: 'Inmueble no encontrado'
      });
    }

    const [inspecciones] = await db.query(
      `SELECT
         IdInspeccion,
         DATE_FORMAT(Fecha, '%d/%m/%Y') AS fechaFormat,
         Resultado,
         Observaciones
       FROM Inspeccion
       WHERE IdInmueble = ?
       ORDER BY Fecha DESC`,
      [id]
    );

    res.json({
      ...inmuebles[0],
      inspecciones
    });
  } catch (error) {
    console.error('Error al obtener el expediente:', error);
    res.status(500).json({
      mensaje: 'Error al obtener el expediente del inmueble'
    });
  }
});

app.get('/api/inmuebles/:id/inspecciones', async (req, res) => {
  const { id } = req.params;

  try {
    const [inspecciones] = await db.query(
      `SELECT
         IdInspeccion,
         DATE_FORMAT(Fecha, '%Y-%m-%d') AS Fecha,
         Resultado,
         Observaciones,
         IdInmueble,
         IdConservador
       FROM Inspeccion
       WHERE IdInmueble = ?
       ORDER BY Fecha DESC, IdInspeccion DESC`,
      [id]
    );

    res.json(inspecciones);
  } catch (error) {
    console.error('Error al consultar las inspecciones:', error);

    res.status(500).json({
      mensaje: 'No se pudo cargar el historial de inspecciones'
    });
  }
});


// ======================================================
// 5.1. OBTENER INSTALACIONES TÉCNICAS
// ======================================================

app.get('/api/inmuebles/:id/instalaciones', async (req, res) => {
  const { id } = req.params;

  try {
    if (!(await existeInmueble(id))) {
      return res.status(404).json({
        mensaje: 'Inmueble no encontrado'
      });
    }

    // Cargar instalaciones iniciales si aún no existen.
    await inicializarInstalaciones(id);

    const [instalaciones] = await db.query(
      `SELECT
         IdInstalacion,
         IdInmueble,
         Nombre,
         Estado,
         DATE_FORMAT(Vencimiento, '%Y-%m-%d') AS Vencimiento
       FROM InstalacionInmueble
       WHERE IdInmueble = ?
       ORDER BY IdInstalacion`,
      [id]
    );

    res.json(instalaciones);
  } catch (error) {
    console.error('Error al obtener instalaciones:', error);
    res.status(500).json({
      mensaje: 'Error al obtener las instalaciones'
    });
  }
});

// ======================================================
// 5.2. GUARDAR MODIFICACIONES DE LAS INSTALACIONES
// ======================================================

app.put('/api/inmuebles/:id/instalaciones', async (req, res) => {
  const { id } = req.params;
  const { instalaciones } = req.body;

  if (!Array.isArray(instalaciones)) {
    return res.status(400).json({
      mensaje: 'La lista de instalaciones no es válida'
    });
  }

  const estadosPermitidos = [
    'Vigente',
    'Pendiente de revisión',
    'Vencido',
    'No aplica'
  ];

  for (const instalacion of instalaciones) {
    if (
      !Number.isInteger(Number(instalacion.IdInstalacion)) ||
      !instalacion.Nombre ||
      !estadosPermitidos.includes(instalacion.Estado) ||
      (
        instalacion.Vencimiento !== null &&
        instalacion.Vencimiento !== '' &&
        !/^\d{4}-\d{2}-\d{2}$/.test(instalacion.Vencimiento)
      )
    ) {
      return res.status(400).json({
        mensaje: 'Una o más instalaciones tienen datos inválidos'
      });
    }
  }

  const conexion = await db.getConnection();

  try {
    if (!(await existeInmueble(id))) {
      conexion.release();

      return res.status(404).json({
        mensaje: 'Inmueble no encontrado'
      });
    }

    await conexion.beginTransaction();

    for (const instalacion of instalaciones) {
      const [resultado] = await conexion.query(
        `UPDATE InstalacionInmueble
         SET Estado = ?, Vencimiento = ?
         WHERE IdInstalacion = ? AND IdInmueble = ? AND Nombre = ?`,
        [
          instalacion.Estado,
          instalacion.Vencimiento || null,
          instalacion.IdInstalacion,
          id,
          instalacion.Nombre
        ]
      );

      if (resultado.affectedRows === 0) {
        const [coincidencias] = await conexion.query(
          `SELECT IdInstalacion
           FROM InstalacionInmueble
           WHERE IdInstalacion = ? AND IdInmueble = ? AND Nombre = ?`,
          [instalacion.IdInstalacion, id, instalacion.Nombre]
        );

        if (coincidencias.length === 0) {
          throw new Error(
            `La instalación "${instalacion.Nombre}" no pertenece al inmueble indicado`
          );
        }
      }
    }

    await conexion.commit();

    const [actualizadas] = await conexion.query(
      `SELECT
         IdInstalacion,
         IdInmueble,
         Nombre,
         Estado,
         DATE_FORMAT(Vencimiento, '%Y-%m-%d') AS Vencimiento
       FROM InstalacionInmueble
       WHERE IdInmueble = ?
       ORDER BY IdInstalacion`,
      [id]
    );

    res.json({
      mensaje: 'Instalaciones guardadas correctamente',
      instalaciones: actualizadas
    });
  } catch (error) {
    await conexion.rollback();

    console.error('Error al guardar instalaciones:', error);

    res.status(500).json({
      mensaje: 'Error al guardar las instalaciones'
    });
  } finally {
    conexion.release();
  }
});

// ======================================================
// 5.3. OBTENER OBSERVACIONES DE LA FICHA
// ======================================================

app.get('/api/inmuebles/:id/observaciones', async (req, res) => {
  const { id } = req.params;

  try {
    if (!(await existeInmueble(id))) {
      return res.status(404).json({
        mensaje: 'Inmueble no encontrado'
      });
    }

    const [filas] = await db.query(
      `SELECT Observaciones, FechaActualizacion
       FROM ObservacionesFicha
       WHERE IdInmueble = ?`,
      [id]
    );

    res.json({
      observaciones: filas.length > 0
        ? filas[0].Observaciones || ''
        : '',
      fechaActualizacion: filas.length > 0
        ? filas[0].FechaActualizacion
        : null
    });
  } catch (error) {
    console.error('Error al obtener observaciones:', error);
    res.status(500).json({
      mensaje: 'Error al obtener las observaciones'
    });
  }
});

// ======================================================
// 5.4. GUARDAR OBSERVACIONES DE LA FICHA
// ======================================================

app.put('/api/inmuebles/:id/observaciones', async (req, res) => {
  const { id } = req.params;
  const { observaciones } = req.body;

  if (
    typeof observaciones !== 'string' ||
    observaciones.length > 10000
  ) {
    return res.status(400).json({
      mensaje: 'Las observaciones no son válidas'
    });
  }

  try {
    if (!(await existeInmueble(id))) {
      return res.status(404).json({
        mensaje: 'Inmueble no encontrado'
      });
    }

    await db.query(
      `INSERT INTO ObservacionesFicha (IdInmueble, Observaciones)
       VALUES (?, ?)
       ON DUPLICATE KEY UPDATE Observaciones = VALUES(Observaciones)`,
      [id, observaciones]
    );

    res.json({
      mensaje: 'Observaciones guardadas correctamente'
    });
  } catch (error) {
    console.error('Error al guardar observaciones:', error);
    res.status(500).json({
      mensaje: 'Error al guardar las observaciones'
    });
  }
});

// ======================================================
// 6. REGISTRAR NUEVA INSPECCIÓN
// ======================================================

app.post('/api/inspecciones', async (req, res) => {
  const {
    idInmueble,
    idConservador,
    fecha,
    resultado,
    observaciones
  } = req.body;

  if (!idInmueble || !fecha || !resultado) {
    return res.status(400).json({
      mensaje: 'El inmueble, la fecha y el resultado son obligatorios'
    });
  }

  try {
    const [result] = await db.query(
      `INSERT INTO Inspeccion
       (IdInmueble, IdConservador, Fecha, Resultado, Observaciones)
       VALUES (?, ?, ?, ?, ?)`,
      [
        idInmueble,
        idConservador || 1,
        fecha,
        resultado,
        observaciones || null
      ]
    );

    res.status(201).json({
      mensaje: 'Inspección guardada correctamente',
      idInspeccion: result.insertId
    });
  } catch (error) {
    console.error('Error al registrar inspección:', error);
    res.status(500).json({
      mensaje: 'Error al registrar la inspección'
    });
  }
});

// ======================================================
// 7. INICIAR SESIÓN
// ======================================================

app.post('/api/login', async (req, res) => {
  const { email, contrasena } = req.body;

  try {
    // Consulta utilizando el pool de promesas configurado en db.js
    const [results] = await db.query(
      `SELECT u.*, r.Nombre as RolNombre 
       FROM usuarios u 
       JOIN rol r ON u.IdRol = r.IdRol 
       WHERE u.Email = ?`,
      [email]
    );

    if (results.length === 0) {
      return res.status(401).json({ mensaje: 'Correo o contraseña incorrectos' });
    }

    const usuario = results[0];

    // Validación flexible (texto plano o hash bcrypt)
    let passwordMatch = false;
    if (usuario.Contrasena && usuario.Contrasena.startsWith('$2b$')) {
      passwordMatch = await bcrypt.compare(contrasena, usuario.Contrasena);
    } else {
      passwordMatch = (usuario.Contrasena === contrasena);
    }

    if (!passwordMatch) {
      return res.status(401).json({ mensaje: 'Correo o contraseña incorrectos' });
    }

    res.json({
      mensaje: 'Login exitoso',
      usuario: {
        id: usuario.IdUsu,
        nombre: usuario.Nombre,
        apellido: usuario.Apellido,
        email: usuario.Email,
        rol: usuario.RolNombre
      }
    });

  } catch (err) {
    console.error("Error en el servidor:", err);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
});

// ======================================================
// 8. REGISTRAR USUARIO DE PRUEBA
// ======================================================

app.post('/api/registro-prueba', async (req, res) => {
  const {
    nombre,
    apellido,
    dni,
    email,
    contrasena,
    telefono,
    idRol
  } = req.body;

  if (!nombre || !apellido || !dni || !email || !contrasena || !idRol) {
    return res.status(400).json({
      mensaje: 'Completá todos los campos obligatorios'
    });
  }

  if (![1, 2, 3, 4].includes(Number(idRol))) {
    return res.status(400).json({
      mensaje: 'El rol indicado no es válido'
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

    const [resultado] = await db.query(
      `INSERT INTO Usuarios
       (Nombre, Apellido, Dni, Email, Contrasena, Telefono, IdRol)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        nombre,
        apellido,
        dni,
        email,
        hash,
        telefono || null,
        Number(idRol)
      ]
    );

    res.status(201).json({
      mensaje: 'Usuario creado correctamente',
      idUsuario: resultado.insertId
    });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({
      mensaje: 'Error al registrar el usuario'
    });
  }
});


/* ======================================================
  SOLICITUDES DE REGISTRO
====================================================== */
// ------------------------------------------------------
// ENVIAR UNA SOLICITUD DE REGISTRO
// ------------------------------------------------------

app.post('/api/solicitudes-registro', async (req, res) => {
  const {
    nombre,
    apellido,
    telefono,
    email,
    motivo,
    rol
  } = req.body;

  // Validar que todos los campos estén completos.
  if (
    !nombre?.trim() ||
    !apellido?.trim() ||
    !telefono?.trim() ||
    !email?.trim() ||
    !motivo?.trim() ||
    !rol
  ) {
    return res.status(400).json({
      mensaje: 'Completá todos los campos obligatorios'
    });
  }

  // Validar los roles permitidos para solicitar el registro.
  const rolesPermitidos = [
    'profesional',
    'propietario',
    'bomberos'
  ];

  if (!rolesPermitidos.includes(rol)) {
    return res.status(400).json({
      mensaje: 'El rol solicitado no es válido'
    });
  }

  // Validar el formato básico del correo.
  const emailNormalizado = email.trim().toLowerCase();
  const formatoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!formatoEmail.test(emailNormalizado)) {
    return res.status(400).json({
      mensaje: 'Ingresá un correo electrónico válido'
    });
  }

  try {
    const [resultado] = await db.query(
      `INSERT INTO solicitudregistro
       (Nombre, Apellido, Telefono, Email, Motivo, RolSolicitado)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        nombre.trim(),
        apellido.trim(),
        telefono.trim(),
        emailNormalizado,
        motivo.trim(),
        rol
      ]
    );

    return res.status(201).json({
      mensaje: 'Solicitud enviada correctamente',
      idSolicitud: resultado.insertId
    });

  } catch (error) {
    console.error('Error al guardar la solicitud:', error);

    return res.status(500).json({
      mensaje: 'No se pudo enviar la solicitud. Intentá nuevamente.'
    });
  }
});


// ------------------------------------------------------
// CONSULTAR LAS SOLICITUDES DE REGISTRO
// ------------------------------------------------------

app.get('/api/solicitudes-registro', async (req, res) => {
  try {
    const [solicitudes] = await db.query(
      `SELECT
         IdSolicitudRegistro,
         Nombre,
         Apellido,
         Telefono,
         Email,
         Motivo,
         RolSolicitado,
         Estado,
         DATE_FORMAT(FechaSolicitud, '%d/%m/%Y %H:%i')
           AS FechaSolicitud
       FROM solicitudregistro
       ORDER BY FechaSolicitud DESC`
    );

    return res.json(solicitudes);

  } catch (error) {
    console.error('Error al consultar las solicitudes:', error);

    return res.status(500).json({
      mensaje: 'No se pudieron obtener las solicitudes'
    });
  }
});


// ------------------------------------------------------
//  ACTUALIZAR EL ESTADO DE UNA SOLICITUD
// ------------------------------------------------------

app.patch('/api/solicitudes-registro/:id/estado', async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;

  const estadosPermitidos = [
    'Pendiente',
    'Aceptada',
    'Rechazada'
  ];

  if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
    return res.status(400).json({
      mensaje: 'El identificador de la solicitud no es válido'
    });
  }

  if (!estadosPermitidos.includes(estado)) {
    return res.status(400).json({
      mensaje: 'El estado indicado no es válido'
    });
  }

  try {
    const [resultado] = await db.query(
      `UPDATE solicitudregistro
       SET Estado = ?
       WHERE IdSolicitudRegistro = ?`,
      [estado, Number(id)]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        mensaje: 'No se encontró la solicitud'
      });
    }

    return res.json({
      mensaje: 'Estado de la solicitud actualizado correctamente'
    });

  } catch (error) {
    console.error('Error al actualizar la solicitud:', error);

    return res.status(500).json({
      mensaje: 'No se pudo actualizar el estado de la solicitud'
    });
  }
});


app.get('/api/prueba', (req, res) => {
  res.json({ mensaje: 'El servidor actualizado funciona' });
});

// ======================================================
// INICIAR SERVIDOR
// ======================================================

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});

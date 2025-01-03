const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Asegurarte de que el directorio 'uploads/' exista
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Configurar Multer para manejar la carga de archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);  // Usar la ruta correcta para la carpeta de subida
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);  // Nombre único para cada archivo
  },
});
const upload = multer({ storage });

// Middleware
const corsOptions = {
  origin: 'https://alcaidiarafaela.github.io/SistemaConteoDigital/', // Aquí debes poner la URL de tu sitio público
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type'],
  preflightContinue: false,
  optionsSuccessStatus: 200,
  credentials: true, // Esto es necesario si también necesitas permitir cookies
  // Añadimos el encabezado necesario para permitir solicitudes a redes privadas
  onHeaders: (headers) => {
    headers['Access-Control-Allow-Private-Network'] = 'true';
  }
};

// Usar CORS con las opciones configuradas
app.use(cors(corsOptions));
app.use(express.json());
app.use('/uploads', express.static('uploads'));  // Sirve los archivos estáticos en /uploads

// Configurar la conexión a la base de datos
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Endpoint para agregar un nuevo interno
app.post('/internos', upload.single('foto'), async (req, res) => {
  const { nombre, dni, fechaIngreso, prontuario, causa, situacionProcesal, fechaEgreso, registrarHuella } = req.body;
  const foto = req.file ? req.file.path.replace(/\\/g, '/') : null; // Asegurarse de que sea una ruta de URL válida

  try {
    const result = await pool.query(
      'INSERT INTO internos (nombre, dni, fecha_ingreso, prontuario, causa, situacion_procesal, foto, fecha_egreso, registrar_huella) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
      [nombre, dni, fechaIngreso, prontuario, causa, situacionProcesal, foto, fechaEgreso, registrarHuella]
    );
    res.status(201).json({ message: 'Interno agregado', result });
  } catch (error) {
    console.error('Error al agregar interno:', error);
    res.status(500).json({ error: 'Error al agregar interno' });
  }
});

// Endpoint para obtener todos los internos
app.get('/internos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM internos');
    const internos = result.rows.map(interno => ({
      ...interno,
      foto: interno.foto.replace(/\\/g, '/') // Asegúrate de que la foto tenga la ruta correcta
    }));
    res.status(200).json(internos);
  } catch (error) {
    console.error('Error al obtener internos:', error);
    res.status(500).json({ error: 'Error al obtener internos' });
  }
});

// Endpoint para obtener la lista de egresos
app.get('/egresos', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT e.id, i.nombre AS usuario, e.motivo, e.fecha_egreso FROM egresos e JOIN internos i ON e.interno_id = i.id'
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error al obtener egresos:', error);
    res.status(500).json({ error: 'Error al obtener egresos' });
  }
});

// Endpoint para eliminar un interno por ID
app.delete('/internos/:id', async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: 'Falta el parámetro "id"' });
  }

  try {
    // Eliminar el interno de la base de datos usando el ID
    const resultEliminar = await pool.query('DELETE FROM internos WHERE id = $1', [id]);

    if (resultEliminar.rowCount > 0) {
      return res.status(200).json({ message: `Interno con ID ${id} eliminado correctamente` });
    } else {
      return res.status(404).json({ message: `No se encontró al interno con ID ${id}` });
    }
  } catch (error) {
    console.error('Error al eliminar el interno:', error);
    return res.status(500).json({ message: 'Error al eliminar el interno' });
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});


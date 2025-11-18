// src/index.js

// Importe las dependencias principales
const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Importe nuestras rutas
const librosRouter = require('./routes/libros.routes');
const autoresRouter = require('./routes/autores.routes');

// Aqui se hace el app de Express
const app = express();

// Middleware para que Express entienda JSON
app.use(express.json());

// Middleware CORS para permitir peticiones desde el frontend (otro puerto)
app.use(cors());

// Rutas base para el API
//  GET http://localhost:3000/api/libros
app.use('/api/libros', librosRouter);
//  GET http://localhost:3000/api/autores
app.use('/api/autores', autoresRouter);

// Lee el puerto desde las variables de entorno o usamos 3000 por defecto
const PORT = process.env.PORT || 3000;

// Iniciamos el servidor obviamente con npm run dev
app.listen(PORT, () => {
  console.log(`✅ Servidor backend escuchando en http://localhost:${PORT}`);
});

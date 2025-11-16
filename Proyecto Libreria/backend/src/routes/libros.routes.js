// src/routes/libros.routes.js

const express = require('express');
const router = express.Router();

// Importamos la función query para hablar con la BD
const { query } = require('../db');

// Ruta: GET /api/libros
// Obtiene todos los libros con su autor
router.get('/', async (req, res) => {
  try {
    // Query con JOIN para traer también nombre del autor
    const sql = `
      SELECT 
        l.id_libro,
        l.titulo,
        l.paginas,
        l.fecha_publicacion,
        l.editorial,
        a.nombre AS nombre_autor,
        a.apellidos AS apellidos_autor
      FROM Libros l
      INNER JOIN Autores a ON l.id_autor = a.id_autor
    `;

    const rows = await query(sql);

    // Enviamos el resultado como JSON
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error al obtener libros:', error);
    res.status(500).json({ message: 'Error al obtener libros' });
  }
});

// Ruta: GET /api/libros/:id
// Obtiene un libro específico por su ID
router.get('/:id', async (req, res) => {
  try {
    const idLibro = req.params.id; // leemos el parámetro de la URL

    const sql = `
      SELECT 
        l.id_libro,
        l.titulo,
        l.paginas,
        l.fecha_publicacion,
        l.editorial,
        a.nombre AS nombre_autor,
        a.apellidos AS apellidos_autor
      FROM Libros l
      INNER JOIN Autores a ON l.id_autor = a.id_autor
      WHERE l.id_libro = ?
    `;

    // Pasamos el idLibro como parámetro para el "?"
    const rows = await query(sql, [idLibro]);

    if (rows.length === 0) {
      // Si no hay filas, no se encontró el libro
      return res.status(404).json({ message: 'Libro no encontrado' });
    }

    // Devolvemos solo la primera fila
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Error al obtener libro por ID:', error);
    res.status(500).json({ message: 'Error al obtener libro' });
  }
});

// Exportamos el router para usarlo en index.js
module.exports = router;

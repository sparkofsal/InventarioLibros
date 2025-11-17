// src/routes/libros.routes.js

const express = require('express');
const router = express.Router();

// Importamos la función query para hablar con MySQL
const { query } = require('../db');

/**
 * GET /api/libros
 * Obtiene TODOS los libros con su autor
 */
router.get('/', async (req, res) => {
  try {
    const sql = `
      SELECT 
        l.id_libro,
        l.titulo,
        l.paginas,
        l.fecha_publicacion,
        l.editorial,
        a.nombre AS nombre_autor,
        a.apellidos AS apellidos_autor,
        l.id_autor
      FROM Libros l
      INNER JOIN Autores a ON l.id_autor = a.id_autor
      ORDER BY l.id_libro ASC
    `;

    const rows = await query(sql);

    res.status(200).json(rows);
  } catch (error) {
    console.error('Error al obtener libros:', error);
    res.status(500).json({ message: 'Error al obtener libros' });
  }
});

/**
 * GET /api/libros/:id
 * Obtiene un libro por ID
 */
router.get('/:id', async (req, res) => {
  try {
    const idLibro = req.params.id;

    const sql = `
      SELECT 
        l.id_libro,
        l.titulo,
        l.paginas,
        l.fecha_publicificacion,
        l.editorial,
        a.nombre AS nombre_autor,
        a.apellidos AS apellidos_autor,
        l.id_autor
      FROM Libros l
      INNER JOIN Autores a ON l.id_autor = a.id_autor
      WHERE l.id_libro = ?
    `;

    const rows = await query(sql, [idLibro]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Libro no encontrado' });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Error al obtener libro por ID:', error);
    res.status(500).json({ message: 'Error al obtener libro' });
  }
});

/**
 * POST /api/libros
 * Crea un nuevo libro
 * Espera en el body (JSON):
 * {
 *   "titulo": "...",
 *   "paginas": 123,
 *   "fecha_publicacion": "YYYY-MM-DD",
 *   "editorial": "...",
 *   "id_autor": 1
 * }
 */
router.post('/', async (req, res) => {
  try {
    const { titulo, paginas, fecha_publicacion, editorial, id_autor } = req.body;

    // Validación muy básica
    if (!titulo || !paginas || !fecha_publicacion || !editorial || !id_autor) {
      return res.status(400).json({
        message: 'Todos los campos son obligatorios: titulo, paginas, fecha_publicacion, editorial, id_autor'
      });
    }

    const sqlInsert = `
      INSERT INTO Libros (titulo, paginas, fecha_publicacion, editorial, id_autor)
      VALUES (?, ?, ?, ?, ?)
    `;

    // query devolverá un objeto OkPacket en este caso (insertId, affectedRows, etc.)
    const result = await query(sqlInsert, [
      titulo,
      paginas,
      fecha_publicacion,
      editorial,
      id_autor
    ]);

    const nuevoId = result.insertId;

    // Volvemos a consultar el libro creado para regresarlo completo con datos del autor
    const sqlSelect = `
      SELECT 
        l.id_libro,
        l.titulo,
        l.paginas,
        l.fecha_publicacion,
        l.editorial,
        a.nombre AS nombre_autor,
        a.apellidos AS apellidos_autor,
        l.id_autor
      FROM Libros l
      INNER JOIN Autores a ON l.id_autor = a.id_autor
      WHERE l.id_libro = ?
    `;

    const rows = await query(sqlSelect, [nuevoId]);

    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Error al crear libro:', error);
    res.status(500).json({ message: 'Error al crear libro' });
  }
});

/**
 * PUT /api/libros/:id
 * Actualiza un libro existente
 * Body JSON (mismos campos que POST)
 */
router.put('/:id', async (req, res) => {
  try {
    const idLibro = req.params.id;
    const { titulo, paginas, fecha_publicacion, editorial, id_autor } = req.body;

    if (!titulo || !paginas || !fecha_publicacion || !editorial || !id_autor) {
      return res.status(400).json({
        message: 'Todos los campos son obligatorios para actualizar el libro'
      });
    }

    const sqlUpdate = `
      UPDATE Libros
      SET titulo = ?, paginas = ?, fecha_publicacion = ?, editorial = ?, id_autor = ?
      WHERE id_libro = ?
    `;

    const result = await query(sqlUpdate, [
      titulo,
      paginas,
      fecha_publicacion,
      editorial,
      id_autor,
      idLibro
    ]);

    // Si no se afectó ninguna fila, el ID no existe
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Libro no encontrado para actualizar' });
    }

    // Consultamos el libro actualizado
    const sqlSelect = `
      SELECT 
        l.id_libro,
        l.titulo,
        l.paginas,
        l.fecha_publicacion,
        l.editorial,
        a.nombre AS nombre_autor,
        a.apellidos AS apellidos_autor,
        l.id_autor
      FROM Libros l
      INNER JOIN Autores a ON l.id_autor = a.id_autor
      WHERE l.id_libro = ?
    `;

    const rows = await query(sqlSelect, [idLibro]);

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Error al actualizar libro:', error);
    res.status(500).json({ message: 'Error al actualizar libro' });
  }
});

/**
 * DELETE /api/libros/:id
 * Elimina un libro por ID
 */
router.delete('/:id', async (req, res) => {
  try {
    const idLibro = req.params.id;

    const sqlDelete = `DELETE FROM Libros WHERE id_libro = ?`;
    const result = await query(sqlDelete, [idLibro]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Libro no encontrado para eliminar' });
    }

    res.status(200).json({ message: 'Libro eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar libro:', error);
    res.status(500).json({ message: 'Error al eliminar libro' });
  }
});

module.exports = router;

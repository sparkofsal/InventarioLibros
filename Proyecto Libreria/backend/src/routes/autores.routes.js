// src/routes/autores.routes.js

const express = require('express');
const router = express.Router();

const { query } = require('../db');

// Ruta: GET /api/autores
// Obtiene todos los autores
router.get('/', async (req, res) => {
  try {
    const sql = 'SELECT * FROM Autores'; // Suponiendo que la tabla se llama 'Autores'
    const rows = await query(sql);

    res.status(200).json(rows);
  } catch (error) {
    console.error('Error al obtener autores:', error);
    res.status(500).json({ message: 'Error al obtener autores' });
  }
});

// Ruta: GET /api/autores/:id
// Obtiene un autor específico por su ID
router.get('/:id', async (req, res) => {
  try {
    const idAutor = req.params.id;
    const sql = 'SELECT * FROM Autores WHERE id_autor = ?';

    const rows = await query(sql, [idAutor]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Autor no encontrado' });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Error al obtener autor:', error);
    res.status(500).json({ message: 'Error al obtener autor' });
  }
});

module.exports = router;

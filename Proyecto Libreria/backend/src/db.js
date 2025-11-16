// src/db.js

// Importamos mysql2 en modo "promise" para usar async/await
const mysql = require('mysql2/promise');
// Cargamos las variables de entorno desde .env
require('dotenv').config();

// Creamos un "pool" de conexiones. Es mejor que una sola conexión fija
// porque permite manejar varias peticiones al mismo tiempo.
const pool = mysql.createPool({
  host: process.env.DB_HOST,     // generalmente 'localhost'
  user: process.env.DB_USER,     // en XAMPP suele ser 'root'
  password: process.env.DB_PASSWORD, // en XAMPP por defecto está vacío
  database: process.env.DB_NAME, // 'Libros'
  port: process.env.DB_PORT || 3306
});

// Función helper para ejecutar queries.
// Recibe un SQL y un arreglo de parámetros para los "?" (si los hay).
async function query(sql, params) {
  const [rows] = await pool.execute(sql, params);
  return rows; // devolvemos solo las filas
}

// Exportamos la función para usarla en otros archivos
module.exports = {
  query
};

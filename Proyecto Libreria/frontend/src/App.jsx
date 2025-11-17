// src/App.jsx
import { useEffect, useState } from "react";

// URL base del backend (puedo mover esto a una variable de entorno después)
const API_BASE_URL = "http://localhost:3000/api";

function App() {
  // Estado para guardar los libros que vienen del backend
  const [libros, setLibros] = useState([]);
  // Estado para manejar si estamos cargando datos
  const [cargando, setCargando] = useState(true);
  // Estado para manejar errores
  const [error, setError] = useState(null);
  // Estado para libro seleccionado (detalle)
  const [libroSeleccionado, setLibroSeleccionado] = useState(null);

  // useEffect se ejecuta una vez al cargar el componente
  useEffect(() => {
    obtenerLibros();
  }, []);

  // Función que llama al backend para obtener todos los libros
  const obtenerLibros = async () => {
    try {
      setCargando(true);
      setError(null);

      const respuesta = await fetch(`${API_BASE_URL}/libros`);

      if (!respuesta.ok) {
        throw new Error("Error al obtener los libros");
      }

      const datos = await respuesta.json();
      setLibros(datos); // guardamos los libros en el estado
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar los libros. Intenta más tarde.");
    } finally {
      setCargando(false);
    }
  };

  // Función para seleccionar un libro y mostrar su detalle
  const manejarClickLibro = (libro) => {
    setLibroSeleccionado(libro);
  };

  return (
    // Contenedor principal con estilo oscuro y sencillo
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#121212",
        color: "#f5f5f5",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        padding: "2rem",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: "1rem" }}>
        📚 Inventario de Libros
      </h1>

      {/* Botón para recargar libros manualmente */}
      <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        <button
          onClick={obtenerLibros}
          style={{
            backgroundColor: "#1f2933",
            color: "#f5f5f5",
            border: "1px solid #4b5563",
            borderRadius: "6px",
            padding: "0.5rem 1rem",
            cursor: "pointer",
          }}
        >
          Recargar lista
        </button>
      </div>

      {/* Mostrar mensajes de carga o error */}
      {cargando && <p style={{ textAlign: "center" }}>Cargando libros...</p>}
      {error && <p style={{ color: "#f87171", textAlign: "center" }}>{error}</p>}

      {/* Contenedor para lista y detalle */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1.2fr",
          gap: "1.5rem",
        }}
      >
        {/* Columna izquierda: tabla/lista de libros */}
        <div
          style={{
            backgroundColor: "#1e293b",
            borderRadius: "10px",
            padding: "1rem",
            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.4)",
          }}
        >
          <h2 style={{ marginBottom: "0.75rem" }}>Lista de libros</h2>

          {libros.length === 0 && !cargando ? (
            <p>No hay libros registrados.</p>
          ) : (
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "0.9rem",
              }}
            >
              <thead>
                <tr style={{ borderBottom: "1px solid #4b5563" }}>
                  <th style={{ textAlign: "left", padding: "0.5rem" }}>
                    Título
                  </th>
                  <th style={{ textAlign: "left", padding: "0.5rem" }}>
                    Autor
                  </th>
                  <th style={{ textAlign: "left", padding: "0.5rem" }}>
                    Editorial
                  </th>
                  <th style={{ textAlign: "left", padding: "0.5rem" }}>
                    Páginas
                  </th>
                </tr>
              </thead>
              <tbody>
                {libros.map((libro) => (
                  <tr
                    key={libro.id_libro}
                    onClick={() => manejarClickLibro(libro)}
                    style={{
                      cursor: "pointer",
                      borderBottom: "1px solid #374151",
                    }}
                  >
                    <td style={{ padding: "0.5rem" }}>{libro.titulo}</td>
                    <td style={{ padding: "0.5rem" }}>
                      {libro.nombre_autor} {libro.apellidos_autor}
                    </td>
                    <td style={{ padding: "0.5rem" }}>{libro.editorial}</td>
                    <td style={{ padding: "0.5rem" }}>{libro.paginas}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Columna derecha: detalle del libro seleccionado */}
        <div
          style={{
            backgroundColor: "#0f172a",
            borderRadius: "10px",
            padding: "1rem",
            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.4)",
          }}
        >
          <h2 style={{ marginBottom: "0.75rem" }}>Detalle del libro</h2>

          {!libroSeleccionado ? (
            <p style={{ color: "#9ca3af" }}>
              Selecciona un libro de la lista para ver los detalles.
            </p>
          ) : (
            <div>
              <h3 style={{ marginBottom: "0.5rem" }}>
                {libroSeleccionado.titulo}
              </h3>
              <p>
                <strong>Autor:</strong>{" "}
                {libroSeleccionado.nombre_autor}{" "}
                {libroSeleccionado.apellidos_autor}
              </p>
              <p>
                <strong>Editorial:</strong> {libroSeleccionado.editorial}
              </p>
              <p>
                <strong>Páginas:</strong> {libroSeleccionado.paginas}
              </p>
              <p>
                <strong>Fecha de publicación:</strong>{" "}
                {new Date(libroSeleccionado.fecha_publicacion).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;

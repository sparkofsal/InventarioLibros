// src/App.jsx
import { useEffect, useState } from "react";

const API_BASE_URL = "http://localhost:3000/api";

function App() {
  // Lista de libros
  const [libros, setLibros] = useState([]);
  // Lista de autores (para el select)
  const [autores, setAutores] = useState([]);

  // Estados de carga / error
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // Libro seleccionado para mostrar detalle
  const [libroSeleccionado, setLibroSeleccionado] = useState(null);

  // Formulario (crear / editar)
  const [formLibro, setFormLibro] = useState({
    id_libro: null,
    titulo: "",
    paginas: "",
    fecha_publicacion: "",
    editorial: "",
    id_autor: "",
  });

  // Modo edición o creación
  const [modoEdicion, setModoEdicion] = useState(false);

  // Mensaje de éxito
  const [mensaje, setMensaje] = useState("");

  // Al cargar el componente, obtenemos libros y autores
  useEffect(() => {
    obtenerLibros();
    obtenerAutores();
  }, []);

  // Obtener todos los libros
  const obtenerLibros = async () => {
    try {
      setCargando(true);
      setError(null);
      const resp = await fetch(`${API_BASE_URL}/libros`);
      if (!resp.ok) throw new Error("Error al obtener libros");
      const data = await resp.json();
      setLibros(data);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar los libros.");
    } finally {
      setCargando(false);
    }
  };

  // Obtener autores (para el select)
  const obtenerAutores = async () => {
    try {
      const resp = await fetch(`${API_BASE_URL}/autores`);
      if (!resp.ok) throw new Error("Error al obtener autores");
      const data = await resp.json();
      setAutores(data);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar los autores.");
    }
  };

  // Manejar clic en un libro de la lista
  const manejarClickLibro = (libro) => {
    setLibroSeleccionado(libro);
  };

  // Manejar cambios del formulario (inputs controlados)
  const manejarCambioFormulario = (e) => {
    const { name, value } = e.target;
    setFormLibro((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Manejar submit del formulario (crear o actualizar)
  const manejarSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    setError("");

    // Validación
    if (
      !formLibro.titulo ||
      !formLibro.paginas ||
      !formLibro.fecha_publicacion ||
      !formLibro.editorial ||
      !formLibro.id_autor
    ) {
      setError("Todos los campos del formulario son obligatorios.");
      return;
    }

    // Esto es para preparar datos a enviar (asegurando tipos numéricos)
    const payload = {
      titulo: formLibro.titulo,
      paginas: Number(formLibro.paginas),
      fecha_publicacion: formLibro.fecha_publicacion,
      editorial: formLibro.editorial,
      id_autor: Number(formLibro.id_autor),
    };

    try {
      let url = `${API_BASE_URL}/libros`;
      let metodo = "POST";

      if (modoEdicion && formLibro.id_libro) {
        // Modo edición: usamos PUT
        url = `${API_BASE_URL}/libros/${formLibro.id_libro}`;
        metodo = "PUT";
      }

      const resp = await fetch(url, {
        method: metodo,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!resp.ok) {
        const errorData = await resp.json().catch(() => ({}));
        throw new Error(errorData.message || "Error al guardar el libro");
      }

      await resp.json(); // podríamos usar la respuesta si queremos

      setMensaje(
        modoEdicion
          ? "Libro actualizado correctamente."
          : "Libro creado correctamente."
      );

      // Refrescamos lista de libros
      await obtenerLibros();

      // Limpiamos formulario y salimos de modo edición
      limpiarFormulario();
    } catch (err) {
      console.error(err);
      setError(err.message || "Error al guardar el libro.");
    }
  };

  // Preparar formulario para editar un libro existente
  const manejarEditar = (libro) => {
    setModoEdicion(true);
    setMensaje("");
    setError("");

    setFormLibro({
      id_libro: libro.id_libro,
      titulo: libro.titulo,
      paginas: libro.paginas,
      fecha_publicacion: libro.fecha_publicacion?.slice(0, 10) || "",
      editorial: libro.editorial,
      id_autor: libro.id_autor,
    });
  };

  // Eliminar libro, le agregue el mensaje de confirmación
  const manejarEliminar = async (libro) => {
    const confirmar = window.confirm(
      `¿Seguro que deseas eliminar el libro "${libro.titulo}"?`
    );
    if (!confirmar) return;

    try {
      const resp = await fetch(`${API_BASE_URL}/libros/${libro.id_libro}`, {
        method: "DELETE",
      });

      if (!resp.ok) {
        const errorData = await resp.json().catch(() => ({}));
        throw new Error(errorData.message || "Error al eliminar el libro");
      }

      setMensaje("Libro eliminado correctamente.");
      await obtenerLibros();

      // Si el libro eliminado era el seleccionado, lo limpiamos
      if (libroSeleccionado && libroSeleccionado.id_libro === libro.id_libro) {
        setLibroSeleccionado(null);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Error al eliminar el libro.");
    }
  };

  // Limpiar formulario y salir de modo edición
  const limpiarFormulario = () => {
    setModoEdicion(false);
    setFormLibro({
      id_libro: null,
      titulo: "",
      paginas: "",
      fecha_publicacion: "",
      editorial: "",
      id_autor: "",
    });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#121212",
        color: "#f5f5f5",
        fontFamily:
          "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        padding: "2rem",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: "1rem" }}>
         Inventario de Libros
      </h1>

      {/* Botón recargar */}
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
            marginRight: "0.5rem",
          }}
        >
          Recargar lista
        </button>
      </div>

      {/* Mensajes de estado */}
      {cargando && <p style={{ textAlign: "center" }}>Cargando libros...</p>}
      {error && (
        <p style={{ color: "#f87171", textAlign: "center" }}>{error}</p>
      )}
      {mensaje && (
        <p style={{ color: "#4ade80", textAlign: "center" }}>{mensaje}</p>
      )}

      {/* Layout principal: izquierda lista, derecha detalle + formulario */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1.4fr",
          gap: "1.5rem",
          marginTop: "1rem",
        }}
      >
        {/* Lista de libros */}
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
            <p>No hay ningun libro registrados.</p>
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
                  <th style={{ textAlign: "left", padding: "0.5rem" }}>
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {libros.map((libro) => (
                  <tr
                    key={libro.id_libro}
                    style={{
                      borderBottom: "1px solid #374151",
                    }}
                  >
                    <td
                      style={{ padding: "0.5rem", cursor: "pointer" }}
                      onClick={() => manejarClickLibro(libro)}
                    >
                      {libro.titulo}
                    </td>
                    <td style={{ padding: "0.5rem" }}>
                      {libro.nombre_autor} {libro.apellidos_autor}
                    </td>
                    <td style={{ padding: "0.5rem" }}>{libro.editorial}</td>
                    <td style={{ padding: "0.5rem" }}>{libro.paginas}</td>
                    <td style={{ padding: "0.5rem" }}>
                      <button
                        onClick={() => manejarEditar(libro)}
                        style={{
                          backgroundColor: "#2563eb",
                          color: "#f9fafb",
                          border: "none",
                          borderRadius: "4px",
                          padding: "0.25rem 0.5rem",
                          fontSize: "0.8rem",
                          cursor: "pointer",
                          marginRight: "0.25rem",
                        }}
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => manejarEliminar(libro)}
                        style={{
                          backgroundColor: "#b91c1c",
                          color: "#f9fafb",
                          border: "none",
                          borderRadius: "4px",
                          padding: "0.25rem 0.5rem",
                          fontSize: "0.8rem",
                          cursor: "pointer",
                        }}
                      >
                        Borrar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Columna derecha: detalle + formulario */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {/* Detalle del libro */}
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
                  {new Date(
                    libroSeleccionado.fecha_publicacion
                  ).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>

          {/* Formulario crear/editar */}
          <div
            style={{
              backgroundColor: "#020617",
              borderRadius: "10px",
              padding: "1rem",
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.4)",
            }}
          >
            <h2 style={{ marginBottom: "0.75rem" }}>
              {modoEdicion ? "Editar libro" : "Agregar nuevo libro"}
            </h2>

            <form onSubmit={manejarSubmit} style={{ display: "grid", gap: "0.5rem" }}>
              <div>
                <label>Título</label>
                <input
                  type="text"
                  name="titulo"
                  value={formLibro.titulo}
                  onChange={manejarCambioFormulario}
                  style={{
                    width: "100%",
                    padding: "0.25rem",
                    borderRadius: "4px",
                    border: "1px solid #4b5563",
                    backgroundColor: "#020617",
                    color: "#e5e7eb",
                  }}
                />
              </div>

              <div>
                <label>Páginas</label>
                <input
                  type="number"
                  name="paginas"
                  value={formLibro.paginas}
                  onChange={manejarCambioFormulario}
                  style={{
                    width: "100%",
                    padding: "0.25rem",
                    borderRadius: "4px",
                    border: "1px solid #4b5563",
                    backgroundColor: "#020617",
                    color: "#e5e7eb",
                  }}
                />
              </div>

              <div>
                <label>Fecha de publicación</label>
                <input
                  type="date"
                  name="fecha_publicacion"
                  value={formLibro.fecha_publicacion}
                  onChange={manejarCambioFormulario}
                  style={{
                    width: "100%",
                    padding: "0.25rem",
                    borderRadius: "4px",
                    border: "1px solid #4b5563",
                    backgroundColor: "#020617",
                    color: "#e5e7eb",
                  }}
                />
              </div>

              <div>
                <label>Editorial</label>
                <input
                  type="text"
                  name="editorial"
                  value={formLibro.editorial}
                  onChange={manejarCambioFormulario}
                  style={{
                    width: "100%",
                    padding: "0.25rem",
                    borderRadius: "4px",
                    border: "1px solid #4b5563",
                    backgroundColor: "#020617",
                    color: "#e5e7eb",
                  }}
                />
              </div>

              <div>
                <label>Autor</label>
                <select
                  name="id_autor"
                  value={formLibro.id_autor}
                  onChange={manejarCambioFormulario}
                  style={{
                    width: "100%",
                    padding: "0.25rem",
                    borderRadius: "4px",
                    border: "1px solid #4b5563",
                    backgroundColor: "#020617",
                    color: "#e5e7eb",
                  }}
                >
                  <option value="">Selecciona un autor</option>
                  {autores.map((autor) => (
                    <option key={autor.id_autor} value={autor.id_autor}>
                      {autor.nombre} {autor.apellidos}
                    </option>
                  ))}
                </select>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "0.5rem",
                  marginTop: "0.5rem",
                  justifyContent: "flex-end",
                }}
              >
                {modoEdicion && (
                  <button
                    type="button"
                    onClick={limpiarFormulario}
                    style={{
                      backgroundColor: "#4b5563",
                      color: "#f9fafb",
                      border: "none",
                      borderRadius: "4px",
                      padding: "0.4rem 0.75rem",
                      cursor: "pointer",
                    }}
                  >
                    Cancelar
                  </button>
                )}

                <button
                  type="submit"
                  style={{
                    backgroundColor: "#16a34a",
                    color: "#f9fafb",
                    border: "none",
                    borderRadius: "4px",
                    padding: "0.4rem 0.75rem",
                    cursor: "pointer",
                  }}
                >
                  {modoEdicion ? "Guardar cambios" : "Agregar libro"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

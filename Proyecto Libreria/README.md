# Proyecto Inventario de Libros
Armando Salazar

Este proyecto es una aplicación web diseñada para gestionar el inventario de una librería.  
Incluye una base de datos relacional en MySQL, un backend en Node.js con Express y un frontend construido en React con Vite.  
La aplicación permite realizar un CRUD completo de libros, incluyendo su relación con autores.

# Objetivo de este sistema

Desarrollar una plataforma funcional que permita a una librería registrar, consultar, editar y eliminar libros de su inventario.  
El sistema debía cumplir con los siguientes requisitos:

- Crear una base de datos en MySQL con tablas relacionadas.
- Conectar la base de datos a un backend hecho en JavaScript (Node.js).
- Crear una API que permita consultar y modificar información.
- Desarrollar una interfaz web para mostrar y administrar los datos.
- Realizar un CRUD completo.

# Avance 1 – Análisis y diseño de la base de datos

1. El lenguaje utilizado para el backend elegi **JavaScript**, mediante Node.js y Express.
2. La base de datos se desarrolló en **MySQL**, usando XAMPP y phpMyAdmin.
3. Defini dos tablas principales:
   - `Autores`
   - `Libros`

# Avance 2 – Creación de la base de datos y tablas

Para este avance use XAMPP y phpMyAdmin.

Pasos:

1. Abrir XAMPP y activar Apache y MySQL.
2. Entrar a phpMyAdmin y crear la base de datos `Libros`.
3. Crear la tabla `Autores`:

```sql
CREATE TABLE Autores (
  id_autor INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  apellidos VARCHAR(150) NOT NULL
);
```

4. Crear la tabla `Libros`:

```sql
CREATE TABLE Libros (
  id_libro INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(200) NOT NULL,
  paginas INT NOT NULL,
  fecha_publicacion DATE NOT NULL,
  editorial VARCHAR(150) NOT NULL,
  id_autor INT NOT NULL,
  CONSTRAINT fk_libros_autores
    FOREIGN KEY (id_autor)
    REFERENCES Autores(id_autor)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
);
```
Agregue una serie de registros para las pruebas, todo lo busque en Google, como ejemplos de libros con detalles.

# Avance 3 – Backend y CRUD

El backend lo desarrolle con Node.js

## Tecnologías de backend
- Node.js  
- Express  
- MySQL2  

# Avance 4 – Frontend API y CRUD

El frontend lo desarrolle con React utilizando Vite.

## Tecnologías utilizadas
- React  
- Vite  
- Fetch API

## Funcionalidades implementadas

- Mostrar tabla de libros obtenidos del backend.
- Mostrar detalle de un libro seleccionado.
- Formulario para crear libros.
- Modo de edición para actualizar información.
- Botón para eliminar libros.
- Actualización automática de la tabla una vez realizados cambios.
- Diseño oscuro simple y limpio.

# Instrucciones para ejecutar el proyecto en local

Este proyecto requiere que el backend y el frontend se ejecuten por separado.

## 1. Requisitos necesarios (importante)

- Node.js instalado.
- XAMPP instalado y funcionando.
- Base de datos “Libros” creada en MySQL(myphpadmin).
- Tablas “Autores” y “Libros” creadas y llenas con datos.

## 2. Ejecutar base de datos (XAMPP)

1. Abrir XAMPP Control Panel.
2. Activar Apache y MySQL.
3. Entrar a phpMyAdmin y verificar que la base de datos “Libros” existe.

## 3. Ejecutar backend

1. Abrir terminal y entrar a la carpeta:

```
cd backend
```

2. Instalar dependencias:

```
npm install
```

3. Crear archivo `.env` con:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=Libros
DB_PORT=3306
PORT=3000
```

4. Ejecutar:

```
npm run dev
```

5. Backend en:

```
http://localhost:3000
```

## 4. Ejecutar frontend

1. Abrir nueva terminal:

```
cd frontend
```

2. Instalar dependencias:

```
npm install
```

3. Ejecutar:

```
npm run dev
```

4. Abrir en el navegador:

```
http://localhost:5173
```

# Conclusión

Este proyecto integra la creación de una base de datos, un backend con API REST y un frontend moderno con React.  
Permite manejar un inventario de libros de manera completa, aplicando conceptos de desarrollo y comunicación entre cliente y servidor.


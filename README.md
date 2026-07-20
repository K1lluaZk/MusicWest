# <p align="center">🎵 MusicWest — Biblioteca Musical</p>

<p align="center">
Aplicación web desarrollada para la gestión de una biblioteca musical, permitiendo administrar canciones mediante operaciones CRUD y aplicar un flujo de trabajo utilizando Git Flow y Pull Requests.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white" alt="Express">
  <img src="https://img.shields.io/badge/SQLite-003B57?style=flat&logo=sqlite&logoColor=white" alt="SQLite">
  <img src="https://img.shields.io/badge/EJS-B4CA65?style=flat" alt="EJS">
  <img src="https://img.shields.io/badge/Bootstrap-7952B3?style=flat&logo=bootstrap&logoColor=white" alt="Bootstrap">
  <img src="https://img.shields.io/badge/Git-F05032?style=flat&logo=git&logoColor=white" alt="Git">
</p>

---

# 📖 Acerca del Proyecto

**MusicWest** es una aplicación web desarrollada para administrar una colección de canciones mediante operaciones **CRUD (Crear, Consultar, Actualizar y Eliminar)**.

Como parte del proyecto se implementó una estrategia de control de versiones basada en **Git Flow**, utilizando ramas de desarrollo, Pull Requests y procesos de integración entre ramas.

---

# ✨ Funcionalidades

- 🎵 Registrar nuevas canciones.
- 📚 Visualizar la biblioteca musical.
- ✏️ Editar información de canciones.
- 🗑️ Eliminar canciones.
- 🔍 Buscar canciones por título, artista o género.
- ⭐ Marcar canciones como favoritas.
- 📊 Mostrar estadísticas generales de la biblioteca.

---

# 🛠 Tecnologías Utilizadas

### Backend

- Node.js
- Express.js

### Base de Datos

- SQLite

### Frontend

- EJS
- Bootstrap

### Herramientas

- Git
- GitHub
- Visual Studio Code

---

# 🌳 Flujo de Trabajo (Git Flow)

Durante el desarrollo se utilizó una estrategia basada en Git Flow, organizando el proyecto mediante las siguientes ramas:

- `main`
- `developer`
- `qa`
- `feature/create-song`
- `feature/read-songs`
- `feature/update-song`
- `feature/delete-song`
- `feature/search-favorites`

Cada funcionalidad fue desarrollada en una rama independiente y posteriormente integrada mediante Pull Requests.

---

# 🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/K1lluaZk/MusicWest.git
```

### 2. Entrar al proyecto

```bash
cd MusicWest
```

### 3. Instalar dependencias

```bash
npm install
```

### 4. Ejecutar la aplicación

```bash
npm start
```

La aplicación estará disponible en:

```
http://localhost:3000
```

---

# 📁 Estructura del Proyecto

```
MusicWest
│
├── controllers/
├── database/
├── models/
├── public/
├── routes/
├── views/
├── app.js
├── package.json
└── README.md
```

---

# 📌 Objetivo Académico

Este proyecto fue desarrollado como práctica para aplicar conceptos de:

- Desarrollo de aplicaciones web con Node.js.
- Arquitectura MVC.
- Bases de datos SQLite.
- Control de versiones con Git.
- Flujo de trabajo Git Flow.
- Pull Requests y procesos de integración en GitHub.

---

# 👨‍💻 Autor

**Mario Suero**

Desarrollado como práctica académica para la asignatura de Ingeniería de Software.

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const DB_DIR = path.join(__dirname, '..', 'database');
const DB_PATH = path.join(DB_DIR, 'music.db');

// Crea la carpeta "database/" si no existe todavía (evita SQLITE_CANTOPEN)
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
  console.log('📁 Carpeta "database/" creada automáticamente.');
}

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('❌ Error al conectar con la base de datos:', err.message);
  } else {
    console.log('✅ Conexión establecida con SQLite:', DB_PATH);
  }
});

function initDatabase() {
  const sql = `
    CREATE TABLE IF NOT EXISTS songs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      artist TEXT NOT NULL,
      album TEXT,
      genre TEXT,
      duration TEXT,
      favorite INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `;

  db.run(sql, (err) => {
    if (err) {
      console.error('❌ Error al crear la tabla "songs":', err.message);
    } else {
      console.log('✅ Tabla "songs" verificada/creada correctamente.');
    }
  });
}

/**
 * @returns {Promise<Array>}
 */
function getAllSongs() {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM songs ORDER BY created_at DESC`;
    db.all(sql, [], (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

/**
 * Obtiene una canción por su ID.
 * @param {number} id
 * @returns {Promise<Object|undefined>}
 */
function getSongById(id) {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM songs WHERE id = ?`;
    db.get(sql, [id], (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
}

/**
 * Inserta una nueva canción en la base de datos.
 * @param {Object} song { title, artist, album, genre, duration }
 * @returns {Promise<number>} ID de la canción insertada
 */
function createSong(song) {
  return new Promise((resolve, reject) => {
    const sql = `
      INSERT INTO songs (title, artist, album, genre, duration, favorite, created_at)
      VALUES (?, ?, ?, ?, ?, 0, datetime('now'))
    `;
    const params = [
      song.title,
      song.artist,
      song.album || null,
      song.genre || null,
      song.duration || null
    ];

    db.run(sql, params, function (err) {
      if (err) return reject(err);
      resolve(this.lastID);
    });
  });
}

/**
 * Actualiza una canción existente.
 * @param {number} id
 * @param {Object} song { title, artist, album, genre, duration }
 * @returns {Promise<number>} Número de filas afectadas
 */
function updateSong(id, song) {
  return new Promise((resolve, reject) => {
    const sql = `
      UPDATE songs
      SET title = ?, artist = ?, album = ?, genre = ?, duration = ?
      WHERE id = ?
    `;
    const params = [
      song.title,
      song.artist,
      song.album || null,
      song.genre || null,
      song.duration || null,
      id
    ];

    db.run(sql, params, function (err) {
      if (err) return reject(err);
      resolve(this.changes);
    });
  });
}

/**
 * Cambia el estado de favorito (toggle) de una canción.
 * @param {number} id
 * @returns {Promise<number>} Número de filas afectadas
 */
function toggleFavorite(id) {
  return new Promise((resolve, reject) => {
    const sql = `UPDATE songs SET favorite = CASE WHEN favorite = 1 THEN 0 ELSE 1 END WHERE id = ?`;
    db.run(sql, [id], function (err) {
      if (err) return reject(err);
      resolve(this.changes);
    });
  });
}

/**
 * @param {string} query
 * @returns {Promise<Array>}
 */
function searchSongs(query) {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT * FROM songs
      WHERE title LIKE ? COLLATE NOCASE
         OR artist LIKE ? COLLATE NOCASE
         OR genre LIKE ? COLLATE NOCASE
      ORDER BY created_at DESC
    `;
    const like = `%${query}%`;
    db.all(sql, [like, like, like], (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

/**
 * @returns {Promise<Array>}
 */
function getFavoriteSongs() {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM songs WHERE favorite = 1 ORDER BY created_at DESC`;
    db.all(sql, [], (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

/**
 * Calcula estadísticas generales de la biblioteca musical.
 * @returns {Promise<{total: number, artists: number, albums: number, favorites: number}>}
 */
function getStats() {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT
        COUNT(*) AS total,
        COUNT(DISTINCT artist) AS artists,
        COUNT(DISTINCT CASE WHEN album IS NOT NULL AND album != '' THEN album END) AS albums,
        SUM(CASE WHEN favorite = 1 THEN 1 ELSE 0 END) AS favorites
      FROM songs
    `;
    db.get(sql, [], (err, row) => {
      if (err) return reject(err);
      resolve({
        total: row.total || 0,
        artists: row.artists || 0,
        albums: row.albums || 0,
        favorites: row.favorites || 0
      });
    });
  });
}

module.exports = {
  initDatabase,
  getAllSongs,
  getSongById,
  createSong,
  updateSong,
  toggleFavorite,
  searchSongs,
  getFavoriteSongs,
  getStats
};
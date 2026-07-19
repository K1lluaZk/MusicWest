const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const DB_DIR = path.join(__dirname, '..', 'database');
const DB_PATH = path.join(DB_DIR, 'music.db');

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


module.exports = {
  initDatabase,
  createSong,
};
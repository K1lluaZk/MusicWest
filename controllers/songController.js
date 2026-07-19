const songModel = require('../models/songModel');

/**
 * @param {Object} data { title, artist }
 * @returns {Array<string>} Lista de mensajes de error (vacía si es válido)
 */
function validateSong(data) {
  const errors = [];

  if (!data.title || data.title.trim() === '') {
    errors.push('El título es obligatorio.');
  }

  if (!data.artist || data.artist.trim() === '') {
    errors.push('El artista es obligatorio.');
  }

  return errors;
}


exports.newSongForm = (req, res) => {
  res.render('create', {
    title: 'Agregar canción',
    error: null,
    formData: {}
  });
};

exports.createSong = async (req, res) => {
  const { title, artist, album, genre, duration } = req.body;
  const errors = validateSong({ title, artist });

  if (errors.length > 0) {
    return res.status(400).render('create', {
      title: 'Agregar canción',
      error: errors.join(' '),
      formData: { title, artist, album, genre, duration }
    });
  }

  try {
    await songModel.createSong({ title, artist, album, genre, duration });
    res.redirect('/songs?success=' + encodeURIComponent('Canción agregada correctamente.'));
  } catch (err) {
    console.error('❌ Error al crear la canción:', err.message);
    res.status(500).render('create', {
      title: 'Agregar canción',
      error: 'Ocurrió un error al guardar la canción. Intenta nuevamente.',
      formData: { title, artist, album, genre, duration }
    });
  }
};

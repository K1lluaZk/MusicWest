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

async function renderIndexWithSongs(res, {
  songs = null,
  success = null,
  error = null,
  searchQuery = '',
  onlyFavorites = false
} = {}) {
  try {
    const stats = await songModel.getStats();
    const list = songs !== null ? songs : await songModel.getAllSongs();

    res.render('index', {
      title: 'Music Library',
      songs: list,
      stats,
      success,
      error,
      searchQuery,
      onlyFavorites
    });
  } catch (err) {
    console.error('❌ Error al renderizar el listado:', err.message);
    res.status(500).send('Error interno del servidor al cargar las canciones.');
  }
}

exports.home = (req, res) => {
  res.redirect('/songs');
};

exports.listSongs = async (req, res) => {
  await renderIndexWithSongs(res, {
    success: req.query.success || null,
    error: req.query.error || null
  });
};

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

exports.editSongForm = async (req, res) => {
  const { id } = req.params;

  try {
    const song = await songModel.getSongById(id);

    if (!song) {
      return res.redirect('/songs?error=' + encodeURIComponent('La canción solicitada no existe.'));
    }

    res.render('edit', {
      title: 'Editar canción',
      error: null,
      song
    });
  } catch (err) {
    console.error('❌ Error al obtener la canción:', err.message);
    res.redirect('/songs?error=' + encodeURIComponent('Error al cargar la canción.'));
  }
};

exports.updateSong = async (req, res) => {
  const { id } = req.params;
  const { title, artist, album, genre, duration } = req.body;
  const errors = validateSong({ title, artist });

  if (errors.length > 0) {
    return res.status(400).render('edit', {
      title: 'Editar canción',
      error: errors.join(' '),
      song: { id, title, artist, album, genre, duration }
    });
  }

  try {
    const changes = await songModel.updateSong(id, { title, artist, album, genre, duration });

    if (changes === 0) {
      return res.redirect('/songs?error=' + encodeURIComponent('No se encontró la canción a actualizar.'));
    }

    res.redirect('/songs?success=' + encodeURIComponent('Canción actualizada correctamente.'));
  } catch (err) {
    console.error('❌ Error al actualizar la canción:', err.message);
    res.status(500).render('edit', {
      title: 'Editar canción',
      error: 'Ocurrió un error al actualizar la canción. Intenta nuevamente.',
      song: { id, title, artist, album, genre, duration }
    });
  }
};

exports.searchSongs = async (req, res) => {
  const query = (req.query.q || '').trim();

  try {
    const songs = query === ''
      ? await songModel.getAllSongs()
      : await songModel.searchSongs(query);

    await renderIndexWithSongs(res, {
      songs,
      searchQuery: query,
      error: query !== '' && songs.length === 0
        ? 'No se encontraron canciones que coincidan con tu búsqueda.'
        : null
    });
  } catch (err) {
    console.error('❌ Error al buscar canciones:', err.message);
    res.status(500).send('Error interno del servidor al buscar canciones.');
  }
};

exports.favoriteSongs = async (req, res) => {
  try {
    const songs = await songModel.getFavoriteSongs();

    await renderIndexWithSongs(res, {
      songs,
      onlyFavorites: true,
      error: songs.length === 0 ? 'Aún no tienes canciones marcadas como favoritas.' : null
    });
  } catch (err) {
    console.error('❌ Error al obtener favoritas:', err.message);
    res.status(500).send('Error interno del servidor al obtener favoritas.');
  }
};

exports.toggleFavorite = async (req, res) => {
  const { id } = req.params;

  try {
    const changes = await songModel.toggleFavorite(id);

    if (changes === 0) {
      return res.redirect('/songs?error=' + encodeURIComponent('No se encontró la canción.'));
    }

    const referer = req.get('Referer') || '/songs';
    res.redirect(referer);
  } catch (err) {
    console.error('❌ Error al actualizar favorito:', err.message);
    res.redirect('/songs?error=' + encodeURIComponent('Ocurrió un error al actualizar el favorito.'));
  }
};
const express = require('express');
const router = express.Router();
const songController = require('../controllers/songController');

router.get('/', songController.home);

router.get('/songs', songController.listSongs);

router.get('/songs/new', songController.newSongForm);
router.post('/songs', songController.createSong);

router.get('/songs/search', songController.searchSongs);
router.get('/songs/favorites', songController.favoriteSongs);
router.get('/songs/toggleFavorite/:id', songController.toggleFavorite);


module.exports = router;
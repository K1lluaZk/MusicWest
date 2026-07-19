const express = require('express');
const router = express.Router();
const songController = require('../controllers/songController');

router.get('/', songController.home);

router.get('/songs', songController.listSongs);

router.get('/songs/new', songController.newSongForm);
router.post('/songs', songController.createSong);

module.exports = router;
const express = require('express');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const methodOverride = require('method-override');

require('./models/songModel').initDatabase();

const songRoutes = require('./routes/songRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layout');

app.use(express.urlencoded({ extended: true })); 
app.use(express.json());
app.use(methodOverride('_method'));              
app.use(express.static(path.join(__dirname, 'public'))); 

app.use('/', songRoutes);

app.use((req, res) => {
  res.status(404).render('index', {
    title: 'Página no encontrada',
    songs: [],
    stats: { total: 0, artists: 0, albums: 0, favorites: 0 },
    error: 'La página que buscas no existe.',
    success: null,
    searchQuery: '',
    onlyFavorites: false
  });
});

app.listen(PORT, () => {
  console.log(`🎵 Music Library corriendo en http://localhost:${PORT}`);
});
const routes = require('express').Router();
const movie = require('../services/movieService');

routes.get('/', (req, res) => {
    movie.fetchAll().then(movies => {
        res.status(200).json({ movies });
    }).catch(error => {
        res.status(400).json({ error });
    });
});


routes.get('/:movie_id/characterlist', (req, res) => {
    const movie_id = req.params.movie_id;
    movie.fetchCharacters(movie_id).then(characters => {
        res.status(200).json({ total_height: characters.total_height, number_of_characters: characters.count, characters });
    }).catch(error => {
        res.status(400).json({ error });
    });
});

module.exports = routes;
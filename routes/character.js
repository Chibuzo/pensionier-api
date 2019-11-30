const routes = require('express').Router();
const movieService = require('../services/movieService');

routes.get('/', (req, res) => {
    if (req.headers['content-type'] !== 'application/json') {
        res.status(400).json({ status: 'Error', message: 'Acceptable content- type header is missing' });
    }

    const movie_id = req.query.movie_id;

    if (!movie_id || isNaN(movie_id)) {
        res.status(400).json({ status: 'Error', message: 'Missing/Invalid parameter. Movie_id must be present and must be a number' });
    }

    const sort = {
        field: req.query.sort_by || '',
        order: req.query.order || 'desc'
    }

    const gender = req.query.gender || '';

    movieService.fetchCharacters(movie_id, sort, gender).then(characters => {
        res.status(200).json({ total_height: characters.total_height, number_of_characters: characters.count, characters });
    }).catch(error => {
        res.status(400).json({ error });
    });
});

module.exports = routes;
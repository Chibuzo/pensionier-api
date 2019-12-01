const routes = require('express').Router();
const movieService = require('../services/movieService');
const { validate, fetchMovieRules } = require('../middlewares/validators');

routes.get('/', fetchMovieRules(), validate, (req, res) => {
    const movie_id = req.query.movie_id;

    movieService.fetchCharacters(movie_id, req.query.sort_by, req.query.order, req.query.gender).then(characters => {
        res.status(200).json({
            total_height_cm: characters.total_height_cm,
            total_height_feet_inches: characters.total_height_feet_inches,
            number_of_characters: characters.count,
            characters
        });
    }).catch(error => {
        res.status(400).json({ error });
    });
});

module.exports = routes;
const routes = require('express').Router();
const movieService = require('../services/movieService');

routes.get('/', (req, res) => {
    movieService.fetchMovies().then(movies => {
        res.status(200).json({ status: 'success', movies });
    }).catch(error => {
        res.status(error.statusCode).json({ status: 'error', error: error.message });
    });
});

module.exports = routes;
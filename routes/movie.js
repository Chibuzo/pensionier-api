const routes = require('express').Router();
const movieService = require('../services/movieService');
const { commentValidationRules, validate, fetchMovieRules, parameterRules } = require('../middlewares/validators');

routes.get('/', (req, res) => {
    movieService.fetchMovies().then(movies => {
        res.status(200).json({ status: 'success', movies });
    }).catch(error => {
        res.status(error.statusCode).json({ status: 'error', error: error.message });
    });
});

// get movie characters
routes.get('/:movie_id/characters', fetchMovieRules(), parameterRules(), validate, (req, res) => {
    const movie_id = req.params.movie_id;

    movieService.fetchCharacters(movie_id, req.query.sort_by, req.query.order, req.query.gender).then(characters => {
        res.status(200).json({
            total_height_cm: characters.total_height_cm,
            total_height_feet_inches: characters.total_height_feet_inches,
            number_of_characters: characters.count,
            characters
        });
    }).catch(error => {
        res.status(error.statusCode).json({ status: 'error', message: error.message });
    });
});

// get movie comments
routes.get('/:movie_id/comments', fetchMovieRules(), validate, (req, res) => {
    commentService.fetchMovieComments(req.params.movie_id).then(comments => {
        res.status(200).json({ status: 'success', comments });
    }).catch(error => {
        res.status(error.statusCode).json({ error: "error", message: error.message });
    });
});

// post comment
routes.post('/comment', commentValidationRules(), validate, (req, res) => {
    commentService.postComment(req.body.comment, req.body.movie_id, req.connection.remoteAddress).then(comment => {
        res.status(201).json({ status: 'success', comment_id: comment.id });
    }).catch(error => {
        res.status(500).json({ status: 'error', error });
    });
});

module.exports = routes;
const routes = require('express').Router();
const movieService = require('../services/movieService');
const commentService = require('../services/commentService');
const { commentValidationRules, validate, fetchMovieRules, parameterRules } = require('../middlewares/validators');
const { handleError } = require('../helpers/errorHandler');


// fetch all starwars movies
routes.get('/', (req, res, next) => {
    movieService.fetchMovies().then(movies => {
        res.status(200).json({ status: 'success', movies });
    }).catch(error => {
        handleError(error, res);
    });
});


// fetch the character set for a movie
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
        handleError(error, res);
    });
});


// fetch comments for a movie
routes.get('/:movie_id/comments', fetchMovieRules(), validate, (req, res) => {
    commentService.fetchMovieComments(req.params.movie_id).then(comments => {
        res.status(200).json({ status: 'success', comments });
    }).catch(error => {
        handleError(error, res);
    });
});


// post comment for a movie
routes.post('/comment', commentValidationRules(), validate, (req, res) => {
    commentService.postComment(req.body.comment, req.body.movie_id, req.connection.remoteAddress).then(comment => {
        res.status(201).json({ status: 'success', comment_id: comment.id });
    }).catch(error => {
        handleError(error, res);
    });
});

module.exports = routes;
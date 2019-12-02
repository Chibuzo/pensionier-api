const routes = require('express').Router();
const commentService = require('../services/commentService');
const { commentValidationRules, validate, fetchMovieRules } = require('../middlewares/validators');

// get movie comments
routes.get('/', fetchMovieRules(), validate, (req, res) => {
    commentService.fetchMovieComments(req.query.movie_id).then(comments => {
        res.status(200).json({ status: 'success', comments });
    }).catch(error => {
        res.status(error.statusCode).json({ error: "error", message: error.message });
    });
});

// post comment
routes.post('/', commentValidationRules(), validate, (req, res) => {
    commentService.postComment(req.body.comment, req.body.movie_id, req.connection.remoteAddress).then(comment => {
        res.status(201).json({ status: 'success', comment_id: comment.id });
    }).catch(error => {
        res.status(500).json({ status: 'error', error });
    });
});

module.exports = routes;
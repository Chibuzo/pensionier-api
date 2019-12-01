const routes = require('express').Router();
const commentService = require('../services/commentService');
const { commentValidationRules, validate, fetchMovieRules } = require('../middlewares/validators');

// get movie comments
routes.get('/', fetchMovieRules(), validate, (req, res) => {
    const movie_id = req.query.movie_id;

    commentService.fetchMovieComments(movie_id).then(comments => {
        res.status(200).json({ status: 'success', comments });
    }).catch(err => {
        res.status(500).json({ error: "error", message: err });
    });
});

// post comment
routes.post('/', commentValidationRules(), validate, (req, res) => {
    commentService.postComment(req.body, req.connection.remoteAddress).then(comment => {
        res.status(201).json({ status: 'success', comment_id: comment.id });
    }).catch(error => {
        res.status(500).json({ error });
    });
});

module.exports = routes;
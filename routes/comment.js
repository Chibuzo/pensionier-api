const routes = require('express').Router();
const commentService = require('../services/commentService');

// get movie comments
routes.get('/', (req, res) => {
    const movie_id = req.query.movie_id;
    commentService.fetchMovieComments(movie_id).then(comments => {
        res.status(200).json({ comments });
    }).catch(err => {
        res.status(500).json({ error: "Server error", message: err });
    });
});

// post comment
routes.post('/', (req, res) => {
    commentService.postComment(req.body, req.connection.remoteAddress).then(comment => {
        res.status(201).json({ comment_id: comment.id });
    }).catch(error => {
        res.status(500).json({ error });
    });
});

module.exports = routes;
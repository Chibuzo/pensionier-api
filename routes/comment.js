const routes = require('express').Router();
const comment = require('../models/comment');

routes.get('/', (req, res) => {
    res.status(200).json({ message: 'comment!' });
});

routes.post('/', (req, res) => {
    const comment_text = req.body.comment;

    const comment_data = {
        movie_id: req.body.movie_id,
        comment: comment_text.length > 500 ? comment_text.substr(0, 499) : comment_text,
        public_ip: req.connection.remoteAddress,
        createdAt: new Date().toUTCString()
    }

    comment.createNew(comment_data).then(comment => {
        res.status(201).json({ comment_id: comment.id });
    }).catch(error => {
        res.status(400).json({ error });
    });
});

module.exports = routes;
const routes = require('express').Router();

const movies = require('./movie');
const characters = require('./character');
const comments = require('./comment');

routes.get('/', (req, res) => {
    res.status(200).json({ message: 'What the fuck are expecting to get here??!!' });
});

routes.use('/movies', movies);
routes.use('/characters', characters);
routes.use('/comments', comments);

module.exports = routes;
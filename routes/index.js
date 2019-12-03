const routes = require('express').Router();

const movies = require('./movie');

routes.get('/', (req, res) => {
    res.status(200).json({ message: 'What are you looking for here??!!' });
});

routes.use('/movies', movies);

module.exports = routes;
const routes = require('express').Router();
const comment = require('../models/comment');

routes.get('/', (req, res) => {
    res.status(200).json({ message: 'comment!' });
});

module.exports = routes;
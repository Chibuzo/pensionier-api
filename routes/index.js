const routes = require('express').Router();
const personRoutes = require('./person');
const userRoutes = require('./user');


routes.get('/', (req, res) => {
    res.status(200).json({ message: 'What are you looking for here??!!' });
});

routes.use('/persons', personRoutes);

routes.use('/users', userRoutes);


module.exports = routes;
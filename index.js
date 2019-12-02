const express = require('express');
const app = express();
require('dotenv').config();
const apiRoutes = require('./routes');
const header_validation = require('./middlewares/header_validator');

app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).json({ message: 'Welcome to star wars api!' });
});

app.use('/api', header_validation, apiRoutes);

// catch 404
app.use((req, res, next) => {
    const error = new Error("Route not found!");
    error.status = 404;
    next(error);
});

app.set('port', process.env.PORT);

app.listen(app.get('port'), () => {
    console.log('App listening on port ' + process.env.PORT);
});
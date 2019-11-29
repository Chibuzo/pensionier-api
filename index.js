const express = require('express');
const app = express();
require('dotenv').config();
const port = 3001;
const apiRoutes = require('./routes');

app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).json({ message: 'Welcome to star wars api!' });
});

app.use('/api', apiRoutes);

app.set('port', process.env.PORT || port);

app.listen(app.get('port'), () => {
    console.log('App listening on port ' + port);
});
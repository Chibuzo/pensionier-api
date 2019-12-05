const routes = require('express').Router();
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');


const movies = require('./movie');

routes.get('/', (req, res) => {
    res.status(200).json({ message: 'What are you looking for here??!!' });
});


routes.use('/movies', movies);

// Swagger set up
const options = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: "Star wars API",
            version: "1.0.0",
            description:
                "This application offers a simple REST api for listing starwars' movies, posting comment on movies and fetching the character set for a movie.",
            license: {
                name: "MIT",
                url: "https://choosealicense.com/licenses/mit/"
            },
            contact: {
                name: "Chibuzo",
                email: "chibuzohenry@gmail.com"
            }
        },
        servers: [
            {
                url: "http://localhost:3001/api"
            },
            {
                url: "http://52.0.4.153:3000/api"
            }
        ]
    },
    apis: ["./routes/*.js", "./models/comment.js", "./services/movieService.js"]
};
const specs = swaggerJsdoc(options);
routes.use("/docs", swaggerUi.serve);
routes.get("/docs", swaggerUi.setup(specs, { explorer: true }));

module.exports = routes;
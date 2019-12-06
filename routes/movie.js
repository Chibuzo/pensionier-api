const routes = require('express').Router();
const movieService = require('../services/movieService');
const commentService = require('../services/commentService');
const { commentValidationRules, validate, fetchMovieRules, parameterRules } = require('../middlewares/validators');
const { handleError } = require('../helpers/errorHandler');

/**
 * @swagger
 * tags:
 *   name: Movies
 *   description: Movie Data Services
 */

/**
 * @swagger
 * path:
 *  /movies:
 *    get:
 *      summary: Fetch all star wars movies
 *      tags: [Movies]
 *      responses:
 *        "200":
 *          description: List of all star wars movies
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/Movie'
 */
routes.get('/', (req, res, next) => {
    movieService.fetchMovies().then(movies => {
        res.status(200).json({ status: 'success', movies });
    }).catch(error => {
        handleError(error, res);
        //res.status(error.statusCode).json({ status: 'error', error: error.message });
    });
});


/**
 * @swagger
 * path:
 *  /movies/{movie_id}/characters:
 *    get:
 *      summary: Fetch all characters for the selected movie
 *      tags: [Movies]
 *      parameters:
 *        - in: path
 *          name: movie_id
 *          schema:
 *              type: integer
 *          required: true
 *        - in: query
 *          name: gender
 *          schema:
 *              type: string
 *              enum:
 *                  - male
 *                  - female
 *        - in: query
 *          name: sort_by
 *          schema:
 *              type: string
 *              enum:
 *                  - name
 *                  - gender
 *                  - height
 *        - in: query
 *          name: order
 *          schema:
 *              type: string
 *              default: 'desc'
 *              enum:
 *                  - desc
 *                  - asc
 *      responses:
 *        "200":
 *          description: An array of movie characters
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/Character'
 */
routes.get('/:movie_id/characters', fetchMovieRules(), parameterRules(), validate, (req, res) => {
    const movie_id = req.params.movie_id;

    movieService.fetchCharacters(movie_id, req.query.sort_by, req.query.order, req.query.gender).then(characters => {
        res.status(200).json({
            total_height_cm: characters.total_height_cm,
            total_height_feet_inches: characters.total_height_feet_inches,
            number_of_characters: characters.count,
            characters
        });
    }).catch(error => {
        handleError(error, res);
    });
});

/**
 * @swagger
 * path:
 *  /movies/{movie_id}/comments:
 *    get:
 *      summary: Fetch all comments for the selected movie
 *      tags: [Movies]
 *      parameters:
 *        - in: path
 *          name: movie_id
 *          schema:
 *              type: integer
 *          required: true 
 *      responses:
 *        "200":
 *          description: An array of movie comments
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/Comment'
 */
routes.get('/:movie_id/comments', fetchMovieRules(), validate, (req, res) => {
    commentService.fetchMovieComments(req.params.movie_id).then(comments => {
        res.status(200).json({ status: 'success', comments });
    }).catch(error => {
        handleError(error, res);
    });
});


/**
 * @swagger
 * path:
 *  /movies/comment:
 *    post:
 *      summary: Post anonymous comment for a movie
 *      tags: [Movies]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Comment'
 *      responses:
 *        "201":
 *          description: Created
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                     type: string
 *                  comment_id: 
 *                     type: integer
 *                     description: Id of posted comment
 */
routes.post('/comment', commentValidationRules(), validate, (req, res) => {
    commentService.postComment(req.body.comment, req.body.movie_id, req.connection.remoteAddress).then(comment => {
        res.status(201).json({ status: 'success', comment_id: comment.id });
    }).catch(error => {
        handleError(error, res);
    });
});

module.exports = routes;
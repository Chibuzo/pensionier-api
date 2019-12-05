const request = require('../helpers/APIRequest')(process.env.STARWARS_API_URL);
const commentModel = require('../models').Comment;
const cache = require('../helpers/cache');
const { ErrorHandler } = require('../helpers/errorHandler');

module.exports = {
    /**
     * Post anonymous comments for a movie
     * @param {String} comment
     * @param {Integer} movie_id
     * @param {String} public_ip
     * @returns {Promise} comment id
     */
    postComment: async (comment_text, movie_id, public_ip) => {

        // prevent creating comment for non-existent movies
        let movie;

        // get movie data from cache
        movie = await cache.get(`movie_${movie_id}`);

        if (!movie) {
            try {
                movie = await request.get(`films/${movie_id}`);

                // save movie data in cache
                cache.set(`movie_${movie_id}`, movie);
            } catch (err) {
                throw new ErrorHandler(err.statusCode, "Supplied movie_id doesn't point to any starwars movie!");
            }
        }

        // proceed to create comment
        const comment = {
            movie_id: movie_id,
            comment: comment_text,
            public_ip: public_ip
        };

        try {
            return await commentModel.create(comment);
        } catch (err) {
            throw new ErrorHandler(500, "Unable to post comment at this time. Please try again later.");
        }
    },


    /**
     * Fetchs comments for a movie in reverse chronological order
     * @param {Integer} movie_id
     * @returns {Promise} Array of comments
     */
    fetchMovieComments: async movie_id => {
        try {
            const raw_comments = await commentModel.getMovieComments(movie_id);

            const comments = await raw_comments.map(comment => {
                return {
                    comment: comment.comment,
                    public_ip: comment.public_ip
                };
            });

            return await comments;
        } catch (err) {
            throw new ErrorHandler(500, "Unable to fetch comments at the momemt. Please try again later.");
        }
    }
}
const commentModel = require('../models/comment');

module.exports = {
    /**
     * Post anonymous comments for a movie
     * @param {String} comment
     * @param {Integer} movie_id
     * @param {String} public_ip
     * @returns {Promise} comment id
     */
    postComment: async (comment_text, movie_id, public_ip) => {
        // check if movie_id points to an existing movie
        let movie;

        // get movie data from cache
        movie = await cache.get(`movie_${movie_id}`);

        if (!movie) {
            try {
                movie = await request.get(`films/${movie_id}`);
            } catch (err) {
                if (err.number === 404) {
                    throw new Error()
                }
            }

            // save movie data in cache
            cache.set(`movie_${movie_id}`, movie);
        }

        const comment = {
            movie_id: movie_id,
            comment: comment_text,
            public_ip: public_ip
        };

        try {
            return await commentModel.createNew(comment);
        } catch (err) {
            throw err;
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
            throw err;
        }
    }
}
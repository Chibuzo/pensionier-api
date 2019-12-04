const commentModel = require('../models').Comment;
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
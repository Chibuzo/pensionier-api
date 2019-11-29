const commentModel = require('../models/comment');

module.exports = {
    postComment: async (comment_data, public_ip) => {
        const comment_text = comment_data.comment;

        const comment = {
            movie_id: comment_data.movie_id,
            comment: comment_text.length > 500 ? comment_text.substr(0, 499) : comment_text,
            public_ip: public_ip
        };

        try {
            return await commentModel.createNew(comment);
        } catch (err) {
            throw err;
        }
    },

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
'use strict';

/**
 * @swagger
 *  components:
 *    schemas:
 *      Comment:
 *        type: object
 *        required:
 *          - comment
 *          - movie_id
 *        properties:
 *          comment:
 *            type: text
 *          public_ip:
 *            type: string
 *            description: IP address of the commenter.
 *          movie_id:
 *             type: integer
 *          createdAt:
 *              type: datetime
 *        example:
 *           comment: 'I love this movie'
 *           movie_id: 1
 */
module.exports = (sequelize, DataTypes) => {
    const Comment = sequelize.define('Comment', {
        comment: DataTypes.TEXT,
        movie_id: DataTypes.INTEGER,
        public_ip: DataTypes.STRING,
    }, {});
    Comment.associate = function (models) {
        // associations can be defined here
    };

    Comment.getMovieCommentCounts = function () {
        return sequelize.query("SELECT COUNT(*) AS comment_count, movie_id FROM comments GROUP BY movie_id", { type: sequelize.QueryTypes.SELECT });
    }

    return Comment;
};
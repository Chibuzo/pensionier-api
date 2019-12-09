'use strict';

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
        return sequelize.query("SELECT COUNT(*) AS comment_count, movie_id FROM Comments GROUP BY movie_id", { type: sequelize.QueryTypes.SELECT });
    }

    return Comment;
};
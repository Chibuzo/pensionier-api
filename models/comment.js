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
    return Comment;
};
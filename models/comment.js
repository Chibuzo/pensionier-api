const db = require('../config/db-setting');

module.exports = {
    createNew: comment => {
        comment.createdAt = new Date().toISOString();

        return new Promise((resolve, reject) => {
            db.query("INSERT INTO comments SET ?", comment, (err, result) => {
                if (err) {
                    return reject(err);
                }
                return resolve({ id: result.insertId });
            });
        });
    },

    getMovieComments: movie_id => {
        return new Promise((resolve, reject) => {
            db.query("SELECT * from comments WHERE movie_id = ? ORDER BY createdAt DESC", [movie_id], (err, comments) => {
                if (err) {
                    return reject(err);
                }
                return resolve(comments);
            });
        });
    },

    getMovieCommentCounts: () => {
        return new Promise((resolve, reject) => {
            db.query("SELECT COUNT(*) AS comment_count, movie_id from comments GROUP BY movie_id", (err, comments) => {
                if (err) {
                    return reject(err);
                }
                return resolve(comments);
            });
        });
    }
}
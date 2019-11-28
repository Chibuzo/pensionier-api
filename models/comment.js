const db = require('../config/db-setting');

module.exports = {
    createNew: comment => {
        return new Promise((resolve, reject) => {
            db.query("INSERT INTO comments SET ?", comment, (err, result) => {
                if (err) {
                    return reject(err);
                }
                return resolve({ id: result.insertId });
            });
        });
    },

    findMovieComments: movie_id => {
        return new Promise((resolve, reject) => {
            db.query("SELECT * from comments WHERE movie_id = ? ORDER BY createdAt DESC", [movie_id], (err, comments) => {
                if (err) {
                    return reject(err);
                }
                return resolve(comments);
            });
        });
    },

    findOne: id => {
        return new Promise((resolve, reject) => {
            db.query("SELECT * from comments where id = ?", [id], (err, result) => {
                if (err) {
                    return reject(err);
                }
                return resolve(result[0]);
            });
        });
    }
}
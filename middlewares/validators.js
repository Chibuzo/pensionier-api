const { body, check, validationResult } = require('express-validator');

module.exports = {
    commentValidationRules: () => {
        return [
            body('movie_id').isNumeric().trim().withMessage("movie_id cannot be empty and must be a number"),
            body('comment').isLength({ max: 500 }).escape().withMessage("Comment must not be more than 500 characters")
        ]
    },

    validate: (req, res, next) => {
        const raw_errors = validationResult(req);

        if (raw_errors.isEmpty()) {
            return next();
        }

        const errors = raw_errors.errors.map(err => ({ message: err.msg }));

        return res.status(422).json({ status: 'error', errors });
    },

    fetchMovieRules: () => {
        return [check('movie_id').isNumeric().withMessage('Missing/Invalid parameter. Movie_id must be present and must be a number')];
    }
}
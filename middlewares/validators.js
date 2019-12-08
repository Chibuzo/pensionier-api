const { body, check, validationResult } = require('express-validator');
const { isValidMovie } = require('../services/movieService');

module.exports = {
    commentValidationRules: () => {
        return [
            body('movie_id').isNumeric().trim().withMessage("movie_id cannot be empty and must be a number"),
            body('comment').exists().withMessage("Comment can not be empty!").isLength({ max: 500 }).escape().withMessage("Comment must not be more than 500 characters")
        ];
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
    },

    parameterRules: () => {
        return [
            check('gender').optional({ nullable: true }).isIn(['female', 'male', 'unknown']).withMessage("gender must be either male, female or unknown"),
            check('sort_by').optional({ nullable: true }).isIn(['gender', 'name', 'height']).withMessage("Invalid sorting parameter. Only gender, name and height are allowed"),
            check('order').optional({ nullable: true }).isIn(['asc', 'desc']).withMessage("Invalid order value. Only 'asc' and 'desc' are allowed")
        ];
    }
}
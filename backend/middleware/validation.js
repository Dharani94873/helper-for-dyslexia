const { validationResult } = require('express-validator');
const logger = require('../utils/logger');

/**
 * Middleware to validate request data using express-validator
 */
const validate = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => ({
            field: error.path || error.param,
            message: error.msg
        }));

        logger.warn('Validation failed:', errorMessages);

        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errorMessages
        });
    }

    next();
};

module.exports = validate;

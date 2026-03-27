const logger = require('../utils/logger');

/**
 * Middleware to check if user has admin role
 */
const admin = (req, res, next) => {
    try {
        // auth middleware should run before this
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required.'
            });
        }

        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Admin privileges required.'
            });
        }

        next();
    } catch (error) {
        logger.error('Admin middleware error:', error);
        return res.status(500).json({
            success: false,
            message: 'Authorization check failed.'
        });
    }
};

module.exports = admin;

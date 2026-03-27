const User = require('../models/User');
const logger = require('../utils/logger');

/**
 * @route   GET /user/me
 * @desc    Get current user profile
 * @access  Private
 */
exports.getProfile = async (req, res, next) => {
    try {
        // User is already attached by auth middleware
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            data: {
                user: user.toPublicJSON()
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @route   PUT /user/me
 * @desc    Update user profile
 * @access  Private
 */
exports.updateProfile = async (req, res, next) => {
    try {
        const { name } = req.body;

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Update only allowed fields
        if (name) user.name = name;

        await user.save();

        logger.info(`User profile updated: ${user.email}`);

        res.json({
            success: true,
            message: 'Profile updated successfully',
            data: {
                user: user.toPublicJSON()
            }
        });
    } catch (error) {
        next(error);
    }
};

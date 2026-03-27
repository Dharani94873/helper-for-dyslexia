const Preference = require('../models/Preference');
const History = require('../models/History');
const logger = require('../utils/logger');

/**
 * @route   GET /preferences
 * @desc    Get user preferences
 * @access  Private
 */
exports.getPreferences = async (req, res, next) => {
    try {
        let preferences = await Preference.findOne({ userId: req.user._id });

        // Create default preferences if not found
        if (!preferences) {
            preferences = await Preference.create({ userId: req.user._id });
        }

        res.json({
            success: true,
            data: { preferences }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @route   POST /preferences
 * @desc    Save or update user preferences
 * @access  Private
 */
exports.savePreferences = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const updates = req.body;

        // Find existing preferences or create new
        let preferences = await Preference.findOne({ userId });

        if (preferences) {
            // Update existing preferences
            Object.keys(updates).forEach(key => {
                if (updates[key] !== undefined && key !== 'userId') {
                    preferences[key] = updates[key];
                }
            });
            await preferences.save();
        } else {
            // Create new preferences
            preferences = await Preference.create({
                userId,
                ...updates
            });
        }

        // Log preference update
        await History.create({
            userId,
            action: 'preferences_update',
            metadata: { updatedFields: Object.keys(updates) }
        });

        logger.info(`Preferences updated for user: ${req.user.email}`);

        res.json({
            success: true,
            message: 'Preferences saved successfully',
            data: { preferences }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @route   DELETE /preferences
 * @desc    Reset preferences to default
 * @access  Private
 */
exports.resetPreferences = async (req, res, next) => {
    try {
        const userId = req.user._id;

        await Preference.deleteOne({ userId });
        const preferences = await Preference.create({ userId });

        logger.info(`Preferences reset for user: ${req.user.email}`);

        res.json({
            success: true,
            message: 'Preferences reset to default',
            data: { preferences }
        });
    } catch (error) {
        next(error);
    }
};

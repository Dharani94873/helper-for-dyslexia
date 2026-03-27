const express = require('express');
const router = express.Router();
const preferencesController = require('../controllers/preferencesController');
const auth = require('../middleware/auth');

/**
 * @route   GET /preferences
 * @desc    Get user preferences
 * @access  Private
 */
router.get('/', auth, preferencesController.getPreferences);

/**
 * @route   POST /preferences
 * @desc    Save or update user preferences
 * @access  Private
 */
router.post('/', auth, preferencesController.savePreferences);

/**
 * @route   DELETE /preferences
 * @desc    Reset preferences to default
 * @access  Private
 */
router.delete('/', auth, preferencesController.resetPreferences);

module.exports = router;

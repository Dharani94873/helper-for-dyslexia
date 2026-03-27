const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

/**
 * @route   GET /user/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/me', auth, userController.getProfile);

/**
 * @route   PUT /user/me
 * @desc    Update user profile
 * @access  Private
 */
router.put('/me', auth, userController.updateProfile);

module.exports = router;

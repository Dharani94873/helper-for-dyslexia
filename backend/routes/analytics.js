const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

/**
 * @route   GET /analytics
 * @desc    Get analytics data
 * @access  Private (Admin only)
 */
router.get('/', auth, admin, analyticsController.getAnalytics);

/**
 * @route   GET /analytics/users
 * @desc    Get user statistics
 * @access  Private (Admin only)
 */
router.get('/users', auth, admin, analyticsController.getUserStats);

module.exports = router;

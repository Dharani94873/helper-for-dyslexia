const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const validate = require('../middleware/validation');

/**
 * @route   POST /auth/signup
 * @desc    Register a new user
 * @access  Public
 */
router.post(
    '/signup',
    authController.signupValidation,
    validate,
    authController.signup
);

/**
 * @route   POST /auth/login
 * @desc    Login user
 * @access  Public
 */
router.post(
    '/login',
    authController.loginValidation,
    validate,
    authController.login
);

module.exports = router;

const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();
// Register route
router.post('/register', authController.registerUser);

// Login route
router.post('/login', authController.loginUser);
router.post('/refresh', authController.refreshToken);

module.exports = router;

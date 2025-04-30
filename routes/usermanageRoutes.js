const express = require('express');
const userController = require('../controllers/userController');
const upload = require('../middleware/upload');
const auth = require('../middleware/auth');
const isadmin = require('../middleware/isadmin');
const router = express.Router();

// Register route
router.get('/', auth, isadmin,  userController.getuserDetails);
router.delete('/ban/:id', auth, isadmin,  userController.deleteUser);
router.get('/otp', auth,   userController.otpGenerate);
router.put('/password_change', auth,   userController.passwordChange);

module.exports = router;

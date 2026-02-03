const express = require('express');
const router = express.Router();
const {
  register,
  login,
  changePassword,
} = require('../controllers/authController');
const { auth } = require('../middleware/auth');
const {
  validateRegistration,
  validateLogin,
  validatePasswordChange,
  handleValidationErrors,
} = require('../middleware/validation');

router.post('/register', validateRegistration, handleValidationErrors, register);
router.post('/login', validateLogin, handleValidationErrors, login);
router.put('/change-password', auth, validatePasswordChange, handleValidationErrors, changePassword);

module.exports = router;

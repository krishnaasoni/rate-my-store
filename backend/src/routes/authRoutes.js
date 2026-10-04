const express = require('express');
const {
  signup,
  login,
  updatePassword,
  getMe,
} = require('../controllers/authController');
const {
  signupValidationRules,
  loginValidationRules,
  updatePasswordValidationRules,
} = require('../validators/authValidator');
const validate = require('../middlewares/validate');
const { authenticateToken } = require('../middlewares/authMiddleware');
const { authRateLimiter } = require('../middlewares/rateLimiter');

const router = express.Router();

// Apply auth rate limiter to signup and login routes
router.post('/signup', authRateLimiter, signupValidationRules, validate, signup);
router.post('/login', authRateLimiter, loginValidationRules, validate, login);

// Authenticated routes
router.put('/password', authenticateToken, updatePasswordValidationRules, validate, updatePassword);
router.get('/me', authenticateToken, getMe);

module.exports = router;

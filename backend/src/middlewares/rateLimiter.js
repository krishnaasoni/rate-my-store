const rateLimit = require('express-rate-limit');

/**
 * Rate limiter middleware for Auth routes to prevent brute force attacks
 */
const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many login/auth requests from this IP, please try again after 15 minutes.',
  },
});

module.exports = {
  authRateLimiter,
};

const rateLimit = require('express-rate-limit');
const config = require('../config/config');

/**
 * Rate limiting specifically for auth routes to prevent brute forcing
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit each IP to 20 requests per windowMs
  skipSuccessfulRequests: true, // don't count successful authentication attempts
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many login attempts, please try again after 15 minutes',
});

/**
 * General API rate limiter
 */
const apiLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests from this IP, please try again later',
});

module.exports = {
  authLimiter,
  apiLimiter,
};
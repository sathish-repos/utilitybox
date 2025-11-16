import rateLimit from 'express-rate-limit';
import config from '../config/index.js';

/**
 * Global rate limiter.
 * Applies to all requests.
 */
export const globalRateLimiter = rateLimit({
  windowMs: config.rateLimit.global.windowMs,
  max: config.rateLimit.global.max,
  message: 'Too many requests from this IP, please try again after 15 minutes.',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  
  // Note: For Vercel, req.ip might need configuration.
  // Vercel sets the 'x-forwarded-for' header.
  // 'trustProxy' is needed if behind a proxy (like Vercel).
  // In app.js, you might need: app.set('trust proxy', 1)
  keyGenerator: (req) => {
    return req.headers['x-forwarded-for'] || req.ip;
  }
});

/**
 * Stricter rate limiter for authentication routes.
 */
export const authLimiter = rateLimit({
  windowMs: config.rateLimit.auth.windowMs,
  max: config.rateLimit.auth.max,
  message: 'Too many login/register attempts, please try again after 15 minutes.',
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return req.headers['x-forwarded-for'] || req.ip;
  }
});
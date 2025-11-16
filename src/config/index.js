import 'dotenv/config';

/**
 * Centralized configuration loader.
 * Loads environment variables and provides sane defaults.
 */
const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 5000,
  mongodbUri: process.env.MONGODB_URI,
  logLevel: process.env.LOG_LEVEL || 'info',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',

  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },

  rateLimit: {
    global: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: parseInt(process.env.RATE_LIMITER_MAX_REQUESTS, 10) || 100, // max requests per window
    },
    auth: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 10, // max auth attempts per window
    },
  },
};

// --- Validation ---
// Ensure essential variables are set, especially for production
if (config.env === 'production') {
  if (!config.mongodbUri) {
    throw new Error('FATAL ERROR: MONGODB_URI is not set.');
  }
  if (!config.jwt.secret || !config.jwt.refreshSecret) {
    throw new Error('FATAL ERROR: JWT secrets are not set.');
  }
}

export default config;

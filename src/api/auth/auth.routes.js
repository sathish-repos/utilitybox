import express from 'express';
import { validate } from '../../middleware/validate.middleware.js';
import { registerSchema, loginSchema, refreshTokenSchema } from './auth.validation.js';
import { registerUser, loginUser, logoutUser, refreshAccessToken } from './auth.controller.js';
import { authLimiter } from '../../middleware/rateLimiter.middleware.js';
import { protect } from '../../middleware/auth.middleware.js';

const router = express.Router();

// Apply a stricter rate limit to auth routes
router.use(authLimiter);

router.post('/register', validate(registerSchema), registerUser);
router.post('/login', validate(loginSchema), loginUser);
router.post('/refresh', validate(refreshTokenSchema), refreshAccessToken);

// Protected route
router.post('/logout', protect, logoutUser);

export default router;

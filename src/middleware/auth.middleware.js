import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import { ApiError } from '../core/ApiError.js';
import { asyncHandler } from '../core/asyncHandler.js';
import { User } from '../models/User.model.js';
import config from '../config/index.js';

/**
 * Middleware to protect routes.
 * Verifies JWT and attaches user to req.user.
 */
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  // 1) Check for token in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  // TODO: Add check for token in cookies if you prefer that method

  if (!token) {
    return next(new ApiError(httpStatus.UNAUTHORIZED, 'You are not logged in. Please log in to get access.'));
  }

  // 2) Verify token
  let decoded;
  try {
    decoded = jwt.verify(token, config.jwt.secret);
  } catch (err) {
    // Handle specific JWT errors
    if (err.name === 'TokenExpiredError') {
      return next(new ApiError(httpStatus.UNAUTHORIZED, 'Your token has expired. Please log in again.'));
    }
    if (err.name === 'JsonWebTokenError') {
      return next(new ApiError(httpStatus.UNAUTHORIZED, 'Invalid token. Please log in again.'));
    }
    return next(err); // Forward other errors
  }

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id).select('+isActive');
  if (!currentUser) {
    return next(new ApiError(httpStatus.UNAUTHORIZED, 'The user belonging to this token no longer exists.'));
  }

  // 4) Check if user is active (not soft-deleted)
  if (!currentUser.isActive) {
     return next(new ApiError(httpStatus.FORBIDDEN, 'User account is deactivated.'));
  }

  // 5) Grant access: attach user to the request object
  req.user = currentUser;
  next();
});

/**
 * Middleware to check user roles.
 * Use AFTER protect() middleware.
 * @param  {...string} roles - Allowed roles (e.g., 'admin', 'moderator').
 */
export const checkRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError(httpStatus.FORBIDDEN, 'You do not have permission to perform this action.')
      );
    }
    next();
  };
};
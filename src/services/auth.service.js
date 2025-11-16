import httpStatus from 'http-status';
import { ApiError } from '../core/ApiError.js';
import { User } from '../models/User.model.js';
import * as tokenService from './token.service.js';

/**
 * JSDoc for User registration data.
 * @typedef {Object} UserRegistrationData
 * @property {string} name
 * @property {string} email
 * @property {string} password
 */

/**
 * Registers a new user.
 * @param {UserRegistrationData} userData - The user's registration details.
 * @returns {Promise<{user: object, accessToken: string, refreshToken: string}>}
 */
export const registerUser = async (userData) => {
  // 1. Check if email is already taken
  if (await User.findOne({ email: userData.email })) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }

  // 2. Create user (password hashing is handled by the model's pre-save hook)
  const user = await User.create(userData);

  // 3. Generate tokens
  const { accessToken, refreshToken } = await tokenService.generateAuthTokens(user);

  // 4. Return user (transformed) and tokens
  return { user: user.toJSON(), accessToken, refreshToken };
};

/**
 * Logs in a user.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{user: object, accessToken: string, refreshToken: string}>}
 */
export const loginUser = async (email, password) => {
  // 1. Find user by email, explicitly including 'password' and 'isActive'
  const user = await User.findOne({ email }).select('+password +isActive');

  // 2. Check if user exists and password is correct
  if (!user || !(await user.isPasswordCorrect(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }

  // 3. Check if user is active
  if (!user.isActive) {
    throw new ApiError(httpStatus.FORBIDDEN, 'User account is deactivated');
  }

  // 4. Generate tokens
  const { accessToken, refreshToken } = await tokenService.generateAuthTokens(user);

  // 5. Return user (transformed) and tokens
  return { user: user.toJSON(), accessToken, refreshToken };
};

/**
 * Refreshes an access token using a refresh token.
 * Implements refresh token rotation.
 * @param {string} oldRefreshToken - The incoming refresh token.
 * @returns {Promise<{newAccessToken: string, newRefreshToken: string}>}
 */
export const refreshUserAccessToken = async (oldRefreshToken) => {
  if (!oldRefreshToken) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Refresh token is required');
  }

  // 1. Verify the refresh token and find the associated DB token
  const { tokenDoc, user } = await tokenService.verifyRefreshToken(oldRefreshToken);

  // 2. Check for token reuse (if tokenDoc is blacklisted, it's already been used)
  if (tokenDoc.blacklisted) {
    // SECURITY: Someone tried to reuse a rotated token.
    // Invalidate all tokens for this user.
    await tokenService.invalidateAllUserTokens(user._id);
    throw new ApiError(httpStatus.FORBIDDEN, 'Token reuse detected. All sessions logged out.');
  }

  // 3. (Optional, but recommended) Blacklist the used token immediately
  //    This prevents it from being used again.
  //    Or, we can just delete it. Let's delete it for simplicity.
  await tokenService.deleteToken(oldRefreshToken);

  // 4. Generate *new* tokens (Access + Refresh)
  const { accessToken, refreshToken } = await tokenService.generateAuthTokens(user);

  return { newAccessToken: accessToken, newRefreshToken: refreshToken };
};

/**
 * Logs out a user by invalidating their refresh token.
 * @param {string} refreshToken - The refresh token to invalidate.
 * @param {string} userId - The ID of the user logging out.
 * @returns {Promise<void>}
 */
export const logoutUser = async (refreshToken, userId) => {
  if (!refreshToken) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Refresh token is required');
  }
  
  // Delete the specific refresh token from the database
  const tokenDoc = await tokenService.deleteToken(refreshToken);

  if (!tokenDoc) {
    // Token was already invalid or not found, but we can treat it as a success.
    // No need to throw an error.
    return;
  }
  
  // Ensure the token belonged to the user who is logging out
  if (tokenDoc.user.toString() !== userId.toString()) {
     throw new ApiError(httpStatus.FORBIDDEN, 'Invalid token for this user.');
  }
};
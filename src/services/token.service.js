import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import { ApiError } from '../core/ApiError.js';
import { Token } from '../models/Token.model.js';
import { User } from '../models/User.model.js';
import config from '../config/index.js';

/**
 * Generates a JWT.
 * @param {string} userId - The user's ID.
 * @param {string} expires - Token expiration time (e.g., "15m").
 * @param {string} secret - The JWT secret.
 * @returns {string} - The generated JWT.
 */
const generateToken = (userId, expires, secret) => {
  const payload = {
    id: userId,
  };
  return jwt.sign(payload, secret, {
    expiresIn: expires,
  });
};

/**
 * Saves a refresh token to the database.
 * @param {string} token - The refresh token.
 * @param {string} userId - The user's ID.
 * @param {Date} expires - The expiration date of the token.
 * @returns {Promise<import('mongoose').Document>}
 */
const saveRefreshToken = async (token, userId, expires) => {
  const tokenDoc = await Token.create({
    token,
    user: userId,
    expires,
  });
  return tokenDoc;
};

/**
 * Generates both access and refresh tokens for a user.
 * The refresh token is saved to the database.
 * @param {import('../models/User.model.js').User} user - The user object.
 * @returns {Promise<{accessToken: string, refreshToken: string}>}
 */
export const generateAuthTokens = async (user) => {
  // 1. Create Access Token
  const accessToken = generateToken(
    user._id,
    config.jwt.expiresIn,
    config.jwt.secret
  );

  // 2. Create Refresh Token
  const refreshTokenExpires = new Date(
    Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days (must match config string)
  );
  const refreshToken = generateToken(
    user._id,
    config.jwt.refreshExpiresIn,
    config.jwt.refreshSecret
  );

  // 3. Save Refresh Token to DB
  await saveRefreshToken(refreshToken, user._id, refreshTokenExpires);

  return {
    accessToken,
    refreshToken,
  };
};

/**
 * Verifies a refresh token and finds the associated user.
 * @param {string} refreshToken - The refresh token.
 * @returns {Promise<{tokenDoc: import('mongoose').Document, user: import('../models/User.model.js').User}>}
 */
export const verifyRefreshToken = async (refreshToken) => {
  // 1. Find the token in the DB
  const tokenDoc = await Token.findOne({ token: refreshToken });
  if (!tokenDoc) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid refresh token');
  }

  // 2. Verify the JWT signature (check if it's expired or tampered)
  let decoded;
  try {
    decoded = jwt.verify(refreshToken, config.jwt.refreshSecret);
  } catch (err) {
    // If verification fails, delete the bad token from DB
    await tokenDoc.deleteOne();
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid or expired refresh token');
  }

  // 3. Find the associated user
  const user = await User.findById(decoded.id).select('+isActive');
  if (!user || !user.isActive) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'User not found or deactivated');
  }

  return { tokenDoc, user };
};

/**
 * Deletes a specific refresh token (used for logout).
 * @param {string} refreshToken - The token to delete.
 * @returns {Promise<import('mongoose').Document>}
 */
export const deleteToken = async (refreshToken) => {
  return Token.findOneAndDelete({ token: refreshToken });
};

/**
 * Deletes all refresh tokens for a specific user (used for security events).
 * @param {string} userId - The user's ID.
 * @returns {Promise<any>}
 */
export const invalidateAllUserTokens = async (userId) => {
  return Token.deleteMany({ user: userId });
};
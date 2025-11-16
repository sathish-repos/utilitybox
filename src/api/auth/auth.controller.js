// eslint-disable-next-line import/no-extraneous-dependencies
import httpStatus from 'http-status';
import { asyncHandler } from '../../core/asyncHandler.js';
import { ApiResponse } from '../../core/ApiResponse.js';
import * as authService from '../../services/auth.service.js';
import config from '../../config/index.js';

// Cookie options for refresh token
const cookieOptions = {
  httpOnly: true,
  secure: config.env === 'production', // Only send over HTTPS in production
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days (must match refresh token expiry)
};

/**
 * @desc    Register a new user
 * @route   POST /api/v1/auth/register
 * @access  Public
 */
const registerUser = asyncHandler(async (req, res) => {
  const { user, accessToken, refreshToken } = await authService.registerUser(req.body);

  res.cookie('refreshToken', refreshToken, cookieOptions);

  new ApiResponse(httpStatus.CREATED, { user, accessToken }, 'User registered successfully.').send(
    res
  );
});

/**
 * @desc    Login a user
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const { user, accessToken, refreshToken } = await authService.loginUser(email, password);

  res.cookie('refreshToken', refreshToken, cookieOptions);

  new ApiResponse(httpStatus.OK, { user, accessToken }, 'Login successful.').send(res);
});

/**
 * @desc    Refresh access token
 * @route   POST /api/v1/auth/refresh
 * @access  Public (requires refresh token in cookie or body)
 */
const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.body.refreshToken || req.cookies.refreshToken;

  const { newAccessToken, newRefreshToken } =
    await authService.refreshUserAccessToken(incomingRefreshToken);

  res.cookie('refreshToken', newRefreshToken, cookieOptions);

  new ApiResponse(httpStatus.OK, { accessToken: newAccessToken }, 'Access token refreshed.').send(
    res
  );
});

/**
 * @desc    Logout a user
 * @route   POST /api/v1/auth/logout
 * @access  Private
 */
const logoutUser = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.body.refreshToken || req.cookies.refreshToken;
  await authService.logoutUser(incomingRefreshToken, req.user._id);

  res.clearCookie('refreshToken', cookieOptions);

  new ApiResponse(httpStatus.OK, null, 'Logout successful.').send(res);
});

export { registerUser, loginUser, logoutUser, refreshAccessToken };

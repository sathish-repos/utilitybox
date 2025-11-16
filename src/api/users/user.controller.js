import httpStatus from 'http-status';
import { asyncHandler } from '../../core/asyncHandler.js';
import { ApiResponse } from '../../core/ApiResponse.js';
import * as userService from '../../services/user.service.js';

/**
 * @desc    Get all users (Admin only)
 * @route   GET /api/v1/users
 * @access  Private/Admin
 */
const getAllUsers = asyncHandler(async (req, res) => {
  // Simple pagination/filtering (can be expanded)
  const filter = {}; // e.g., req.query.email ? { email: req.query.email } : {}
  const options = {
    page: parseInt(req.query.page, 10) || 1,
    limit: parseInt(req.query.limit, 10) || 10,
  };

  const result = await userService.queryUsers(filter, options);
  new ApiResponse(httpStatus.OK, result).send(res);
});

/**
 * @desc    Get user by ID (Admin only)
 * @route   GET /api/v1/users/:id
 * @access  Private/Admin
 */
const getUserById = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  new ApiResponse(httpStatus.OK, user).send(res);
});

/**
 * @desc    Update current user's profile
 * @route   PATCH /api/v1/users/me
 * @access  Private
 */
const updateMe = asyncHandler(async (req, res) => {
  // Only allow updating name and email
  const updateBody = {
    name: req.body.name,
    email: req.body.email,
  };
  const user = await userService.updateUserById(req.user.id, updateBody);
  new ApiResponse(httpStatus.OK, user, 'Profile updated successfully.').send(res);
});

/**
 * @desc    Delete (soft) current user
 * @route   DELETE /api/v1/users/me
 * @access  Private
 */
const deleteMe = asyncHandler(async (req, res) => {
  await userService.softDeleteUserById(req.user.id);
  new ApiResponse(httpStatus.OK, null, 'Account deleted successfully.').send(res);
});

export { getAllUsers, getUserById, updateMe, deleteMe };

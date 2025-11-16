import httpStatus from 'http-status';
import { ApiError } from '../core/ApiError.js';
import { User } from '../models/User.model.js';
// Note: We don't import Mongoose-Paginate here, but the User model has it.

/**
 * Get a user by their ID.
 * @param {string} id - The user's ID.
 * @returns {Promise<import('../models/User.model.js').User>}
 */
export const getUserById = async (id) => {
  const user = await User.findById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  return user;
};

/**
 * Get a user by their email.
 * @param {string} email - The user's email.
 * @returns {Promise<import('../models/User.model.js').User>}
 */
export const getUserByEmail = async (email) => {
  return User.findOne({ email });
};

/**
 * Update a user's details by their ID.
 * @param {string} userId - The user's ID.
 * @param {object} updateBody - The fields to update.
 * @returns {Promise<import('../models/User.model.js').User>}
 */
export const updateUserById = async (userId, updateBody) => {
  const user = await getUserById(userId);

  // Prevent password from being updated through this route
  if (updateBody.password) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Password cannot be updated from this route.');
  }

  // Check if email is being updated and if it's already taken
  if (updateBody.email && (await User.findOne({ email: updateBody.email, _id: { $ne: userId } }))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }

  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Soft delete a user by ID.
 * Sets `isActive` to false.
 * @param {string} userId - The user's ID.
 * @returns {Promise<void>}
 */
export const softDeleteUserById = async (userId) => {
  const user = await User.findById(userId).select('+isActive');
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  user.isActive = false;
  await user.save();
  
  // TODO: Also invalidate all their refresh tokens
  // await tokenService.invalidateAllUserTokens(userId);
};

/**
 * Query for users with pagination.
 * @param {object} filter - Mongoose filter criteria.
 * @param {object} options - Pagination options (limit, page, sortBy).
 * @returns {Promise<object>} - Paginated result.
 */
export const queryUsers = async (filter, options) => {
  // Add soft-delete filter
  const queryFilter = { ...filter, isActive: { $ne: false } };
  
  // We don't have the paginate plugin on User, so we do it manually
  // Or, we could add it. Let's add it for consistency.
  // **UPDATE**: I'll do it manually to show a different pattern.
  
  const limit = options.limit || 10;
  const page = options.page || 1;
  const skip = (page - 1) * limit;
  const sortBy = options.sortBy ? options.sortBy.replace(':', ' ') : 'createdAt';
  
  const users = await User.find(queryFilter).sort(sortBy).skip(skip).limit(limit);
  const totalUsers = await User.countDocuments(queryFilter);
  
  return {
    results: users,
    page,
    limit,
    totalPages: Math.ceil(totalUsers / limit),
    totalResults: totalUsers,
  };
};
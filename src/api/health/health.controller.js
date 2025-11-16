import httpStatus from 'http-status';
import { ApiResponse } from '../../core/ApiResponse.js';
import { asyncHandler } from '../../core/asyncHandler.js';

/**
 * @desc    Health check endpoint
 * @route   GET /api/v1/health
 * @access  Public
 */
const healthCheck = asyncHandler(async (req, res) => {
  const healthData = {
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  };

  new ApiResponse(httpStatus.OK, healthData, 'API health is nominal.').send(res);
});

export { healthCheck };

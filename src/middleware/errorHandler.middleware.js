import httpStatus from 'http-status';
import config from '../config/index.js';
import logger from '../config/logger.js';
import { ApiError } from '../core/ApiError.js';

/**
 * Formats an error response for development.
 * Includes stack trace.
 * @param {Error | ApiError} err
 * @param {import('express').Response} res
 */
const sendErrorDev = (err, res) => {
  logger.error('DEV ERROR:', err);
  res.status(err.statusCode || httpStatus.INTERNAL_SERVER_ERROR).json({
    success: false,
    status: err.status || 'error',
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

/**
 * Formats an error response for production.
 * Only sends trusted, operational errors to the client.
 * @param {ApiError} err
 * @param {import('express').Response} res
 */
const sendErrorProd = (err, res) => {
  // A) Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      success: false,
      status: err.status,
      message: err.message,
    });
  }
  // B) Programming or other unknown error: don't leak error details
  else {
    // 1) Log error to console/log aggregator (Vercel)
    logger.error('PROD ERROR:', err);

    // 2) Send generic message
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      status: 'error',
      message: 'Something went very wrong!',
    });
  }
};

/**
 * Handles Zod validation errors.
 * @param {Error} err
 * @returns {ApiError}
 */
const handleZodError = (err) => {
  const errors = err.errors.map((el) => `${el.path.join('.')}: ${el.message}`);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new ApiError(httpStatus.BAD_REQUEST, message);
};

/**
 * Handles Mongoose duplicate key errors.
 * @param {Error} err
 * @returns {ApiError}
 */
const handleDuplicateFieldsError = (err) => {
  const value = err.message.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new ApiError(httpStatus.BAD_REQUEST, message);
};

/**
 * Handles Mongoose validation errors.
 * @param {Error} err
 * @returns {ApiError}
 */
const handleValidationError = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new ApiError(httpStatus.BAD_REQUEST, message);
};

/**
 * Handles Mongoose CastErrors (e.g., invalid ObjectId).
 * @param {Error} err
 * @returns {ApiError}
 */
const handleCastError = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new ApiError(httpStatus.BAD_REQUEST, message);
};

/**
 * Global Error Handling Middleware.
 * This MUST have 4 arguments to be recognized by Express as an error handler.
 * @param {Error | ApiError} err
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
// eslint-disable-next-line no-unused-vars
const globalErrorHandler = (err, req, res, next) => {
  let error = err;

  // Set default status code and status if not already set
  error.statusCode = error.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
  error.status = error.status || 'error';

  if (config.env === 'development') {
    return sendErrorDev(error, res);
  }

  // --- Production Error Handling ---
  // Mark common errors as 'operational' so the client gets a useful message.
  
  // Zod validation error
  if (error.name === 'ZodError') {
    error = handleZodError(error);
  }
  // Mongoose validation error
  if (error.name === 'ValidationError') {
    error = handleValidationError(error);
  }
  // Mongoose duplicate key error
  if (error.code === 11000) {
    error = handleDuplicateFieldsError(error);
  }
  // Mongoose cast error (e.g., invalid ID format)
  if (error.name === 'CastError') {
    error = handleCastError(error);
  }
  
  // Note: JWT errors are handled directly in auth.middleware.js
  // to provide specific 401 responses, but could also be handled here.
  
  // Send the final production-ready error
  sendErrorProd(error, res);
};

export default globalErrorHandler;
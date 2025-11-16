import httpStatus from 'http-status';
import { ApiError } from '../core/ApiError.js';
import { ZodError } from 'zod';

/**
 * Middleware to validate request data using a Zod schema.
 * @param {import('zod').AnyZodObject} schema - The Zod schema to validate against.
 */
export const validate = (schema) => (req, res, next) => {
  try {
    // Parse and validate
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
      cookies: req.cookies,
    });
    
    // If validation succeeds, move to the next middleware
    next();
  } catch (error) {
    // If validation fails, check if it's a ZodError
    if (error instanceof ZodError) {
      // Pass the ZodError to the global error handler
      next(error);
    } else {
      // Pass other errors (e.g., programming errors)
      next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal validation error'));
    }
  }
};
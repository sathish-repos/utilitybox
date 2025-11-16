/**
 * Custom Error class for operational errors that are safe to send to the client.
 * @extends Error
 */
class ApiError extends Error {
  /**
   * @param {number} statusCode - HTTP status code.
   * @param {string} message - Error message.
   * @param {boolean} [isOperational=true] - Flag indicating if it's a known, operational error.
   * @param {string} [stack=''] - Optional stack trace.
   */
  constructor(statusCode, message, isOperational = true, stack = '') {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };
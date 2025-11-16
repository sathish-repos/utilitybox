/**
 * A wrapper for async route handlers to catch errors.
 * This avoids repeating try/catch blocks in every controller.
 * @param {Function} requestHandler - The async controller function.
 * @returns {Function} - The wrapped middleware function.
 */
const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};

export { asyncHandler };

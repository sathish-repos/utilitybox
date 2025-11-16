/**
 * Standardized success response wrapper.
 */
class ApiResponse {
  /**
   * @param {number} statusCode - HTTP status code.
   * @param {any} data - The response payload.
   * @param {string} [message='Success'] - A descriptive message.
   */
  constructor(statusCode, data, message = 'Success') {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = true; // Indicates a successful API call
  }

  /**
   * Sends the response.
   * @param {import('express').Response} res - Express response object.
   */
  send(res) {
    return res.status(this.statusCode).json(this);
  }
}

export { ApiResponse };
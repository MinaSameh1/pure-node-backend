/**
 * @description Error class to handle HTTP errors
 * @param {number} status - HTTP status code
 * @param {string} message - error message
 * @param {Error} error - error object
 */
export class HttpError extends Error {
  constructor(status = 500, message = 'Internal Server Error', error = null) {
    super(message)
    this.status = status
    this.error = error
  }
}

/**
 * @description Helper function to check if error is an instance of HttpError
 * @param {Error} err - error object
 * @returns {boolean} - true if error is an instance of HttpError
 */
export const isHttpError = err => err instanceof HttpError

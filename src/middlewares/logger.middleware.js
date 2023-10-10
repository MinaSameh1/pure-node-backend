import { logger } from '../utils/logger.js'

/**
 * @description Middleware to log all requests
 * @param {Object} req - Request Object
 * @param {Object} res - Response Object
 * @returns {void}
 */
export const loggerMiddleware = (req, res) => {
  const start = Date.now()
  res.on('finish', () => {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
    logger.info(
      `${req.method} ${req.url} ${res.statusCode} took ${
        Date.now() - start
      }ms - ${req.headers['user-agent']} ${ip}`,
    )
  })
}

import { logger } from '../utils/logger.js'
import { isHttpError } from '../utils/error.util.js'

/**
 * @description Helper function to handle 404 errors
 * @param {Request} req - request object
 * @param {Resposne} res - response object
 */
export const handle404 = (_req, res) => {
  res.writeHead(404, { 'Content-Type': 'application/json' })
  res.end('{"message": "Not Found"}')
}

export const handleErrors = (err, _req, res) => {
  if (isHttpError(err)) {
    // log only 500 errors
    if (err.status === 500) {
      logger.error(err.error)
    }
    res.writeHead(err.status, { 'Content-Type': 'application/json' })
    return res.end(JSON.stringify({ message: err.message }))
  }
  logger.error(err)
  res.writeHead(500, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify({ message: 'Internal Server Error' }))
}

export const handleFavicon = (_req, res) => {
  res.writeHead(204)
  res.end()
}

export const handleRoot = (_req, res) => {
  res.writeHead(204)
  res.end('')
}

export const handleHealthCheck = (_req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify({ status: 'UP' }))
}

/**
 * @description Helper function to get the body of the request
 * @param {Request} req - request object
 * @returns {any} - returns the body of the request
 */
export const getBody = async req => {
  let body = ''

  for await (const chunk of req) {
    body += chunk
  }

  // handle content type
  if (req.headers['content-type'] === 'application/json') {
    body = JSON.parse(body)
  }

  return body
}

import { logger } from '../utils/logger.js'
import { isHttpError } from '../utils/error.util.js'
import { isPositiveNumber } from '../utils/utils.js'

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

export const handleServerShutdown = (server, callback) => {
  if (!server) {
    throw new Error('Server is not defined!')
  }
  if (!callback || typeof callback !== 'function') {
    throw new Error('Callback is not defined or not a function!')
  }

  server.on('close', () => {
    logger.info('Server Closed')
    callback()
    logger.info('Exited Gracefully')
    process.exit(0)
  })

  const handleSignalShutdown = signal => () => {
    logger.info(`Received ${signal}. Shutting down`)
    setTimeout(() => {
      logger.error(
        'Could not close connections in time, forcefully shutting down',
      )
    }, 8000)
    server.close()
    server.closeAllConnections()
  }

  process.on('SIGTERM', handleSignalShutdown('SIGTERM'))
  process.on('SIGINT', handleSignalShutdown('SIGINT'))
  process.on('SIGQUIT', handleSignalShutdown('SIGQUIT'))
  process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection at:', promise, 'reason:', reason)
  })
  process.on('uncaughtException', err => {
    logger.error('Uncaught Exception thrown:', err, '\n', err.stack)
    process.exit(1)
  })
}

export const getQueryParams = parsedUrl => {
  const query = Object.fromEntries(parsedUrl.searchParams.entries())
  query.get = (key, defaultValue = undefined) => {
    const value = query[key]
    if (!value) {
      return defaultValue
    }
    return value
  }
  return query
}
export const getDefaultQueryParams = query => {
  const page = isPositiveNumber(query.get('page')) ? query.get('page') : 1
  const limit = isPositiveNumber(query.get('limit')) ? query.get('limit') : 10
  const sort = query.get('sort', 'created_at')
  const sortDirection = query.get('sortDirection', '-1')
  return {
    page,
    limit,
    sort,
    sortDirection,
  }
}

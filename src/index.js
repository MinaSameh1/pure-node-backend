import 'dotenv/config.js'
import { createServer } from 'node:http'
import { handleBookPaths } from './api/book/book.router.js'
import { handleBorrowerPaths } from './api/borrower/borrower.router.js'
import { handleBorroweringPaths } from './api/borrowing/borrowing.router.js'
import { connect, disconnect } from './helper/db.helper.js'
import * as httpHelpers from './helper/http.helper.js'
import { loggerMiddleware } from './middlewares/logger.middleware.js'
import { logger } from './utils/logger.js'

const bootstrap = async () => {
  await connect()
  const server = createServer(async (req, res) => {
    try {
      loggerMiddleware(req, res)
      const parsedUrl = new URL(req.url, `http://${req.headers.host}`)
      const paths = parsedUrl.pathname.split('/').filter(Boolean)
      req.query = httpHelpers.getQueryParams(parsedUrl)
      req.params = {}

      req.body = await httpHelpers.getBody(req)

      if (req.url === '/favicon.ico') {
        return httpHelpers.handleFavicon(req, res)
      } else if (req.url === '/') {
        return httpHelpers.handleRoot(req, res)
      } else if (req.url === '/health') {
        return httpHelpers.handleHealthCheck(req, res)
      } else if (await handleBookPaths(req, res, paths)) {
        // handleBookPaths returns true if it handles the request
        return
      } else if (await handleBorrowerPaths(req, res, paths)) {
        return
      } else if (await handleBorroweringPaths(req, res, paths)) {
        return
      }

      return httpHelpers.handle404(req, res)
    } catch (err) {
      return httpHelpers.handleErrors(err, req, res)
    }
  })

  server.on('clientError', (err, socket) => {
    if (err.code === 'ECONNRESET' || !socket.writable) {
      return
    }
    if (err) console.error(err)
    // as per nodejs docs https://nodejs.org/api/http.html#event-clienterror
    socket.end('HTTP/1.1 400 Bad Request\r\n\r\n')
  })

  const port = process.env.PORT || 8000

  server.listen(port, () => {
    logger.info(`Server is running at ${port}`)
    logger.debug(`Log level is at ${logger.getLevel()}`)
  })

  // handle shutdowns
  httpHelpers.handleServerShutdown(server, async () => {
    await disconnect()
    logger.info('Database disconnected.')
  })
}

bootstrap()

import 'dotenv/config'
import { handleBookPaths } from './api/book/book.router.js'
import { createServer } from 'node:http'
import { connect } from './helper/db.helper.js'
import * as helperHandlers from './helper/http.helper.js'
import { loggerMiddleware } from './middlewares/logger.middleware.js'
import { logger } from './utils/logger.js'

const bootstrap = async () => {
  await connect()
  const server = createServer(async (req, res) => {
    try {
      loggerMiddleware(req, res)
      const parsedUrl = new URL(req.url, `http://${req.headers.host}`)
      const paths = parsedUrl.pathname.split('/').filter(Boolean)
      const query = parsedUrl.searchParams

      req.body = await helperHandlers.getBody(req)
      // handle the body type.

      if (paths === '/favicon.ico') {
        return helperHandlers.handleFavicon(req, res)
      } else if (paths === '/') {
        return helperHandlers.handleRoot(req, res)
      } else if (paths === '/health') {
        return helperHandlers.handleHealthCheck(req, res)
      } else if (await handleBookPaths(req, res, paths, query)) {
        // handleBookPaths returns true if it handles the request
        return
      }

      return helperHandlers.handle404(req, res)
    } catch (err) {
      return helperHandlers.handleErrors(err, req, res)
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
    logger.debug(`Log level is at ${process.env.LOG_LEVEL}`)
  })
}

bootstrap()

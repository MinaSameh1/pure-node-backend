import 'dotenv/config'
import { createServer } from 'node:http'
import { connect } from './helper/db.helper.js'
import * as helperHandlers from './helper/http.helper.js'
import { loggerMiddleware } from './middlewares/logger.middleware.js'
import { logger } from './utils/logger.js'

const bootstrap = async () => {
  await connect()
  const server = createServer((req, res) => {
    try {
      loggerMiddleware(req, res)
      const parsedUrl = new URL(req.url, `http://${req.headers.host}`)
      const pathName = parsedUrl.pathname

      console.log(pathName.split('/').filter(Boolean))

      if (pathName === '/favicon.ico') {
        return helperHandlers.handleFavicon(req, res)
      } else if (pathName === '/') {
        return helperHandlers.handleRoot(req, res)
      } else if (pathName === '/health') {
        return helperHandlers.handleHealthCheck(req, res)
      }

      return helperHandlers.handle404(req, res)
    } catch (err) {
      return helperHandlers.handle500(err, req, res)
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

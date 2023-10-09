const logLevel = process.env.LOG_LEVEL || 'debug'

export const logger = {
  debug: (
    /**
     * @type {unknown[]}
     */
    ...msgs
  ) => {
    console.debug(...msgs)
  },
  warn: (
    /**
     * @type {unknown[]}
     */
    ...msgs
  ) => {
    console.warn(...msgs)
  },
  error: (
    /**
     * @type {unknown[]}
     */
    ...msgs
  ) => {
    console.error(...msgs)
  },
  info: (
    /**
     * @type {unknown[]}
     */
    ...msgs
  ) => {
    console.info(...msgs)
  },
}

if (logLevel === 'warn') {
  logger.debug = (..._msgs) => {}
} else if (logLevel === 'error') {
  logger.debug = (..._msgs) => {}
  logger.warn = (..._msgs) => {}
} else if (logLevel === 'silent') {
  logger.debug = (..._msgs) => {}
  logger.warn = (..._msgs) => {}
  logger.error = (..._msgs) => {}
  logger.info = (..._msgs) => {}
}

export default logger

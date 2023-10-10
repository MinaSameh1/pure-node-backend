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
  getLevel: () => {
    return logLevel
  },
}

if (logLevel === 'warn') {
  logger.debug = (..._msgs) => null
} else if (logLevel === 'error') {
  logger.debug = (..._msgs) => null
  logger.warn = (..._msgs) => null
  logger.info = (..._msgs) => null
} else if (logLevel === 'info') {
  logger.debug = (..._msgs) => null
  logger.warn = (..._msgs) => null
} else if (logLevel === 'silent') {
  logger.debug = (..._msgs) => null
  logger.warn = (..._msgs) => null
  logger.error = (..._msgs) => null
  logger.info = (..._msgs) => null
}

export default logger

/**
 * @description This file is responsible for db connections.
 */
import pg from 'pg'
import { logger } from '../utils/logger.js'

/*
 * Object Pool that handles connections.
 * From: https://node-postgres.com/features/connecting
 */
let pool

/**
 * @description responsible for connecting to the database.
 */
export function connect() {
  // As recommended by official docs to use pooling for web apps: https://node-postgres.com/features/pooling
  pool = new pg.Pool({
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT),
    database: process.env.POSTGRES_DB,
  })
  return pool.connect()
}

/**
 * @description responsible for disconnecting the database.
 */
export function disconnect() {
  pool.end()
}

export function getClient() {
  return pool.connect()
}

/**
 * @description This will be used to run any single sql query,
 * Taken from the official Docs: https://node-postgres.com/guides/async-express
 * @param {String} sqlQuery: the SQL query
 * @param {Array<unknown>} params: Array of parameters for prepared statements, defaults to []
 * @returns {Promise<QueryResult>} the result of the query
 */
export async function query(sqlQuery, params = []) {
  const start = Date.now()
  const res = await pool.query(sqlQuery, params)
  logger.debug(
    `Executed Query, ${sqlQuery} , Took ${Date.now() - start}ms with ${
      res.rowCount ?? 0
    } count`,
  )
  return res
}

export default query

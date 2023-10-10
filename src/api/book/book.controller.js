import { isPositiveNumber } from '../../utils/utils.js'
import { isUUID } from '../../utils/uuid.util.js'
import * as service from './book.service.js'

/**
 * @description This function will handle getting and validating query params for the get all books route.
 * I decided it should not be in the service, as its more of a controller/framework thing. Let service deal with domain specific things.
 * @param {{
 * get: (key: string, defaultValue: any) => any
 * } & Record<string, string>} query: the query object from the request.
 * @returns {Object} the validated query params.
 *
 * @example
 * handleGetQueryParams(query)
 * // returns { page: 1, limit: 10, sort: 'title', sortDirection: '1', search: 'hello', title: 'hello', author: 'hello', isbn: 'hello', avaliable_quantity_start: 1, avaliable_quantity_end: 10, shelf_location: 'hello' }
 */
function getQueryParamsForGetAllController(query) {
  const page = isPositiveNumber(query.get('page')) ? query.get('page') : 1
  const limit = isPositiveNumber(query.get('limit')) ? query.get('limit') : 10
  const sort = query.get('sort', 'created_at')
  const sortDirection = query.get('sortDirection', '-1')
  const search = query.get('search')
  const title = query.get('title')
  const author = query.get('author')
  const isbn = query.get('isbn')
  const avaliable_quantity_start = query.get('avaliable_quantity_start')
  const avaliable_quantity_end = query.get('avaliable_quantity_end')
  const shelf_location = query.get('shelf_location')
  return {
    page,
    limit,
    sort,
    sortDirection,
    search,
    title,
    author,
    isbn,
    avaliable_quantity_start,
    avaliable_quantity_end,
    shelf_location,
  }
}

/**
 * @description This function will validate the id param from the request. Checks if its a valid uuid.
 * @param {String} id: the id param from the request.
 * @param {Object} res: the response object.
 * @returns {Boolean} true if valid, false if not.
 */
const validateParamId = (id, res) => {
  if (!id) {
    res.writeHead(400, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ message: 'Request recieved without an ID!' }))
    return false
  }
  if (!isUUID(id)) {
    res.writeHead(400, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ message: 'Invalid ID recieved:' + id }))
    return false
  }
  return true
}

export async function handleGetBookById(req, res) {
  const id = req.params.id
  if (!validateParamId(id, res)) {
    return
  }
  const item = await service.getBookById(id)
  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify({ data: item }))
}

export async function handleGetAllBooks(req, res) {
  const options = getQueryParamsForGetAllController(req.query)

  const results = await service.getAllBooks(options)

  res.writeHead(200, { 'Content-Type': 'application/json' })
  return res.end(
    JSON.stringify({
      data: results.result,
      total: results.total,
      pages: results.pages,
    }),
  )
}

export async function handleCreateBook(req, res) {
  const { errs, body } = service.validateBookBody(req.body)
  if (errs.length > 0) {
    res.writeHead(400, { 'Content-Type': 'application/json' })
    return res.end(JSON.stringify({ message: errs }))
  }
  const item = await service.createBook(body)
  res.writeHead(200, { 'Content-Type': 'application/json' })
  return res.end(JSON.stringify({ data: item }))
}

export async function handleUpdateBook(req, res) {
  if (!validateParamId(req.params.id, res)) {
    return
  }
  const { errs, body } = service.validateBookBody(req.body)
  if (errs.length > 0) {
    res.writeHead(400, { 'Content-Type': 'application/json' })
    return res.end(JSON.stringify({ message: errs }))
  }

  const item = await service.updateById(req.params.id, body)
  res.writeHead(200, { 'Content-Type': 'application/json' })
  return res.end(
    JSON.stringify({ data: item, message: 'Successfully updated' }),
  )
}

export async function handleDeleteBook(req, res) {
  if (!validateParamId(req.params.id, res)) {
    return
  }
  const item = await service.deleteById(req.params.id)
  res.writeHead(200, { 'Content-Type': 'application/json' })
  return res.end(
    JSON.stringify({ data: item, message: 'Successfully deleted' }),
  )
}

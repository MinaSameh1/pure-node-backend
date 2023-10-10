import { validateParamId } from '../../helper/validations.helper.js'
import { getDefaultQueryParams } from '../../helper/http.helper.js'
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
  const defaultQuery = getDefaultQueryParams(query)
  const search = query.get('search')
  const title = query.get('title')
  const author = query.get('author')
  const isbn = query.get('isbn')
  const avaliable_quantity_start = query.get('avaliable_quantity_start')
  const avaliable_quantity_end = query.get('avaliable_quantity_end')
  const shelf_location = query.get('shelf_location')
  return {
    ...defaultQuery,
    search,
    title,
    author,
    isbn,
    avaliable_quantity_start,
    avaliable_quantity_end,
    shelf_location,
  }
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
  validateParamId(req.params.id, res)
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
  validateParamId(req.params.id, res)
  const item = await service.deleteById(req.params.id)
  res.writeHead(200, { 'Content-Type': 'application/json' })
  return res.end(
    JSON.stringify({ data: item, message: 'Successfully deleted' }),
  )
}

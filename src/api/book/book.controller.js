import { isUUID } from '../../utils/uuid.util.js'
import * as service from './book.service.js'

export function handleGetBookById(req, res, id) {
  if (!id) {
    res.writeHead(400, { 'Content-Type': 'application/json' })
    return res.end(
      JSON.stringify({ message: 'Request recieved without an ID!' }),
    )
  }
  if (!isUUID(id)) {
    res.writeHead(400, { 'Content-Type': 'application/json' })
    return res.end(JSON.stringify({ message: 'Invalid ID recieved:' + id }))
  }
  res.end('get book by id, ' + id)
}

export function handleGetAllBooks(req, res, query) {
  res.writeHead(200, { 'Content-Type': 'application/json' })
  return res.end('get all books')
}

export async function handleCreateBook(req, res) {
  const { errs, body } = service.validateBookBody(req.body)
  if (errs.length > 0) {
    res.writeHead(400, { 'Content-Type': 'application/json' })
    return res.end(JSON.stringify({ message: errs }))
  }
  const item = await service.createBook(body)
  res.writeHead(200, { 'Content-Type': 'application/json' })
  return res.end(JSON.stringify({ result: item }))
}

export function handleUpdateBook(req, res, id) {
  res.writeHead(200, { 'Content-Type': 'application/json' })
  return res.end('update book')
}

export function handleDeleteBook(req, res, id) {
  res.writeHead(200, { 'Content-Type': 'application/json' })
  return res.end('delete book')
}

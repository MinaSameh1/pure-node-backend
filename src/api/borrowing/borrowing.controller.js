import { getDefaultQueryParams } from '../../helper/http.helper.js'
import { validateParamId } from '../../helper/validations.helper.js'
import { HttpError } from '../../utils/error.util.js'
import { isDate } from '../../utils/utils.js'
import * as service from './borrowing.service.js'

function getQueryParamsForGetBorrowedBooks(query) {
  const defaultQuery = getDefaultQueryParams(query)
  const borrowerId = query.get('borrower_id')
  const bookId = query.get('book_id')
  return {
    ...defaultQuery,
    sort: query.get('sort', 'checked_out_date'),
    borrowerId,
    bookId,
    overdue: query.get('overdue'),
    lastMonth: query.get('last_month'),
    csv: query.get('csv'),
  }
}

function getQueryParamsForGetBorrowedBooksLog(query) {
  const defaultQuery = getQueryParamsForGetBorrowedBooks(query)
  return {
    ...defaultQuery,
    sort: query.get('sort', 'created_at'),
    type: query.get('type'),
  }
}

export async function handleCheckoutBook(req, res) {
  const bookId = req.params.bookId
  const borrowerId = req.params.borrowerId
  const dueDate = req.body?.due_date
  if (!isDate(dueDate)) {
    throw new HttpError(400, 'Invalid Due Date')
  } else if (new Date(req.body.due_date) > new Date()) {
    throw new HttpError(400, 'Due Date cannot be in the future')
  }

  validateParamId(bookId)
  validateParamId(borrowerId)

  const result = await service.checkoutBook(borrowerId, bookId, dueDate)

  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify({
    message: 'Book checked out successfully',
    data: result
  }))
}

export async function handleReturnBook(req, res) {
  const bookId = req.params.bookId
  const borrowerId = req.params.borrowerId

  validateParamId(bookId)
  validateParamId(borrowerId)

  await service.returnBook(bookId, borrowerId)
  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify({
    message: 'Book returned successfully',
  }))
}

export async function handleGetBorrowedBooks(req, res) {
  const query = getQueryParamsForGetBorrowedBooks(req.query)

  const results = await service.getBorrowedBooks(query)

  if (query.csv) {
    res.setHeader('Content-Type', 'text/csv')
    res.setHeader('Content-Disposition', 'attachment; filename=borrowed_books.csv')
    const headers = [
      "id",
      "borrower",
      "book",
      "due_date",
      "checked_out_date",
      "return_date",
      "title",
      "author",
      "name",
      "email",
    ]
    res.write(headers.join(',') + '\n')
    results.result.forEach(row => {
      res.write(headers.map(header => row[header]).join(',') + '\n')
    })
    res.end()
    return
  }


  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify({
    data: results.result,
    total: results.total,
    pages: results.pages,
  }))
}

export async function handleGetTransactionLog(req, res) {
  const query = getQueryParamsForGetBorrowedBooksLog(req.query)

  const results = await service.getTransactionLog(query)

  if (query.csv) {
    res.setHeader('Content-Type', 'text/csv')
    res.setHeader('Content-Disposition', 'attachment; filename=borrow_transactions_log.csv')
    const headers = [
      "book_id",
      "borrower_id",
      "created_at",
      "transation_type",
    ]
    res.write(headers.join(',') + '\n')
    results.result.forEach(row => {
      res.write(headers.map(header => row[header]).join(',') + '\n')
    })
    res.end()
    return
  }

  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify({
    data: results.result,
    total: results.total,
    pages: results.pages,
  }))
}

import * as bookService from '../book/book.service.js'
import { borrowTransactionLogRepository } from '../../db/borrow_transactions_log.repository.js'
import { borrowedBooksRepository } from '../../db/borrowerd_books.repository.js'
import { HttpError } from '../../utils/error.util.js'
import { isSortColumnError } from '../../helper/db.helper.js'

export async function checkoutBook(borrowerId, bookId, dueDate) {
  // check if book already borrowed
  const borrowedBook = await borrowedBooksRepository.hasBorrowedBook(
    borrowerId,
    bookId,
  )
  if (borrowedBook) {
    throw new HttpError(400, 'Book is already borrowed')
  }
  // decrease book quantity
  // Need to get rest of the book for PUT!!
  const book = await bookService.getBookById(bookId)
  if (book.avaliable_quantity <= 0) {
    throw new HttpError(400, 'Book is not available')
  }

  const results = await Promise.allSettled([
    borrowTransactionLogRepository.createCheckout(borrowerId, bookId),
    borrowedBooksRepository.create(borrowerId, bookId, dueDate),
    bookService.updateById(bookId, {
      ...book,
      avaliable_quantity: book.avaliable_quantity - 1,
    }),
  ])

  results.forEach(result => {
    if (result.status === 'rejected') throw result.reason
  })

  return {
    result: results[1].value,
  }
}

export async function returnBook(borrowerId, bookId) {
  const borrowedBook = await borrowedBooksRepository.hasBorrowedBook(
    borrowerId,
    bookId,
  )
  if (!borrowedBook) {
    throw new HttpError(400, 'Book is not borrowed')
  }
  if (borrowedBook.return_date) {
    throw new HttpError(400, 'Book is already returned')
  }
  const result = await borrowedBooksRepository.updateReturned(
    borrowerId,
    bookId,
  )
  if (!result) {
    throw new HttpError(400, 'Book is not borrowed')
  }

  await borrowTransactionLogRepository.createReturn(borrowerId, bookId)
  const book = await bookService.getBookById(bookId)
  await bookService.updateById(bookId, {
    ...book,
    avaliable_quantity: book.avaliable_quantity + 1,
  })

  return result
}

/**
 * @param {{borrowerId: string, bookId: string, limit: number, page: number, sort: string, sortDirection: unknown | 1}} options
 */
export async function getBorrowedBooks(options) {
  try {
    return await borrowedBooksRepository.findAll(options)
  } catch (err) {
    if (isSortColumnError(err)) {
      throw new HttpError(400, 'Invalid sort column')
    }
    throw err
  }
}

/**
 * @param {{borrowerId: string, bookId: string, limit: number, page: number, sort: string, sortDirection: unknown | 1}} options
 */
export async function getTransactionLog(options) {
  try {
    return await borrowTransactionLogRepository.findAll(options)
  } catch (err) {
    if (isSortColumnError(err)) {
      throw new HttpError(400, 'Invalid sort column')
    }
    throw err
  }
}

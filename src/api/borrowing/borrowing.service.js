import * as borrowerService from "../borrower/borrower.service.js";
import * as bookService from "../book/book.service.js";
import { borrowTransactionLogRepository } from '../../db/borrow_transactions_log.repository.js'
import { borrowedBooksRepository } from "../../db/borrowerd_books.repository.js";
import { HttpError } from "../../utils/error.util.js";

export async function checkoutBook(borrowerId, bookId, dueDate) {
  // check if book already borrowed
  const borrowedBook = await borrowedBooksRepository.hasBorrowedBook(borrowerId, bookId)
  if (borrowedBook) {
    throw new HttpError(400, 'Book is already borrowed')
  }
  const results = await Promise.allSettled([
    borrowTransactionLogRepository.createCheckout(borrowerId, bookId),
    borrowedBooksRepository.create(borrowerId, bookId, dueDate)
  ])

  results.forEach(result => {
    if (result.status === 'rejected')
      throw result.reason
  })

  return {
    result: results[1].value,
  }
}

export async function returnBook(borrowerId, bookId) {
  const borrowedBook = await borrowedBooksRepository.hasBorrowedBook(borrowerId, bookId)
  if (!borrowedBook) {
    throw new HttpError(400, 'Book is not borrowed')
  }
  if (borrowedBook.return_date) {
    throw new HttpError(400, 'Book is already returned')
  }
  const result = await borrowedBooksRepository.updateReturned(borrowerId, bookId)
  if (!result) {
    throw new HttpError(400, 'Book is not borrowed')
  }

  await borrowTransactionLogRepository.createReturn(borrowerId, bookId)

  return result
}

/**
  * @param {{borrowerId: string, bookId: string, limit: number, page: number, sort: string, sortDirection: unknown | 1}} options
  */
export async function getBorrowedBooks(options) {
  return borrowedBooksRepository.findAll(options)
}

/**
  * @param {{borrowerId: string, bookId: string, limit: number, page: number, sort: string, sortDirection: unknown | 1}} options
  */
export async function getTransactionLog(options) {
  return borrowTransactionLogRepository.findAll(options)
}

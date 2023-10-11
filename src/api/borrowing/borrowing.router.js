import { handleErrors } from '../../helper/http.helper.js'
import {
  handleCheckoutBook,
  handleGetBorrowedBooks,
  handleReturnBook,
  handleGetTransactionLog,
} from './borrowing.controller.js'

const route = 'borrow'

/**
 * @description: This file contains all the routes for actions
 * @param {Request} req - request object
 * @param {Response} res - response object
 * @param {string[]} pathName - array of path names
 * @param {URLSearchParams} query - query params
 * @returns {Promise<boolean>} - returns true if it handles the request
 */
export const handleBorroweringPaths = async (req, res, pathName) => {
  if (pathName.includes(route) && pathName[0] === route) {
    try {
      if (req.method === 'GET') {
        // for path /borrow/log
        if (pathName.length > 1 && pathName[1] === 'log') {
          await handleGetTransactionLog(req, res)
          return true
        }
        await handleGetBorrowedBooks(req, res)
        return true
      }
      if (req.method === 'POST') {
        // for paths like /borrow/USER_ID/checkout/BOOK_ID
        if (pathName.length > 2 && pathName[2] === 'checkout' && pathName[3]) {
          req.params.bookId = pathName[3]
          req.params.borrowerId = pathName[1]
          await handleCheckoutBook(req, res)
          return true
        }
        // for paths like /borrow/USER_ID/return/BOOK_ID
        if (pathName.length > 2 && pathName[2] === 'return' && pathName[3]) {
          req.params.bookId = pathName[3]
          req.params.borrowerId = pathName[1]
          await handleReturnBook(req, res)
          return true
        }
      }
      return false
    } catch (err) {
      handleErrors(err, req, res)
      return true
    }
  }
}

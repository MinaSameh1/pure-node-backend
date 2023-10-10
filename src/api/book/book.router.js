import { handleErrors } from '../../helper/http.helper.js'
import {
  handleGetAllBooks,
  handleGetBookById,
  handleCreateBook,
  handleUpdateBook,
  handleDeleteBook,
} from './book.controller.js'

const route = 'book'

/**
 * @description: This file contains all the routes for the book resource
 * @param {Request} req - request object
 * @param {Response} res - response object
 * @param {string[]} pathName - array of path names
 * @param {URLSearchParams} query - query params
 * @returns {Promise<boolean>} - returns true if it handles the request
 */
export const handleBookPaths = async (req, res, pathName) => {
  if (pathName.includes(route) && pathName[0] === route) {
    try {
      if (req.method === 'GET') {
        // check if it has an id
        // if it has an id, return the book with that id
        if (pathName.length > 1 && pathName[1]) {
          // leave validation of the ID to the controller
          req.params.id = pathName[1]
          await handleGetBookById(req, res)
          return true
        } else {
          await handleGetAllBooks(req, res)
          return true
        }
      }
      if (req.method === 'POST') {
        await handleCreateBook(req, res)
        return true
      }
      if (req.method === 'PUT') {
        req.params.id = pathName.length > 1 ? pathName[1] : undefined
        await handleUpdateBook(req, res)
        return true
      }
      if (req.method === 'DELETE') {
        req.params.id = pathName.length > 1 ? pathName[1] : undefined
        await handleDeleteBook(req, res)
        return true
      }
      return false
    } catch (err) {
      handleErrors(err, req, res)
      return true
    }
  }
}

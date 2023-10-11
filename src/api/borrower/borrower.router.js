import { handleErrors } from '../../helper/http.helper.js'
import {
  handleGet,
  handleGetById,
  handleCreate,
  handleUpdate,
  handleDelete,
} from './borrower.controller.js'

const route = 'borrower'

/**
 * @description: This file contains all the routes for the borrower resource
 * @param {Request} req - request object
 * @param {Response} res - response object
 * @param {string[]} pathName - array of path names
 * @param {URLSearchParams} query - query params
 * @returns {Promise<boolean>} - returns true if it handles the request
 */
export const handleBorrowerPaths = async (req, res, pathName) => {
  if (pathName.includes(route) && pathName[0] === route) {
    try {
      if (req.method === 'GET') {
        if (pathName.length > 1 && pathName[1]) {
          req.params.id = pathName[1]
          await handleGetById(req, res)
          return true
        } else {
          await handleGet(req, res)
          return true
        }
      }
      if (req.method === 'POST') {
        await handleCreate(req, res)
        return true
      }
      if (req.method === 'PUT') {
        req.params.id = pathName.length > 1 ? pathName[1] : undefined
        await handleUpdate(req, res)
        return true
      }
      if (req.method === 'DELETE') {
        req.params.id = pathName.length > 1 ? pathName[1] : undefined
        await handleDelete(req, res)
        return true
      }
      return false
    } catch (err) {
      handleErrors(err, req, res)
      return true
    }
  }
}

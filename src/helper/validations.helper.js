import { HttpError } from '../utils/error.util.js'
import { isUUID } from "../utils/utils.js"

/**
 * @description This function will validate the id param from the request. Checks if its a valid uuid.
 * @param {String} id: the id param from the request.
 * @param {Object} res: the response object.
 * @returns {Boolean} true if valid, false if not.
 * @throws {HttpError} if the id is not valid.
 */
export const validateParamId = id => {
  if (!id) {
    throw new HttpError(400, 'No Id recieved')
  }
  if (!isUUID(id)) {
    throw new HttpError(400, 'Invalid ID recieved:' + id)
  }
  return true
}

import { borrowerRepository } from '../../db/borrower.repository.js'
import { isSortColumnError } from '../../helper/db.helper.js'
import { HttpError } from '../../utils/error.util.js'
import { isEmail } from '../../utils/utils.js'

export const validateBody = body => {
  const errs = []
  if (!body) {
    return {
      errs: ['Request recieved without a body!'],
      body,
    }
  }

  // validate email
  if (!body.email) {
    errs.push(['Request recieved without an email!'])
  } else if (typeof body.email !== 'string') {
    errs.push(['Shelf location must be a string!'])
  } else if (body.email.length < 3 || body.email.length > 50) {
    errs.push([
      'Shelf location must be at least 3 and at most 50 characters long!',
    ])
  } else if (!isEmail(body.email)) {
    errs.push(['Email must be a valid email address!'])
  }

  // validate name
  if (!body.name) {
    errs.push(['Request recieved without a name!'])
  } else if (typeof body.name !== 'string') {
    errs.push(['Shelf location must be a string!'])
  } else if (body.name.length < 3 || body.name.length > 100) {
    errs.push([
      'Shelf location must be at least 3 and at most 100 characters long!',
    ])
  } else if (body.name.match(/[^a-zA-Z0-9 ]/)) {
    errs.push(['Name must only contain alphanumeric characters!'])
  }

  return {
    errs,
    body,
  }
}

export const create = async borrower => {
  const emailExists = await borrowerRepository.emailExists(borrower.email)
  if (emailExists) {
    throw new HttpError(400, 'Borrower with that email already exists!')
  }
  return borrowerRepository.create(borrower)
}

export const getAll = async options => {
  try {
    // await here for the error to be caught by the catch block
    return await borrowerRepository.findAll(options)
  } catch (err) {
    if (isSortColumnError(err)) {
      throw new HttpError(400, 'Invalid sort column!')
    }
    // handle it above
    throw err
  }
}

export const getById = async id => {
  try {
    const item = await borrowerRepository.findOneById(id)
    if (!item) {
      throw new HttpError(404, 'Borrower not found!')
    }
    return item
  } catch (err) {
    throw new HttpError(500, err.message, err)
  }
}

export const updateById = async (id, borrower) => {
  const itemExists = await borrowerRepository.findOneById(id)
  if (!itemExists) {
    throw new HttpError(404, 'Borrower not found!')
  }
  return borrowerRepository.updateById(id, borrower)
}

export const deleteById = async id => {
  const item = await borrowerRepository.deleteById(id)
  if (!item) {
    throw new HttpError(404, 'Borrower not found!')
  }
  return item
}

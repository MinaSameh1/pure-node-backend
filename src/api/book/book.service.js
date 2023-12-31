import { bookRepository } from '../../db/book.repository.js'
import { isSortColumnError } from '../../helper/db.helper.js'
import { HttpError } from '../../utils/error.util.js'
import { isNumber } from '../../utils/utils.js'

export const validateBookBody = body => {
  const errs = []
  if (!body) {
    return {
      errs: ['Request recieved without a body!'],
      body,
    }
  }
  if (!body.title) {
    errs.push(['Request recieved without a title!'])
  } else if (body.title.length < 3) {
    errs.push(['Title must be at least 3 characters long!'])
  } else if (body.title.length > 100) {
    errs.push(['Title must be less than 100 characters long!'])
  } else if (body.title.match(/[^a-zA-Z0-9 ]/)) {
    errs.push(['Title must only contain alphanumeric characters!'])
  }
  if (!body.author) {
    errs.push(['Request recieved without an author!'])
  } else if (body.author.length < 3) {
    errs.push(['Author must be at least 3 characters long!'])
  } else if (body.author.length > 100) {
    errs.push(['Author must be less than 100 characters long!'])
  } else if (body.author.match(/[^a-zA-Z0-9 ]/)) {
    errs.push(['Author must only contain alphanumeric characters!'])
  }

  if (!body.isbn) {
    errs.push(['Request recieved without an isbn!'])
  } else if (body.isbn?.toString().match(/[^a-zA-Z0-9 -]/)) {
    errs.push(['Isbn must only contain alphanumeric characters!'])
  }
  if (!body.avaliable_quantity) {
    errs.push(['Request recieved without an avaliable_quantity!'])
  } else if (!isNumber(body.avaliable_quantity)) {
    errs.push(['Avaliable quantity must be a number!'])
  } else if (body.avaliable_quantity < 0) {
    errs.push(['Avaliable quantity must be greater than 0!'])
  } else {
    body.avaliable_quantity = parseInt(body.avaliable_quantity)
  }
  if (!body.shelf_location) {
    errs.push(['Request recieved without a shelf_location!'])
  }
  return {
    errs,
    body,
  }
}

export const createBook = async book => {
  const isbnExists = await bookRepository.getBookByIsbn(book.isbn)
  if (isbnExists) {
    throw new HttpError(400, 'Book with that isbn already exists!')
  }
  return bookRepository.create(book)
}

/**
  * @throws {HttpError} if the sort column is invalid
  */
export const getAllBooks = async options => {
  try {
    // await here for the error to be caught by the catch block
    return await bookRepository.findAll(options)
  } catch (err) {
    if (isSortColumnError(err)) {
      throw new HttpError(400, 'Invalid sort column!')
    }
    // handle it above
    throw err
  }
}

export const getBookById = async id => {
  const book = await bookRepository.findOneById(id)
  if (!book) {
    throw new HttpError(404, 'Book not found!')
  }
  return book
}

export const updateById = async (id, book) => {
  const bookExists = await bookRepository.findOneById(id)
  if (!bookExists) {
    throw new HttpError(404, 'Book not found!')
  }
  return bookRepository.updateById(id, book)
}

export const deleteById = async id => {
  const item = await bookRepository.deleteById(id)
  if (!item) {
    throw new HttpError(404, 'Book not found!')
  }
  return item
}

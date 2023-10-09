import { query } from '../helper/db.helper.js'

export const bookRepository = {
  async create(book) {
    const result = await query(
      `INSERT INTO public.books(
title, author, isbn, avaliable_quantity, shelf_location)
VALUES ($1, $2, $3, $4, $5) RETURNING *;`,
      [
        book.title,
        book.author,
        book.isbn,
        book.avaliable_quantity,
        book.shelf_location,
      ],
    )
    return result.rows[0]
  },

  async getAllBooks({ page = 1, limit = 10, search = undefined }) {
    const offset = (page - 1) * limit
    if (!search) {
      const result = await query(
        'SELECT * FROM public.books LIMIT ? OFFSET ?;',
        [limit, offset],
      )
      return result.rows
    }
    const result = await query(
      'SELECT * FROM public.books WHERE title LIKE ? OR author LIKE ? LIMIT ? OFFSET ?;',
      [search, search, limit, offset],
    )
    return result.rows
  },

  async getBookById(id) {
    const result = await query(
      'SELECT * FROM public.books WHERE id = ?;',
      [id],
    )
    return result.rows[0]
  },

  async updateBook(id, book) {
    const result = await query(
      `UPDATE public.books
SET title = ?, author = ?, isbn = ?, avaliable_quantity = ?, shelf_location = ?
WHERE id = ? RETURNING *;`,
      [
        book.title,
        book.author,
        book.isbn,
        book.avaliable_quantity,
        book.shelf_location,
        id,
      ],
    )
    return result.rows[0]
  },

  async deleteBook(id) {
    const result = await query(
      'DELETE FROM public.books WHERE id = ? RETURNING *;',
      [id],
    )
    return result.rows[0]
  },

  async getBookByIsbn(isbn) {
    const result = await query(
      'SELECT b.id FROM public.books as b WHERE isbn = $1;',
      [isbn],
    )
    return result.rows[0]
  }
}

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

  async findAll({
    page = 1,
    limit = 10,
    sort = 'created_at',
    sortDirection = '1',
    search = undefined,
    title = undefined,
    author = undefined,
    isbn = undefined,
    avaliable_quantity_start = undefined,
    avaliable_quantity_end = undefined,
    shelf_location = undefined,
  }) {
    const offset = (page - 1) * limit

    // lets construct the query
    let queryStr = 'SELECT * FROM public."books"'
    let params = []
    if (search) {
      queryStr += ` WHERE title LIKE $1 OR author LIKE $2`
      params.push(`%${search}%`)
      params.push(`%${search}%`)
    }
    if (title) {
      if (queryStr.includes('WHERE')) {
        queryStr += ` AND title LIKE $${params.length + 1}`
      } else queryStr += ' WHERE title LIKE $1'
      params.push(`%${title}%`)
    }
    if (author) {
      if (queryStr.includes('WHERE')) {
        queryStr += ` AND author LIKE $${params.length + 1}`
      } else queryStr += ' WHERE author LIKE $1'
      params.push(`%${author}%`)
    }
    if (isbn) {
      if (queryStr.includes('WHERE')) {
        queryStr += ` AND isbn = $${params.length + 1}`
      } else queryStr += ' WHERE isbn LIKE $1'
      params.push(`%${isbn}%`)
    }
    if (avaliable_quantity_start) {
      if (queryStr.includes('WHERE')) {
        queryStr += ` AND avaliable_quantity >= $${params.length + 1}`
      } else queryStr += ' WHERE avaliable_quantity >= $1'
      params.push(avaliable_quantity_start)
    }
    if (avaliable_quantity_end) {
      if (queryStr.includes('WHERE')) {
        queryStr += ` AND avaliable_quantity <= $${params.length + 1}`
      } else queryStr += ' WHERE avaliable_quantity <= $1'
      params.push(avaliable_quantity_end)
    }
    if (shelf_location) {
      if (queryStr.includes('WHERE')) {
        queryStr += ` AND shelf_location = $${params.length + 1}`
      } else queryStr += ' WHERE shelf_location = $1'
      params.push(shelf_location)
    }

    const totalCount = await query(queryStr.replace('*', 'COUNT(*)'), params)

    queryStr += ` ORDER BY ${sort} ${
      sortDirection === '1' ? 'ASC' : 'DESC'
    } LIMIT $${params.length + 1} OFFSET $${params.length + 2};`
    params.push(limit, offset)
    const result = await query(queryStr, params)
    const count = Number(totalCount.rows[0].count)
    return {
      total: count,
      result: result.rows,
      pages: Math.ceil(count / limit),
    }
  },

  async findOneById(id) {
    const result = await query('SELECT * FROM public.books WHERE id = $1;', [
      id,
    ])
    return result.rows[0]
  },

  async getBookByIsbn(isbn) {
    const result = await query(
      'SELECT b.id FROM public.books as b WHERE isbn = $1;',
      [isbn],
    )
    return result.rows[0]
  },

  async updateById(id, book) {
    const result = await query(
      `UPDATE public.books 
  SET title = $1, author = $2, isbn = $3, avaliable_quantity = $4, shelf_location = $5
  WHERE id = $6 RETURNING *;`,
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

  async deleteById(id) {
    const result = await query(
      'DELETE FROM public.books WHERE id = $1 RETURNING *;',
      [id],
    )
    return result.rows[0]
  },
}

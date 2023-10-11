import { query } from '../helper/db.helper.js'

export const borrowedBooksRepository = {
  create: async (borrowerId, bookId, due_date) => {
    const result = await query(
      `INSERT INTO public.borrowerd_books (borrower, book, due_date) VALUES ($1, $2, $3) RETURNING *`,
      [borrowerId, bookId, due_date],
    )
    return result.rows[0]
  },

  updateReturned: async (borrowerId, bookId) => {
    const result = await query(
      'UPDATE public.borrowerd_books SET return_date = NOW() WHERE borrower = $1 AND book = $2 RETURNING *',
      [borrowerId, bookId],
    )
    return result.rows.length !== 0
  },

  findAll: async ({
    limit = 10,
    page = 1,
    sort = 'checked_out_date',
    sortDirection = 'ASC',
    borrowerId = null,
    bookId = null,
    overdue = null,
    lastMonth = null,
  }) => {
    const offset = (page - 1) * limit
    let queryStr = `SELECT bb.*, b.title, b.author, br.name, br.email FROM public.borrowerd_books as bb`
    const params = []

    if (borrowerId) {
      queryStr += ` WHERE bb.borrower = $${params.length + 1}`
      params.push(borrowerId.toString())
    }
    if (bookId) {
      if (queryStr.includes('WHERE'))
        queryStr += ` AND bb.book = $${params.length + 1}`
      else queryStr += ` WHERE bb.book = $${params.length + 1}`
      params.push(bookId.toString())
    }
    if (overdue) {
      if (queryStr.includes('WHERE')) queryStr += ` AND bb.due_date < NOW()`
      else queryStr += ` WHERE bb.due_date < NOW()`
      queryStr += ` AND bb.return_date IS NULL`
    }
    if (lastMonth) {
      if (queryStr.includes('WHERE'))
        queryStr += ` AND bb.checked_out_date > NOW() - INTERVAL '1 month'`
      else queryStr += ` WHERE bb.checked_out_date > NOW() - INTERVAL '1 month'`
    }

    const totalCount = await query(
      queryStr.replace(
        'bb.*, b.title, b.author, br.name, br.email',
        'COUNT(*)',
      ),
      params,
    )

    // Join with books and borrowers table
    const joinStatement = ` LEFT JOIN books b ON b.id=bb.book LEFT JOIN borrower br ON br.id=bb.borrower`
    // join needs to come before where
    if (queryStr.includes('WHERE'))
      queryStr = queryStr.replace('WHERE', joinStatement + ' WHERE')
    else queryStr += joinStatement

    queryStr += ` ORDER BY bb.${sort} ${sortDirection === '1' ? 'ASC' : 'DESC'}`
    const count = Number(totalCount.rows[0].count)
    if (page === 0) {
      const result = await query(queryStr, params)
      return {
        total: count,
        result: result.rows,
        pages: 1,
      }
    } else if (offset >= count) {
      return {
        total: 0,
        result: [],
        pages: 0,
      }
    }
    queryStr += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`
    params.push(limit, offset)

    const result = await query(queryStr, params)

    return {
      total: count,
      result: result.rows,
      pages: Math.ceil(count / limit),
    }
  },

  hasBorrowedBook: async (borrowerId, bookId) => {
    const result = await query(
      `SELECT * FROM public.borrowerd_books as bb WHERE bb.borrower = $1 AND bb.book = $2 AND bb.return_date IS NULL`,
      [borrowerId, bookId],
    )
    return result.rows.length !== 0
  },
}

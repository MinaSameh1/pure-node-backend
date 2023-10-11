import { query } from '../helper/db.helper.js'

export const borrowTransactionLogRepository = {
  createCheckout: async (borrowerId, bookId) => {
    const result = await query(
      `INSERT INTO borrow_transactions_log (borrower_id, book_id, transation_type) VALUES ($1, $2, $3) RETURNING *`,
      [borrowerId, bookId, 'checkout']
    )
    return result.rows[0]
  },

  createReturn: async (borrowerId, bookId) => {
    const result = await query(
      `INSERT INTO borrow_transactions_log (borrower_id, book_id, transation_type) VALUES ($1, $2, $3) RETURNING *`,
      [borrowerId, bookId, 'return']
    )
    return result.rows[0]
  },

  // check that the book is not already borrowed 
  async hasBorrowedBook(borrowerId, bookId) {
    const result = await query(
      `SELECT * FROM borrow_transactions_log WHERE borrower_id = $1 AND book_id = $2 AND transation_type = 'checkout'`,
      [borrowerId, bookId]
    )
    return result.rows.length !== 0 ? result.rows[0] : null
  },

  findAll: async ({
    page = 1,
    limit = 10,
    sort = 'created_at',
    sortDirection = '1',
    type = null,
    bookId = null,
    borrowerId = null,
    lastMonth = null,
  }) => {
    const offset = (page - 1) * limit
    let queryStr = 'SELECT * FROM borrow_transactions_log'
    const params = []

    if (borrowerId) {
      queryStr += ` WHERE borrower_id = $${params.length + 1}`
      params.push(borrowerId.toString())
    }
    if (bookId) {
      if (queryStr.includes('WHERE')) queryStr += ` AND book_id = $${params.length + 1}`
      else queryStr += ` WHERE book_id = $${params.length + 1}`
      params.push(bookId.toString())
    }
    if (type) {
      if (queryStr.includes('WHERE')) queryStr += ` AND transation_type = $${params.length + 1}`
      else queryStr += ` WHERE transation_type = $${params.length + 1}`
      params.push(type)
    }
    if (lastMonth) {
      if (queryStr.includes('WHERE')) queryStr += ` AND created_at > NOW() - INTERVAL '1 month'`
      else queryStr += ` WHERE created_at > NOW() - INTERVAL '1 month'`
    }
    const totalCount = await query(queryStr.replace('*', 'COUNT(*)'), params)

    queryStr += ` ORDER BY ${sort} ${sortDirection === "1" ? "ASC" : "DESC"} LIMIT $${params.length + 1} OFFSET $${params.length + 2}`
    params.push(limit, offset)
    const result = await query(queryStr, params)
    const count = Number(totalCount.rows[0].count)
    return {
      total: count,
      result: result.rows,
      pages: Math.ceil(count / limit),
    }
  }

  // prevent update and delete.
}

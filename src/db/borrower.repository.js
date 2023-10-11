import { query } from '../helper/db.helper.js'

export const borrowerRepository = {
  async create(borrower) {
    const result = await query(
      `INSERT INTO public.borrower (name, email) VALUES ($1, $2) RETURNING *;`,
      [borrower.name, borrower.email],
    )
    return result.rows[0]
  },

  async findAll({
    page = 1,
    limit = 10,
    sort = 'created_at',
    sortDirection = '1',
    name = undefined,
    email = undefined,
  }) {
    const offset = (page - 1) * limit
    let queryStr = 'SELECT * FROM public.borrower'
    const params = []

    if (name) {
      queryStr += ` WHERE name LIKE $${params.length + 1}`
      params.push(`%${name}%`)
    }
    if (email) {
      if (queryStr.includes('WHERE'))
        queryStr += ` AND email LIKE $${params.length + 1}`
      else queryStr += ` WHERE email LIKE $${params.length + 1}`
      params.push(`%${email}%`)
    }

    const totalCount = await query(queryStr.replace('*', 'COUNT(*)'), params)
    queryStr += ` ORDER BY ${sort} ${sortDirection === '1' ? 'ASC' : 'DESC'
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
    const result = await query(
      `SELECT * FROM public.borrower WHERE id = $1;`,
      [id],
    )
    return result.rows.length > 0 ? result.rows[0] : null
  },

  async updateById(id, borrower) {
    const result = await query(
      `UPDATE public.borrower SET name = $1, email = $2 WHERE id = $3 RETURNING *;`,
      [borrower.name, borrower.email, id],
    )
    if (result.rows.length === 0) {
      return null
    }
    return result.rows[0]
  },

  async deleteById(id) {
    const result = await query(
      `DELETE FROM public.borrower WHERE id = $1 RETURNING *;`,
      [id],
    )
    if (result.rows.length === 0) {
      return null
    }
    return result.rows[0]
  },

  async emailExists(email) {
    const result = await query(
      `SELECT * FROM public.borrower WHERE email = $1;`,
      [email],
    )
    return result.rows.length > 0
  },
}

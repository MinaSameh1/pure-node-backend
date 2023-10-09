import { query } from '../utils'

export const UserRepository = {
  async create(user) {
    const result = await query(
      'INSERT INTO public."users"(name, email) VALUES($1, $2)',
      [user.name, user.email],
    )
    return result.rows[0]
  },
}

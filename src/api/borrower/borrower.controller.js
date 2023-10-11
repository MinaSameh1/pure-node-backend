import { getDefaultQueryParams } from '../../helper/http.helper.js'
import { validateParamId } from '../../helper/validations.helper.js'
import * as service from './borrower.service.js'

function getQueryParamsForGetAllController(query) {
  const defaultQuery = getDefaultQueryParams(query)
  const email = query.get('email')
  const name = query.get('name')
  return {
    ...defaultQuery,
    email,
    name,
  }
}

export async function handleGetById(req, res) {
  const id = req.params.id

  validateParamId(id, res)

  const item = await service.getById(id)
  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify({ data: item }))
}

export async function handleGet(req, res) {
  const options = getQueryParamsForGetAllController(req.query)

  const results = await service.getAll(options)

  res.writeHead(200, { 'Content-Type': 'application/json' })
  return res.end(
    JSON.stringify({
      data: results.result,
      total: results.total,
      pages: results.pages,
    }),
  )
}

export async function handleCreate(req, res) {
  const { errs, body } = service.validateBody(req.body)
  if (errs.length > 0) {
    res.writeHead(400, { 'Content-Type': 'application/json' })
    return res.end(JSON.stringify({ message: errs }))
  }
  const item = await service.create(body)
  res.writeHead(200, { 'Content-Type': 'application/json' })
  return res.end(JSON.stringify({ data: item }))
}

export async function handleUpdate(req, res) {
  validateParamId(req.params.id, res)
  const { errs, body } = service.validateBody(req.body)
  if (errs.length > 0) {
    res.writeHead(400, { 'Content-Type': 'application/json' })
    return res.end(JSON.stringify({ message: errs }))
  }

  const item = await service.updateById(req.params.id, body)
  res.writeHead(200, { 'Content-Type': 'application/json' })
  return res.end(
    JSON.stringify({ data: item, message: 'Successfully updated' }),
  )
}

export async function handleDelete(req, res) {
  validateParamId(req.params.id, res)
  const item = await service.deleteById(req.params.id)
  res.writeHead(200, { 'Content-Type': 'application/json' })
  return res.end(
    JSON.stringify({ data: item, message: 'Successfully deleted' }),
  )
}

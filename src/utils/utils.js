export const isNumber = value => {
  return !isNaN(Number(value))
}

export const isPositiveNumber = value => {
  return isNumber(value) && Number(value) > 0
}

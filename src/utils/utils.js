export const isNumber = value => {
  return !isNaN(Number(value))
}

export const isPositiveNumber = value => {
  return isNumber(value) && Number(value) > 0
}

export function isEmail(email) {
  const emailFormat =
    /^[a-zA-Z0-9_.+]+(?<!^[0-9]*)@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/
  if (email && email !== '' && email.match(emailFormat)) {
    return true
  }
  return false
}

export function isUUID(input) {
  // Regular expression to match a UUID pattern
  const uuidPattern =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/

  // Test the input string against the pattern
  return uuidPattern.test(input)
}

export function isDate(unknown) {
  const testVar = new Date(unknown);
  return (
    // null is not a valid date, it causes issues when used with new Date()
    unknown !== null &&
    testVar.toString() !== "Invalid Date" &&
    !isNaN(testVar.getTime())
  );
}

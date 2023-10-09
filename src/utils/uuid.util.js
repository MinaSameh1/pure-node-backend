export function isUUID(input) {
  // Regular expression to match a UUID pattern
  const uuidPattern =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/

  // Test the input string against the pattern
  return uuidPattern.test(input)
}

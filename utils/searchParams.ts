/**
 * Converts a search parameters object to a query string.
 * @param searchParams - Object containing search parameters
 * @returns A formatted query string starting with '?', or an empty string if no valid parameters
 */
export function serializeSearchParams(searchParams: {
  [key: string]: string | string[] | undefined
}): string {
  // Filter out undefined values and create key=value pairs
  const validParams = Object.entries(searchParams)
    .filter(([_, value]) => value !== undefined)
    .map(([key, value]) => {
      // Handle array values
      if (Array.isArray(value)) {
        return value
          .filter((item) => item !== undefined && item !== null && item !== '')
          .map((item) => `${encodeURIComponent(key)}=${encodeURIComponent(item)}`)
          .join('&')
      }
      // Handle string values
      return `${encodeURIComponent(key)}=${encodeURIComponent(value as string)}`
    })
    .filter((param) => param !== '') // Filter out any empty strings
    .join('&')

  return validParams ? `?${validParams}` : ''
}

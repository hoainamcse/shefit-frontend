import { statusCodeErrorMap } from '../errors/httpErrors'

const public_url = process.env.NEXT_PUBLIC_SERVER_URL

/**
 * Fetches data from the server.
 * @param input - The URL to fetch.
 * @param init - The optional RequestInit object for additional configuration.
 * @param json - Whether to add content-type header as application/json.
 * @returns A Promise that resolves to the Response object representing the fetched data.
 * @throws Error if the base URL is not set, if fetching data fails, or if an HTTP error occurs.
 */
export async function fetchData(input: RequestInfo, init: RequestInit = {}, json = true) {
  const baseURL = process.env.SERVER_URL || public_url

  console.log('Fetching data from: ', (baseURL || 'undefined') + input)

  if (!baseURL) {
    throw new Error('Base URL is not set.')
  }

  // Get access token (client-side only for now, since we're making API calls)
  let accessToken: string | undefined
  
  // Check if we're in a browser context
  if (typeof window !== 'undefined') {
    // Client-side, get from localStorage
    accessToken = localStorage.getItem('access_token') || undefined
  }

  // Add headers (json content-type and authorization)
  init.headers = {
    ...init.headers,
    ...(json && { 'Content-Type': 'application/json' }),
    ...(accessToken && { 'Authorization': `Bearer ${accessToken}` }),
  }

  // Fetch data from the server
  let response
  try {
    response = await fetch(baseURL + input, init)
  } catch (error) {
    console.error('Failed to fetch data: ', error)
    throw new Error('Failed to fetch data')
  }

  // Check HTTP errors
  if (!response.ok) {
    const body = await response.json()
    const errorMessage = body.error || 'Unknown error occurred.'

    // Map HTTP status code to error class
    if (response.status in statusCodeErrorMap) {
      throw new statusCodeErrorMap[response.status](errorMessage)
    }

    // Generic error
    throw new Error('Something went wrong: ' + response.status + ' : ' + errorMessage)
  }

  return response
}

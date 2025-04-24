import { statusCodeErrorMap } from '../errors/httpErrors'

const public_url = process.env.NEXT_PUBLIC_BASE_URL

/**
 * Fetches data from the server.
 * @param input - The URL to fetch.
 * @param init - The optional RequestInit object for additional configuration.
 * @param json - Whether to add content-type header as application/json.
 * @returns A Promise that resolves to the Response object representing the fetched data.
 * @throws Error if the base URL is not set, if fetching data fails, or if an HTTP error occurs.
 */
export async function fetchData(input: RequestInfo, init: RequestInit = {}, json = true) {
  const baseURL = process.env.SERVER_BASE_URL || public_url

  let secureBaseURL = baseURL
  if (secureBaseURL && secureBaseURL.startsWith('http://')) {
    secureBaseURL = secureBaseURL.replace('http://', 'https://')
  }

  console.log('Fetching data from: ', (secureBaseURL || 'undefined') + input)

  if (!secureBaseURL) {
    throw new Error('Base URL is not set.')
  }

  if (init.body) {
    init.headers = {
      ...init.headers,
      ...(json && { 'Content-Type': 'application/json' }),
    }
  }

  let response
  try {
    response = await fetch(secureBaseURL + input, init)
  } catch (error) {
    console.error('Failed to fetch data: ', error)
    throw new Error('Failed to fetch data')
  }

  if (!response.ok) {
    const body = await response.json()
    const errorMessage = body.error || 'Unknown error occurred.'

    if (response.status in statusCodeErrorMap) {
      throw new statusCodeErrorMap[response.status](errorMessage)
    }

    throw new Error('Something went wrong: ' + response.status + ' : ' + errorMessage)
  }

  return response
}

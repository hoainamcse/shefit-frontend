import { cookies } from 'next/headers'
import { auth } from '@/auth'
import { statusCodeErrorMap } from '../errors/httpErrors'

const baseUrl = process.env.SERVER_URL || process.env.NEXT_PUBLIC_SERVER_URL

if (!baseUrl) {
  throw new Error('SERVER_URL or NEXT_PUBLIC_SERVER_URL is not set.')
}

/**
 * Server-side fetch function for API calls.
 * Token refresh is handled automatically by Auth.js.
 * @param endpoint - The API endpoint to fetch.
 * @param options - The optional RequestInit object for additional configuration.
 * @param useJson - Whether to add content-type header as application/json (defaults to true).
 * @returns A Promise that resolves to the Response object representing the fetched data.
 * @throws Error if the base URL is not set, if fetching data fails, or if an HTTP error occurs.
 */
export async function fetchDataServer(
  endpoint: RequestInfo,
  options: RequestInit = {},
  useJson = true
): Promise<Response> {
  const url = `${baseUrl}${String(endpoint)}`
  console.log('Fetching data from server:', url)

  const cookieStore = await cookies()

  let headers: HeadersInit = {
    ...options.headers,
    Cookie: cookieStore.toString(),
    ...(useJson && { 'Content-Type': 'application/json' }),
  }

  // Get session from Auth.js
  let session = null
  try {
    session = await auth()
  } catch (error) {
    console.warn('Failed to get session on server:', error)
  }

  // Add access token to headers if available
  if (session?.accessToken) {
    headers = {
      ...headers,
      Authorization: `Bearer ${session.accessToken}`,
    }
  }

  try {
    const response = await fetch(url, { ...options, headers })

    if (!response.ok) {
      const body = await response.json().catch(() => ({ error: 'Failed to parse error response' }))
      const errorMessage = body.error?.message || 'Unknown error occurred'

      if (response.status in statusCodeErrorMap) {
        throw new statusCodeErrorMap[response.status](errorMessage)
      }

      throw new Error(`HTTP Error ${response.status}: ${errorMessage}`)
    }

    return response
  } catch (error) {
    if (error instanceof Error && Object.values(statusCodeErrorMap).some((ErrorClass) => error instanceof ErrorClass)) {
      throw error
    }

    const message = error instanceof Error ? error.message : 'Unknown error occurred'
    console.error('Failed to fetch data on server:', message)
    throw new Error(`Failed to fetch data: ${message}`)
  }
}

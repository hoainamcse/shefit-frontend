import { cookies } from 'next/headers'
import { verifySession } from '@/lib/dal'
import { statusCodeErrorMap } from '../errors/httpErrors'

const baseUrl = process.env.SERVER_URL || process.env.NEXT_PUBLIC_SERVER_URL

if (!baseUrl) {
  throw new Error('SERVER_URL or NEXT_PUBLIC_SERVER_URL is not set.')
}

/**
 * Server-side fetch function with automatic token refresh.
 * @param endpoint - The API endpoint to fetch.
 * @param options - The optional RequestInit object for additional configuration.
 * @param useJson - Whether to add content-type header as application/json (defaults to true).
 * @returns A Promise that resolves to the Response object representing the fetched data.
 * @throws Error if the base URL is not set, if fetching data fails, or if an HTTP error occurs.
 */
export async function fetchDataServer(endpoint: RequestInfo, options: RequestInit = {}, useJson = true): Promise<Response> {
  const url = `${baseUrl}${endpoint}`
  console.log('Fetching data from server:', url)

  const cookieStore = await cookies()

  let headers: HeadersInit = {
    ...options.headers,
    Cookie: cookieStore.toString(),
    ...(useJson && { 'Content-Type': 'application/json' }),
  }

  // Get session from cookies
  let session = null
  try {
    session = await verifySession()
  } catch (error) {
    console.warn('Failed to get session on server:', error)
  }

  // Add authorization header if session exists
  if (session?.accessToken) {
    headers = {
      ...headers,
      Authorization: `Bearer ${session.accessToken}`,
    }
  }

  try {
    let response = await fetch(url, { ...options, headers })

    // Handle token refresh for 401 errors
    if (response.status === 401 && session?.refreshToken) {
      console.log('Access token expired, attempting to refresh...')

      const refreshedTokens = await refreshTokens(session.refreshToken)

      if (refreshedTokens) {
        console.log('Token refreshed successfully, retrying request...')
        console.log('Note: Server-side token refresh - tokens will be used for this request only')
        console.log('To persist tokens, use a Server Action or redirect to a route that handles token updates')

        // Retry with new token (but can't persist it in server components)
        const refreshedHeaders = {
          ...headers,
          Authorization: `Bearer ${refreshedTokens.access_token}`,
        }

        response = await fetch(url, { ...options, headers: refreshedHeaders })
      } else {
        console.log('Token refresh failed')
      }
    }

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

/**
 * Refresh tokens using the refresh token
 */
async function refreshTokens(refreshToken: string): Promise<{ access_token: string; refresh_token: string } | null> {
  try {
    const response = await fetch(`${baseUrl}/v1/auth/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      }),
    })

    if (response.ok) {
      return await response.json()
    }

    return null
  } catch (error) {
    console.error('Token refresh failed:', error)
    return null
  }
}

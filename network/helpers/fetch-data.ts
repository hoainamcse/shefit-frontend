import { statusCodeErrorMap } from '../errors/httpErrors'

const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL

if (!baseUrl) {
  throw new Error('NEXT_PUBLIC_SERVER_URL is not set.')
}

/**
 * Client-side fetch function with automatic token refresh.
 * @param endpoint - The API endpoint to fetch.
 * @param options - The optional RequestInit object for additional configuration.
 * @param useJson - Whether to add content-type header as application/json (defaults to true).
 * @returns A Promise that resolves to the Response object representing the fetched data.
 * @throws Error if the base URL is not set, if fetching data fails, or if an HTTP error occurs.
 */
export async function fetchData(endpoint: RequestInfo, options: RequestInit = {}, useJson = true): Promise<Response> {
  const url = `${baseUrl}${endpoint}`
  console.log('Fetching data from:', url)

  let headers: HeadersInit = {
    ...options.headers,
    ...(useJson && { 'Content-Type': 'application/json' }),
  }

  // Get session from API
  let session = null
  try {
    const sessionResponse = await fetch('/api/session')
    if (sessionResponse.ok) {
      session = await sessionResponse.json()
    }
  } catch (error) {
    console.warn('Failed to get session:', error)
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

        // Update session via API call
        await updateSession(refreshedTokens)

        // Retry with new token
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
    console.error('Failed to fetch data:', message)
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

/**
 * Update session with new tokens
 */
async function updateSession(tokens: { access_token: string; refresh_token: string }): Promise<void> {
  try {
    await fetch('/api/session', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
      }),
    })
  } catch (error) {
    console.error('Failed to update session:', error)
  }
}

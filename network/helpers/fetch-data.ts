import { updateSession, verifySession } from '@/lib/dal'
import { statusCodeErrorMap } from '../errors/httpErrors'
import { refreshToken } from '../server/auth'

const PUBLIC_URL = process.env.NEXT_PUBLIC_SERVER_URL
const SERVER_URL = process.env.SERVER_URL || PUBLIC_URL

/**
 * Fetches data from the server with authentication and automatic token refresh.
 * @param endpoint - The API endpoint to fetch.
 * @param options - The optional RequestInit object for additional configuration.
 * @param useJson - Whether to add content-type header as application/json (defaults to true).
 * @returns A Promise that resolves to the Response object representing the fetched data.
 * @throws Error if the base URL is not set, if fetching data fails, or if an HTTP error occurs.
 */
export async function fetchData(endpoint: RequestInfo, options: RequestInit = {}, useJson = true): Promise<Response> {
  if (!SERVER_URL) {
    throw new Error('Base URL is not set.')
  }

  const url = `${SERVER_URL}${endpoint}`
  console.log('Fetching data from:', url)

  const session = await verifySession()

  const headers: HeadersInit = {
    ...options.headers,
    ...(useJson && { 'Content-Type': 'application/json' }),
    ...(session?.accessToken && { Authorization: `Bearer ${session.accessToken}` }),
  }

  try {
    let response = await fetch(url, { ...options, headers })

    if (response.status === 401 && session?.refreshToken) {
      const newSession = await refreshToken(session.refreshToken)

      if (newSession) {
        await updateSession({
          accessToken: newSession.access_token,
          refreshToken: newSession.refresh_token,
        })

        const refreshedHeaders = {
          ...headers,
          Authorization: `Bearer ${newSession.access_token}`,
        }

        response = await fetch(url, { ...options, headers: refreshedHeaders })
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

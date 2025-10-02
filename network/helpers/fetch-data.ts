import { sessionStorage, isRefreshTokenExpired } from '@/lib/session'
import { statusCodeErrorMap } from '../errors/httpErrors'
import { refreshToken as refreshTokenAPI } from '../client/auth'

const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL

if (!baseUrl) {
  throw new Error('NEXT_PUBLIC_SERVER_URL is not set.')
}

let isRefreshing = false
let refreshPromise: Promise<string> | null = null

/**
 * Refresh the access token using the refresh token
 */
async function refreshAccessToken(): Promise<string> {
  // If already refreshing, return the existing promise
  if (isRefreshing && refreshPromise) {
    return refreshPromise
  }

  isRefreshing = true
  refreshPromise = (async () => {
    try {
      const session = sessionStorage.get()
      if (!session) {
        throw new Error('No session found')
      }

      // Check if refresh token is expired
      if (isRefreshTokenExpired(session.refreshToken)) {
        console.log('Refresh token expired, clearing session')
        sessionStorage.remove()
        throw new Error('Refresh token expired')
      }

      console.log('Refreshing access token...')
      const newTokens = await refreshTokenAPI(session.refreshToken)

      // Update session with new tokens
      const updatedSession = {
        ...session,
        accessToken: newTokens.access_token,
        refreshToken: newTokens.refresh_token,
      }
      sessionStorage.set(updatedSession)

      console.log('Access token refreshed successfully')
      return newTokens.access_token
    } catch (error) {
      console.error('Failed to refresh token:', error)
      sessionStorage.remove()
      throw error
    } finally {
      isRefreshing = false
      refreshPromise = null
    }
  })()

  return refreshPromise
}

export async function fetchData(endpoint: RequestInfo, options: RequestInit = {}, useJson = true): Promise<Response> {
  const url = `${baseUrl}${String(endpoint)}`
  console.log('Fetching data from:', url)

  let headers: HeadersInit = {
    ...options.headers,
    ...(useJson && { 'Content-Type': 'application/json' }),
  }

  // Get session from localStorage
  let session = sessionStorage.get()

  // Use access token directly from session
  if (session?.accessToken) {
    headers = {
      ...headers,
      Authorization: `Bearer ${session.accessToken}`,
    }
  }

  try {
    const response = await fetch(url, { ...options, headers })

    // If 401 Unauthorized, try to refresh token and retry once
    if (response.status === 401 && session?.refreshToken) {
      console.log('Received 401, attempting to refresh token...')

      try {
        const newAccessToken = await refreshAccessToken()

        // Retry the request with new token
        headers = {
          ...headers,
          Authorization: `Bearer ${newAccessToken}`,
        }

        const retryResponse = await fetch(url, { ...options, headers })

        if (!retryResponse.ok) {
          const body = await retryResponse.json().catch(() => ({ error: 'Failed to parse error response' }))
          const errorMessage = body.error?.message || 'Unknown error occurred'

          if (retryResponse.status in statusCodeErrorMap) {
            throw new statusCodeErrorMap[retryResponse.status](errorMessage)
          }

          throw new Error(`HTTP Error ${retryResponse.status}: ${errorMessage}`)
        }

        return retryResponse
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError)
        // Clear session and throw original 401 error
        sessionStorage.remove()
        throw new statusCodeErrorMap[401]('Authentication failed')
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

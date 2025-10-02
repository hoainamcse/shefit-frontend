import { statusCodeErrorMap } from '../errors/httpErrors'

const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL

if (!baseUrl) {
  throw new Error('NEXT_PUBLIC_SERVER_URL is not set.')
}

export async function fetchData(endpoint: RequestInfo, options: RequestInit = {}, useJson = true): Promise<Response> {
  const url = `${baseUrl}${String(endpoint)}`
  console.log('Fetching data from:', url)

  let headers: HeadersInit = {
    ...options.headers,
    ...(useJson && { 'Content-Type': 'application/json' }),
  }

  // Get session from Auth.js
  let session = null
  try {
    const sessionResponse = await fetch('/api/auth/session')
    if (sessionResponse.ok) {
      const authSession = await sessionResponse.json()
      // Transform to our format if session exists
      if (authSession?.user) {
        session = {
          userId: Number(authSession.user.id),
          role: authSession.role,
          accessToken: authSession.accessToken,
          refreshToken: authSession.refreshToken,
        }
      }
    }
  } catch (error) {
    console.warn('Failed to get session:', error)
  }

  // Use access token directly from session
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
    console.error('Failed to fetch data:', message)
    throw new Error(`Failed to fetch data: ${message}`)
  }
}

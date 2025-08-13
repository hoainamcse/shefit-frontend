import { statusCodeErrorMap } from '../errors/httpErrors'
import { ServerTokenManager } from '@/lib/server-token-manager'

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

  let session = null
  try {
    const sessionResponse = await fetch('/api/session')
    if (sessionResponse.ok) {
      session = await sessionResponse.json()
    }
  } catch (error) {
    console.warn('Failed to get session:', error)
  }

  const validToken = await ServerTokenManager.getValidToken(session)
  if (validToken) {
    headers = {
      ...headers,
      Authorization: `Bearer ${validToken}`,
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

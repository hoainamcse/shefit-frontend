import { decodeJwt } from 'jose'

export class ServerTokenManager {
  private static async refreshTokens(
    refreshToken: string
  ): Promise<{ access_token: string; refresh_token: string } | null> {
    const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || ''

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
        return response.json()
      }

      return null
    } catch (error) {
      console.error('Token refresh failed:', error)
      return null
    }
  }

  static async getValidToken(currentSession: any): Promise<string | null> {
    if (!currentSession?.accessToken) return null

    try {
      const decoded = decodeJwt(currentSession.accessToken)
      const now = Math.floor(Date.now() / 1000)

      // If token is valid for more than 60 seconds, return it
      if (decoded.exp && decoded.exp > now + 60) {
        return currentSession.accessToken
      }

      // Token is expired or about to expire, try to refresh
      if (currentSession.refreshToken) {
        const newTokens = await this.refreshTokens(currentSession.refreshToken)
        
        if (newTokens) {
          // Update session with new tokens
          await this.updateSession(newTokens)
          return newTokens.access_token
        }
      }

      return null
    } catch (error) {
      console.error('Token validation error:', error)
      return null
    }
  }

  private static async updateSession(tokens: { access_token: string; refresh_token: string }): Promise<void> {
    try {
      // In server-side context, we can't directly update the session
      // This would need to be handled differently, perhaps by returning the new tokens
      // and letting the caller handle the session update
      console.log('New tokens available, but cannot update session from server-side')
    } catch (error) {
      console.error('Failed to update session:', error)
    }
  }
}

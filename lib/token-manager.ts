'use client'

import { decodeJwt } from 'jose'

let refreshPromise: Promise<{ access_token: string; refresh_token: string } | null> | null = null

export class TokenManager {
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

      if (decoded.exp && decoded.exp > now + 60) {
        return currentSession.accessToken
      }

      refreshPromise ??= this.refreshTokens(currentSession.refreshToken)

      const newTokens = await refreshPromise
      refreshPromise = null

      if (newTokens) {
        await this.updateSession(newTokens)
        return newTokens.access_token
      }

      return null
    } catch (error) {
      console.error('Token validation error:', error)
      return null
    }
  }

  private static async updateSession(tokens: { access_token: string; refresh_token: string }): Promise<void> {
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
}

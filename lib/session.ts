'use client'

import type { SessionPayload } from '@/models/auth'

const SESSION_STORAGE_KEY = 'shefit_session'
const SESSION_COOKIE_NAME = 'shefit_session'

// Token expiration times from backend
const ACCESS_TOKEN_EXPIRY = 1 * 24 * 60 * 60 // 1 day in seconds
const REFRESH_TOKEN_EXPIRY = 3 * 24 * 60 * 60 // 3 days in seconds

/**
 * Client-side session management
 */
export const sessionStorage = {
  get: (): SessionPayload | null => {
    if (typeof window === 'undefined') return null

    try {
      const stored = localStorage.getItem(SESSION_STORAGE_KEY)
      if (!stored) return null
      return JSON.parse(stored)
    } catch (error) {
      console.error('Error reading session from localStorage:', error)
      return null
    }
  },

  set: (session: SessionPayload): void => {
    if (typeof window === 'undefined') return

    try {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session))
      // Also set in cookie for SSR access (use refresh token expiry time)
      document.cookie = `${SESSION_COOKIE_NAME}=${JSON.stringify(session)}; path=/; max-age=${REFRESH_TOKEN_EXPIRY}; SameSite=Lax`
    } catch (error) {
      console.error('Error saving session to localStorage:', error)
    }
  },

  remove: (): void => {
    if (typeof window === 'undefined') return

    try {
      localStorage.removeItem(SESSION_STORAGE_KEY)
      // Remove cookie
      document.cookie = `${SESSION_COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
    } catch (error) {
      console.error('Error removing session from localStorage:', error)
    }
  },
}

/**
 * Check if access token is expired (with 5 minute buffer before actual expiry)
 * Access token expires in 1 day
 */
export function isAccessTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    const expiresAt = payload.exp * 1000 // Convert to milliseconds
    const now = Date.now()
    const buffer = 5 * 60 * 1000 // 5 minutes buffer

    return expiresAt - buffer <= now
  } catch (error) {
    console.error('Error checking access token expiration:', error)
    return true
  }
}

/**
 * Check if refresh token is expired
 * Refresh token expires in 3 days
 */
export function isRefreshTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    const expiresAt = payload.exp * 1000 // Convert to milliseconds
    const now = Date.now()

    return expiresAt <= now
  } catch (error) {
    console.error('Error checking refresh token expiration:', error)
    return true
  }
}

/**
 * Get token expiration time in milliseconds
 */
export function getTokenExpiration(token: string): number | null {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.exp * 1000 // Convert to milliseconds
  } catch (error) {
    console.error('Error getting token expiration:', error)
    return null
  }
}

// Legacy export for backward compatibility
export const isTokenExpired = isAccessTokenExpired

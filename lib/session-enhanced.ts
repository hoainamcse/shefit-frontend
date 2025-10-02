'use client'

import type { SessionPayload } from '@/models/auth'

const SESSION_STORAGE_KEY = 'shefit_session'
const SESSION_COOKIE_NAME = 'shefit_session'

// Token expiration times from backend
const ACCESS_TOKEN_EXPIRY = 1 * 24 * 60 * 60 // 1 day in seconds
const REFRESH_TOKEN_EXPIRY = 3 * 24 * 60 * 60 // 3 days in seconds

/**
 * Check if localStorage is available and working
 */
function isLocalStorageAvailable(): boolean {
  try {
    if (typeof window === 'undefined') return false

    const testKey = '__shefit_test__'
    localStorage.setItem(testKey, 'test')
    const result = localStorage.getItem(testKey)
    localStorage.removeItem(testKey)
    return result === 'test'
  } catch (error) {
    console.warn('localStorage is not available:', error)
    return false
  }
}

/**
 * Enhanced session storage with iOS compatibility
 * Falls back to memory storage if localStorage fails
 */
let memoryStorage: SessionPayload | null = null

export const sessionStorage = {
  get: (): SessionPayload | null => {
    if (typeof window === 'undefined') return null

    // Try localStorage first
    if (isLocalStorageAvailable()) {
      try {
        const stored = localStorage.getItem(SESSION_STORAGE_KEY)
        if (stored) {
          const parsed = JSON.parse(stored)
          // Also update memory cache
          memoryStorage = parsed
          return parsed
        }
      } catch (error) {
        console.error('Error reading session from localStorage:', error)
      }
    }

    // Try to read from cookie as fallback
    try {
      const cookies = document.cookie.split(';')
      const sessionCookie = cookies.find(c => c.trim().startsWith(`${SESSION_COOKIE_NAME}=`))
      if (sessionCookie) {
        const cookieValue = sessionCookie.split('=')[1]
        if (cookieValue) {
          try {
            const decoded = decodeURIComponent(cookieValue)
            const parsed = JSON.parse(decoded)
            // Update memory cache
            memoryStorage = parsed
            return parsed
          } catch (error) {
            console.error('Error parsing session from cookie:', error)
          }
        }
      }
    } catch (error) {
      console.error('Error reading session from cookie:', error)
    }

    // Final fallback: return memory storage
    return memoryStorage
  },

  set: (session: SessionPayload): void => {
    if (typeof window === 'undefined') return

    // Always update memory storage first
    memoryStorage = session

    const sessionStr = JSON.stringify(session)
    let localStorageSuccess = false
    let cookieSuccess = false

    // Try localStorage
    if (isLocalStorageAvailable()) {
      try {
        localStorage.setItem(SESSION_STORAGE_KEY, sessionStr)
        localStorageSuccess = true
        console.log('✓ Session saved to localStorage')
      } catch (error) {
        console.error('✗ Error saving session to localStorage:', error)
        // If quota exceeded, try to clear old data
        if (error instanceof Error && error.name === 'QuotaExceededError') {
          try {
            // Clear old test keys
            for (let i = 0; i < localStorage.length; i++) {
              const key = localStorage.key(i)
              if (key?.startsWith('shefit_test_')) {
                localStorage.removeItem(key)
              }
            }
            // Try again
            localStorage.setItem(SESSION_STORAGE_KEY, sessionStr)
            localStorageSuccess = true
            console.log('✓ Session saved to localStorage (after cleanup)')
          } catch (retryError) {
            console.error('✗ Still failed after cleanup:', retryError)
          }
        }
      }
    } else {
      console.warn('⚠ localStorage not available, using cookie and memory only')
    }

    // Always try to set cookie as backup
    try {
      // Encode the session to handle special characters
      const encodedSession = encodeURIComponent(sessionStr)
      const cookieString = `${SESSION_COOKIE_NAME}=${encodedSession}; path=/; max-age=${REFRESH_TOKEN_EXPIRY}; SameSite=Lax`

      document.cookie = cookieString

      // Verify cookie was set
      if (document.cookie.includes(SESSION_COOKIE_NAME)) {
        cookieSuccess = true
        console.log('✓ Session saved to cookie')
      } else {
        console.warn('⚠ Cookie was not set (may be blocked by browser)')
      }
    } catch (error) {
      console.error('✗ Error saving session to cookie:', error)
    }

    // Log final status
    if (localStorageSuccess || cookieSuccess) {
      console.log(`Session storage status: localStorage=${localStorageSuccess}, cookie=${cookieSuccess}, memory=true`)
    } else {
      console.error('⚠ Session only saved to memory - will be lost on page reload!')
    }
  },

  remove: (): void => {
    if (typeof window === 'undefined') return

    // Clear memory storage
    memoryStorage = null

    // Clear localStorage
    if (isLocalStorageAvailable()) {
      try {
        localStorage.removeItem(SESSION_STORAGE_KEY)
        console.log('✓ Session removed from localStorage')
      } catch (error) {
        console.error('Error removing session from localStorage:', error)
      }
    }

    // Clear cookie
    try {
      document.cookie = `${SESSION_COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
      console.log('✓ Session removed from cookie')
    } catch (error) {
      console.error('Error removing session from cookie:', error)
    }
  },
}

/**
 * Server-side session management (for Server Components)
 * This needs to be imported from 'next/headers' only on server
 */
export async function getServerSession(): Promise<SessionPayload | null> {
  // This will be imported dynamically in server components
  const { cookies } = await import('next/headers')

  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)

    if (!sessionCookie?.value) return null

    try {
      // Try to decode if it's URL encoded
      const decoded = decodeURIComponent(sessionCookie.value)
      return JSON.parse(decoded)
    } catch {
      // If decoding fails, try parsing directly
      return JSON.parse(sessionCookie.value)
    }
  } catch (error) {
    console.error('Error reading session from cookies:', error)
    return null
  }
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

// Export for testing
export const _testing = {
  isLocalStorageAvailable,
  getMemoryStorage: () => memoryStorage,
  clearMemoryStorage: () => { memoryStorage = null }
}

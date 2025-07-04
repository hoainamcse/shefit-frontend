'use client'

import { useCallback, useEffect, useState } from 'react'
import type { SessionPayload } from '@/models/auth'

interface UseSessionReturn {
  session: SessionPayload | null
  isLoading: boolean
  refreshSession: () => Promise<void>
  clearSession: () => Promise<void>
}

/**
 * Client-side hook for session management
 * Fetches session data from the server and provides methods to refresh/clear session
 * Also provides a fetchData function that automatically handles token refresh
 */
export function useSession(): UseSessionReturn {
  const [session, setSession] = useState<SessionPayload | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchSession = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/session')

      if (response.ok) {
        const sessionData = await response.json()
        setSession(sessionData)
      } else {
        setSession(null)
      }
    } catch (error) {
      console.error('Failed to fetch session:', error)
      setSession(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const refreshSession = useCallback(async () => {
    await fetchSession()
  }, [fetchSession])

  const clearSession = useCallback(async () => {
    try {
      await fetch('/api/session', { method: 'DELETE' })
      setSession(null)
    } catch (error) {
      console.error('Failed to clear session:', error)
      // Clear local state even if API call fails
      setSession(null)
    }
  }, [])

  useEffect(() => {
    fetchSession()
  }, [fetchSession])

  return {
    session,
    isLoading,
    refreshSession,
    clearSession,
  }
}

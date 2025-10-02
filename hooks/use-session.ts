'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import type { SessionPayload } from '@/models/auth'
import { sessionStorage, isAccessTokenExpired, isRefreshTokenExpired } from '@/lib/session'
import { refreshToken as refreshTokenAPI } from '@/network/client/auth'

interface UseSessionReturn {
  session: SessionPayload | null
  isLoading: boolean
  refreshSession: () => Promise<void>
  clearSession: () => Promise<void>
}

// Query keys
const SESSION_QUERY_KEY = ['session']

/**
 * Client-side hook for session management using localStorage and cookies
 *
 * Token expiration logic:
 * - Access token: 1 day
 * - Refresh token: 3 days
 *
 * If access token is expired but refresh token is valid:
 *   -> Automatically refresh access token
 *
 * If refresh token is expired:
 *   -> Clear session (force re-login)
 */
export function useSession(): UseSessionReturn {
  const queryClient = useQueryClient()
  const [isLoading, setIsLoading] = useState(true)

  // Query to get session from localStorage
  const { data: session } = useQuery<SessionPayload | null>({
    queryKey: SESSION_QUERY_KEY,
    queryFn: () => sessionStorage.get(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

  // Check and refresh token if needed
  useEffect(() => {
    const checkAndRefreshToken = async () => {
      const currentSession = sessionStorage.get()

      if (!currentSession) {
        setIsLoading(false)
        return
      }

      try {
        // First check if refresh token is expired
        if (isRefreshTokenExpired(currentSession.refreshToken)) {
          console.log('Refresh token expired, clearing session')
          sessionStorage.remove()
          queryClient.setQueryData(SESSION_QUERY_KEY, null)
          setIsLoading(false)
          return
        }

        // Check if access token is expired
        if (isAccessTokenExpired(currentSession.accessToken)) {
          console.log('Access token expired, refreshing...')
          try {
            const newTokens = await refreshTokenAPI(currentSession.refreshToken)
            const updatedSession: SessionPayload = {
              ...currentSession,
              accessToken: newTokens.access_token,
              refreshToken: newTokens.refresh_token,
            }
            sessionStorage.set(updatedSession)
            queryClient.setQueryData(SESSION_QUERY_KEY, updatedSession)
            console.log('Token refreshed successfully')
          } catch (error) {
            console.error('Failed to refresh token:', error)
            // If refresh fails, clear the session
            sessionStorage.remove()
            queryClient.setQueryData(SESSION_QUERY_KEY, null)
          }
        }
      } catch (error) {
        console.error('Error during token validation:', error)
        sessionStorage.remove()
        queryClient.setQueryData(SESSION_QUERY_KEY, null)
      }

      setIsLoading(false)
    }

    checkAndRefreshToken()

    // Set up periodic token check (every 5 minutes)
    const intervalId = setInterval(checkAndRefreshToken, 5 * 60 * 1000)

    return () => clearInterval(intervalId)
  }, [queryClient])

  // Refresh session mutation
  const refreshSessionMutation = useMutation({
    mutationFn: async () => {
      const currentSession = sessionStorage.get()
      if (!currentSession) throw new Error('No session to refresh')

      // Check if refresh token is expired
      if (isRefreshTokenExpired(currentSession.refreshToken)) {
        throw new Error('Refresh token expired')
      }

      const newTokens = await refreshTokenAPI(currentSession.refreshToken)
      const updatedSession: SessionPayload = {
        ...currentSession,
        accessToken: newTokens.access_token,
        refreshToken: newTokens.refresh_token,
      }
      sessionStorage.set(updatedSession)
      return updatedSession
    },
    onSuccess: (updatedSession) => {
      queryClient.setQueryData(SESSION_QUERY_KEY, updatedSession)
    },
    onError: (error) => {
      console.error('Failed to refresh session:', error)
      // Clear session on error
      sessionStorage.remove()
      queryClient.setQueryData(SESSION_QUERY_KEY, null)
    },
  })

  // Clear session mutation
  const clearSessionMutation = useMutation({
    mutationFn: async () => {
      sessionStorage.remove()
    },
    onSuccess: () => {
      queryClient.setQueryData(SESSION_QUERY_KEY, null)
      queryClient.invalidateQueries({ queryKey: SESSION_QUERY_KEY })
    },
    onError: (error) => {
      console.error('Failed to clear session:', error)
    },
  })

  return {
    session: session || null,
    isLoading,
    refreshSession: async () => {
      await refreshSessionMutation.mutateAsync()
    },
    clearSession: clearSessionMutation.mutateAsync,
  }
}


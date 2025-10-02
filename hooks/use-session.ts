'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useSession as useNextAuthSession } from 'next-auth/react'
import type { SessionPayload } from '@/models/auth'

interface UseSessionReturn {
  session: SessionPayload | null
  isLoading: boolean
  refreshSession: () => Promise<void>
  clearSession: () => Promise<void>
}

// Query keys
const SESSION_QUERY_KEY = ['session']

/**
 * Client-side hook for session management using Auth.js with React Query wrapper
 * Maintains backward compatibility with the existing API interface
 */
export function useSession(): UseSessionReturn {
  const queryClient = useQueryClient()
  const { data: nextAuthSession, status, update } = useNextAuthSession()

  // Transform Auth.js session to match the old SessionPayload format
  const session: SessionPayload | null = nextAuthSession
    ? {
        userId: Number(nextAuthSession.user.id),
        role: nextAuthSession.role,
        accessToken: nextAuthSession.accessToken,
        refreshToken: nextAuthSession.refreshToken,
      }
    : null

  const isLoading = status === 'loading'

  // Refresh session mutation
  const refreshSessionMutation = useMutation({
    mutationFn: async () => {
      // Use Auth.js update method to refresh the session
      await update()
      await queryClient.invalidateQueries({ queryKey: SESSION_QUERY_KEY })
    },
  })

  // Clear session mutation
  const clearSessionMutation = useMutation({
    mutationFn: async () => {
      // Auth.js handles sign out through its own API
      await fetch('/api/auth/signout', { method: 'POST' })
    },
    onSuccess: () => {
      // Invalidate queries after sign out
      queryClient.invalidateQueries({ queryKey: SESSION_QUERY_KEY })
    },
    onError: (error) => {
      console.error('Failed to clear session:', error)
    },
  })

  return {
    session,
    isLoading,
    refreshSession: refreshSessionMutation.mutateAsync,
    clearSession: clearSessionMutation.mutateAsync,
  }
}

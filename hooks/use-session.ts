'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
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
 * Client-side hook for session management using React Query
 * Fetches session data from the server and provides methods to refresh/clear session
 * Leverages React Query for caching, retrying, and automatic refetching
 */
export function useSession(): UseSessionReturn {
  const queryClient = useQueryClient()

  // Fetch session query
  const { data: session, isLoading } = useQuery({
    queryKey: SESSION_QUERY_KEY,
    queryFn: async () => {
      const response = await fetch('/api/session')

      if (!response.ok) {
        return null
      }

      return response.json() as Promise<SessionPayload>
    },
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    retry: false, // Don't retry if session fetch fails
  })

  // Refresh session mutation
  const refreshSessionMutation = useMutation({
    mutationFn: async () => {
      // Invalidate the session query to force a refetch
      await queryClient.invalidateQueries({ queryKey: SESSION_QUERY_KEY })
    },
  })

  // Clear session mutation
  const clearSessionMutation = useMutation({
    mutationFn: async () => {
      await fetch('/api/session', { method: 'DELETE' })
    },
    onSuccess: () => {
      // Set session data to null in the query cache
      queryClient.setQueryData(SESSION_QUERY_KEY, null)
    },
    onError: (error) => {
      console.error('Failed to clear session:', error)
      // Clear local state even if API call fails
      queryClient.setQueryData(SESSION_QUERY_KEY, null)
    },
  })

  return {
    session: session || null,
    isLoading,
    refreshSession: refreshSessionMutation.mutateAsync,
    clearSession: clearSessionMutation.mutateAsync,
  }
}

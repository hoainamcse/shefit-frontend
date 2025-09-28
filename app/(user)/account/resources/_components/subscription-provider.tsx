'use client'

import { UserSubscription } from '@/models/user-subscriptions'
import React, { createContext, useContext, ReactNode, useState, useEffect, useMemo } from 'react'
import { useSession } from '@/hooks/use-session'
import { useQuery } from '@tanstack/react-query'
import { getUserSubscriptions } from '@/network/client/users'
import { queryKeyUserSubscriptions } from '@/network/client/user-subscriptions'

type SelectedResource = UserSubscription | 'favorites' | null

interface SubscriptionContextType {
  selectedSubscription: UserSubscription | null
  showFavorites: boolean
  selectedResource: SelectedResource
  setSelectedResource: (resource: SelectedResource) => void
  isLoading: boolean
  setIsLoading: (isLoading: boolean) => void
  userSubscriptions: UserSubscription[]
  isError: boolean
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined)

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const { session } = useSession()
  const [selectedResource, setSelectedResource] = useState<SelectedResource>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [initialSelectionMade, setInitialSelectionMade] = useState(false)

  // Fetch user subscriptions using React Query
  const {
    data: userSubsResponse,
    isLoading: queryLoading,
    isError,
  } = useQuery({
    queryKey: [queryKeyUserSubscriptions, session?.userId],
    queryFn: () => getUserSubscriptions(session!.userId),
    enabled: !!session,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  // Process and sort subscriptions
  const userSubscriptions = useMemo<UserSubscription[]>(() => {
    if (!userSubsResponse?.data?.length) return []

    const currentDate = new Date()
    return [...userSubsResponse.data].sort((a: UserSubscription, b: UserSubscription) => {
      const aEndDate = new Date(a.subscription_end_at)
      const bEndDate = new Date(b.subscription_end_at)
      const aIsActive = currentDate <= aEndDate
      const bIsActive = currentDate <= bEndDate

      if (aIsActive && !bIsActive) return -1
      if (!aIsActive && bIsActive) return 1

      return bEndDate.getTime() - aEndDate.getTime()
    })
  }, [userSubsResponse?.data])

  // Derived values from selectedResource
  const selectedSubscription = useMemo(() => {
    return selectedResource && selectedResource !== 'favorites' ? selectedResource : null
  }, [selectedResource])

  const showFavorites = useMemo(() => {
    return selectedResource === 'favorites'
  }, [selectedResource])

  // Update loading state based on query state
  useEffect(() => {
    setIsLoading(queryLoading)

    if (isError) {
      console.error('Error fetching subscriptions')
      setIsLoading(false)
    }
  }, [queryLoading, isError])

  // Set initial subscription selection
  useEffect(() => {
    if (queryLoading) {
      setIsLoading(true)
      return
    }

    setIsLoading(false)

    if (!initialSelectionMade && userSubsResponse?.data !== undefined) {
      if (userSubscriptions.length > 0) {
        const latestSubscription = userSubscriptions[0]
        setSelectedResource(latestSubscription)
      } else {
        setSelectedResource('favorites')
      }
      setInitialSelectionMade(true)
    }
  }, [queryLoading, userSubsResponse?.data, userSubscriptions, initialSelectionMade])

  const contextValue = React.useMemo(
    () => ({
      selectedSubscription,
      showFavorites,
      selectedResource,
      setSelectedResource,
      isLoading,
      setIsLoading,
      userSubscriptions,
      isError,
    }),
    [selectedSubscription, showFavorites, selectedResource, isLoading, userSubscriptions, isError]
  )

  return <SubscriptionContext.Provider value={contextValue}>{children}</SubscriptionContext.Provider>
}

export function useSubscription() {
  const context = useContext(SubscriptionContext)
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider')
  }
  return context
}

'use client'

import { UserSubscriptionDetail } from '@/models/user-subscriptions'
import React, { createContext, useContext, ReactNode, useState } from 'react'

interface SubscriptionContextType {
  selectedSubscription: UserSubscriptionDetail | null
  setSelectedSubscription: (subscription: UserSubscriptionDetail | null) => void
  showFavorites: boolean
  setShowFavorites: (show: boolean) => void
  isLoading: boolean
  setIsLoading: (isLoading: boolean) => void
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined)

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [selectedSubscription, setSelectedSubscription] = useState<UserSubscriptionDetail | null>(null)
  const [showFavorites, setShowFavorites] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const contextValue = React.useMemo(
    () => ({
      selectedSubscription,
      setSelectedSubscription,
      showFavorites,
      setShowFavorites,
      isLoading,
      setIsLoading,
    }),
    [selectedSubscription, showFavorites, isLoading]
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

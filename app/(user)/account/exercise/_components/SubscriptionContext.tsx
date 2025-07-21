'use client'

import React, { createContext, useContext, ReactNode, useState } from 'react'

interface Subscription {
  id: number
  user_id: number
  course_format: string
  status: string
  subscription_start_at: string
  subscription_end_at: string
  order_number: string
  total_price: number
  coupon_code: string
  subscription: {
    id: number
    courses: Array<{
      id: number
      course_name: string
    }>
  }
  exercises: any[]
  meal_plans: any[]
  dishes: any[]
}

interface SubscriptionContextType {
  selectedSubscription: Subscription | null | undefined
  setSelectedSubscription: (subscription: Subscription | undefined) => void
  showFavorites: boolean
  setShowFavorites: (show: boolean) => void
  isLoading: boolean
  setIsLoading: (isLoading: boolean) => void
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined)

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | undefined>(undefined)
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

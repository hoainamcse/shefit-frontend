'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { getUserSubscriptions } from '@/network/client/users'
import { UserSubscription } from '@/models/user-subscriptions'
import { useSession } from '@/hooks/use-session'
import { useState, useEffect, useMemo } from 'react'
import { useSubscription } from './subscription-context'
import { useQuery } from '@tanstack/react-query'

export default function ListSubscriptions() {
  const { session } = useSession()
  const {
    selectedSubscription,
    setSelectedSubscription,
    showFavorites,
    setShowFavorites,
    setIsLoading: setContextLoading,
    isLoading: contextLoading,
  } = useSubscription()

  // Fetch user subscriptions using React Query
  const {
    data: userSubsResponse,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['user-subscriptions', session?.userId],
    queryFn: () => getUserSubscriptions(session!.userId),
    enabled: !!session,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  // Update context loading state based on query state
  useEffect(() => {
    setContextLoading(isLoading)

    if (isError) {
      console.error('Error fetching subscriptions')
      setContextLoading(false)
    }
  }, [isLoading, isError, setContextLoading])

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

  // Track if initial selection has been made
  const [initialSelectionMade, setInitialSelectionMade] = useState(false)

  // Set latest subscription as default only after data is fully loaded
  useEffect(() => {
    // When loading, update the context loading state
    if (isLoading) {
      setContextLoading(true)
      return
    }

    // Data is now loaded (not loading)
    setContextLoading(false)

    // Only make the selection once when loading is complete
    if (!initialSelectionMade && userSubsResponse?.data !== undefined) {
      if (userSubscriptions.length > 0) {
        // Default to the latest subscription
        const latestSubscription = userSubscriptions[0]
        setSelectedSubscription(latestSubscription)
        setShowFavorites(false)
      } else {
        // If no subscriptions, fall back to favorites
        setSelectedSubscription(null)
        setShowFavorites(true)
      }
      setInitialSelectionMade(true)
    }
  }, [
    isLoading,
    userSubsResponse?.data,
    userSubscriptions,
    initialSelectionMade,
    setContextLoading,
    setSelectedSubscription,
    setShowFavorites,
  ])

  const handleSubscriptionChange = async (value: string) => {
    if (value === 'favorites') {
      setShowFavorites(true)
      return
    }

    setShowFavorites(false)

    const subscriptionId = parseInt(value)
    const subscription = userSubscriptions.find((sub: UserSubscription) => sub.id === subscriptionId)
    if (subscription) {
      setSelectedSubscription(subscription)
    }
  }

  const currentDate = new Date()
  const endDate = selectedSubscription?.subscription_end_at ? new Date(selectedSubscription.subscription_end_at) : null
  const isActive = endDate ? currentDate <= endDate : false

  return session ? (
    <div className="flex flex-col lg:flex-row gap-5 mb-6 w-full">
      <div className="relative w-full lg:w-[370px]">
        <Select
          value={showFavorites ? 'favorites' : selectedSubscription?.id?.toString() || ''}
          onValueChange={handleSubscriptionChange}
        >
          <SelectTrigger className="w-full h-[54px] text-left">
            <SelectValue placeholder={contextLoading ? 'Đang tải...' : 'Gói member của bạn'} />
          </SelectTrigger>
          <SelectContent className="w-full max-h-[300px] overflow-y-auto">
            {userSubscriptions.map((subscription: UserSubscription) => {
              const subscriptionId = subscription.id.toString()

              return (
                <SelectItem key={subscriptionId} value={subscriptionId} className="cursor-pointer hover:bg-gray-100">
                  {subscription.subscription.name}
                </SelectItem>
              )
            })}
            <SelectItem key="favorites" value="favorites">
              Yêu thích
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {!showFavorites && (
        <>
          {isActive ? (
            <Button className="w-[100px] h-[46px] lg:w-[160px] lg:h-[54px] bg-[#13D8A7] text-base rounded-none border border-[#000000]">
              Còn hạn
            </Button>
          ) : (
            <Button className="w-[100px] h-[46px] lg:w-[160px] lg:h-[54px] bg-[#E61417] text-base rounded-none border border-[#000000]">
              Hết hạn
            </Button>
          )}

          <div className="flex lg:flex-row gap-5 mt-auto text-base justify-between text-[#737373] font-bold">
            <div className="flex flex-col lg:flex-row lg:gap-10 gap-2">
              <div className="flex gap-2">
                <div>Ngày bắt đầu:</div>
                <span>
                  {selectedSubscription?.subscription_start_at
                    ? new Date(selectedSubscription.subscription_start_at).toLocaleDateString('vi-VN')
                    : ''}
                </span>
              </div>
              <div className="flex gap-2">
                <div>Ngày kết thúc:</div>
                <span>
                  {selectedSubscription?.subscription_end_at
                    ? new Date(selectedSubscription.subscription_end_at).toLocaleDateString('vi-VN')
                    : ''}
                </span>
              </div>
            </div>
            {selectedSubscription?.coupon && (
              <div className="flex gap-2">
                <div>Promocode:</div>
                <span>{selectedSubscription?.coupon.code}</span>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  ) : null
}

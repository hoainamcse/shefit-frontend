'use client'

import { useEffect, useState } from 'react'
import { useSession } from '@/hooks/use-session'
import { getUserSubscriptions } from '@/network/client/users'
import { useParams } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface SubscriptionStatus {
  hasSubscription: boolean
  isValid: boolean
  startDate: string | null
  endDate: string | null
  coupon_code: string | null
}

export default function SubscriptionInfo() {
  const { session } = useSession()
  const params = useParams()
  const [isLoading, setIsLoading] = useState(true)
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus>({
    hasSubscription: false,
    isValid: false,
    startDate: null,
    endDate: null,
    coupon_code: null,
  })

  const isSubscriptionValid = (subscriptionEndAt: string): boolean => {
    if (!subscriptionEndAt) return false
    const endDate = new Date(subscriptionEndAt)
    const currentDate = new Date()
    return endDate > currentDate
  }

  useEffect(() => {
    async function fetchUserSubscriptions() {
      if (!session) {
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        const subscriptionId = Number(params?.id)
        const response = await getUserSubscriptions(session.userId)

        const userSubscription = response.data?.find((subscription) => subscription.subscription.id === subscriptionId)

        if (userSubscription) {
          const isValid = userSubscription.subscription_end_at
            ? isSubscriptionValid(userSubscription.subscription_end_at)
            : false

          setSubscriptionStatus({
            hasSubscription: true,
            isValid,
            startDate: userSubscription.subscription_start_at,
            endDate: userSubscription.subscription_end_at,
            coupon_code: userSubscription.coupon_code,
          })
        }
      } catch (error) {
        console.error('Error fetching user subscriptions:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserSubscriptions()
  }, [session, params?.id])

  if (isLoading) {
    return <div className="text-center py-4">Đang tải...</div>
  }

  if (!subscriptionStatus.hasSubscription) {
    return null
  }

  return (
    <div>
      <div className="flex items-center mb-2">
        {subscriptionStatus.isValid ? (
          <Button className="w-[100px] h-[46px] lg:w-[160px] lg:h-[54px] bg-[#13D8A7] text-base rounded-none border border-[#000000]">
            Còn hạn
          </Button>
        ) : (
          <Button className="w-[100px] h-[46px] lg:w-[160px] lg:h-[54px] bg-[#E61417] text-base rounded-none border border-[#000000]">
            Hết hạn
          </Button>
        )}
      </div>
      {subscriptionStatus.startDate && (
        <div className="flex gap-2 items-center mb-2 text-[#737373] text-sm lg:text-lg">
          <span>Ngày bắt đầu:</span>
          <span>{formatDate(subscriptionStatus.startDate)}</span>
        </div>
      )}
      {subscriptionStatus.endDate && (
        <div className="flex gap-2 items-center mb-2 text-[#737373] text-sm lg:text-lg">
          <span>Ngày kết thúc:</span>
          <span>{formatDate(subscriptionStatus.endDate)}</span>
        </div>
      )}
      {subscriptionStatus.coupon_code && (
        <div className="flex gap-2 items-center mb-2 text-[#737373] text-sm lg:text-lg">
          <span>Promocode:</span>
          <span>{subscriptionStatus.coupon_code}</span>
        </div>
      )}
    </div>
  )
}

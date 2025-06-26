'use client'

import { useEffect, useState } from 'react'
import { useSession } from '@/components/providers/session-provider'
import { getUserSubscriptions } from '@/network/server/user-subscriptions'
import { useParams } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'

interface SubscriptionStatus {
  hasSubscription: boolean
  status: 'active' | 'expired' | null
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
    status: null,
    startDate: null,
    endDate: null,
    coupon_code: null,
  })

  useEffect(() => {
    async function fetchUserSubscriptions() {
      if (!session) {
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        const subscriptionId = Number(params?.id)
        const response = await getUserSubscriptions(session.userId.toString())

        const userSubscription = response.data?.find((subscription) => subscription.subscription.id === subscriptionId)

        if (userSubscription) {
          setSubscriptionStatus({
            hasSubscription: true,
            status: userSubscription.status as 'active' | 'expired',
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
        {subscriptionStatus.status === 'active' ? (
          <Badge className="bg-green-600 px-8 py-3 text-lg font-bold">Còn hạn</Badge>
        ) : (
          <Badge className="bg-red-600 px-8 py-3 text-lg font-bold">Hết hạn</Badge>
        )}
      </div>
      {subscriptionStatus.startDate && (
        <div className="flex gap-2 items-center mb-2 text-[#737373] text-lg">
          <span>Ngày bắt đầu:</span>
          <span>{formatDate(subscriptionStatus.startDate)}</span>
        </div>
      )}
      {subscriptionStatus.endDate && (
        <div className="flex gap-2 items-center mb-2 text-[#737373] text-lg">
          <span>Ngày kết thúc:</span>
          <span>{formatDate(subscriptionStatus.endDate)}</span>
        </div>
      )}
      {subscriptionStatus.coupon_code && (
        <div className="flex gap-2 items-center mb-2 text-[#737373] text-lg">
          <span>Promocode:</span>
          <span>{subscriptionStatus.coupon_code}</span>
        </div>
      )}
    </div>
  )
}

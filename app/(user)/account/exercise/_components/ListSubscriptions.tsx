'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { getUserSubscriptions } from '@/network/server/user-subscriptions'
import { useRouter } from 'next/navigation'
import { getSubscription } from '@/network/server/subscriptions'
import { useSession } from '@/components/providers/session-provider'
import { useEffect, useState } from 'react'
import { useSubscription } from './SubscriptionContext'

export default function ListSubscriptions() {
  const { session } = useSession()
  const [isLoading, setIsLoading] = useState(true)
  const [userSubscriptions, setUserSubscriptions] = useState<any[]>([])
  const [subscriptionNames, setSubscriptionNames] = useState<{ [key: number]: string }>({})
  const {
    selectedSubscription,
    setSelectedSubscription,
    showFavorites,
    setShowFavorites,
    setIsLoading: setContextLoading,
  } = useSubscription()

  useEffect(() => {
    setShowFavorites(true)
  }, [])

  useEffect(() => {
    async function fetchData() {
      if (!session) return

      try {
        setContextLoading(true)
        const userSubsResponse = await getUserSubscriptions(session.userId)
        if (userSubsResponse.data && userSubsResponse.data.length > 0) {
          const sortedSubscriptions = [...userSubsResponse.data].sort(
            (a, b) => new Date(b.subscription_end_at).getTime() - new Date(a.subscription_end_at).getTime()
          )

          setUserSubscriptions(sortedSubscriptions)
          if (!selectedSubscription) {
            setSelectedSubscription(sortedSubscriptions[0])
          }

          const namesPromises = sortedSubscriptions.map(async (sub) => {
            try {
              const subResponse = await getSubscription(sub.subscription.id)
              return { id: sub.subscription.id, name: subResponse.data?.name || `Gói tập ${sub.subscription.id}` }
            } catch (error) {
              console.error('Error fetching subscription:', error)
              return { id: sub.subscription.id, name: `Gói tập ${sub.subscription.id}` }
            }
          })

          const subscriptionData = await Promise.all(namesPromises)
          const namesMap: { [key: number]: string } = {}

          subscriptionData.forEach((item) => {
            if (item) {
              namesMap[item.id] = item.name
            }
          })

          setSubscriptionNames(namesMap)
        } else {
          setSelectedSubscription(undefined)
        }
      } catch (error) {
        console.error('Error fetching subscriptions:', error)
      } finally {
        setContextLoading(false)
      }
    }

    fetchData()
  }, [session])

  const router = useRouter()

  const handleSubscriptionChange = async (value: string) => {
    if (value === 'favorites') {
      setShowFavorites(true)
      return
    }

    setShowFavorites(false)

    const subscriptionId = parseInt(value)
    const subscription = userSubscriptions.find((sub) => sub.id === subscriptionId)
    if (subscription) {
      setSelectedSubscription(subscription)
    }
  }

  const isActive = selectedSubscription?.status === 'active'
  const currentDate = new Date()
  const endDate = selectedSubscription?.subscription_end_at ? new Date(selectedSubscription.subscription_end_at) : null
  const isExpired = endDate ? currentDate > endDate : false

  return session ? (
    <div className="flex gap-5 mb-6">
      <div className="relative w-[370px]">
        <Select
          value={showFavorites ? 'favorites' : selectedSubscription?.id?.toString() || ''}
          onValueChange={handleSubscriptionChange}
        >
          <SelectTrigger className="w-full h-[54px] text-left">
            <SelectValue placeholder={isLoading ? 'Đang tải...' : 'Gói member của bạn'} />
          </SelectTrigger>
          <SelectContent className="w-full max-h-[300px] overflow-y-auto">
            <SelectItem key="favorites" value="favorites">
              Yêu thích
            </SelectItem>
            {userSubscriptions.map((subscription) => {
              const subscriptionId = subscription.id.toString()
              return (
                <SelectItem key={subscriptionId} value={subscriptionId} className="cursor-pointer hover:bg-gray-100">
                  {subscriptionNames[subscription.subscription?.id] ||
                    `Gói tập ${subscription.subscription?.id || subscription.id}`}
                </SelectItem>
              )
            })}
          </SelectContent>
        </Select>
      </div>

      {!showFavorites && (
        <>
          {isActive ? (
            <Button className="w-[160px] h-[54px] bg-[#13D8A7] text-lg">Còn hạn</Button>
          ) : (
            <Button className="w-[160px] h-[54px] bg-[#E61417] text-lg">Hết hạn</Button>
          )}

          <div className="flex gap-5 mt-auto text-lg justify-center text-[#737373] font-bold">
            <div>
              Ngày bắt đầu:
              <span>
                {selectedSubscription?.subscription_start_at
                  ? new Date(selectedSubscription.subscription_start_at).toLocaleDateString('vi-VN')
                  : ''}
              </span>
            </div>
            <div>
              Ngày kết thúc:
              <span>
                {selectedSubscription?.subscription_end_at
                  ? new Date(selectedSubscription.subscription_end_at).toLocaleDateString('vi-VN')
                  : ''}
              </span>
            </div>
            <div>
              Promocode:
              <span>{selectedSubscription?.coupon_code}</span>
            </div>
          </div>
        </>
      )}
    </div>
  ) : null
}

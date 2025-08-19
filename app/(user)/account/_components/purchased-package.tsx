'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import Link from 'next/link'
import { useSession } from '@/hooks/use-session'
import { getUserSubscriptions } from '@/network/client/users'
import { getSubscription } from '@/network/client/subscriptions'
import { useEffect, useState } from 'react'
import { UserSubscriptionDetail } from '@/models/user-subscriptions'
import { Subscription } from '@/models/subscription'

type EnhancedSubscription = UserSubscriptionDetail & {
  subscriptionDetails?: Subscription
  isValid?: boolean
}

export default function PurchasedPackage() {
  const { session } = useSession()
  const [subscriptions, setSubscriptions] = useState<EnhancedSubscription[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const isSubscriptionValid = (subscriptionEndAt: string): boolean => {
    if (!subscriptionEndAt) return false
    const endDate = new Date(subscriptionEndAt)
    const currentDate = new Date()
    return endDate > currentDate
  }

  useEffect(() => {
    let isMounted = true

    async function fetchUserSubscriptions() {
      if (!session?.userId) return

      try {
        setIsLoading(true)
        const response = await getUserSubscriptions(session.userId)

        if (isMounted && response.data && response.data.length > 0) {
          try {
            const enhancedSubscriptions = await Promise.all(
              response.data.map(async (sub) => {
                try {
                  if (sub.subscription.id) {
                    const detailsResponse = await getSubscription(sub.subscription.id.toString())
                    const isValid = sub.subscription_end_at ? isSubscriptionValid(sub.subscription_end_at) : false

                    if (detailsResponse.data) {
                      return {
                        ...sub,
                        subscriptionDetails: detailsResponse.data,
                        isValid,
                      }
                    }
                  }
                  return {
                    ...sub,
                    isValid: sub.subscription_end_at ? isSubscriptionValid(sub.subscription_end_at) : false,
                  }
                } catch (err) {
                  console.error(`Error fetching details for subscription ${sub.subscription.id}:`, err)
                  return {
                    ...sub,
                    isValid: sub.subscription_end_at ? isSubscriptionValid(sub.subscription_end_at) : false,
                  }
                }
              })
            )

            if (isMounted) {
              setSubscriptions(enhancedSubscriptions)
            }
          } catch (error) {
            console.error('Error enhancing subscriptions:', error)
            if (isMounted) {
              setSubscriptions(
                response.data.map((sub) => ({
                  ...sub,
                  isValid: sub.subscription_end_at ? isSubscriptionValid(sub.subscription_end_at) : false,
                }))
              )
            }
          }
        } else if (isMounted) {
          setSubscriptions([])
        }
      } catch (error) {
        console.error('Error fetching user subscriptions:', error)
        if (isMounted) {
          setSubscriptions([])
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    fetchUserSubscriptions()

    return () => {
      isMounted = false
    }
  }, [session?.userId])

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('vi-VN')
    } catch (error) {
      return dateString
    }
  }

  return (
    <div>
      <div className="lg:font-[family-name:var(--font-coiny)] font-[family-name:var(--font-roboto-condensed)] font-semibold lg:font-bold text-[#FF7873] text-2xl md:text-4xl mb-4 lg:px-12 px-4">
        Gói Đã Mua
      </div>

      <div className="text-[#737373] text-sm md:text-lg mb-6 lg:px-12 px-4">Các gói bạn đã đăng ký</div>

      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : subscriptions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:px-12">
          {subscriptions.map((subscription) => (
            <div key={subscription.id} className="bg-[#FFAEB01A] lg:rounded-[20px] lg:p-5 p-4 h-full relative">
              <div className="flex flex-col 2xl:flex-row 2xl:gap-4 h-full justify-between">
                <div className="flex flex-col gap-5 justify-between h-full w-full 2xl:w-1/2">
                  <div className="flex flex-col items-start justify-between gap-2">
                    <div className="lg:font-[family-name:var(--font-coiny)] font-[family-name:var(--font-roboto-condensed)] font-semibold lg:font-bold text-[#000000] text-lg lg:text-xl">
                      {subscription.subscriptionDetails?.name || `Gói #${subscription.subscription.id}`}
                    </div>
                    <Button
                      className={`block 2xl:hidden text-white text-xs rounded-none border border-[#000000] md:text-sm lg:text-lg w-[100px] h-[36px] lg:w-[160px] lg:h-[46px] ${
                        subscription.isValid ? 'bg-[#13D8A7]' : 'bg-[#E61417]'
                      }`}
                    >
                      {subscription.isValid ? 'Còn hạn' : 'Hết hạn'}
                    </Button>
                    <div className="space-y-3">
                      <div className="flex text-[#737373] text-sm lg:text-lg gap-2">
                        <div>Ngày bắt đầu:</div>
                        <div>{formatDate(subscription.subscription_start_at)}</div>
                      </div>
                      <div className="flex text-[#737373] text-sm lg:text-lg gap-2">
                        <div>Ngày kết thúc:</div>
                        <div>{formatDate(subscription.subscription_end_at)}</div>
                      </div>
                      {subscription.coupon_code && (
                        <div className="flex text-[#737373] text-sm lg:text-lg gap-2">
                          <div>Promocode:</div>
                          <div>{subscription.coupon_code}</div>
                        </div>
                      )}
                    </div>
                  </div>
                  <Link
                    href={`/packages/${subscription.subscription.id}`}
                    className="h-fit text-sm lg:text-lg text-[#13D8A7] mt-4"
                  >
                    <Button className="bg-[#13D8A7] rounded-full w-[160px] h-[36px] text-sm lg:text-lg">
                      Chọn gói
                    </Button>
                  </Link>
                </div>
                <div className="w-full 2xl:w-1/2 mt-4 2xl:mt-0 flex flex-col gap-4">
                  <Button
                    className={`ml-auto hidden 2xl:block rounded-none border border-[#000000] text-white text-xs md:text-sm lg:text-lg w-[100px] h-[36px] lg:w-[160px] lg:h-[46px] ${
                      subscription.isValid ? 'bg-[#13D8A7]' : 'bg-[#E61417]'
                    }`}
                  >
                    {subscription.isValid ? 'Còn hạn' : 'Hết hạn'}
                  </Button>
                  <img
                    src={subscription.subscriptionDetails?.assets?.thumbnail}
                    alt=""
                    className="aspect-[400/255] object-cover rounded-[20px] w-full h-auto"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 text-[#737373]">
          Bạn chưa mua gói nào. Hãy chọn gói ở tab "Tất cả" để bắt đầu.
        </div>
      )}
    </div>
  )
}

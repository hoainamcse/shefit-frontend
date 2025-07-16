'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import Link from 'next/link'
import { useSession } from '@/hooks/use-session'
import { getUserSubscriptions } from '@/network/client/users'
import { getSubscription } from '@/network/client/subscriptions'
import { useEffect, useState } from 'react'
import { UserSubscriptionDetail } from '@/models/user-subscriptions'

type EnhancedSubscription = UserSubscriptionDetail & {
  name?: string
  description_1?: string
  description_2?: string
  cover_image?: string
}

export default function PurchasedPackage() {
  const { session } = useSession()
  const [subscriptions, setSubscriptions] = useState<EnhancedSubscription[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchUserSubscriptions() {
      if (!session) return

      try {
        setIsLoading(true)
        const response = await getUserSubscriptions(session.userId)

        if (response.data && response.data.length > 0) {
          setSubscriptions(response.data)

          try {
            const enhancedSubscriptions = await Promise.all(
              response.data.map(async (sub) => {
                try {
                  if (sub.subscription.id) {
                    const detailsResponse = await getSubscription(sub.subscription.id.toString())
                    if (detailsResponse.data) {
                      return {
                        ...sub,
                        name: detailsResponse.data.name,
                        description_1: detailsResponse.data.description_1,
                        description_2: detailsResponse.data.description_2,
                        cover_image: detailsResponse.data.cover_image,
                      }
                    }
                  }
                  return sub
                } catch (err) {
                  console.error(`Error fetching details for subscription ${sub.subscription}:`, err)
                  return sub
                }
              })
            )

            setSubscriptions(enhancedSubscriptions)
          } catch (error) {
            console.error('Error enhancing subscriptions:', error)
          }
        } else {
          setSubscriptions([])
        }
      } catch (error) {
        console.error('Error fetching user subscriptions:', error)
        setSubscriptions([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserSubscriptions()
  }, [session])

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('vi-VN')
    } catch (error) {
      return dateString
    }
  }

  return (
    <div>
      <div className="font-[family-name:var(--font-coiny)] text-[#FF7873] text-3xl md:text-[40px] md:leading-[44px] mb-4 font-bold lg:px-12 px-4">
        Gói Đã Mua
      </div>

      <div className="text-[#737373] text-base md:text-xl mb-6 lg:px-12 px-4">Các gói bạn đã đăng ký</div>

      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : subscriptions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:px-12">
          {subscriptions.map((subscription) => (
            <div key={subscription.id} className="bg-[#FFAEB01A] lg:rounded-[20px] lg:p-5 p-4 h-full relative">
              <div className="flex flex-col 2xl:flex-row 2xl:gap-4">
                <div className="flex flex-col gap-5 justify-between px-2 w-full 2xl:w-1/2">
                  <div className="flex flex-col items-start justify-between gap-2">
                    <div className="font-[family-name:var(--font-coiny)] text-[#000000] text-xl lg:text-2xl font-semibold">
                      {subscription.name || `Gói #${subscription.subscription.id}`}
                    </div>
                    <Button
                      className={`block lg:hidden text-white text-sm rounded-none border border-[#000000] md:text-base lg:text-xl w-[100px] h-[36px] lg:w-[160px] lg:h-[46px] ${
                        subscription.status === 'active' ? 'bg-[#13D8A7]' : 'bg-[#E61417]'
                      }`}
                    >
                      {subscription.status === 'active' ? 'Còn hạn' : 'Hết hạn'}
                    </Button>
                    <div className="space-y-3">
                      <div className="flex text-[#737373] text-base lg:text-xl gap-2">
                        <div>Ngày bắt đầu:</div>
                        <div>{formatDate(subscription.subscription_start_at)}</div>
                      </div>
                      <div className="flex text-[#737373] text-base lg:text-xl gap-2">
                        <div>Ngày kết thúc:</div>
                        <div>{formatDate(subscription.subscription_end_at)}</div>
                      </div>
                      {subscription.coupon_code && (
                        <div className="flex text-[#737373] text-base lg:text-xl gap-2">
                          <div>Promocode:</div>
                          <div>{subscription.coupon_code}</div>
                        </div>
                      )}
                    </div>
                  </div>

                  <Link
                    href={`/packages/detail/${subscription.subscription.id}`}
                    className="h-fit text-base lg:text-xl text-[#13D8A7] mt-4"
                  >
                    <Button className="bg-[#13D8A7] rounded-full w-[160px] h-[36px] text-base lg:text-xl">
                      Chọn gói
                    </Button>
                  </Link>
                </div>
                <div className="w-full 2xl:w-1/2 mt-4 2xl:mt-0 flex flex-col gap-4">
                  <Button
                    className={`ml-auto hidden lg:block rounded-none border border-[#000000] text-white text-sm md:text-base lg:text-xl w-[100px] h-[36px] lg:w-[160px] lg:h-[46px] ${
                      subscription.status === 'active' ? 'bg-[#13D8A7]' : 'bg-[#E61417]'
                    }`}
                  >
                    {subscription.status === 'active' ? 'Còn hạn' : 'Hết hạn'}
                  </Button>
                  <img
                    src={subscription.cover_image}
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

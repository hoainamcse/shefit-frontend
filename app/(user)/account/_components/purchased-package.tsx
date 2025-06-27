'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import Link from 'next/link'
import { useSession } from '@/components/providers/session-provider'
import { getUserSubscriptions } from '@/network/server/user-subscriptions'
import { getSubscription } from '@/network/server/subscriptions'
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
                    const detailsResponse = await getSubscription(sub.subscription.id)
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
      <div className="font-[family-name:var(--font-coiny)] text-[#FF7873] text-3xl md:text-[40px] md:leading-[44px] mb-4 font-bold">
        Gói Đã Mua
      </div>

      <div className="text-[#737373] text-base md:text-xl mb-6">Các gói bạn đã đăng ký</div>

      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : subscriptions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 h">
          {subscriptions.map((subscription) => (
            <div
              key={subscription.id}
              className="bg-[#FFAEB01A] rounded-[20px] py-5 px-5 grid grid-cols-1 md:grid-cols-2 h-full"
            >
              <div className="flex flex-col gap-5 max-w-[45%] text-lg">
                <div className="font-[family-name:var(--font-coiny)] text-[#000000] text-xl md:text-2xl mb-[18px]">
                  {subscription.name || `Gói #${subscription.subscription.id}`}
                </div>
                <div className="flex justify-between text-[#737373]">
                  <div>Ngày bắt đầu:</div>
                  <div>{formatDate(subscription.subscription_start_at)}</div>
                </div>
                <div className="flex justify-between text-[#737373]">
                  <div>Ngày kết thúc:</div>
                  <div>{formatDate(subscription.subscription_end_at)}</div>
                </div>
                <Link
                  href={`/packages/detail/${subscription.subscription.id}`}
                  className="h-fit text-base md:text-xl lg:text-2xl text-[#13D8A7] mb-[18px] max-md:font-light mt-auto"
                >
                  <Button className="bg-[#13D8A7] rounded-full w-[160px] h-[36px] text-lg">Chọn gói</Button>
                </Link>
              </div>
              <div className="flex flex-col justify-between items-end gap-4">
                <Button
                  className={`rounded-lg text-white text-lg w-[160px] h-[56px] ${
                    subscription.status === 'active' ? 'bg-[#13D8A7]' : 'bg-[#E61417]'
                  }`}
                >
                  {subscription.status === 'active' ? 'Còn hạn' : 'Hết hạn'}
                </Button>
                <img src={subscription.cover_image} alt="" className="aspect-[3/2] object-cover rounded-[20px]" />
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

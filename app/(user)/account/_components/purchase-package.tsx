'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { getSubscriptions } from '@/network/client/subscriptions'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import PurchasedPackage from './purchased-package'
import { cn } from '@/lib/utils'
import { useSession } from '@/hooks/use-session'
import { useState, useEffect } from 'react'
import { ListResponse } from '@/models/response'
import { Subscription } from '@/models/subscription'
import { useSearchParams } from 'next/navigation'
import { getUserSubscriptions } from '@/network/client/users'

export default function PurchasePackage() {
  const { session } = useSession()
  const searchParams = useSearchParams()
  const courseId = searchParams.get('course_id')

  const [subscriptions, setSubscriptions] = useState<ListResponse<Subscription>>({
    status: '',
    data: [],
    paging: { page: 1, per_page: 10, total: 0 },
  })
  const [isLoading, setIsLoading] = useState(true)
  const [purchasedSubscriptionIds, setPurchasedSubscriptionIds] = useState<number[]>([])

  useEffect(() => {
    async function fetchUserSubscriptions() {
      if (!session) return

      try {
        const response = await getUserSubscriptions(session.userId)

        if (response.data && response.data.length > 0) {
          const subscribedIds = response.data.map((sub) => Number(sub.subscription.id))
          setPurchasedSubscriptionIds(subscribedIds)
        }
      } catch (error) {
        console.error('Error fetching user subscriptions:', error)
      }
    }

    if (session) {
      fetchUserSubscriptions()
    }
  }, [session])

  useEffect(() => {
    async function fetchSubscriptions() {
      try {
        setIsLoading(true)
        let data

        if (courseId) {
          data = await getSubscriptions({ course_id: parseInt(courseId) })
        } else {
          data = await getSubscriptions()
        }

        if (session && purchasedSubscriptionIds.length > 0) {
          data = {
            ...data,
            data: data.data.filter((sub) => !purchasedSubscriptionIds.includes(Number(sub.id))),
          }
        }

        setSubscriptions(data)
      } catch (error) {
        console.error('Error fetching subscriptions:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSubscriptions()
  }, [courseId, session, purchasedSubscriptionIds])

  if (isLoading) {
    return (
      <div className="pb-16 md:pb-16 px-5 sm:px-9 lg:px-[56px] xl:px-[60px]">
        <div className="font-[family-name:var(--font-coiny)] text-[#FF7873] text-3xl md:text-[40px] md:leading-[44px] mb-4 font-bold">
          Mua Gói Độ Dáng
        </div>
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="pb-16 md:pb-16 px-5 sm:px-9 lg:px-[56px] xl:px-[60px]">
      <Tabs defaultValue="all">
        {session && (
          <TabsList className="bg-background gap-y-3 sm:gap-y-5 gap-x-7 pl-0 h-fit lg:h-9 mb-6">
            <TabsTrigger
              value="all"
              className={cn('text-ring bg-white !shadow-none border-2 border-[#FF7873] text-lg ')}
            >
              Tất cả
            </TabsTrigger>
            <TabsTrigger
              value="purchased"
              className={cn('text-ring bg-white !shadow-none border-2 border-[#FF7873] text-lg')}
            >
              Đã mua
            </TabsTrigger>
          </TabsList>
        )}
        <TabsContent value="all">
          <div className="font-[family-name:var(--font-coiny)] text-[#FF7873] text-3xl md:text-[40px] md:leading-[44px] mb-4 font-bold">
            Mua Gói Độ Dáng
          </div>

          <div className="text-[#737373] text-base md:text-xl mb-6">
            {courseId
              ? 'Bạn cần mua một trong các Gói Member sau để truy cập vào khóa tập vừa xem'
              : 'Mua gói độ dáng để bắt đầu các khóa tập và thực đơn'}
          </div>

          {subscriptions.data.length === 0 ? (
            <div className="text-center text-[#737373] py-8">
              {courseId ? 'Không có gói nào phù hợp với khóa học này' : 'Không có gói nào khả dụng'}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              {subscriptions.data.map((subscription) => (
                <div key={subscription.id} className="bg-[#FFAEB01A] rounded-[20px] p-5 h-full">
                  <div className="flex flex-col 2xl:flex-row">
                    <div className="flex flex-col gap-5 justify-between px-2 w-full">
                      <div className="font-[family-name:var(--font-coiny)] text-[#000000] text-xl lg:text-2xl font-semibold mb-[18px]">
                        {subscription.name}
                      </div>
                      <ul className="list-disc pl-7 text-base md:text-xl text-[#737373] lg:w-[50%] w-full space-y-2">
                        {subscription.description_1
                          .replace(/<\/?p[^>]*>/g, '')
                          .split('\n')
                          .filter((item) => item.trim() !== '')
                          .map((item, index) => (
                            <li
                              key={index}
                              className="[&>p]:m-0 [&>p]:inline"
                              dangerouslySetInnerHTML={{ __html: item }}
                            />
                          ))}
                      </ul>
                      <Link href={`/packages/detail/${subscription.id}${courseId ? `?course_id=${courseId}` : ''}`}>
                        <Button className="bg-[#13D8A7] w-[190px] h-[38px] rounded-[26px] text-base md:text-xl font-normal md:pt-2.5 md:pb-1.5">
                          Chọn gói
                        </Button>
                      </Link>
                    </div>
                    <img
                      src={subscription.cover_image}
                      alt=""
                      className="aspect-[3/2] object-cover rounded-[20px] lg:w-[402px] lg:h-[261px] w-full mt-4"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="purchased">
          <PurchasedPackage />
        </TabsContent>
      </Tabs>
    </div>
  )
}

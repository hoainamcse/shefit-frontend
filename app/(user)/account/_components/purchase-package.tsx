'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { getSubscriptions, getSubscriptionsByCourseId } from '@/network/server/subscriptions'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import PurchasedPackage from './purchased-package'
import { cn } from '@/lib/utils'
import { useSession } from '@/components/providers/session-provider'
import { useState, useEffect } from 'react'
import { ListResponse } from '@/models/response'
import { Subscription } from '@/models/subscription'
import { useSearchParams } from 'next/navigation'

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

  useEffect(() => {
    async function fetchSubscriptions() {
      try {
        setIsLoading(true)
        let data

        if (courseId) {
          data = await getSubscriptionsByCourseId(parseInt(courseId))
        } else {
          data = await getSubscriptions()
        }

        setSubscriptions(data)
      } catch (error) {
        console.error('Error fetching subscriptions:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSubscriptions()
  }, [courseId])

  if (isLoading) {
    return (
      <div className="pb-16 md:pb-16 px-5 sm:px-9 lg:px-[56px] xl:px-[60px]">
        <div className="font-[Coiny] text-[#FF7873] text-3xl md:text-[40px] md:leading-[44px] mb-3.5">
          Mua Gói Độ Dáng
        </div>
        <div className="text-[#737373] text-base md:text-xl mb-6">Đang tải...</div>
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
              Gói đã mua
            </TabsTrigger>
          </TabsList>
        )}
        <TabsContent value="all">
          <div className="font-[Coiny] text-[#FF7873] text-3xl md:text-[40px] md:leading-[44px] mb-3.5">
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
                  <div>
                    <div className="flex justify-between">
                      <div className="font-[Coiny] text-[#000000] text-xl md:text-2xl mb-[18px]">
                        {subscription.name}
                      </div>
                    </div>

                    <div className="flex gap-5 justify-between items-center px-2 w-full">
                      <ul className="list-disc pl-7 text-base md:text-xl text-[#737373] w-[50%] space-y-2">
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
                      <img
                        src={subscription.cover_image}
                        alt=""
                        className="aspect-[3/2] object-cover rounded-[20px] w-[50%]"
                      />
                    </div>

                    <Link href={`/packages/detail/${subscription.id}${courseId ? `?course_id=${courseId}` : ''}`}>
                      <Button className="bg-[#13D8A7] w-[190px] h-[38px] rounded-[26px] text-base md:text-xl font-normal md:pt-2.5 md:pb-1.5">
                        Chọn gói
                      </Button>
                    </Link>
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

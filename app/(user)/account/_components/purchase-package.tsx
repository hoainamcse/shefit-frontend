'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { getSubscriptions } from '@/network/client/subscriptions'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import PurchasedPackage from './purchased-package'
import { cn } from '@/lib/utils'
import { useSession } from '@/hooks/use-session'
import { useState, useEffect, useMemo, useCallback } from 'react'
import { ListResponse } from '@/models/response'
import { Subscription } from '@/models/subscription'
import { useSearchParams } from 'next/navigation'
import { getUserSubscriptions } from '@/network/client/users'
import { HtmlContent } from '@/components/html-content'

export default function PurchasePackage() {
  const { session } = useSession()
  const searchParams = useSearchParams()
  const courseId = searchParams.get('course_id')
  const mealPlansId = searchParams.get('meal_plans_id')

  const [allSubscriptions, setAllSubscriptions] = useState<ListResponse<Subscription>>({
    status: '',
    data: [],
    paging: { page: 1, per_page: 10, total: 0 },
  })
  const [isLoading, setIsLoading] = useState(true)
  const [purchasedSubscriptionIds, setPurchasedSubscriptionIds] = useState<number[]>([])
  const [isUserSubscriptionsLoaded, setIsUserSubscriptionsLoaded] = useState(false)

  useEffect(() => {
    let isMounted = true

    async function fetchUserSubscriptions() {
      if (!session?.userId) return

      try {
        const response = await getUserSubscriptions(session.userId)

        if (isMounted && response.data && response.data.length > 0) {
          const subscribedIds = response.data.map((sub) => Number(sub.subscription.id))
          setPurchasedSubscriptionIds(subscribedIds)
        }
      } catch (error) {
        console.error('Error fetching user subscriptions:', error)
      } finally {
        if (isMounted) {
          setIsUserSubscriptionsLoaded(true)
        }
      }
    }

    if (session) {
      fetchUserSubscriptions()
    } else {
      setIsUserSubscriptionsLoaded(true)
    }

    return () => {
      isMounted = false
    }
  }, [session?.userId])

  useEffect(() => {
    let isMounted = true

    async function fetchSubscriptions() {
      try {
        setIsLoading(true)
        let data

        if (courseId) {
          data = await getSubscriptions({ course_id: parseInt(courseId) })
        } else if (mealPlansId) {
          data = await getSubscriptions({ meal_plans_id: parseInt(mealPlansId) })
        } else {
          data = await getSubscriptions()
        }

        if (isMounted) {
          setAllSubscriptions(data)
        }
      } catch (error) {
        console.error('Error fetching subscriptions:', error)
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    fetchSubscriptions()

    return () => {
      isMounted = false
    }
  }, [courseId, mealPlansId])

  const filteredSubscriptions = useMemo(() => {
    if (!session || courseId || mealPlansId || !isUserSubscriptionsLoaded) {
      return allSubscriptions.data
    }

    return allSubscriptions.data.filter((sub) => !purchasedSubscriptionIds.includes(Number(sub.id)))
  }, [allSubscriptions.data, session, courseId, mealPlansId, purchasedSubscriptionIds, isUserSubscriptionsLoaded])

  const parseDescription = useCallback((description: string) => {
    const parser = new DOMParser()
    const doc = parser.parseFromString(description, 'text/html')
    const paragraphs = Array.from(doc.querySelectorAll('p')).map((p) => p.innerHTML)

    return paragraphs.filter((item: string) => item.trim() !== '')
  }, [])

  if (isLoading || (session && !isUserSubscriptionsLoaded)) {
    return (
      <div className="pb-16 md:pb-16 px-5 lg:px-12 sm:px-9">
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Tabs defaultValue="all">
        {session && (
          <TabsList className="bg-background gap-y-3 sm:gap-y-5 gap-x-7 pl-0 h-fit lg:h-9 mb-6 px-4 lg:px-12">
            <TabsTrigger
              value="all"
              className={cn('text-ring bg-white !shadow-none border-2 border-[#FF7873] text-base ')}
            >
              Tất cả
            </TabsTrigger>
            <TabsTrigger
              value="purchased"
              className={cn('text-ring bg-white !shadow-none border-2 border-[#FF7873] text-base')}
            >
              Đã mua
            </TabsTrigger>
          </TabsList>
        )}
        <TabsContent value="all">
          <div className="font-[family-name:var(--font-roboto-condensed)] lg:font-[family-name:var(--font-coiny)] font-semibold lg:font-bold text-[#FF7873] text-2xl md:text-4xl mb-4 px-4 lg:px-12">
            Mua Gói Member
          </div>

          <div className="text-[#737373] text-sm md:text-lg mb-6 px-4 lg:px-12">
            {courseId
              ? 'Bạn cần mua một trong các Gói Member sau để truy cập vào khóa tập vừa xem'
              : mealPlansId
              ? 'Bạn cần mua một trong các Gói Member sau để truy cập vào thực đơn vừa xem'
              : 'Mua gói độ dáng để bắt đầu các khóa tập và thực đơn'}
          </div>

          {filteredSubscriptions.length === 0 ? (
            <div className="text-center text-[#737373] py-8">
              {courseId
                ? 'Không có gói nào phù hợp với khóa học này'
                : mealPlansId
                ? 'Không có gói nào phù hợp với thực đơn này'
                : 'Không có gói nào khả dụng'}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:px-12">
              {filteredSubscriptions.map((subscription) => {
                const parsedDescription = parseDescription(subscription.description_1)

                return (
                  <div key={subscription.id} className="bg-[#FFAEB01A] lg:rounded-[20px] lg:p-5 p-4 h-full">
                    <div className="flex flex-col 2xl:flex-row 2xl:gap-4 h-full justify-between">
                      <div className="flex flex-col gap-5 justify-between h-full w-full 2xl:w-1/2">
                        <div className="font-[family-name:var(--font-roboto-condensed)] lg:font-[family-name:var(--font-coiny)] font-semibold lg:font-bold text-[#000000] text-lg lg:text-xl">
                          {subscription.name}
                        </div>
                        <ul className="list-disc pl-7 text-sm md:text-lg text-[#737373] w-full space-y-2">
                          {parsedDescription.map((content: string, index: number) => (
                            <li key={index} className="[&>p]:m-0 [&>p]:inline list-item">
                              <HtmlContent content={content} className="whitespace-pre-line" />
                            </li>
                          ))}
                        </ul>
                        <Link
                          href={`/packages/detail/${subscription.id}${
                            courseId ? `?course_id=${courseId}` : mealPlansId ? `?meal_plans_id=${mealPlansId}` : ''
                          }`}
                        >
                          <Button className="bg-[#13D8A7] w-[190px] h-[38px] rounded-[26px] text-sm md:text-lg font-normal md:pt-2.5 md:pb-1.5">
                            Chọn gói
                          </Button>
                        </Link>
                      </div>
                      <div className="w-full 2xl:w-1/2 mt-4 2xl:mt-0">
                        <img
                          src={subscription.assets.thumbnail}
                          alt=""
                          className="aspect-[400/255] object-cover rounded-[20px] w-full h-auto"
                        />
                      </div>
                    </div>
                  </div>
                )
              })}
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

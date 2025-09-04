import { getSubscription } from '@/network/server/subscriptions'
import { getCourses } from '@/network/server/courses'
import { CardCourse } from '@/components/cards/card-course'
import { CardMealPlan } from '@/components/cards/card-meal-plan'
import Link from 'next/link'
import { getMealPlans } from '@/network/server/meal-plans'
import ActionButtons from './_components/action-buttons'
import SubscriptionInfo from './_components/subscription-info'
import { serializeSearchParams } from '@/utils/searchParams'
import { HTMLRenderer } from '@/components/html-renderer'
import { Button } from '@/components/ui/button'
import { BackIconBlack } from '@/components/icons/BackIconBlack'
import { Subscription } from '@/models/subscription'

export default async function PackageDetail({
  params,
  searchParams,
}: {
  params: Promise<{ id: Subscription['id'] }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { id: subscriptionId } = await params
  const _searchParams = await searchParams
  const query = serializeSearchParams(_searchParams)
  const back = typeof _searchParams.back === 'string' ? _searchParams.back : ''
  const subscription = await getSubscription(subscriptionId)
  const courses = await getCourses()
  const mealPlans = await getMealPlans()

  const subscriptionData = subscription?.data
  return (
    <div>
      <div className="relative">
        <Link href={back || '/packages'} className="lg:hidden items-center gap-2 cursor-pointer">
          <Button className="px-4 flex items-center text-lg bg-transparent hover:bg-transparent focus:bg-transparent active:bg-transparent text-black shadow-none font-medium">
            <BackIconBlack className="mb-1" /> Quay về
          </Button>
        </Link>
        <img
          src={subscriptionData?.assets.mobile_cover || subscriptionData?.assets.thumbnail}
          alt={`${subscriptionData?.name}`}
          className="lg:rounded-xl rounded-none mb-4 w-full object-cover aspect-[400/255] block lg:hidden"
        />
      </div>
      <div className="flex mx-auto flex-col gap-10 mt-10 w-full pb-24 px-4 lg:px-14">
        <div className="mb-20 flex flex-col gap-10">
          <img
            src={
              subscriptionData?.assets.desktop_cover ||
              subscriptionData?.assets.mobile_cover ||
              subscriptionData?.assets.thumbnail
            }
            alt={`${subscriptionData?.name}`}
            className="lg:rounded-xl rounded-none mb-4 w-full object-cover lg:aspect-[1800/681] hidden lg:block"
          />
          <SubscriptionInfo />
          <div className="flex justify-between text-base">
            <div className="flex flex-col gap-10 w-full">
              <div className="font-[family-name:var(--font-roboto-condensed)] lg:font-[family-name:var(--font-coiny)] font-semibold lg:font-bold text-[#FF7873] text-2xl md:text-4xl mb-8 text-center">
                {subscriptionData?.name}
              </div>
              <div>
                <div className="font-[family-name:var(--font-roboto-condensed)] lg:font-[family-name:var(--font-coiny)] font-semibold lg:font-bold text-[#FF7873] text-2xl md:text-4xl mb-4">
                  Thông tin gói tập
                </div>
                <HTMLRenderer className="whitespace-pre-line" content={subscriptionData?.description_2 || ''} />
              </div>
              <div>
                <div className="font-[family-name:var(--font-roboto-condensed)] lg:font-[family-name:var(--font-coiny)] font-semibold lg:font-bold text-[#FF7873] text-2xl md:text-4xl mb-4">
                  Khoá tập thuộc gói
                </div>
                <p className="mb-5">Các khóa tập bạn được truy cập khi mua gói member này</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {subscriptionData?.course_ids?.map((courseId: number) => {
                    const course = courses?.data?.find((course) => course.id === courseId)
                    if (!course) return null
                    return (
                      <CardCourse
                        data={course}
                        key={course.id}
                        to={`/courses/${course.id}?back=${encodeURIComponent('/packages/' + subscriptionId + query)}`}
                      />
                    )
                  })}
                </div>
              </div>
              {subscriptionData?.meal_plan_ids && subscriptionData?.meal_plan_ids.length > 0 && (
                <div>
                  <div className="font-[family-name:var(--font-roboto-condensed)] lg:font-[family-name:var(--font-coiny)] font-semibold lg:font-bold text-[#FF7873] text-2xl md:text-4xl mb-4">
                    Thực đơn
                  </div>
                  <HTMLRenderer
                    className="whitespace-pre-line mb-5"
                    content={subscriptionData?.meal_plan_description || ''}
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {subscriptionData?.meal_plan_ids.map((mealPlanId: number) => {
                      const mealPlan = mealPlans?.data?.find((plan: any) => plan.id === mealPlanId)
                      if (!mealPlan) return null
                      return (
                        <CardMealPlan
                          data={mealPlan}
                          key={mealPlan.id}
                          to={`/meal-plans/${mealPlan.id}?back=${encodeURIComponent(
                            '/packages/' + subscriptionId + query
                          )}`}
                        />
                      )
                    })}
                  </div>
                </div>
              )}
              <div>
                <div className="font-[family-name:var(--font-roboto-condensed)] lg:font-[family-name:var(--font-coiny)] font-semibold lg:font-bold text-[#FF7873] text-2xl md:text-4xl mb-4">
                  Theo dõi kết quả
                </div>
                <HTMLRenderer className="whitespace-pre-line" content={subscriptionData?.result_checkup || ''} />
              </div>
              <ActionButtons subscription={subscription.data} query={query} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

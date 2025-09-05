import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { getCourses } from '@/network/server/courses'
import { HTMLRenderer } from '@/components/html-renderer'
import { CardCourse } from '@/components/cards/card-course'
import { CardMealPlan } from '@/components/cards/card-meal-plan'
import { BackIconBlack } from '@/components/icons/BackIconBlack'
import { getMealPlans } from '@/network/server/meal-plans'
import { getSubscription } from '@/network/server/subscriptions'
import { serializeSearchParams } from '@/utils/searchParams'
import ActionButtons from './_components/action-buttons'
import SubscriptionInfo from './_components/subscription-info'

export default async function PackageDetail({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { id } = await params
  const _searchParams = await searchParams
  const query = serializeSearchParams(_searchParams)
  const back = typeof _searchParams.back === 'string' ? _searchParams.back : ''

  const { data } = await getSubscription(id)

  const { data: courses } = await getCourses({ ids: data.course_ids.join(',') })
  const { data: mealPlans } = await getMealPlans({ ids: data.meal_plan_ids.join(',') })

  return (
    <div>
      <div className="relative">
        <Link href={back || '/packages'} className="lg:hidden items-center gap-2 cursor-pointer">
          <Button className="px-4 flex items-center text-lg bg-transparent hover:bg-transparent focus:bg-transparent active:bg-transparent text-black shadow-none font-medium">
            <BackIconBlack className="mb-1" /> Quay về
          </Button>
        </Link>
        <img
          src={data.assets.mobile_cover || data.assets.thumbnail}
          alt={`${data.name}`}
          className="lg:rounded-xl rounded-none mb-4 w-full object-cover aspect-[400/255] block lg:hidden"
        />
      </div>
      <div className="flex mx-auto flex-col gap-10 mt-10 w-full pb-24 px-4 lg:px-14">
        <div className="mb-20 flex flex-col gap-10">
          <img
            src={data.assets.desktop_cover || data.assets.mobile_cover || data.assets.thumbnail}
            alt={`${data.name}`}
            className="lg:rounded-xl rounded-none mb-4 w-full object-cover lg:aspect-[1800/681] hidden lg:block"
          />
          <SubscriptionInfo subscriptionId={id} />
          <div className="flex justify-between text-base">
            <div className="flex flex-col gap-10 w-full">
              <div className="font-[family-name:var(--font-roboto-condensed)] lg:font-[family-name:var(--font-coiny)] font-semibold lg:font-bold text-[#FF7873] text-2xl md:text-4xl mb-8 text-center">
                {data.name}
              </div>
              <div>
                <div className="font-[family-name:var(--font-roboto-condensed)] lg:font-[family-name:var(--font-coiny)] font-semibold lg:font-bold text-[#FF7873] text-2xl md:text-4xl mb-4">
                  Thông tin gói tập
                </div>
                <HTMLRenderer className="whitespace-pre-line" content={data.description_2 || ''} />
              </div>
              <div>
                <div className="font-[family-name:var(--font-roboto-condensed)] lg:font-[family-name:var(--font-coiny)] font-semibold lg:font-bold text-[#FF7873] text-2xl md:text-4xl mb-4">
                  Khoá tập thuộc gói
                </div>
                <p className="mb-5">Các khóa tập bạn được truy cập khi mua gói member này</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {courses.map((course) => (
                    <CardCourse
                      data={course}
                      key={course.id}
                      to={`/courses/${course.id}?back=${encodeURIComponent('/packages/' + id + query)}`}
                    />
                  ))}
                </div>
              </div>
              {mealPlans.length > 0 && (
                <div>
                  <div className="font-[family-name:var(--font-roboto-condensed)] lg:font-[family-name:var(--font-coiny)] font-semibold lg:font-bold text-[#FF7873] text-2xl md:text-4xl mb-4">
                    Thực đơn
                  </div>
                  <HTMLRenderer className="whitespace-pre-line mb-5" content={data.meal_plan_description || ''} />
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {mealPlans.map((mealPlan) => (
                      <CardMealPlan
                        data={mealPlan}
                        key={mealPlan.id}
                        to={`/meal-plans/${mealPlan.id}?back=${encodeURIComponent('/packages/' + id + query)}`}
                      />
                    ))}
                  </div>
                </div>
              )}
              <div>
                <div className="font-[family-name:var(--font-roboto-condensed)] lg:font-[family-name:var(--font-coiny)] font-semibold lg:font-bold text-[#FF7873] text-2xl md:text-4xl mb-4">
                  Theo dõi kết quả
                </div>
                <HTMLRenderer className="whitespace-pre-line" content={data.result_checkup || ''} />
              </div>
              <ActionButtons subscription={data} query={query} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

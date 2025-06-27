import { getSubscription } from '@/network/server/subscriptions'
import { getCourses } from '@/network/server/courses'
import { ChevronRight } from 'lucide-react'
import { courseLevelLabel, courseFormLabel } from '@/lib/label'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { getMealPlans } from '@/network/server/meal-plans'
import AcctionButton from './_components/AcctionButton'
import SubscriptionInfo from './_components/SubscriptionInfo'
import { BackIcon } from '@/components/icons/BackIcon'

export default async function PackageDetail({ params }: { params: Promise<{ id: string }> }) {
  const subscription = await getSubscription(Number((await params).id))
  const courses = await getCourses()
  const mealPlans = await getMealPlans()
  const NextButton = ({ className, href }: { className?: string; href?: string }) => {
    return (
      <button type="button" className={`bg-background p-2 rounded-3xl text-ring ${className}`}>
        <ChevronRight className="w-4 h-4" />
      </button>
    )
  }

  const subscriptionData = subscription?.data
  return (
    <div className="flex max-w-screen-2xl mx-auto flex-col gap-10 mt-10 w-full pb-24 relative">
      <Link href="/account?tab=buy-package" className="flex items-center gap-[10px] cursor-pointer">
        <BackIcon color="#000000" style={{ marginBottom: '4px' }} />
        <div className="text-xl text-[#000000] font-semibold">Quay về</div>
      </Link>
      <div className="p-6 mb-20 flex flex-col gap-10">
        <img
          src={subscriptionData?.cover_image}
          alt={`${subscriptionData?.name}`}
          className="rounded-xl mb-4 w-full h-[680px] object-cover"
        />
        <SubscriptionInfo />
        <div className="flex justify-between text-lg">
          <div className="flex flex-col gap-10 w-full">
            <div className="font-[family-name:var(--font-coiny)] text-[#FF7873] text-3xl md:text-[40px] md:leading-[44px] mb-6 font-bold">
              {subscriptionData?.name}
            </div>
            <div>
              <div className="font-[family-name:var(--font-coiny)] text-[#FF7873] text-3xl md:text-[40px] md:leading-[44px] mb-4 font-bold">
                Thông tin Gói
              </div>
              <p dangerouslySetInnerHTML={{ __html: subscriptionData?.description_2 || '' }} />
            </div>
            <div>
              <div className="font-[family-name:var(--font-coiny)] text-[#FF7873] text-3xl md:text-[40px] md:leading-[44px] mb-4  font-bold">
                Khóa Tập Thuộc Gói
              </div>
              <p className="mb-5">Các khóa tập bạn được truy cập khi mua gói member này</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {subscriptionData?.relationships?.courses.map((c) => {
                  const course = courses?.data?.find((course) => course.id === c.id)
                  return course ? (
                    <div key={`${c.id}`}>
                      <div className="relative group">
                        <img
                          src={course.cover_image || subscriptionData?.cover_image}
                          alt={course.course_name || c.id.toString()}
                          className="aspect-[5/3] object-cover rounded-xl mb-4 w-[585px] h-[373px]"
                        />
                        <div className="bg-[#00000033] group-hover:opacity-0 absolute inset-0 transition-opacity rounded-xl" />

                        <Link href={`/courses/${course.id}/${course.course_format}-classes`}>
                          <NextButton className="absolute bottom-3 right-3 transform transition-transform duration-300 group-hover:translate-x-1" />
                        </Link>
                      </div>
                      <div className="flex justify-between">
                        <div>
                          <p className="font-medium">{course.course_name}</p>
                          <p className="text-[#737373]">{courseLevelLabel[course.difficulty_level]}</p>
                          <p className="text-[#737373]">{course.trainer}</p>
                        </div>
                        <div>
                          <div className="text-gray-500 flex justify-end max-w-[200px]">
                            {Array.isArray(course.form_categories)
                              ? course.form_categories.map((cat) => cat.name).join(', ')
                              : courseFormLabel[course.form_categories]}
                          </div>
                          <div className="flex justify-end">
                            {course.is_free ? (
                              <Button className="bg-[#DA1515] text-white w-[136px] rounded-full">Free</Button>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : null
                })}
              </div>
            </div>
            {subscriptionData?.relationships?.meal_plans && subscriptionData?.relationships?.meal_plans.length > 0 && (
              <div>
                <div className="font-[family-name:var(--font-coiny)] text-[#FF7873] text-3xl md:text-[40px] md:leading-[44px] mb-4 font-bold">
                  Thực đơn
                </div>
                <p dangerouslySetInnerHTML={{ __html: subscriptionData?.meal_plan_description || '' }} />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {subscriptionData?.relationships?.meal_plans.map((ml) => {
                    const mealPlan = mealPlans?.data?.find((plan: any) => plan.id === ml.id)
                    return mealPlan ? (
                      <div key={`menu-${ml.id}`}>
                        <div className="relative group">
                          <img
                            src={mealPlan.image}
                            alt={mealPlan.title}
                            className="aspect-[5/3] object-cover rounded-xl mb-4"
                          />
                          <div className="bg-[#00000033] group-hover:opacity-0 absolute inset-0 transition-opacity rounded-xl" />
                          <Link href={`/meal-plans/${ml.id}`}>
                            <NextButton className="absolute bottom-6 right-4 transform transition-transform duration-300 group-hover:translate-x-1" />
                          </Link>
                        </div>
                        <div className="relative">
                          <div>
                            <p className="font-medium">{mealPlan.title}</p>
                            <p className="text-[#737373]">{mealPlan.subtitle}</p>
                            <p className="text-[#737373]">
                              Chef {mealPlan.chef_name} - {mealPlan.number_of_days} ngày
                            </p>
                          </div>
                          <div className="absolute bottom-0 right-0">
                            {mealPlan.is_free ? (
                              <Button className="bg-[#DA1515] text-white w-[136px] rounded-full">Free</Button>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    ) : null
                  })}
                </div>
              </div>
            )}
            <div>
              <div className="font-[family-name:var(--font-coiny)] text-[#FF7873] text-3xl md:text-[40px] md:leading-[44px] mb-4 font-bold">
                Theo dõi kết quả
              </div>
              <p dangerouslySetInnerHTML={{ __html: subscriptionData?.result_checkup || '' }} />
            </div>
            <AcctionButton />
          </div>
        </div>
      </div>
    </div>
  )
}

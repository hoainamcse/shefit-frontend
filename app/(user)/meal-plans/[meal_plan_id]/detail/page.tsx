import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getMealPlan } from '@/network/server/meal-plans'
import { getMealPlanDishes } from '@/network/server/meal-plans'
import { getMealPlanDays } from '@/network/server/meal-plans'
import type { MealPlanDish } from '@/models/meal-plan'
import { sortByKey } from '@/lib/helpers'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { getUserSubscriptions } from '@/network/server/users'
import { BackIcon } from '@/components/icons/BackIcon'
import { BackIconBlack } from '@/components/icons/BackIconBlack'

export default async function MealPlanDetailPage({ params }: { params: Promise<{ meal_plan_id: string }> }) {
  const { meal_plan_id } = await params

  const session = await getSession()

  if (!session) {
    redirect(`/meal-plans/${meal_plan_id}`)
  }

  try {
    const subscriptions = await getUserSubscriptions(session.userId)

    const isSubscriptionValid = (subscription: any): boolean => {
      if (!subscription?.subscription_end_at) return false

      const endDate = new Date(subscription.subscription_end_at)
      const currentDate = new Date()
      const isActive = subscription.status === 'active'

      return isActive && endDate > currentDate
    }

    const hasAccess = subscriptions.data?.some((subscription: any) => {
      return isSubscriptionValid(subscription)
    })

    if (!hasAccess) {
      redirect(`/meal-plans/${meal_plan_id}`)
    }
  } catch (error) {
    console.error('Error checking meal plan access:', error)
    redirect(`/meal-plans/${meal_plan_id}`)
  }

  const { data: mealPlanByDay } = await getMealPlanDays(meal_plan_id)
  const { data: mealPlan } = await getMealPlan(meal_plan_id)
  console.log(mealPlanByDay)

  const sortedMealPlanByDay = Array.isArray(mealPlanByDay)
    ? [...mealPlanByDay].sort((a, b) => a.day_number - b.day_number)
    : []

  return (
    <div>
      <div className="relative block md:hidden">
        <div className="flex flex-col lg:gap-10 gap-4 max-w-[1800px] w-full mx-auto">
          <Link href={`/meal-plans/${meal_plan_id}`} className="flex items-center">
            <Button className="flex items-center text-lg bg-transparent hover:bg-transparent focus:bg-transparent active:bg-transparent text-black shadow-none font-medium">
              <BackIconBlack className="mb-1"/> Quay về
            </Button>
          </Link>
        </div>
        <img
          src={mealPlan.assets.mobile_cover || mealPlan.assets.thumbnail}
          alt="Menu detail image"
          className="w-full aspect-[440/281] object-cover block md:hidden"
        />
      </div>
      <div className="flex flex-col max-w-screen-[1800px] mx-auto">
        <div className="items-center justify-center mb-20 md:mt-5 mt-0 p-2 xl:p-4">
          <div className="relative w-full">
            <img
              src={mealPlan.assets.desktop_cover || mealPlan.assets.mobile_cover || mealPlan.assets.thumbnail}
              alt="Menu detail image"
              className="w-full aspect-[1800/681] object-cover rounded-sm lg:rounded-xl md:rounded-md hidden md:block"
            />
          </div>
          <div className="mr-auto text-lg my-20 max-lg:my-0 max-lg:p-1">
            <div className="lg:font-[family-name:var(--font-coiny)] font-[family-name:var(--font-roboto-condensed)] font-semibold lg:font-bold text-ring text-2xl md:text-4xl md:mb-5 mb-0">
              Menu theo lịch
            </div>
          </div>
          <Tabs defaultValue="1" className="w-full h-full">
            <TabsList className="w-full flex-wrap md:justify-start justify-between bg-transparent p-0 h-full">
              {sortedMealPlanByDay.map((day: any) => (
                <TabsTrigger
                  key={day.id}
                  value={`${day.day_number}`}
                  className="rounded-full md:mx-3 mx-0 md:my-5 my-1 w-[63px] h-[64px] flex flex-col items-center justify-center font-medium text-[#000000] text-lg cursor-pointer data-[state=active]:bg-[#91EBD5] data-[state=active]:text-white bg-transparent hover:bg-[#91EBD5]/10 transition-colors duration-200"
                >
                  <div>
                    Ngày <br /> {day.day_number}
                  </div>
                </TabsTrigger>
              ))}
            </TabsList>

            {sortedMealPlanByDay.map((day: any) =>
              day.image ? (
                <TabsContent key={`image-${day.id}`} value={`${day.day_number}`} className="mt-0">
                  <div className="w-full mb-6 px-1 md:px-0">
                    <img
                      src={day.image}
                      alt={`Ngày ${day.day_number}`}
                      className="w-full h-auto object-cover rounded-[20px] md:aspect-[1800/681] aspect-[407/255]"
                    />
                  </div>
                </TabsContent>
              ) : null
            )}

            {await Promise.all(
              sortedMealPlanByDay.map(async (day: any) => {
                const dayId = day.id
                const { data: dayDishes } = await getMealPlanDishes(meal_plan_id, dayId)
                const dishesData = sortByKey(dayDishes, 'created_at', { transform: (val) => new Date(val).getTime() })
                return (
                  <TabsContent key={day.id} value={`${day.day_number}`}>
                    {dishesData.length === 0 ? (
                      <div>Chưa có món ăn cho ngày này.</div>
                    ) : (
                      dishesData.map((dish: MealPlanDish) => (
                        <div
                          key={dish.id}
                          className="mb-10 flex flex-col xl:w-full xl:text-lg max-lg:text-sm gap-8 max-lg:px-1"
                        >
                          <div>
                            <div className="font-medium">{dish.name}</div>
                            <div className="text-[#737373]">Dinh dưỡng: {dish.nutrients}</div>
                          </div>
                          <div className="xl:w-full text-[#737373]">{dish.description}</div>
                        </div>
                      ))
                    )}
                  </TabsContent>
                )
              })
            )}
          </Tabs>
        </div>
      </div>
    </div>
  )
}

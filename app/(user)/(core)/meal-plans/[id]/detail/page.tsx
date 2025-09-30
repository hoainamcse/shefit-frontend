'use client'

import type { DishMealTime, MealPlanDish } from '@/models/meal-plan'

import Link from 'next/link'
import { useState } from 'react'
import { useQuery, useQueries } from '@tanstack/react-query'
import { useParams, useSearchParams } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { BackIconBlack } from '@/components/icons/BackIconBlack'
import { sortByKey } from '@/utils/helpers'
import {
  getMealPlan,
  getMealPlanDays,
  getMealPlanDishes,
  queryKeyMealPlanDays,
  queryKeyMealPlanDishes,
  queryKeyMealPlans,
} from '@/network/client/meal-plans'

const mealTimeOrder: DishMealTime[] = ['breakfast', 'lunch', 'snack', 'dinner']

export default function MealPlanDetailPage() {
  const { id: mealPlanId } = useParams<{ id: string }>()
  const searchParams = useSearchParams()
  const query = searchParams ? `?${searchParams.toString()}` : ''
  const back = searchParams.get('back')

  const [selectedTab, setSelectedTab] = useState<string>('1')

  const { data: mealPlanData } = useQuery({
    queryKey: [queryKeyMealPlans, mealPlanId],
    queryFn: () => getMealPlan(Number(mealPlanId)),
  })

  const { data: mealPlanDaysData } = useQuery({
    queryKey: [queryKeyMealPlanDays, mealPlanId],
    queryFn: () => getMealPlanDays(Number(mealPlanId)),
  })

  const mealPlan = mealPlanData?.data
  const mealPlanDays = mealPlanDaysData?.data || []

  // Sort meal plan days
  const sortedMealPlanByDay = sortByKey(mealPlanDays, 'day_number', { transform: (val) => Number(val) })

  // Find the selected day's id based on the selected tab
  const selectedDay = sortedMealPlanByDay.find((day: any) => `${day.day_number}` === selectedTab)

  // Use a single useQuery to fetch dishes for the currently selected day
  const { data: dishesData, isLoading: isDishesLoading } = useQuery({
    queryKey: [queryKeyMealPlanDishes, mealPlanId, selectedDay?.id],
    queryFn: async () => getMealPlanDishes(Number(mealPlanId), selectedDay!.id),
    enabled: !!selectedDay,
  })

  // Sort dishes by meal time (breakfast, lunch, dinner, etc.)
  const sortedMealPlanDishes = dishesData?.data
    ? sortByKey(dishesData.data, 'meal_time', {
        transform: (val) => mealTimeOrder.indexOf(val),
      })
    : []

  if (!mealPlan) {
    return <div>Không tìm thấy kế hoạch bữa ăn.</div>
  }

  return (
    <div>
      <div className="relative block md:hidden">
        <div className="flex flex-col lg:gap-10 gap-4 max-w-[1800px] w-full mx-auto">
          <Link href={back || `/meal-plans/${mealPlanId}${query}`} className="flex items-center">
            <Button className="flex items-center text-lg bg-transparent hover:bg-transparent focus:bg-transparent active:bg-transparent text-black shadow-none font-medium">
              <BackIconBlack className="mb-1" /> Quay về
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

          {/* Day selection buttons */}
          <div className="w-full flex-wrap flex md:justify-start justify-between bg-transparent p-0">
            {mealPlanDays.map((day: any) => (
              <button
                key={day.id}
                onClick={() => setSelectedTab(`${day.day_number}`)}
                className={`rounded-full md:mx-3 mx-0 md:my-5 my-1 w-[63px] h-[64px] flex flex-col items-center justify-center font-medium text-[#000000] text-lg cursor-pointer transition-colors duration-200 ${
                  selectedTab === `${day.day_number}`
                    ? 'bg-[#91EBD5] text-white'
                    : 'bg-transparent hover:bg-[#91EBD5]/10'
                }`}
              >
                <div>
                  Ngày <br /> {day.day_number}
                </div>
              </button>
            ))}
          </div>

          {/* Day image (if available) */}
          {selectedDay?.image && (
            <div className="mt-0">
              <div className="w-full mb-6 px-1 md:px-0">
                <img
                  src={selectedDay.image}
                  alt={`Ngày ${selectedDay.day_number}`}
                  className="w-full h-auto object-cover rounded-[20px] md:aspect-[1800/681] aspect-[407/255]"
                />
              </div>
            </div>
          )}

          {/* Dishes content */}
          <div className="mt-6">
            {isDishesLoading ? (
              <div>Đang tải dữ liệu...</div>
            ) : sortedMealPlanDishes.length === 0 ? (
              <div>Chưa có món ăn cho ngày này.</div>
            ) : (
              sortedMealPlanDishes.map((dish: MealPlanDish) => (
                <div
                  key={dish.id}
                  className="mb-10 flex flex-col xl:w-full xl:text-lg max-lg:text-sm gap-8 max-lg:px-1"
                >
                  <div>
                    {/* <div>{dish.meal_time}</div> */}
                    <div className="font-medium">{dish.name}</div>
                    <div className="text-[#737373]">Dinh dưỡng: {dish.nutrients}</div>
                  </div>
                  <div className="xl:w-full text-[#737373]">{dish.description}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { useQueries } from '@tanstack/react-query'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { CardMealPlan } from '@/components/cards/card-meal-plan'
import { getGoals } from '@/network/client/goals'
import { getCalories } from '@/network/client/calories'
import { getMealPlans, queryKeyMealPlans } from '@/network/client/meal-plans'

function SingleSelectHero({
  placeholder,
  options,
  value,
  onChange,
  isDisabled,
}: {
  placeholder: string
  options: { value: string; label: string }[]
  value: string | undefined
  onChange: (value: string | undefined) => void
  isDisabled?: boolean
}) {
  return (
    <Select value={value || ''} onValueChange={(val) => onChange(val || undefined)} disabled={isDisabled}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
        {value && (
          <>
            <SelectSeparator />
            <Button
              className="w-full px-2"
              variant="secondary"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onChange(undefined)
              }}
            >
              Bỏ chọn
            </Button>
          </>
        )}
      </SelectContent>
    </Select>
  )
}

export default function MealPlansPage() {
  const [filter, setFilter] = useState({
    goal: undefined as string | undefined,
    calorie: undefined as string | undefined,
    showType: 'all',
  })

  const [
    { data: mealPlansResponse, isLoading: isMealPlansLoading, error: mealPlansError },
    { data: goalsResponse, isLoading: isGoalsLoading },
    { data: caloriesResponse, isLoading: isCaloriesLoading },
  ] = useQueries({
    queries: [
      {
        queryKey: [queryKeyMealPlans, filter.goal, filter.calorie, filter.showType],
        queryFn: () => {
          const params: Record<string, any> = { sort_by: 'display_order', sort_order: 'asc' }

          // Add goal_id if filtered
          if (filter.goal) {
            params.goal_id = filter.goal
          }

          // Add calorie_id if filtered
          if (filter.calorie) {
            params.calorie_id = filter.calorie
          }

          // Add is_free filter if needed
          if (filter.showType === 'free') {
            params.is_free = true
          }

          return getMealPlans(params)
        },
      },
      {
        queryKey: ['goals'],
        queryFn: getGoals,
      },
      {
        queryKey: ['calories'],
        queryFn: getCalories,
      },
    ],
  })

  // Use separate loading states instead of combining them
  const mealPlans = mealPlansResponse?.data || []
  const goals = goalsResponse?.data || []
  const calories = caloriesResponse?.data || []

  return (
    <div className="px-4 lg:mt-8 mt-6">
      <div className="max-w-screen-md mx-auto mb-6 sm:mb-8 lg:mb-12">
        <p className="lg:font-[family-name:var(--font-coiny)] font-[family-name:var(--font-roboto-condensed)] font-semibold md:text-center text-ring text-2xl md:text-4xl mb-3.5 md:mb-7">
          Chọn thực đơn
        </p>
        <p className="sm:text-center text-[#737373] text-sm mb-4">
          Lựa chọn thực đơn phù hợp với mục tiêu, với các món ăn đơn giản, dễ chuẩn bị hàng ngày. Ăn ngon miệng mà vẫn
          đảm bảo tăng cơ, giảm mỡ hiệu quả!
        </p>
        <div className="flex gap-4 w-full max-w-4xl mx-auto">
          <div className="w-full">
            {isGoalsLoading ? (
              <Skeleton className="h-10 w-full rounded-md" />
            ) : (
              <SingleSelectHero
                placeholder="Mục tiêu"
                options={goals.map((goal) => ({
                  value: goal.id.toString(),
                  label: goal.name,
                }))}
                value={filter.goal}
                onChange={(goal) => setFilter((prev) => ({ ...prev, goal }))}
                isDisabled={isGoalsLoading}
              />
            )}
          </div>
          <div className="w-full">
            {isCaloriesLoading ? (
              <Skeleton className="h-10 w-full rounded-md" />
            ) : (
              <SingleSelectHero
                placeholder="Lượng calo"
                options={calories.map((calorie) => ({
                  value: calorie.id.toString(),
                  label: calorie.name,
                }))}
                value={filter.calorie}
                onChange={(calorie) => setFilter((prev) => ({ ...prev, calorie }))}
                isDisabled={isCaloriesLoading}
              />
            )}
          </div>
        </div>
      </div>

      {/* Meal plan filter */}
      <div className="mb-4 lg:mb-8">
        <div className="flex justify-center pb-4 gap-8">
          <button
            onClick={() => setFilter((prev) => ({ ...prev, showType: 'all' }))}
            className={`text-sm md:text-base transition-all hover:text-ring ${
              filter.showType === 'all' ? 'text-ring font-medium border-b-2 border-ring' : 'text-gray-600'
            }`}
            disabled={isMealPlansLoading}
          >
            Tất cả
          </button>
          <button
            onClick={() => setFilter((prev) => ({ ...prev, showType: 'free' }))}
            className={`text-sm md:text-base transition-all hover:text-ring ${
              filter.showType === 'free' ? 'text-ring font-medium border-b-2 border-ring' : 'text-gray-600'
            }`}
            disabled={isMealPlansLoading}
          >
            Miễn phí
          </button>
        </div>
      </div>

      {/* Meal plan list */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 sm:gap-5 gap-4 mx-auto items-stretch">
        {isMealPlansLoading ? (
          <div className="col-span-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
            {Array(6)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <Skeleton className="h-[220px] w-full rounded-lg" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
              ))}
          </div>
        ) : mealPlansError ? (
          <div className="col-span-full flex justify-center items-center py-12">
            <p className="text-red-500">Failed to load blogs. Please try again.</p>
          </div>
        ) : mealPlans.length > 0 ? (
          mealPlans.map((mealPlan, index) => <CardMealPlan key={mealPlan.id} data={mealPlan} />)
        ) : (
          <div className="col-span-full flex justify-center items-center py-12">
            <p className="text-gray-500 text-center">Không tìm thấy thực đơn phù hợp</p>
          </div>
        )}
      </div>
    </div>
  )
}

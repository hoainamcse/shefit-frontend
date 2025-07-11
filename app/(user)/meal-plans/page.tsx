'use client'

import Layout from '@/app/(user)/_components/layout'
import { MultiSelect } from '@/components/ui/select'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import { getMealPlans } from '@/network/client/meal-plans'
import { getGoals } from '@/network/client/goals'
import { getCalories } from '@/network/client/calories'
import type { MealPlan, MealPlanGoal } from '@/models/meal-plan'
import { Button } from '@/components/ui/button'
import { Calorie } from '@/models/calorie'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

function MultiSelectHero({
  placeholder,
  options,
  value,
  onChange,
}: {
  placeholder: string
  options: { value: string; label: string }[]
  value: string[]
  onChange: (value: string[]) => void
}) {
  return (
    <MultiSelect
      options={options}
      value={value}
      onValueChange={onChange}
      placeholder={placeholder}
      selectAllLabel="Tất cả"
      maxDisplay={2}
    />
  )
}

const NextButton = ({ href, className }: { href: string; className?: string }) => {
  return (
    <Link href={href}>
      <button type="button" className={`bg-background p-2 rounded-3xl text-ring ${className}`}>
        <ChevronRight className="w-4 h-4" />
      </button>
    </Link>
  )
}

export default function MealPlansPage() {
  const [calories, setCalories] = useState<Calorie[]>([])
  const [mealPlanGoals, setMealPlanGoals] = useState<Array<{ id: string; name: string }>>([])
  const [filter, setFilter] = useState({
    goals: [] as string[],
    calories: [] as string[],
    showType: 'all' // 'all' or 'free'
  })
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)

        const [mealPlansResponse, goalsResponse, caloriesResponse] = await Promise.all([
          getMealPlans(),
          getGoals(),
          getCalories(),
        ])

        setMealPlans(mealPlansResponse.data || [])
        const formattedGoals = (goalsResponse.data || []).map((goal) => ({
          id: goal.id.toString(),
          name: goal.name,
        }))
        setMealPlanGoals(formattedGoals)
        setCalories(caloriesResponse.data || [])
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const filteredMealPlans = mealPlans.filter((mealPlan) => {
    const goalId = mealPlan.meal_plan_goal
      ? typeof mealPlan.meal_plan_goal === 'string'
        ? mealPlan.meal_plan_goal
        : mealPlan.meal_plan_goal.id?.toString()
      : ''

    const calorieId = mealPlan.calorie ? mealPlan.calorie.id?.toString() : ''

    const matchesGoals = filter.goals.length === 0 || filter.goals.includes(goalId)
    const matchesCalories = filter.calories.length === 0 || filter.calories.includes(calorieId)
    const matchesShowType = filter.showType === 'all' || (filter.showType === 'free' && mealPlan.is_free)

    return matchesGoals && matchesCalories && matchesShowType
  })

  return (
    <div>
      <div className="max-w-screen-md mx-auto">
        <p className="font-[family-name:var(--font-coiny)] font-bold sm:text-center text-ring text-2xl sm:text-3xl my-8 sm:my-4">
          Chọn thực đơn
        </p>
        <p className="sm:text-center text-[#737373] text-base mb-4">
          Lựa chọn thực đơn phù hợp với mục tiêu, với các món ăn đơn giản, dễ chuẩn bị hàng ngày. Ăn ngon miệng mà vẫn
          đảm bảo tăng cơ, giảm mỡ hiệu quả!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-4xl mx-auto">
          <div className="w-full">
            <MultiSelectHero
              placeholder="Mục tiêu"
              options={mealPlanGoals.map((goal) => ({
                value: goal.id.toString(),
                label: goal.name,
              }))}
              value={filter.goals}
              onChange={(goals) => setFilter((prev) => ({ ...prev, goals }))}
            />
          </div>
          <div className="w-full">
            <MultiSelectHero
              placeholder="Lượng calo"
              options={calories.map((calorie) => ({
                value: calorie.id.toString(),
                label: calorie.name,
              }))}
              value={filter.calories}
              onChange={(calories) => setFilter((prev) => ({ ...prev, calories }))}
            />
          </div>
        </div>
      </div>
      <Tabs defaultValue="all" className="w-full" onValueChange={(value) => setFilter(prev => ({ ...prev, showType: value }))}>
        <TabsList className="bg-white mb-4 w-full flex justify-center mt-4">
          <TabsTrigger value="all" className={cn('underline text-ring bg-white !shadow-none')}>
            Tất cả
          </TabsTrigger>
          <TabsTrigger value="free" className={cn('underline text-ring bg-white !shadow-none')}>
            Free
          </TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mx-auto mt-6">
            {filteredMealPlans.map((mealPlan) => (
              <div key={`menu-${mealPlan.id}`} className="lg:w-[585px] w-full max-w-[585px] overflow-hidden">
                <div className="relative group">
                  <img
                    src={mealPlan.image}
                    alt={mealPlan.title}
                    className="aspect-[5/3] object-cover rounded-xl mb-4 w-full max-w-[585px] lg:h-[373px] h-[261px]"
                  />
                  <div className="bg-[#00000033] group-hover:opacity-0 absolute inset-0 transition-opacity rounded-xl" />
                  <NextButton
                    className="absolute bottom-6 right-4 transform transition-transform duration-300 group-hover:translate-x-1"
                    href={`/meal-plans/${mealPlan.id}`}
                  />
                  <div className="absolute top-2 right-2">
                    {mealPlan.is_free ? (
                      <Button className="bg-[#DA1515] text-white w-[136px] rounded-full">Free</Button>
                    ) : (
                      <Button className="bg-[#737373] text-white w-[136px] rounded-full">+ Gói Member</Button>
                    )}
                  </div>
                </div>
                <div className="relative">
                  <div>
                    <p className="font-medium">{mealPlan.title}</p>
                    <p className="text-[#737373]">{mealPlan.subtitle}</p>
                    <p className="text-[#737373]">Chef {mealPlan.chef_name}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="free">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mx-auto mt-6">
            {filteredMealPlans.map((mealPlan) => (
              <div key={`menu-${mealPlan.id}`} className="lg:w-[585px] w-full max-w-[585px] overflow-hidden">
                <div className="relative group">
                  <img
                    src={mealPlan.image}
                    alt={mealPlan.title}
                    className="aspect-[5/3] object-cover rounded-xl mb-4 w-full max-w-[585px] lg:h-[373px] h-[261px]"
                  />
                  <div className="bg-[#00000033] group-hover:opacity-0 absolute inset-0 transition-opacity rounded-xl" />
                  <NextButton
                    className="absolute bottom-6 right-4 transform transition-transform duration-300 group-hover:translate-x-1"
                    href={`/meal-plans/${mealPlan.id}`}
                  />
                  <div className="absolute top-2 right-2">
                    {mealPlan.is_free ? (
                      <Button className="bg-[#DA1515] text-white w-[136px] rounded-full">Free</Button>
                    ) : (
                      <Button className="bg-[#737373] text-white w-[136px] rounded-full">+ Gói Member</Button>
                    )}
                  </div>
                </div>
                <div className="relative">
                  <div>
                    <p className="font-medium">{mealPlan.title}</p>
                    <p className="text-[#737373]">{mealPlan.subtitle}</p>
                    <p className="text-[#737373]">Chef {mealPlan.chef_name}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

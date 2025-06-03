'use client'

import Layout from '@/app/(user)/_components/layout'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import { getMealPlans } from '@/network/server/meal-plans'
import { mealPlanGoalOptions } from '@/lib/label'
import type { MealPlan } from '@/models/meal-plan'

const CALORIE_OPTIONS = [
  { value: 'low', label: '< 300 cal' },
  { value: 'medium', label: '300-400 cal' },
  { value: 'high', label: '> 400 cal' },
]

function SelectHero({
  placeholder,
  options,
  value,
  onChange,
}: {
  placeholder: string
  options: { value: string; label: string }[]
  value: string
  onChange: (value: string) => void
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((item) => (
          <SelectItem key={item.value} value={item.value}>
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
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
  const [goal, setGoal] = useState('')
  const [calorieCategory, setCalorieCategory] = useState('')
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([])

  useEffect(() => {
    const fetchMealPlans = async () => {
      const response = await getMealPlans()
      setMealPlans(response.data || [])
    }
    fetchMealPlans()
  }, [])

  const filteredMealPlans = mealPlans.filter((mealPlan) => {
    const matchesGoal = !goal || mealPlan.goal === goal
    const matchesCalorie =
      !calorieCategory || getCalorieCategory((mealPlan.calorie?.max_calorie ?? 0).toString()) === calorieCategory
    return matchesGoal && matchesCalorie
  })

  return (
    <Layout>
      <div className="max-w-screen-md mx-auto">
        <p className="font-[family-name:var(--font-coiny)] sm:text-center text-ring text-2xl sm:text-3xl my-2 sm:my-4">
          Chọn thực đơn
        </p>
        <p className="sm:text-center text-[#737373] text-base mb-4">
          Lựa chọn thực đơn phù hợp với mục tiêu, với các món ăn đơn giản, dễ chuẩn bị hàng ngày. Ăn ngon miệng mà vẫn
          đảm bảo tăng cơ, giảm mỡ hiệu quả!
        </p>
        <div className="flex gap-4">
          <SelectHero placeholder="Mục tiêu" options={mealPlanGoalOptions} value={goal} onChange={setGoal} />
          <SelectHero
            placeholder="Lượng calo"
            options={CALORIE_OPTIONS}
            value={calorieCategory}
            onChange={setCalorieCategory}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-screen-xl mx-auto mt-6">
        {filteredMealPlans.map((mealPlan) => (
          <div key={`menu-${mealPlan.id}`}>
            <div className="relative group">
              <img src={mealPlan.image} alt={mealPlan.title} className="aspect-[5/3] object-cover rounded-xl mb-4" />
              <div className="bg-[#00000033] group-hover:opacity-0 absolute inset-0 transition-opacity rounded-xl" />
              <NextButton
                className="absolute bottom-6 right-4 transform transition-transform duration-300 group-hover:translate-x-1"
                href={`/meal-plans/${mealPlan.id}`}
              />
            </div>
            <p className="font-medium">{mealPlan.title}</p>
            <p className="text-[#737373]">{mealPlan.subtitle}</p>
            <p className="text-[#737373]">
              Chef {mealPlan.chef_name} - {mealPlan.number_of_days} ngày
            </p>
          </div>
        ))}
      </div>
    </Layout>
  )
}

function getCalorieCategory(calories: string): string {
  const cal = parseInt(calories)
  if (cal < 300) return 'low'
  if (cal > 400) return 'high'
  return 'medium'
}

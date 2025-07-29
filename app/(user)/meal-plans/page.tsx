'use client'

import { MultiSelect } from '@/components/ui/select'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import { getMealPlans } from '@/network/client/meal-plans'
import { getGoals } from '@/network/client/goals'
import { getCalories } from '@/network/client/calories'
import type { MealPlan } from '@/models/meal-plan'
import { Button } from '@/components/ui/button'
import { Calorie } from '@/models/calorie'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useRouter } from 'next/navigation'
import { useSession } from '@/hooks/use-session'
import { getUserSubscriptions } from '@/network/client/users'
import { UserSubscriptionDetail } from '@/models/user-subscriptions'

function MultiSelectHero({
  placeholder,
  options,
  value,
  onChange,
  isDisabled,
}: {
  placeholder: string
  options: { value: string; label: string }[]
  value: string[]
  onChange: (value: string[]) => void
  isDisabled?: boolean
}) {
  return (
    <MultiSelect
      options={options}
      value={value}
      onValueChange={onChange}
      placeholder={placeholder}
      selectAllLabel="Tất cả"
      maxDisplay={2}
      disabled={isDisabled}
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
  const router = useRouter()
  const { session } = useSession()
  const [calories, setCalories] = useState<Calorie[]>([])
  const [mealPlanGoals, setMealPlanGoals] = useState<Array<{ id: string; name: string }>>([])
  const [filter, setFilter] = useState({
    goals: [] as string[],
    calories: [] as string[],
    showType: 'all',
  })
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAccessDialog, setShowAccessDialog] = useState(false)
  const [selectedMealPlan, setSelectedMealPlan] = useState<MealPlan | null>(null)
  const [isCheckingAccess, setIsCheckingAccess] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)

        const [mealPlansResponse, goalsResponse, caloriesResponse] = await Promise.all([
          getMealPlans({ sort_by: 'display_order', sort_order: 'asc' }),
          getGoals(),
          getCalories(),
        ])

        const publicMealPlans = (mealPlansResponse.data || []).filter(
          (mealPlan: MealPlan) => mealPlan.is_public === true
        )
        setMealPlans(publicMealPlans)
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

  const checkMealPlanAccess = (mealPlanId: number, userSubscriptions: UserSubscriptionDetail[]): boolean => {
    const isSubscriptionValid = (subscriptionEndAt: string): boolean => {
      if (!subscriptionEndAt) return false
      const endDate = new Date(subscriptionEndAt)
      const currentDate = new Date()
      return endDate > currentDate
    }

    return userSubscriptions.some((userSub) => {
      const hasValidSubscription = userSub.subscription_end_at && isSubscriptionValid(userSub.subscription_end_at)
      const hasMealPlan = userSub.meal_plans?.some((mealPlan: any) => mealPlan.id === mealPlanId)
      return hasValidSubscription && hasMealPlan
    })
  }

  const handleMembershipClick = async (mealPlan: MealPlan) => {
    if (!session?.userId) {
      router.push(`/account?tab=buy-package&meal_plans_id=${mealPlan.id}`)
      return
    }

    setIsCheckingAccess(true)

    try {
      const userSubscriptions = await getUserSubscriptions(session.userId.toString())
      const hasAccess = checkMealPlanAccess(mealPlan.id, userSubscriptions.data)

      if (hasAccess) {
        setSelectedMealPlan(mealPlan)
        setShowAccessDialog(true)
      } else {
        router.push(`/account?tab=buy-package&meal_plans_id=${mealPlan.id}`)
      }
    } catch (error) {
      console.error('Error checking meal plan access:', error)
      router.push(`/account?tab=buy-package&meal_plans_id=${mealPlan.id}`)
    } finally {
      setIsCheckingAccess(false)
    }
  }

  const handleStartMealPlan = () => {
    if (selectedMealPlan) {
      router.push(`/meal-plans/${selectedMealPlan.id}`)
      setShowAccessDialog(false)
      setSelectedMealPlan(null)
    }
  }

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
    <>
      <div className="px-4 mt-8">
        <div className="max-w-screen-md mx-auto">
          <p className="lg:font-[family-name:var(--font-coiny)] font-[family-name:var(--font-roboto-condensed)] font-semibold md:text-center text-ring text-2xl md:text-4xl mb-3.5 md:mb-7">
            Chọn thực đơn
          </p>
          <p className="sm:text-center text-[#737373] text-sm mb-4">
            Lựa chọn thực đơn phù hợp với mục tiêu, với các món ăn đơn giản, dễ chuẩn bị hàng ngày. Ăn ngon miệng mà vẫn
            đảm bảo tăng cơ, giảm mỡ hiệu quả!
          </p>
          <div className="flex gap-4 w-full max-w-4xl mx-auto">
            <div className="w-full">
              <MultiSelectHero
                placeholder="Mục tiêu"
                options={mealPlanGoals.map((goal) => ({
                  value: goal.id.toString(),
                  label: goal.name,
                }))}
                value={filter.goals}
                onChange={(goals) => setFilter((prev) => ({ ...prev, goals }))}
                isDisabled={isLoading}
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
                isDisabled={isLoading}
              />
            </div>
          </div>
        </div>
        <Tabs
          defaultValue="all"
          className="w-full"
          onValueChange={(value) => setFilter((prev) => ({ ...prev, showType: value }))}
        >
          <TabsList className="bg-white mb-4 w-full flex justify-center mt-4">
            <TabsTrigger disabled={isLoading} value="all" className={cn('underline text-ring bg-white !shadow-none')}>
              Tất cả
            </TabsTrigger>
            <TabsTrigger disabled={isLoading} value="free" className={cn('underline text-ring bg-white !shadow-none')}>
              Free
            </TabsTrigger>
          </TabsList>
          {isLoading && (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          )}
          <TabsContent value="all">
            {filteredMealPlans.length === 0 ? null : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 mx-auto mt-6 justify-items-center">
                {filteredMealPlans.map((mealPlan) => (
                  <div key={`menu-${mealPlan.id}`} className="w-full max-w-full overflow-hidden">
                    <div className="relative group">
                      <img
                        src={mealPlan.cover_image}
                        alt={mealPlan.title}
                        className="aspect-[585/373] object-cover rounded-xl mb-4 w-full"
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
                          <Button
                            className="bg-[#737373] text-white w-[136px] rounded-full"
                            onClick={() => handleMembershipClick(mealPlan)}
                            disabled={isCheckingAccess}
                          >
                            {isCheckingAccess ? 'Đang kiểm tra...' : '+ Gói Member'}
                          </Button>
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
            )}
          </TabsContent>
          <TabsContent value="free">
            {filteredMealPlans.length === 0 ? null : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mx-auto mt-6 justify-items-center">
                {filteredMealPlans.map((mealPlan) => (
                  <div
                    key={`menu-${mealPlan.id}`}
                    className="lg:w-[585px] md:w-[450px] sm:w-[400px] w-full max-w-full overflow-hidden"
                  >
                    <div className="relative group">
                      <img
                        src={mealPlan.cover_image}
                        alt={mealPlan.title}
                        className="aspect-[5/3] object-cover rounded-xl mb-4 w-full lg:h-[373px] md:h-[300px] sm:h-[280px] h-[261px]"
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
                          <Button
                            className="bg-[#737373] text-white w-[136px] rounded-full"
                            onClick={() => handleMembershipClick(mealPlan)}
                            disabled={isCheckingAccess}
                          >
                            {isCheckingAccess ? 'Đang kiểm tra...' : '+ Gói Member'}
                          </Button>
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
            )}
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={showAccessDialog} onOpenChange={setShowAccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center lg:font-[family-name:var(--font-coiny)] font-[family-name:var(--font-roboto-condensed)] font-semibold lg:font-bold text-[#FF7873] text-lg"></DialogTitle>
          </DialogHeader>
          <div className="text-center py-4">
            <p className="text-base text-[#737373] mb-4">BẠN ĐÃ MUA GÓI MEMBER CÓ THỰC ĐƠN NÀY</p>
          </div>
          <div className="flex gap-4 justify-center w-full px-10">
            <Button className="bg-[#13D8A7] rounded-full w-full text-base" onClick={() => handleStartMealPlan()}>
              Bắt đầu thực đơn
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

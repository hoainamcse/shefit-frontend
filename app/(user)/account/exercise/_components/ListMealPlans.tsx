'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useSubscription } from './SubscriptionContext'
import { useAuth } from '@/components/providers/auth-context'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { getMealPlans } from '@/network/server/meal-plans'
import { MealPlan } from '@/models/meal-plan'
import { useEffect } from 'react'
import { DeleteIcon } from '@/components/icons/DeleteIcon'

export default function ListMealPlans() {
  const { userId } = useAuth()
  const { selectedSubscription } = useSubscription()
  const [dialogOpen, setDialogOpen] = useState(false)
  const isLoggedIn = !!userId

  const [filteredMealPlans, setFilteredMealPlans] = useState<MealPlan[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchAndFilterMealPlans = async () => {
      if (!selectedSubscription?.meal_plans?.length) {
        setFilteredMealPlans([])
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        const response = await getMealPlans()

        if (response?.data) {
          const subscriptionMealPlanIds = selectedSubscription.meal_plans.map((mp: any) =>
            typeof mp === 'object' ? mp.id : mp
          )

          const filtered = response.data.filter((mealPlan: MealPlan) => subscriptionMealPlanIds.includes(mealPlan.id))

          setFilteredMealPlans(filtered)
        }
      } catch (error) {
        console.error('Error fetching meal plans:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAndFilterMealPlans()
  }, [selectedSubscription?.meal_plans])

  if (!isLoggedIn) {
    return (
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button className="bg-[#13D8A7] text-white text-xl w-full rounded-full h-14 mt-6">Thêm thực đơn</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold">VUI LÒNG ĐĂNG NHẬP VÀ MUA GÓI</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center text-center gap-6">
            <p className="text-lg">HÃY ĐĂNG NHẬP & MUA GÓI ĐỂ THÊM KHÓA TẬP & THỰC ĐƠN</p>
            <div className="flex gap-4 justify-center w-full px-10">
              <div className="flex-1">
                <Button
                  className="bg-[#13D8A7] rounded-full w-full text-lg"
                  onClick={() => {
                    setDialogOpen(false)
                    window.location.href = '/account?tab=buy-package'
                  }}
                >
                  Mua gói
                </Button>
              </div>
              <div className="flex-1">
                <Button
                  className="bg-[#13D8A7] rounded-full w-full text-lg"
                  onClick={() => {
                    setDialogOpen(false)
                    window.location.href = '/auth/login'
                  }}
                >
                  Đăng nhập
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  if (!selectedSubscription) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-lg text-gray-500 mb-4">Vui lòng chọn gói đăng ký để xem thực đơn</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#13D8A7]"></div>
      </div>
    )
  }

  if (filteredMealPlans.length === 0) {
    return (
      <Link href="/meal-plans">
        <Button className="bg-[#13D8A7] text-white text-xl w-full rounded-full h-14">Thêm thực đơn</Button>
      </Link>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mx-auto mt-6 text-lg lg:text-xl">
        {filteredMealPlans.map((mealPlan) => (
          <Link href={`/meal-plans/${mealPlan.id}`} key={mealPlan.id}>
            <div key={mealPlan.id}>
              <div className="relative group">
                <div className="absolute top-4 right-4 z-10">
                  <DeleteIcon className="text-white hover:text-red-500 transition-colors duration-300" />
                </div>
                <img
                  src={mealPlan.image}
                  alt={mealPlan.title}
                  className="aspect-[5/3] object-cover rounded-xl mb-4 w-full"
                />
                <div className="bg-[#00000033] group-hover:opacity-0 absolute inset-0 transition-opacity rounded-xl" />
              </div>
              <p className="font-medium">{mealPlan.title}</p>
              <p className="text-[#737373]">{mealPlan.subtitle}</p>
              <p className="text-[#737373]">
                Chef {mealPlan.chef_name} - {mealPlan.number_of_days} ngày
              </p>
            </div>
          </Link>
        ))}
      </div>
      <div className="mt-6">
        <Link href="/meal-plans">
          <Button className="bg-[#13D8A7] text-white text-xl w-full rounded-full h-14">Thêm thực đơn</Button>
        </Link>
      </div>
    </div>
  )
}

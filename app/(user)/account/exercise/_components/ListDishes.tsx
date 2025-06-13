'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useSubscription } from './SubscriptionContext'
import { useSession } from '@/components/providers/session-provider'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { getDishes } from '@/network/server/dishes'
import { MealPlan } from '@/models/meal-plan'
import { useEffect } from 'react'
import { DeleteIcon } from '@/components/icons/DeleteIcon'

export default function ListMealPlans() {
  const { session } = useSession()
  const { selectedSubscription } = useSubscription()
  const [dialogOpen, setDialogOpen] = useState(false)

  const [filteredDishes, setFilteredDishes] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchAndFilterDishes = async () => {
      if (!selectedSubscription?.dishes?.length) {
        setFilteredDishes([])
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        const response = await getDishes()

        if (response?.data) {
          const subscriptionDishIds = selectedSubscription.dishes.map((mp: any) =>
            typeof mp === 'object' ? mp.id : mp
          )

          const filtered = response.data.filter((dish: any) => subscriptionDishIds.includes(dish.id))

          setFilteredDishes(filtered)
        }
      } catch (error) {
        console.error('Error fetching dishes:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAndFilterDishes()
  }, [selectedSubscription?.dishes])

  if (!session) {
    return (
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button className="bg-[#13D8A7] text-white text-xl w-full rounded-full h-14 mt-6">Thêm món ăn</Button>
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
        <p className="text-lg text-gray-500 mb-4">Vui lòng chọn gói đăng ký để xem món ăn</p>
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

  if (filteredDishes.length === 0) {
    return (
      <Link href="/dishes">
        <Button className="bg-[#13D8A7] text-white text-xl w-full rounded-full h-14">Thêm món ăn</Button>
      </Link>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mx-auto mt-6 text-lg lg:text-xl">
        {filteredDishes.map((dish) => (
          <Link href={`/dishes/${dish.id}`} key={dish.id}>
            <div key={dish.id}>
              <div className="relative group">
                <div className="absolute top-4 right-4 z-10">
                  <DeleteIcon className="text-white hover:text-red-500 transition-colors duration-300" />
                </div>
                <img src={dish.image} alt={dish.title} className="aspect-[5/3] object-cover rounded-xl mb-4 w-full" />
                <div className="bg-[#00000033] group-hover:opacity-0 absolute inset-0 transition-opacity rounded-xl" />
              </div>
              <p className="font-medium">{dish.title}</p>
              <p className="text-[#737373]">{dish.subtitle}</p>
              <p className="text-[#737373]">
                Chef {dish.chef_name} - {dish.number_of_days} ngày
              </p>
            </div>
          </Link>
        ))}
      </div>
      <div className="mt-6">
        <Link href="/dishes">
          <Button className="bg-[#13D8A7] text-white text-xl w-full rounded-full h-14">Thêm món ăn</Button>
        </Link>
      </div>
    </div>
  )
}

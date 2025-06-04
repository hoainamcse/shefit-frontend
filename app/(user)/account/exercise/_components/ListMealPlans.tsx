"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getUserMealPlans } from "@/network/server/user-meal-plans"
import { DeleteIcon } from "@/components/icons/DeleteIcon"
import { deleteUserMealPlan } from "@/network/server/user-meal-plans"
import { toast } from "sonner"
import { useAuth } from "@/components/providers/auth-context"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { UserMealPlan } from "@/models/user-meal-plans"
import { ListResponse } from "@/models/response"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function ListMealPlans() {
  const router = useRouter()
  const { userId } = useAuth()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [mealPlans, setMealPlans] = useState<ListResponse<UserMealPlan>>({
    status: "",
    data: [],
    paging: { page: 1, per_page: 10, total: 0 },
  })
  const [isLoading, setIsLoading] = useState(true)
  const isLoggedIn = !!userId

  const handleDeleteMealPlan = async (mealPlanId: string) => {
    if (!userId) return

    try {
      await deleteUserMealPlan(userId.toString(), mealPlanId)
      toast("Xóa thực đơn thành công")
      // Refresh meal plans after deletion
      const updatedMealPlans = await getUserMealPlans(userId.toString())
      setMealPlans(updatedMealPlans)
    } catch (error) {
      toast("Xóa thực đơn thất bại")
    }
  }

  useEffect(() => {
    async function fetchMealPlans() {
      if (!isLoggedIn) {
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        const response = await getUserMealPlans(userId.toString())
        setMealPlans(response)
      } catch (error) {
        console.error("Error fetching meal plans:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMealPlans()
  }, [userId, isLoggedIn])

  if (!isLoggedIn) {
    return (
      <div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#13D8A7] text-white text-xl w-full rounded-full h-14 mt-6">Thêm thực đơn</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-center text-2xl font-bold"></DialogTitle>
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
      </div>
    )
  }

  if (isLoading) {
    return (
      <div>
        <div className="text-gray-500 text-xl">Đang tải...</div>
      </div>
    )
  }

  return (
    <>
      {mealPlans.data.length === 0 ? (
        <div>
          <div className="text-gray-500 text-xl">Bạn chưa có thực đơn nào</div>
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mx-auto mt-6 text-lg lg:text-xl">
            {mealPlans.data.map((mealPlan: UserMealPlan) => (
              <Link href={`/meal-plans/${mealPlan.meal_plan.id}`} key={mealPlan.id}>
                <div key={mealPlan.id}>
                  <div className="relative group">
                    <div className="absolute top-4 right-4 z-10">
                      <DeleteIcon
                        className="text-white hover:text-red-500 transition-colors duration-300"
                        onClick={() => handleDeleteMealPlan(mealPlan.id?.toString() || "")}
                      />
                    </div>
                    <img
                      src={mealPlan.meal_plan.image}
                      alt={mealPlan.meal_plan.title}
                      className="aspect-[5/3] object-cover rounded-xl mb-4 w-full"
                    />
                    <div className="bg-[#00000033] group-hover:opacity-0 absolute inset-0 transition-opacity rounded-xl" />
                  </div>
                  <p className="font-medium">{mealPlan.meal_plan.title}</p>
                  <p className="text-[#737373]">{mealPlan.meal_plan.subtitle}</p>
                  <p className="text-[#737373]">
                    Chef {mealPlan.meal_plan.chef_name} - {mealPlan.meal_plan.number_of_days} ngày
                  </p>
                </div>
              </Link>
            ))}
          </div>
          <Link href="/exercise/detail">
            <Button className="bg-[#13D8A7] text-white text-xl w-full rounded-full h-14 mt-6">Thêm thực đơn</Button>
          </Link>
        </div>
      )}
    </>
  )
}

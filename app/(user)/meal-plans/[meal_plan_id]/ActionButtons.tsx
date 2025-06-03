"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { createUserMealPlan } from "@/network/server/user-meal-plans"
import { toast } from "sonner"

interface ActionButtonsProps {
  mealPlanId: number
}

const handleSaveMealPlan = async (mealPlanId: number) => {
  try {
    await createUserMealPlan({ meal_plan_id: mealPlanId }, "1")
    toast.success("Đã lưu thực đơn thành công!")
  } catch (error) {
    console.error("Error saving meal plan:", error)
    toast.error("Có lỗi xảy ra khi lưu thực đơn!")
  }
}

export default function ActionButtons({ mealPlanId }: ActionButtonsProps) {
  return (
    <div className="gap-5 w-2/3 mx-auto mb-10 flex justify-center mt-20 max-lg:w-full max-lg:px-5">
      <Link href={`/meal-plans/${mealPlanId}/detail`} className="w-full">
        <Button className="w-full rounded-full text-xl bg-[#13D8A7] text-white hover:bg-[#11c296] h-14">Bắt đầu</Button>
      </Link>
      <Button
        onClick={() => handleSaveMealPlan(mealPlanId)}
        className="w-full rounded-full text-xl bg-white text-[#13D8A7] h-14 border-2 border-[#13D8A7]"
      >
        Lưu
      </Button>
    </div>
  )
}

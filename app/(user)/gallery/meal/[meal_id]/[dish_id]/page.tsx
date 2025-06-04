import React from "react"
import { getDish } from "@/network/server/dishes"
export default async function MealDetail({ params }: { params: Promise<{ dish_id: string; meal_id: string }> }) {
  const resolvedParams = await params
  const { dish_id } = resolvedParams
  const detailDish = await getDish(dish_id)
  return (
    <div className="flex flex-col gap-10 mt-10">
      <div className="font-[family-name:var(--font-coiny)] text-ring xl:text-[40px] mb-5 text-center">
        {detailDish.data?.name}
      </div>
      <img src={detailDish.data?.image} alt="" className="h-[680px] object-cover rounded-xl" />
      <div>
        <div className="font-medium">{detailDish.data?.name}</div>
        <div className="text-[#737373]">
          KCAL {detailDish.data?.calories} Pro {detailDish.data?.protein} Fat {detailDish.data?.fat} Carb{" "}
          {detailDish.data?.carb} Fiber {detailDish.data?.fiber}
        </div>
      </div>
      <div className="text-xl text-[#737373]">{detailDish.data?.description}</div>
    </div>
  )
}
